'''Test for adding to database'''
import unittest
import unittest.mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../'))
sys.path.append(os.path.abspath('../'))
import app
import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'admin'
INITIAL_SOCRE = 100

class AddUserTestCase(unittest.TestCase):
    '''Class for check'''
    def setUp(self):
        '''Create test cases'''
        self.success_test_params = [
            {
                KEY_INPUT: 'Akash',
                KEY_EXPECTED: models.Person(username="Akash", score=INITIAL_SOCRE),
            },
            {
                KEY_INPUT: 'Mike',
                KEY_EXPECTED: models.Person(username="Mike", score=INITIAL_SOCRE),
            },
            {
                KEY_INPUT: 'Jay',
                KEY_EXPECTED: models.Person(username="Jay", score=INITIAL_SOCRE),
            },
            {
                KEY_INPUT: 'Name',
                KEY_EXPECTED: models.Person(username="Name", score=INITIAL_SOCRE),
            },

        ]
        self.failure_test_params = [
            {
                KEY_INPUT: 'Akash',
                KEY_EXPECTED: models.Person(username="Mike", score=503),
            },
            {
                KEY_INPUT: 'Mike',
                KEY_EXPECTED: models.Person(username="Name", score=0),
            },
            {
                KEY_INPUT: 'Jay',
                KEY_EXPECTED: models.Person(username="Akash", score=10),
            },
            {
                KEY_INPUT: 'Name',
                KEY_EXPECTED: models.Person(username="Mike", score=-1234),
            },

        ]


    def test_success(self):
        '''Run the success case'''
        for test in self.success_test_params:
            with patch('app.db.session.add'):
                with patch('app.db.session.commit'):

                    actual_result = app.add_db(test[KEY_INPUT])

                    expected_result = test[KEY_EXPECTED]

                    self.assertEqual(actual_result.username, expected_result.username)
                    self.assertEqual(actual_result.score, expected_result.score)

    def test_failure(self):
        '''Run failure case'''
        for test in self.failure_test_params:
            with patch('app.db.session.add'):
                with patch('app.db.session.commit'):

                    actual_result = app.add_db(test[KEY_INPUT])

                    expected_result = test[KEY_EXPECTED]

                    self.assertNotEqual(actual_result.username, expected_result.username)
                    self.assertNotEqual(actual_result.score, expected_result.score)



if __name__ == '__main__':
    unittest.main()
