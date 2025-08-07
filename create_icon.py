#!/usr/bin/env python3
"""
Create a PNG icon for the MultiAgent Swarm VS Code extension
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_extension_icon():
    # Create a 128x128 image with transparent background
    size = 128
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background circle with gradient effect
    center = size // 2
    radius = 50
    
    # Create background circle
    draw.ellipse([center-radius, center-radius, center+radius, center+radius], 
                fill=(102, 126, 234, 255), outline=(118, 75, 162, 255), width=3)
    
    # Robot head (white rectangle with rounded corners)
    head_width = 36
    head_height = 28
    head_x = center - head_width // 2
    head_y = center - 15
    draw.rounded_rectangle([head_x, head_y, head_x + head_width, head_y + head_height], 
                          radius=6, fill=(255, 255, 255, 230))
    
    # Eyes
    eye_radius = 3
    left_eye_x = head_x + 8
    right_eye_x = head_x + head_width - 8
    eye_y = head_y + 10
    draw.ellipse([left_eye_x-eye_radius, eye_y-eye_radius, left_eye_x+eye_radius, eye_y+eye_radius], 
                fill=(102, 126, 234, 255))
    draw.ellipse([right_eye_x-eye_radius, eye_y-eye_radius, right_eye_x+eye_radius, eye_y+eye_radius], 
                fill=(102, 126, 234, 255))
    
    # Antenna/signals
    antenna_y = head_y - 8
    draw.line([left_eye_x, head_y, left_eye_x-5, antenna_y], fill=(255, 255, 255, 200), width=2)
    draw.line([center, head_y, center, antenna_y-3], fill=(255, 255, 255, 200), width=2)
    draw.line([right_eye_x, head_y, right_eye_x+5, antenna_y], fill=(255, 255, 255, 200), width=2)
    
    # Network nodes (small circles)
    node_radius = 6
    node_y = center + 25
    
    # Left node
    left_node_x = center - 25
    draw.ellipse([left_node_x-node_radius, node_y-node_radius, left_node_x+node_radius, node_y+node_radius], 
                fill=(255, 255, 255, 200))
    
    # Center node
    center_node_y = node_y + 8
    draw.ellipse([center-node_radius, center_node_y-node_radius, center+node_radius, center_node_y+node_radius], 
                fill=(255, 255, 255, 200))
    
    # Right node
    right_node_x = center + 25
    draw.ellipse([right_node_x-node_radius, node_y-node_radius, right_node_x+node_radius, node_y+node_radius], 
                fill=(255, 255, 255, 200))
    
    # Connection lines
    draw.line([left_node_x, node_y, center, center_node_y], fill=(255, 255, 255, 150), width=2)
    draw.line([right_node_x, node_y, center, center_node_y], fill=(255, 255, 255, 150), width=2)
    draw.line([left_node_x, node_y-8, center, head_y+head_height], fill=(255, 255, 255, 100), width=1)
    draw.line([right_node_x, node_y-8, center, head_y+head_height], fill=(255, 255, 255, 100), width=1)
    
    # Save the icon
    icon_path = os.path.join(os.path.dirname(__file__), 'media', 'icon.png')
    img.save(icon_path, 'PNG')
    print(f"Icon saved to: {icon_path}")
    
    # Also create smaller versions
    for size in [64, 32, 16]:
        resized = img.resize((size, size), Image.LANCZOS)
        resized_path = os.path.join(os.path.dirname(__file__), 'media', f'icon_{size}.png')
        resized.save(resized_path, 'PNG')
        print(f"Icon {size}x{size} saved to: {resized_path}")

if __name__ == "__main__":
    create_extension_icon()
