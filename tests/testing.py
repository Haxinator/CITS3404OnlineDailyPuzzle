from datetime import datetime, timedelta
import unittest, os , time
from urllib import response
from app import app, db
from app.models import User
from flask import url_for, request
from json import loads, dumps
#python -m tests.testing

class UserModelCase(unittest.TestCase):
    def setUp(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
        # Normal(Works)
        db.create_all()
    def tearDown(self):
        db.session.remove()
        db.drop_all()

    # Tests password hashing functionality, and if the password is stored
    # correctly in the db
    def test_password_hashing(self):
        # Add User to db
        user1 = User(username="123", email="123@gmail.com")
        user1.set_password("123")
        db.session.add(user1)
        db.session.commit()

        # Check if user id is assigned correctly
        self.assertTrue(user1.user_id, 1)

        # Get user from db
        u1 = User.query.get(1)

        # check wrong password
        self.assertFalse(u1.check_password('asfas'))
        # Check right password
        self.assertTrue(u1.check_password('123'))
        # Check smaller similar password
        self.assertFalse(u1.check_password('12'))
        # Check larger similar password
        self.assertFalse(u1.check_password('1234'))


    #Tests user information stored in db is as expected
    def test_user_info(self):
        # Add User to db
        user1 = User(username="Cool Guy", email="Coolz@gmail.com")
        db.session.add(user1)
        db.session.commit()

        # Get User from db
        u1 = User.query.get(1)

        # Check if username is as expected
        self.assertEqual(u1.username, "Cool Guy")
        # Check that similar username is not equal
        self.assertNotEqual(u1.username, "CoolGuy")
        # Check if email is as expected
        self.assertEqual(u1.email, "Coolz@gmail.com")
        # Check that similar email is not equal
        self.assertNotEqual(u1.email, "Cool@gmail.com")

    #tests the user score information 
    def test_score_defaults(self):
        user1 = User(username="Cool Guy", email="Coolz@gmail.com")
        db.session.add(user1)
        db.session.commit()

        u1 = User.query.get(1)

        # Check default values are assigned correctly
        self.assertEqual(u1.highest_score,0)
        self.assertEqual(u1.scores_array, "")
        self.assertEqual(u1.difficulty_dict, '{"EASY":0,"NORMAL":0,"HARD":0}')
        self.assertEqual(u1.isComplete, '{"EASY":false,"NORMAL":false,"HARD":false}')
        
        # Defaults of isComplete
        isComplete = loads(u1.isComplete)
        self.assertFalse(isComplete["EASY"])
        self.assertFalse(isComplete["NORMAL"])
        self.assertFalse(isComplete["HARD"])

        # Defaults of difficulty_dict
        difficulty_dict = loads(u1.difficulty_dict)
        self.assertEqual(difficulty_dict["EASY"], 0)
        self.assertEqual(difficulty_dict["NORMAL"], 0)
        self.assertEqual(difficulty_dict["HARD"], 0)



    def test_user_score(self):
        user1 = User(username="Cool Guy", email="Coolz@gmail.com")
        db.session.add(user1)
        db.session.commit()

        u1 = User.query.get(1)

        # Test add values to isComplete
        isComplete = loads(u1.isComplete)
        isComplete["EASY"] = True
        isComplete["NORMAL"] = True
        u1.isComplete = dumps(isComplete)

        # Test if isComplete values were stored correctly
        isComplete = loads(u1.isComplete)
        self.assertTrue(isComplete["EASY"])
        self.assertTrue(isComplete["NORMAL"])
        self.assertFalse(isComplete["HARD"])

        # Test add values to difficulty_dict
        difficulty_dict = loads(u1.difficulty_dict)
        difficulty_dict["EASY"] += 5
        difficulty_dict["HARD"] += 1
        u1.difficulty_dict = dumps(difficulty_dict)

        # Test if difficulty_dict values were stored correctly
        difficulty_dict = loads(u1.difficulty_dict)
        self.assertEqual(difficulty_dict["EASY"], 5)
        self.assertEqual(difficulty_dict["NORMAL"], 0)
        self.assertEqual(difficulty_dict["HARD"], 1)

        # Test adding values to highest_score
        u1.highest_score += 250
        self.assertEqual(u1.highest_score,250)
        u1.highest_score += 500
        self.assertEqual(u1.highest_score,750)

        # Test adding values to score array
        u1.scores_array += "," +"250"
        u1.scores_array += ","+"500"
        scores_array = u1.scores_array.split(",")
        self.assertEqual(scores_array[0], "")
        self.assertEqual(scores_array[1], "250")
        self.assertEqual(scores_array[2], "500")

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