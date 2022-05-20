from datetime import datetime, timedelta
import unittest, os , time
from urllib import response
from app import app, db
from app.models import User
from flask import url_for, request
#python -m tests.testing

class UserModelCase(unittest.TestCase):
    def setUp(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
        # Normal(Works)
        self.user1 = User(user_id=1, username="123", email="123@gmail.com")
        self.user1.set_password("123")

        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_password_hashing(self):
        self.assertFalse(self.user1.check_password('asfas'))
        self.assertTrue(self.user1.check_password('123'))

    #Tests user information stored
    def test_user_info(self):
        pass

    #tests the user score information 
    def test_user_score(self):
        pass

    def test_login_page(self):
        #chck if login page is sent
        tester = app.test_client(self)
        response = tester.get('/login')
        status_code = response.status
        self.assertEqual(status_code, '200 OK')
        
    def test_register_page(self):
        #check if register page is sent
        tester = app.test_client(self)
        response = tester.get('/register')
        status_code = response.status
        self.assertEqual(status_code, '200 OK')

    def test_home_page(self):
        #check if home page is sent
        tester = app.test_client(self)
        response = tester.get('/home')
        status_code = response.status
        self.assertEqual(status_code, '200 OK')

    def test_stat_page(self):
        #check if stats page is sent
        tester = app.test_client(self)
        response = tester.get('/stats')
        status_code = response.status
        self.assertEqual(status_code, '200 OK')

    def test_game_page(self):
        #check if resource is found
        tester = app.test_client(self)
        response = tester.get('/game')
        status_code = response.status
        self.assertEqual(status_code, '302 FOUND')

        #check if user gets redirected (because they're not logged in)
        test_client = app.test_client(self)
        with test_client:
            response = test_client.get("/game", follow_redirects=True)
            # check that the path changed
            assert request.path == url_for("login")




if __name__ == '__main__':
    unittest.main(verbosity=2)