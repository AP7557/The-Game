'''Test for adding to database'''
import unittest
import unittest.mock
from unittest.mock import patch
import os
import sys
import random
sys.path.append(os.path.abspath('../'))
import app
import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'admin'
INITIAL_SOCRE = 100


class PrintTestCase(unittest.TestCase):
    '''Class for check'''
    def setUp(self):
        '''Create test cases'''
        self.success_test_params = [
            {
                KEY_INPUT:
                'Akash',
                KEY_EXPECTED: [{
                    'username': "admin",
                    'score': 100
                }, {
                    'username': "Akash",
                    'score': 100
                }],
            },
            {
                KEY_INPUT:
                'Mike',
                KEY_EXPECTED: [{
                    'username': "admin",
                    'score': 100
                }, {
                    'username': "Akash",
                    'score': 100
                }, {
                    'username': "Mike",
                    'score': 100
                }],
            },
            {
                KEY_INPUT:
                'Jay',
                KEY_EXPECTED: [{
                    'username': "admin",
                    'score': 100
                }, {
                    'username': "Akash",
                    'score': 100
                }, {
                    'username': "Mike",
                    'score': 100
                }, {
                    'username': "Jay",
                    'score': 100
                }],
            },
            {
                KEY_INPUT:
                'Name',
                KEY_EXPECTED: [{
                    'username': "admin",
                    'score': 100
                }, {
                    'username': "Akash",
                    'score': 100
                }, {
                    'username': "Mike",
                    'score': 100
                }, {
                    'username': "Jay",
                    'score': 100
                }, {
                    'username': "Name",
                    'score': 100
                }],
            },
        ]

        self.failure_test_params = [
            {
                KEY_INPUT:
                'Akash',
                KEY_EXPECTED: [{
                    'username': "Akash",
                    'score': 1
                }, {
                    'username': "admin",
                    'score': 100
                }],
            },
            {
                KEY_INPUT:
                'Mike',
                KEY_EXPECTED: [{
                    'username': "admin",
                    'score': 40
                }, {
                    'username': "Akash",
                    'score': 100
                }, {
                    'username': "Mike",
                    'score': 60
                }],
            },
            {
                KEY_INPUT:
                'Jay',
                KEY_EXPECTED: [{
                    'username': "admin",
                    'score': 200
                }, {
                    'username': "Akash",
                    'score': 0
                }, {
                    'username': "Mike",
                    'score': 75
                }, {
                    'username': "Jay",
                    'score': 7
                }],
            },
            {
                KEY_INPUT:
                'Name',
                KEY_EXPECTED: [{
                    'username': "admin",
                    'score': 100
                }, {
                    'username': "Akash",
                    'score': 97
                }, {
                    'username': "Mike",
                    'score': 54
                }, {
                    'username': "Jay",
                    'score': 33
                }, {
                    'username': "Name",
                    'score': 12
                }],
            },
        ]

        initial_person = models.Person(username=INITIAL_USERNAME,
                                       score=INITIAL_SOCRE)
        self.initial_db_mock = [{
            "username": initial_person.username,
            "score": initial_person.score
        }]

    def mocked_db_session_add(self, person):
        '''mock add to db'''
        self.initial_db_mock.append({
            "username": person.username,
            "score": random.randrange(50, 111)
        })

    def mocked_db_session_commit(self):
        '''mock commit to db'''
        pass

    def mocked_person_score_desc(self):
        '''mock desc from db'''
        pass

    def mocked_person_order_by(self, arg):
        '''mock order_by based on db'''
        print("ORDER_BY")
        with patch('models.Person.score.desc', self.mocked_person_score_desc):
            print(self.initial_db_mock, arg)
            self.initial_db_mock.sort(key=lambda item: item.get("score"),
                                      reverse=True)
            return self.initial_db_mock

    def mocked_person_query_all(self):
        '''mock query get all from db'''
        print(self.initial_db_mock)
        return self.initial_db_mock

    def test_success(self):
        '''Run the success case'''
        for test in self.success_test_params:
            with patch('app.db.session.add', self.mocked_db_session_add):
                with patch('app.db.session.commit',
                           self.mocked_db_session_commit):
                    app.add_db(test[KEY_INPUT])
                    with patch('models.Person.query') as mocked_query:
                        mocked_query.order_by = self.mocked_person_order_by

                        actual_result = app.print_db()

                        expected_result = test[KEY_EXPECTED]
                        self.assertEqual(actual_result[-1],
                                         expected_result[-1])
                        self.assertEqual(actual_result, expected_result)

    def test_failure(self):
        '''Run failure case'''
        for test in self.failure_test_params:
            with patch('app.db.session.add', self.mocked_db_session_add):
                with patch('app.db.session.commit',
                           self.mocked_db_session_commit):
                    app.add_db(test[KEY_INPUT])
                    with patch('models.Person.query') as mocked_query:
                        mocked_query.order_by = self.mocked_person_order_by

                        actual_result = app.print_db()
                        expected_result = test[KEY_EXPECTED]

                        self.assertNotEqual(actual_result[-1],
                                            expected_result[-1])
                        self.assertNotEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
