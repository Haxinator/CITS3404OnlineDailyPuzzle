#This file is purely responsible for 
#creating a database
from app import app
from app import db

##CREATE TABLE
class Player(db.Model):
    username = db.Column(db.String(250), primary_key=True)
    password = db.Column(db.String(250),nullable=True)
    correct_attempt = db.Column(db.Integer)
    wrong_attempt = db.Column(db.Integer)
    highest_score = db.Column(db.Date)

db.create_all()