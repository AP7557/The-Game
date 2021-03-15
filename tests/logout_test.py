'''Test file when user logs out and appropriately reassign players'''
import os
import sys
import unittest
sys.path.append(os.path.abspath('../'))
import app

KEY_INPUT = "input"
KEY_EXPECTED = "expected"


class UserLogoutTest(unittest.TestCase):
    '''Test class to check user-logout function works correctly'''
    def setUp(self):
        app.dic = {'X': 'Akash', 'O': 'Mike', 'spec': ['Jay', 'Name']}

        self.success_test_params = [{
            KEY_INPUT: "Akash",
            KEY_EXPECTED: {
                'X': 'Jay',
                'O': 'Mike',
                'spec': ['Name']
            },
        }, {
            KEY_INPUT: "Mike",
            KEY_EXPECTED: {
                'X': 'Jay',
                'O': 'Name',
                'spec': []
            },
        }, {
            KEY_INPUT: "Jay",
            KEY_EXPECTED: {
                'X': '',
                'O': 'Name',
                'spec': []
            },
        }, {
            KEY_INPUT: "Name",
            KEY_EXPECTED: {
                'X': '',
                'O': '',
                'spec': []
            },
        }]

        self.failure_test_params = [{
            KEY_INPUT: "Akash",
            KEY_EXPECTED: {
                'X': 'Akash',
                'O': '',
                'spec': ['Jay', 'Name']
            },
        }, {
            KEY_INPUT: "Mike",
            KEY_EXPECTED: {
                'X': 'Mike',
                'O': 'Akash',
                'spec': ["Jay"]
            },
        }, {
            KEY_INPUT: "Jay",
            KEY_EXPECTED: {
                'X': 'Jay',
                'O': 'Akash',
                'spec': ['Jay', 'Name', 'Mike']
            },
        }, {
            KEY_INPUT: "Name",
            KEY_EXPECTED: {
                'X': 'Akash',
                'O': 'Mike',
                'spec': ['Jay', 'Name']
            },
        }]

    def test_logout_success(self):
        '''Test function to check all the players are reassigned appropriately'''
        for test in self.success_test_params:
            actual_result = app.on_logout({'currentUser': test[KEY_INPUT]})
            expected_result = test[KEY_EXPECTED]

            self.assertEqual(actual_result['X'], expected_result['X'])
            self.assertEqual(actual_result['O'], expected_result['O'])
            self.assertEqual(actual_result['spec'], expected_result['spec'])
            self.assertEqual(actual_result, expected_result)

    def test_logout_failure(self):
        '''Test function to check all the players are reassigned (not)appropriately'''
        for test in self.failure_test_params:
            actual_result = app.on_logout({'currentUser': test[KEY_INPUT]})
            expected_result = test[KEY_EXPECTED]

            self.assertNotEqual(actual_result['X'], expected_result['X'])
            self.assertNotEqual(actual_result['O'], expected_result['O'])
            self.assertNotEqual(actual_result['spec'], expected_result['spec'])
            self.assertNotEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
