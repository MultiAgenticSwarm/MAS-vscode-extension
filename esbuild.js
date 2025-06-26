const esbuild = require('esbuild');
const path = require('path');
const polyfill = require('@esbuild-plugins/node-globals-polyfill');
const dotenv = require('dotenv');
dotenv.config();

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const buildExtension = () =>
  esbuild.build({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    platform: 'node',
    target: ['node18'],
    outfile: 'dist/extension.js',
    external: ['vscode'],
    define: {
      'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
    },
    sourcemap: !production,
    minify: production,
    logLevel: 'info',
  });

const buildWeb = async () =>
  await esbuild.build({
    entryPoints: ['src/web/main.ts'],  //main entry!!!!!!!
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    platform: 'browser',
    outdir: 'dist/web',
    external: ['vscode'],
    define: {
      global: 'globalThis',
    },
    plugins: [
      polyfill.NodeGlobalsPolyfillPlugin({
        process: true,
        buffer: true,
      }),
    ],
    logLevel: 'info',
  });

async function main() {
  await buildExtension();
  await buildWeb();
  if (watch) console.log('👀 Watching (not enabled in this version)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
