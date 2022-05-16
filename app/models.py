#!/usr/bin/env python3
from app import app
from app import db
from app import login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
#flask db migrate

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

    correct_attempt = db.Column(db.Integer)
    wrong_attempt = db.Column(db.Integer)
    highest_score = db.Column(db.Integer)

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Puzzle(db.Model):
    # __tablename__ = 'puzzles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    puzzle_dictionary = db.Column(db.String(3600), unique=True, nullable=False)
    difficulty = db.Column(db.String(6), nullable = False, index=True)
    def __repr__(self):
        return '<Dictionary: {}>'.format(self.puzzle_dictionary)

db.create_all()