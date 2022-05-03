#This file is purely responsible for routing
from app import app
from flask import render_template, request, url_for
from werkzeug.utils import redirect
from app.create_database import Player

@app.route('/')
@app.route('/index')
@app.route('/home')
def home():
    return render_template("HTML/homepage.html", title ="Homepage")

#Temporarily all security systems are disabled and instead of signup when user enter the username and password the information will just get pass into the database
@app.route('/login')
def login():
    return render_template("HTML/login.html", title = "Login")

@app.route('/game')
def game():
    return render_template("HTML/dailypuzzle.html", title = "Puzzle")

@app.route('/rules')
def rules():
    return render_template("HTML/about.html", title = "About")

@app.route('/stats')
def stats():
    return render_template("HTML/statistics.html", title = "Statistics")

#Only if POST is used, upload to database
@app.route('/database',methods= ["POST"])
def database():
    #Try to import the data and redirect to home page, otherwise redirect back to login page
    try:
        username = request.form["username"]
        password = request.form["password"]
        new_player = Player(username=username, password=password)
        db.session.add(new_player)
        db.session.commit()
        return redirect(url_for('home'))
    except:
        return redirect(url_for('login'))