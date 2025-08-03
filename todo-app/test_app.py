"""
Test suite for the Python Todo App
Created by QA Tester Agent - MultiAgent Swarm Demo

Simple test runner - run with: python3 test_app.py
"""

import json
import sqlite3
import tempfile
import os
import sys
import unittest
from app import app, init_db

class TodoAppTestCase(unittest.TestCase):
    
    def setUp(self):
        """Set up test client with a temporary database."""
        # Create a temporary database file
        self.db_fd, self.temp_db = tempfile.mkstemp()
        app.config['TESTING'] = True
        app.config['DATABASE'] = self.temp_db
        
        self.client = app.test_client()
        with app.app_context():
            # Initialize the test database
            init_db()
    
    def tearDown(self):
        """Clean up after test."""
        os.close(self.db_fd)
        os.unlink(self.temp_db)

    def test_index_page(self):
        """Test that the main page loads correctly."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Python Todo App', response.data)

    def test_get_empty_todos(self):
        """Test getting todos when none exist."""
        response = self.client.get('/api/todos')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data, [])

    def test_add_todo(self):
        """Test adding a new todo."""
        todo_data = {'task': 'Test todo item'}
        response = self.client.post('/api/todos', 
                                  json=todo_data,
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['task'], 'Test todo item')
        self.assertEqual(data['completed'], False)
        self.assertIn('id', data)
        self.assertIn('created_at', data)

    def test_add_empty_todo(self):
        """Test that empty todos are rejected."""
        todo_data = {'task': ''}
        response = self.client.post('/api/todos', 
                                  json=todo_data,
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_update_todo(self):
        """Test updating a todo's task and completion status."""
        # Add a todo first
        todo_data = {'task': 'Original task'}
        response = self.client.post('/api/todos', json=todo_data, content_type='application/json')
        todo = json.loads(response.data)
        
        # Update the todo's task
        update_data = {'task': 'Updated task'}
        response = self.client.put(f'/api/todos/{todo["id"]}', 
                                 json=update_data,
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['task'], 'Updated task')
        self.assertEqual(data['completed'], False)

    def test_delete_todo(self):
        """Test deleting a todo."""
        # Add a todo first
        todo_data = {'task': 'Todo to delete'}
        response = self.client.post('/api/todos', json=todo_data, content_type='application/json')
        todo = json.loads(response.data)
        
        # Delete the todo
        response = self.client.delete(f'/api/todos/{todo["id"]}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('message', data)
        
        # Verify it's gone
        response = self.client.get('/api/todos')
        data = json.loads(response.data)
        self.assertEqual(len(data), 0)

def run_tests():
    """Run all tests and print results."""
    print("🧪 Running Python Todo App Tests")
    print("=" * 40)
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TodoAppTestCase)
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 40)
    if result.wasSuccessful():
        print("✅ All tests passed! The todo app is working correctly.")
        return True
    else:
        print(f"❌ {len(result.failures)} test(s) failed, {len(result.errors)} error(s)")
        return False

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
