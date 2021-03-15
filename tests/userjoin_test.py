'''Test file when user joins and appropriately assign players'''
import os
import sys
sys.path.append(os.path.abspath('../'))

import unittest
import app

KEY_INPUT = "input"
KEY_EXPECTED = "expected"


class UserJoinTest(unittest.TestCase):
    '''Test class to check userJoin function works correctly'''
    def setUp(self):
        app.dic = {"X": "", "O": "", "spec": []}

        self.success_test_params = [{
            KEY_INPUT: "Akash",
            KEY_EXPECTED: {
                'X': 'Akash',
                'O': '',
                'spec': []
            },
        }, {
            KEY_INPUT: "Mike",
            KEY_EXPECTED: {
                'X': 'Akash',
                'O': 'Mike',
                'spec': []
            },
        }, {
            KEY_INPUT: "Jay",
            KEY_EXPECTED: {
                'X': 'Akash',
                'O': 'Mike',
                'spec': ['Jay']
            },
        }, {
            KEY_INPUT: "Name",
            KEY_EXPECTED: {
                'X': 'Akash',
                'O': 'Mike',
                'spec': ['Jay', 'Name']
            },
        }]

        self.failure_test_params = [{
            KEY_INPUT: "Akash",
            KEY_EXPECTED: {
                'X': '',
                'O': 'Akash',
                'spec': [""]
            },
        }, {
            KEY_INPUT: "Mike",
            KEY_EXPECTED: {
                'X': '',
                'O': 'Akash',
                'spec': ["Mike"]
            },
        }, {
            KEY_INPUT: "Jay",
            KEY_EXPECTED: {
                'X': 'Jay',
                'O': 'Akash',
                'spec': ["Mike"]
            },
        }, {
            KEY_INPUT: "Name",
            KEY_EXPECTED: {
                'X': 'Jay',
                'O': 'Name',
                'spec': ['Akash']
            },
        }]

    def test_join_success(self):
        '''Test function to check all the players are assigned appropriately'''
        for test in self.success_test_params:
            actual_result = app.on_username({'username': test[KEY_INPUT]})
            expected_result = test[KEY_EXPECTED]

            self.assertEqual(actual_result['X'], expected_result['X'])
            self.assertEqual(actual_result['O'], expected_result['O'])
            self.assertEqual(actual_result['spec'], expected_result['spec'])
            self.assertEqual(actual_result, expected_result)

    def test_join_failure(self):
        '''Test function to check all the players are assigned (not)appropriately'''
        for test in self.failure_test_params:
            actual_result = app.on_username({'username': test[KEY_INPUT]})
            expected_result = test[KEY_EXPECTED]

            self.assertNotEqual(actual_result['X'], expected_result['X'])
            self.assertNotEqual(actual_result['O'], expected_result['O'])
            self.assertNotEqual(actual_result['spec'], expected_result['spec'])
            self.assertNotEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
