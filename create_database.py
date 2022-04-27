from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
#CREATE DATABASE
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
#Optional: But it will silence the deprecation warning in the console.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


##CREATE TABLE
class Player(db.Model):
    username = db.Column(db.String(250), primary_key=True)
    password = db.Column(db.String(250),nullable=True)
    correct_attempt = db.Column(db.Integer)
    wrong_attempt = db.Column(db.Integer)
    highest_score = db.Column(db.Date)

db.create_all()