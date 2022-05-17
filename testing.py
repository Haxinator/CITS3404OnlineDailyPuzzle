from datetime import datetime, timedelta
import unittest, os , time
from app import app, db
from app.models import User
from flask import url_for, request
from flask_security.utils import login_user
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

    def test_login_authentication(self):
        with self.client:
            response = self.client.post('login', {username: "123", password: "123"})
            # success
            assertEquals(current_user.username, '123')


    def test_register_page(self):
        tester = app.test_client(self)
        response = tester.get('/register')
        status_code = response.status
        self.assertEqual(status_code, '200 OK')

    def test_home_page(self):
        tester = app.test_client(self)
        response = tester.get('/home')
        status_code = response.status
        self.assertEqual(status_code, '200 OK')

    def test_game_page(self):
        test_client = app.test_client(self.user1)
        with test_client:
            response = test_client.get("/game", follow_redirects=True)
            # check that the path changed
            assert request.path == url_for("login")















if __name__ == '__main__':
    unittest.main(verbosity=2)