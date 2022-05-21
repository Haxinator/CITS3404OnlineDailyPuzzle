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

# Record of when last the puzzle sets were updated
LastRunTime = {
    "EASY":datetime.min,
    "NORMAL":datetime.min,
    "HARD":datetime.min
    }
# container for the puzzles to be dispensed to users
puzzles = {}

# For debugging and testing purposes
@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Player': User, 'Puzzle': Puzzle}

@app.route('/home', methods=["GET","POST"])
def home():
    # If post
    if request.method == "POST":
        difficulty = request.form["Difficulty"]
        return redirect(url_for('game', Difficulty = difficulty))

    # If get request
    difficulty = request.args.get("Difficulty")
    return render_template("HTML/homepage.html", title ="Homepage")

#
@app.route('/game', methods=['GET', 'POST'])
@login_required
def game():
    if not current_user.is_authenticated:
            return redirect(url_for('login'))
    else:
        # if user is logged in

        difficulty = request.args.get("Difficulty")
        # In case difficulty wasn't provided
        if difficulty is None:
            difficulty = "EASY"

        # if user uploaded a game
        if request.method == "POST":
            user_puzzle =request.form["PuzzleDb"]
            user_canvas, diff, puz_name = user_puzzle.split("|")
            # Add puzzle to db
            try:
                puzzle = Puzzle(puzzle_dictionary=user_canvas, difficulty=diff, name=puz_name)
                db.session.add(puzzle)
                db.session.commit()
                flash(diff + " Puzzle " + puz_name + " Successfully Uploaded!")
            except:
                flash("Could not add puzzle, name or pattern already exists.")
        return render_template("HTML/dailypuzzle.html", title = "Puzzle",Difficulty = difficulty)

# Creates the a random puzzle set on user request
# Or will return the puzzle already generated if it's the same day.
@app.route("/getData", methods=["GET"])
def getData():
    # global so python doesn't get confused
    global puzzles
    global LastRunTime

    time = datetime.utcnow()
    difficulty = request.args.get("Difficulty")
    isComplete = json.loads(current_user.isComplete)

    # In case difficulty wasn't defined
    if difficulty is None:
        difficulty = "EASY"

    print(time)

    # If the current time is greater or equal to the time at which
    # The puzzles should be updated
    if(time >= (LastRunTime[difficulty] + timedelta(days=1))):
        # update current users isComplete for this function
        isComplete[difficulty] = False
        # get all users
        users = User.query.all()

        for user in users:
            # Reset Personal score counter on a new day
            # New puzzle set for this difficulty
            # So set isComplete to false for all
            user.scores_array = ""
            Complete = json.loads(user.isComplete)
            Complete[difficulty] = False
            user.isComplete = json.dumps(Complete)

        db.session.commit()

        # Update the time this puzzle was last generated
        LastRunTime[difficulty] = time

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
            # In case there are no puzzles in the db
            return "None"
        elif(numberOfPuzzles > puzzlesStored):
            # In case the number of puzzles requested
            # is more then the number stored
            numberOfPuzzles = puzzlesStored

        # Get number of puzzles specified
        while len(puzzles[difficulty]) < numberOfPuzzles:
            print("length" + str(len(puzzles[difficulty])))

            dictionary = None
            name = None

            # If no puzzle or if the puzzle is already in the set
            # get a new puzzle
            while name in puzzles or name is None:
                index = int(random.random()*puzzlesStored)
                puzzle = Puzzle.query.filter_by(difficulty=difficulty).offset(index).first()
                dictionary = puzzle.puzzle_dictionary
                name = puzzle.name

            #Add puzzle to the set
            print(index)
            puzzles[difficulty][name] = dictionary

    # If User already completed this set of puzzles today
    if(isComplete[difficulty]):
        return "Complete"
    else:
       return jsonify(puzzles[difficulty])
    
@app.route("/getScore", methods=["POST"])
def getScore():
    if request.method == 'POST':
        # gets difficulty as a string
        difficulty = request.args.get("Difficulty")
        #gets score as a string    
        score = request.args.get("Score")
        # completed puzzle set for this difficulty
        isComplete = json.loads(current_user.isComplete)
        isComplete[difficulty] = True
        current_user.isComplete = json.dumps(isComplete)

        player = current_user
        #gets the old scores
        old_score = current_user.highest_score
        score_list = str(player.scores_array)

        #gets the current user's difficulty dictionary that contains 
        # the total games count according to difficulty
        dic = json.loads(current_user.difficulty_dict)
        print(dic)
        print(difficulty)
        dic[difficulty] += 1
        current_user.difficulty_dict = json.dumps(dic)

        # Add score to scores_array
        # add score to the running total
        final_score_str = score_list + "," + score
        final_score = int(score) + old_score
        player.highest_score = final_score
        player.scores_array = final_score_str

        db.session.commit()
        return "Score uploaded"
                
@app.route("/FBsharing", methods=["POST", "GET"])
def FBsharing():
    if request.method == "POST":

        # Getting the name of player
        name = User.query.filter_by(user_id=int(current_user.get_id())).first().username
        # Getting Score
        score = request.args.get("Score")
        difficulty = request.args.get("difficulty")


        # Obtain credentials for facebook
        filename = os.path.join(app.static_folder, 'credentials.json')
        with open(filename) as file:
            credentials = json.load(file)

        # upload data to facebook
        access_token = credentials["access_token"]
        id = credentials["id"]
        msg = f" {name} completed {list(puzzles[difficulty].keys())} and got a score of {score}!"
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
    
        # Add difficulty_dict to array
        if type(dic2) == str:
            dic = json.loads(dic2)
            dic_diff.append(dic["EASY"])
            dic_diff.append(dic["NORMAL"])
            dic_diff.append(dic["HARD"])
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
    
    # If the user has a score to show
    if current_user.is_authenticated and current_user.scores_array is not None:
        #gets the scores of current user for all the games that user has played so far
        scores_list_str = current_user.scores_array
        print(scores_list_str)
        i = stat_user.index(current_user.username)
        stat_table1 = scores_list_str.split(",")
        size = len(stat_table1)
        total_score = current_user.highest_score
        return render_template("HTML/statistics.html", title = "Statistics", stat_table2 = stat_table2, length = length, i = i, stat_table1 = stat_table1, size = size, total_score = total_score, stat_table3 = stat_table3, size_dic = size_dic, users_list = users_list)
    else:
        # return anonymous stat page
        return render_template("HTML/statistics.html", title = "Statistics", length = length, size_dic = size_dic, users_list = users_list, stat_table2 = stat_table2, stat_table3 = stat_table3)
   

@app.route('/logout')
def logout():
    logout_user()
    flash("You have been successfully logged out.")
    return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    # In case the user accidently went here
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    # add user if the form is fine
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('You have been registered!')
        return redirect(url_for('login'))
    return render_template('HTML/register.html', title='Register', form=form)

# default page
@app.route('/')
@app.route('/login',methods = ['GET','POST'])
def login():
    # In case user already logged in
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    # otherwise try to log the user in
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        # if user isn't found or password is incorrect
        if user is None or not user.check_password(form.password.data):
            flash('[Invalid username or password.]')
            return redirect(url_for('login'))
        # login user
        login_user(user, remember=form.remember_me.data)
        # get the page the user wanted to go to, if it exists
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            # otherwise send user to home page
            next_page = url_for('home')
        return redirect(next_page)
    # otherwise make the user sign in again
    return render_template("HTML/login.html", title='Sign In', form=form)
