#!/usr/bin/env python3
from email.policy import default
from app import app
from app import db
from app import login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

@login.user_loader
def load_user(id):
    return User.query.get(int(id))


#Remember to update the database everytime details in Player changes
class User(UserMixin,db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return (self.user_id)

    # User score and puzzle details
    # Running total of user score
    highest_score = db.Column(db.Integer, default = 0)
    # Record of the user's scores obtained today
    scores_array = db.Column(db.String(3000), default = "")
    # Record of how many puzzles the user completed (for usage table)
    difficulty_dict = db.Column(db.String(300), default='{"EASY":0,"NORMAL":0,"HARD":0}')
    # Records if user completed the daily puzzles or not
    isComplete = db.Column(db.String(50), default='{"EASY":false,"NORMAL":false,"HARD":false}')
    def __repr__(self):
        return '<User {}>'.format(self.username)

class Puzzle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    # The actual "puzzle"
    puzzle_dictionary = db.Column(db.String(3600), unique=True, nullable=False)
    # difficulty of the puzzle
    difficulty = db.Column(db.String(6), nullable = False, index=True)
    def __repr__(self):
        return '<Dictionary: {}>'.format(self.puzzle_dictionary)

db.create_all()