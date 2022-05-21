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
#Optional: But it will silence the deprecation warning in the console.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#FLASK LOGIN

# login manager initalisation
login = LoginManager(app)
login.login_view = 'login'

from app import routes, models

#run app and turn debug mode on
if __name__ == "__main__":
    app.run(debug=True)