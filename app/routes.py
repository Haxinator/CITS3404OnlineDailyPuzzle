#This file is purely responsible for routing
from sqlalchemy.sql.expression import func
import json
import requests
from app import app
from app import db
from app import login
from flask import render_template, request, url_for, flash, jsonify
from flask_login import current_user, login_user, login_required, logout_user
from werkzeug.urls import url_parse
from werkzeug.utils import redirect
from app.models import User, Puzzle
from app.forms import LoginForm, RegistrationForm
from werkzeug.urls import url_parse
import os

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Player': User, 'Puzzle': Puzzle}

@app.route('/home', methods=["GET","POST"])
def home():
    if request.method == "POST":
        difficulty = request.form["Difficulty"]
        return redirect(url_for('game', Difficulty = difficulty))

    difficulty = request.args.get("Difficulty")
    return render_template("HTML/homepage.html", title ="Homepage")

#
@app.route('/game', methods=['GET', 'POST'])
@login_required
def game():
    if not current_user.is_authenticated:
            return redirect(url_for('login'))
    else:
        difficulty = request.args.get("Difficulty")
        if difficulty is None:
            difficulty = "EASY"
        if request.method == "POST":
            user_puzzle =request.form["PuzzleDb"]
            user_canvas, diff, puz_name = user_puzzle.split("|")
            flash(user_canvas)
            flash(diff)
            try:
                puzzle = Puzzle(puzzle_dictionary=user_canvas, difficulty=diff, name=puz_name)
                db.session.add(puzzle)
                db.session.commit()
                flash("Puzzle Successfully Uploaded!")
                return render_template("HTML/puzzs.html", title ="Puzzle List", puzzles = Puzzle.query.all())
            except:
                flash("Could not add puzzle, name or pattern already exists.")
                return render_template("HTML/dailypuzzle.html", title = "Puzzle",Difficulty = difficulty)
        
        
        return render_template("HTML/dailypuzzle.html", title = "Puzzle",Difficulty = difficulty)

@app.route("/getData", methods=["GET"])
def getData():
    # number of puzzles in set
    numberOfPuzzles = 3
    # record of iteration
    i = 0
    # record of puzzle set
    puzzles = {}
    difficulty = request.args.get("Difficulty")
    # In case difficulty wasn't defined
    if difficulty is None:
        difficulty = "EASY"
    # Get only the puzzles with the same difficulty
    # Only get 3 puzzles
    puzzleList = Puzzle.query.filter_by(difficulty=difficulty).limit(numberOfPuzzles)
    # For each puzzle add the dictionary and name to the puzzles dictionary
    for puzzle in puzzleList:
        dictionary = puzzle.puzzle_dictionary
        name = puzzle.name 
        puzzles[i] = {"dict":dictionary, "name":name}
        i+=1
    # Return a dictionary containing the set of puzzles
    return jsonify({"0":puzzles[0],"1":puzzles[1],"2":puzzles[2]})

@app.route("/FBsharing", methods=["POST", "GET"])
def FBsharing():
    if request.method == "POST":

        # Getting the name of player
        name = User.query.filter_by(user_id=int(current_user.get_id())).first().username
        # Getting Score
        score = request.args.get("Score")


        filename = os.path.join(app.static_folder, 'credentials.json')
        with open(filename) as file:
            credentials = json.load(file)

        access_token = credentials["access_token"]
        id = credentials["id"]
        msg = f" Player {name} has scored {score} recently"
        post_url = f"https://graph.facebook.com/{id}/feed"
        payload = {
            'message': msg,
            'access_token': access_token
        }
        r = requests.post(post_url, data=payload)
        return "successfully added"
    else:
        return "this page is not usable for client"
    



@app.route('/rules')
def rules():
    return render_template("HTML/about.html", title = "About")

@app.route('/stats')
def stats():
    return render_template("HTML/statistics.html", title = "Statistics")

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('You have been registered!')
        return redirect(url_for('login'))
    return render_template('HTML/register.html', title='Register', form=form)

#Temporarily all security systems are disabled and instead of signup when user enter the username and password the information will just get pass into the database
@app.route('/')
@app.route('/login',methods = ['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('[Invalid username or password.]')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('home')
        return redirect(next_page)
    return render_template("HTML/login.html", title='Sign In', form=form)
