#This file is purely responsible for routing
from sqlalchemy.sql.expression import func

#from crypt import methods
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
from sqlalchemy import desc
import json

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
            dic = {"EASY": 0, "NORMAL": 0, "HARD": 0}
        else:
            dic = json.loads(current_user.difficulty_dict)
           
        #updates the count in the difficulty dictionary for the current user   
        if difficulty == "easy" or difficulty is None:
            dic["EASY"] =+ 1
        if difficulty == "normal":
            dic["NORMAL"] =+ 1
        if difficulty == "hard":
            dic["HARD"] =+ 1
        current_user.difficulty_dict = json.dumps(dic)
        db.session.commit()
        
        if request.method == 'POST':
            user_puzzle = request.form.get("PuzzleDb")
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

@app.route("/getScore", methods=["POST"])
def getScore():
    if request.method == 'POST':
            #gets the final score when game ends
            info = request.data #type: binary
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
    i = stat_user.index(current_user.username)

    #gets the scores of current user for all the games that user has played so far
    scores_list_str = current_user.scores_array
    print(scores_list_str)
    try:
        stat_table1 = scores_list_str.split(",")
        size = len(stat_table1)
        total_score = current_user.highest_score
        return render_template("HTML/statistics.html", title = "Statistics", stat_table2 = stat_table2, length = length, i = i, stat_table1 = stat_table1, size = size, total_score = total_score, stat_table3 = stat_table3, size_dic = size_dic, users_list = users_list)
    except:
        no_score = str(current_user.scores_array)
        return render_template("HTML/statistics.html", title = "Statistics",no_score = no_score, length = length, i = i, size_dic = size_dic, users_list = users_list, stat_table2 = stat_table2, stat_table3 = stat_table3)
   
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
