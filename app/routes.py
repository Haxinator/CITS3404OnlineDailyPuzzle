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

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Player': User}

@app.route('/home', methods=["GET","POST"])
def home():
    if request.method == "POST":
        difficulty = request.form["Difficulty"]
        return redirect(url_for('game', Difficulty = difficulty))

    difficulty = request.args.get("Difficulty")
    return render_template("HTML/homepage.html", title ="Homepage")

#
@app.route('/game')
def game():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    difficulty = request.args.get("Difficulty")
    if difficulty is None:
        difficulty = "easy"
    return render_template("HTML/dailypuzzle.html", title = "Puzzle",Difficulty = difficulty)

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
        user = User(username=form.username.data, email=form.email.data, password=form.password.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('HTML/register.html', title='Register', form=form)

#Temporarily all security systems are disabled and instead of signup when user enter the username and password the information will just get pass into the database
@app.route('/')
@app.route('/login',methods = ['GET','POST'])
#@login_required

def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
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
