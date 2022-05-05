
#python3 -m venv venv
#source venv/bin/activate
#This file creates an instance of flask
#called "app".
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import Config
from flask_login import LoginManager

#create object from class Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = 'any secret string'


#CREATE DATABASE
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
#app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
#Optional: But it will silence the deprecation warning in the console.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#FLASK LOGIN

login = LoginManager(app)
login.login_view = 'login'
from app import routes, models


#Must be imported here
#Route imports the above app
#variable. i.e. It needs it
#in order to run
from app import routes

#run app and turn debug mode on
if __name__ == "__main__":
    app.run(debug=True)