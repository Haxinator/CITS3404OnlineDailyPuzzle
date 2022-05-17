#This file is purely responsible for routing
from sqlalchemy.sql.expression import func

from crypt import methods
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
import random
from datetime import datetime, timedelta

# Global time variable
# time = datetime.date(datetime.utcnow()) + timedelta(days=1)
# LastRunTime = datetime.utcnow()


LastRunTime = {
    "EASY":datetime.min,
    "NORMAL":datetime.min,
    "HARD":datetime.min
    }
# Global puzzles variable
puzzles = {}
# Global variable that determines if this is the first time
# The puzzle is retrieved.
# firstRun = True

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
    # global firstRun
    global puzzles
    global LastRunTime
    time = datetime.utcnow()
    difficulty = request.args.get("Difficulty")
    # In case difficulty wasn't defined
    if difficulty is None:
        difficulty = "EASY"

    #Breaks on difficulty switch, either only choose one difficulty a day
    #Or code to account for it
    print(time)
    if(time >= (LastRunTime[difficulty] + timedelta(minutes=30))):
        LastRunTime[difficulty] = time
        # firstRun = False
        # clear puzzle set of this difficulty
        puzzles[difficulty] = {}
        
        # number of puzzles stored in the db
        puzzlesStored = Puzzle.query.filter_by(difficulty=difficulty).count()
        # number of puzzles in the set to send
        # Minimum set size is 2, max is 5
        numberOfPuzzles = int(random.random()*3)+2
        print("Number of puzzles in set: " + str(numberOfPuzzles))
        print("Number of " + str(difficulty) + " puzzles stored: " + str(puzzlesStored))

        if(puzzlesStored == 0):
            return "None"
        elif(numberOfPuzzles > puzzlesStored):
            numberOfPuzzles = puzzlesStored

        # Only get number of puzzles specified
        for i in range(numberOfPuzzles):
            dictionary = None
            name = None

            while name in puzzles or name is None:
                index = int(random.random()*puzzlesStored)
                puzzle = Puzzle.query.filter_by(difficulty=difficulty).offset(index).first()
                dictionary = puzzle.puzzle_dictionary
                name = puzzle.name

            print(index)
            puzzles[difficulty][name] = dictionary

    return jsonify(puzzles[difficulty])



@app.route('/rules')
def rules():
    return render_template("HTML/about.html", title = "About")

@app.route('/stats')
def stats():
    return render_template("HTML/statistics.html", title = "Statistics")

@app.route('/logout')
def logout():
    logout_user()
    flash("You have been successfully logged out.")
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
