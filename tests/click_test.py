'''Test file when user press box and sends appropriate data'''
import os
import sys
import unittest
sys.path.append(os.path.abspath('../'))
import app


KEY_INPUT = "input"
KEY_EXPECTED = "expected"


class UserClickTest(unittest.TestCase):
    '''Test class to check click function works correctly'''
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: {
                    "message":
                    ["X", None, "X", "O", None, None, None, None, None],
                    "OXs": "O",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
                KEY_EXPECTED: {
                    "message":
                    ["X", None, "X", "O", None, None, None, None, None],
                    "OXs": "O",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
            },
            {
                KEY_INPUT: {
                    "message":
                    ["X", None, "X", "O", "O", None, None, None, None],
                    "OXs": "X",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
                KEY_EXPECTED: {
                    "message":
                    ["X", None, "X", "O", "O", None, None, None, None],
                    "OXs": "X",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
            },
            {
                KEY_INPUT: {
                    "message":
                    ["X", "O", "X", "O", None, None, "X", None, None],
                    "OXs": "X",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
                KEY_EXPECTED: {
                    "message":
                    ["X", "O", "X", "O", None, None, "X", None, None],
                    "OXs": "X",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
            },
            {
                KEY_INPUT: {
                    "message":
                    ["X", None, "X", "O", None, "X", None, "O", None],
                    "OXs": "O",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
                KEY_EXPECTED: {
                    "message":
                    ["X", None, "X", "O", None, "X", None, "O", None],
                    "OXs": "O",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
            },
        ]

        self.failure_test_params = [
            {
                KEY_INPUT: {
                    "message":
                    ["X", None, "X", "O", None, None, None, None, None],
                    "OXs": "O",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
                KEY_EXPECTED: {
                    "message":
                    ["X", None, "X", "O", None, None, None, "X", None],
                    "OXs": "X",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name', 'Akash']
                    }
                },
            },
            {
                KEY_INPUT: {
                    "message":
                    ["X", None, "X", "O", "O", None, "O", None, None],
                    "OXs": "X",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
                KEY_EXPECTED: {
                    "message":
                    ["X", None, "X", "O", "O", None, "X", None, None],
                    "OXs": "O",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': '',
                        'spec': ['Jay', 'Name']
                    }
                },
            },
            {
                KEY_INPUT: {
                    "message":
                    ["X", "O", "X", "O", None, None, "X", None, None],
                    "OXs": "X",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
                KEY_EXPECTED: {
                    "message":
                    ["X", "O", "X", "O", "X", None, "X", None, None],
                    "OXs": "XO",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Name']
                    }
                },
            },
            {
                KEY_INPUT: {
                    "message": ["X", None, "X", "O", "", "X", None, "O", None],
                    "OXs": "O",
                    "allPlayers": {
                        'X': 'Akash',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
                KEY_EXPECTED: {
                    "message":
                    ["X", None, "X", "O", None, "X", None, "O", None],
                    "OXs": "X",
                    "allPlayers": {
                        'X': 'Name',
                        'O': 'Mike',
                        'spec': ['Jay', 'Name']
                    }
                },
            },
        ]

    def test_click_success(self):
        '''Test function to check all the click data are assigned appropriately'''
        for test in self.success_test_params:
            actual_result = app.on_click(test[KEY_INPUT])

            expected_result = test[KEY_EXPECTED]

            self.assertEqual(actual_result['message'],
                             expected_result['message'])
            self.assertEqual(actual_result['OXs'], expected_result['OXs'])
            self.assertEqual(actual_result['allPlayers'],
                             expected_result['allPlayers'])
            self.assertEqual(actual_result, expected_result)

    def test_click_failure(self):
        '''Test function to check all the click data are assigned (not)appropriately'''
        for test in self.failure_test_params:
            actual_result = app.on_click(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]

            self.assertNotEqual(actual_result['message'],
                                expected_result['message'])
            self.assertNotEqual(actual_result['OXs'], expected_result['OXs'])
            self.assertNotEqual(actual_result['allPlayers'],
                                expected_result['allPlayers'])
            self.assertNotEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
