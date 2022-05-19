#This file is purely responsible for routing

from app import app
from app import db
from app import login
from flask import render_template, request, url_for, flash
from flask_login import current_user, login_user, login_required, logout_user
from werkzeug.urls import url_parse
from werkzeug.utils import redirect
from app.models import User
from app.forms import LoginForm, RegistrationForm
from werkzeug.urls import url_parse


#Temporarily all security systems are disabled and instead of signup when user enter the username and password the information will just get pass into the database
@app.route('/')
@app.route('/login',methods = ['GET','POST'])
#@login_required

<<<<<<< HEAD
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.password == form.password.data and user.username == form.username.data:
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('home')
        return redirect(next_page)
    return render_template("HTML/login.html", title='Sign In', form=form)


@app.route('/home')
def home():
    return render_template("HTML/homepage.html", title ="Homepage")
=======
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
            if difficulty == "easy" or difficulty is None:
                dic["EASY"] = 1
            if difficulty == "normal":   
                dic["NORMAL"] = 1
            if difficulty == "hard":
                dic["HARD"] = 1
            current_user.difficulty_dict = json.dumps(dic)
            db.session.commit()
        #updates the count in the difficulty dictionary for the current user
        elif (str(current_diff != "None")):
            dic = json.loads(current_user.difficulty_dict)
            if difficulty == "easy" or difficulty is None:
                dic["EASY"] = dic["EASY"] + 1
            if difficulty == "normal":
                dic["NORMAL"] = dic["NORMAL"] + 1
            if difficulty == "hard":
                dic["HARD"] = dic["HARD"] + 1
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
>>>>>>> b5e0cab35286643d5b996c6c696102c56c3889c4

@app.route('/game')
def game():
    return render_template("HTML/dailypuzzle.html", title = "Puzzle")

@app.route('/rules')
def rules():
    return render_template("HTML/about.html", title = "About")

@app.route('/stats')
def stats():
    return render_template("HTML/statistics.html", title = "Statistics")

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Player': User}

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data, password=form.password.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('HTML/register.html', title='Register', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))