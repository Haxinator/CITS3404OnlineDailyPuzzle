#This file creates an instance of flask
#called "app".
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

#create object from class Flask
app = Flask(__name__)

#CREATE DATABASE
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
#Optional: But it will silence the deprecation warning in the console.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#Must be imported here
#Route imports the above app
#variable. i.e. It needs it
#in order to run
from app import routes

#run app and turn debug mode on
if __name__ == "__main__":
    app.run(debug=True)