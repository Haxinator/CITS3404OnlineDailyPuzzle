# CITS3403OnlineDailyPuzzle

Online daily puzzle group project for CITS3403 - Agile Web Development.
At the University of Western Australia
Developed by "HD Gang":
@author
Joshua Noble (Haxinator) 27760978,
**Student numbers and last names TBA**
Will,
Amir,
and Dhwani.

# the purpose of the web application, explaining the design of the game.

The purpose of the web application is to enhance the user's memory, whilst also teaching them how to draw pixel art.

The daily puzzle developed is a memory game in nature. The user must complete the set of given puzzles to win the daily puzzle. A pattern/picture is shown to a user and they must recreate it in the web application. The puzzle allows an indefinite number of attempts until the user gets is correct, upon which a next button will appear allowing the user to go to the next puzzle in the set or if it is the last puzzle in the set, the user gets a final score and wins the game.

There are three difficulties: easy, medium and hard. The size of puzzle to remember increases with an increase in difficulty. Meaning each puzzle in the set will take a longer time to complete and there is a greater chance of the user making a mistake.

Users can also create and upload their own puzzles via the upload button.

The puzzle colour pallet was specifically chosen to contrast the different colours for those whom are colourblind.

# the architecture of the web application.

Web pages in this application are rendered server side.

Model View Controller architecture.
Models are the tables stored in the database in this case the user and the puzzles.
The controller (flask) prepares the view based on the route and information given by the model.
View is what the client sees, which is the page the controller developed serverside and sent to the client's machine.

<<<<<<< HEAD
Login Page - Allow user to login with an existing account <br/><br/>
Register Page - Allow user to register a new account<br/><br/>
Home Page - Allow user to select difficulty for the puzzle or to go to the rules page or the statistics page<br/><br/>
Game/Play Page - Allow user to create or solve the puzzle based on difficulty(Default: easy)<br/><br/>
About/Rules Page - Tell the user how to play the game<br/><br/>
Statistics/Leaderboard Page - Show the stats and ranking of the player compare to themselves or other players<br/><br/>
=======
**NEEDS TO BE REVIEWED**
>>>>>>> dhwani

# describe how to launch the web application.

Provided flask is installed with the correct packages, as given in the requirements.txt file. The application should simply run once "flask run"
is typed in the terminal whilst in the top level directory (i.e. Where the puzzle.py file is found). This application was developed and tested using the linux distribution "Ubuntu", it is assumed whomever runs this application will also run it in "Ubuntu" or a similar linux distribution.

Once the application is running, open the page in a browser by typing in the URL "localhost:5000/" (without the quotations of course).

# describe some unit tests for the web application, and how to run them.

<<<<<<< HEAD
To run the unit test, simply enter command (python -m tests.testing) in the terminal and it will activate the testing.py, which is the unit test python script.<br/>
Each unit test will be run for 2-5 times<br/>
The following criteria will be tested in the unit test:

1. Login and register functionality and authentication <br />
   Normal login (Successful)<br />
   Entering login details without account <br />
   Not entering field/fields in register form <br />
   Entering email address without @gmail.com at the end<br />
   Entering a different repeated password to the password<br />
   Entering an existing username in the register form<br />
   <br/>
2. Access to different pages <br />
   Trying to access to every page<br />
   Trying to access to every page without login<br />
   <br />
3. The puzzle game<br />
   Test different difficulty<br />
   Test when player finishes puzzle(s)<br />
   <br />
4. The Scoring system<br /><br />
5. The Sharing system<br /><br />
=======
**UNIT TESTS TO BE ADDED**
**NEEDS TO BE COMPLETED**
>>>>>>> dhwani

# Include commit logs, showing contributions and review from both contributing students.

**TO BE ADDED ONCE PROJECT IS FINALISED**
