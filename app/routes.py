#This file is purely responsible for routing

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
from datetime import datetime, timedelta
from sqlalchemy import desc
import random
import requests
import json
import os

LastRunTime = {
    "EASY":datetime.min,
    "NORMAL":datetime.min,
    "HARD":datetime.min
    }
# Global puzzles variable
puzzles = {}


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
            difficulty = "easy"

        #gets the current user's difficulty dictionary that contains the total games count according to difficulty
        current_diff = current_user.difficulty_dict

        if(str(current_diff) == "None"): #if user is playing for the first time
            dic = {"easy": 0, "normal": 0, "hard": 0}
        else:
            dic = json.loads(current_user.difficulty_dict)

        dic[difficulty] += 1
        
        current_user.difficulty_dict = json.dumps(dic)
        db.session.commit()
        
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

@app.route("/getScore", methods=["POST"])
def getScore():
    if request.method == 'POST':
            #gets the final score when game ends
            #type: binary
            info = request.data 
            #converts the score into str(.decode('utf-8') removes binary from the info)
            score_str = info.decode('utf-8')
            #converts str to int
            s = int(info.decode('utf-8'))
            player = current_user
            #gets the data from the database for the current user
            old_score = current_user.highest_score
            old_score_str = str(player.scores_array)
            #if user is playing the game for the first time
            if str(old_score_str) == "None" and str(old_score) == "None": 
                final_score_str = score_str
                player.highest_score = s
                player.scores_array = final_score_str
                db.session.commit()
            else:
                final_score_str = old_score_str + "," + score_str
        
                split_str = final_score_str.split(",")
                final_score = s + old_score
                player.highest_score = final_score
                player.scores_array = final_score_str
                db.session.commit()
                
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

@app.route('/stats', methods = ["GET","POST"])
def stats():
    #gets the difficulty_dict and usernames from the database
    users_list = [each.username for each in (User.query.with_entities(User.username).order_by(User.user_id))]
    stat_table3 = []
    for u in User.query.with_entities(User.difficulty_dict):
        dic_diff = []
        #_asdict() converts SQLAlchemy row object to a python dict
        u_dict = u._asdict()
        dic2 = u_dict['difficulty_dict']
    
        if type(dic2) == str:
            dic = json.loads(dic2)
            dic_diff.append(dic["easy"])
            dic_diff.append(dic["normal"])
            dic_diff.append(dic["hard"])
            stat_table3.append(dic_diff)
    
    size_dic = len(stat_table3)

    #gets the username of all users from the database order by highest_score
    stat_user = [each.username for each in (User.query.with_entities(User.username).order_by(desc(User.highest_score)).all())]
    #gets the highest_score of all users from the database order by highest_score
    stat_score = [each.highest_score for each in (User.query.with_entities(User.highest_score).order_by(desc(User.highest_score)).all())]
    stat_table2 = []
    #stat_table2 list that contains usernames and scores
    stat_table2.append(stat_user)
    stat_table2.append(stat_score)
    length = len(stat_user)
    
    if current_user.is_authenticated:
        #gets the scores of current user for all the games that user has played so far
        scores_list_str = current_user.scores_array
        print(scores_list_str)
        i = stat_user.index(current_user.username)
        stat_table1 = scores_list_str.split(",")
        size = len(stat_table1)
        total_score = current_user.highest_score
        return render_template("HTML/statistics.html", title = "Statistics", stat_table2 = stat_table2, length = length, i = i, stat_table1 = stat_table1, size = size, total_score = total_score, stat_table3 = stat_table3, size_dic = size_dic, users_list = users_list)
    else:
        # no_score = str(current_user.scores_array)
        return render_template("HTML/statistics.html", title = "Statistics", length = length, size_dic = size_dic, users_list = users_list, stat_table2 = stat_table2, stat_table3 = stat_table3)
   

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
