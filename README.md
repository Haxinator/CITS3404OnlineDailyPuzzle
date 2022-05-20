# CITS3403OnlineDailyPuzzle

Online daily puzzle group project for CITS3403 - Agile Web Development.
At the University of Western Australia
Developed by "HD Gang":
@author
Joshua Noble (Haxinator) 27760978,
Wai Him Ho (Will-H007) 22701889,
Amir Andakhs (amirandakhs) 22839936,
and Dhwani Joshi (Bye0123) 22875673.

# the purpose of the web application, explaining the design of the game.

The purpose of the web application is to enhance the user's memory, whilst also teaching them how to draw pixel art.

The daily puzzle developed is a memory game in nature. The user must complete the set of given puzzles to win the daily puzzle. A pattern/picture is shown to a user and they must recreate it in the web application. The puzzle allows an indefinite number of attempts until the user gets is correct, upon which a next button will appear allowing the user to go to the next puzzle in the set or if it is the last puzzle in the set, the user gets a final score and wins the game. However, if the user's final score is negative they lose the game. They can optionally share their score to our Facebook page (on either win or lose).

There are three difficulties: easy, normal and hard. The size of puzzle to remember increases with an increase in difficulty. Meaning each puzzle in the set will take a longer time to complete and there is a greater chance of the user making a mistake. Each difficulty set, once completed by the user cannot be done by the user again, the user must wait until the next day for a new puzzle set.

Users can also create and upload their own puzzles via the upload button.

The puzzle colour pallet was specifically chosen to contrast the different colours for those whom are colourblind.

# the architecture of the web application.

Web pages in this application are rendered server side.

Model View Controller architecture.
Models are the tables stored in the database in this case the User and the Puzzles.
The controller (flask & Jinja) prepares the view based on the route and information given by the model.
View is what the routing functions return, and ultimately what the client sees, which is the page the controller developed serverside and sent to the client's machine.

Login Page - Allow user to login with an existing account <br/><br/>
Register Page - Allow user to register a new account<br/><br/>
Home Page - Allow user to select difficulty for the puzzle or to go to the rules page or the statistics page<br/><br/>
Game/Play Page - Allow user to create or solve the puzzle based on difficulty(Default: easy)<br/><br/>
About/Rules Page - Tell the user how to play the game<br/><br/>
Statistics/Leaderboard Page - Show the stats and ranking of the player compared to themselves or other players<br/><br/>
puzz.html page - A page that shows the list of all puzzles uploaded to the server. Can be accessed only once the user submits their own puzzle.

# describe how to launch the web application.

Provided flask is installed with the correct packages, as given in the requirements.txt file. The application should simply run once "flask run"
is typed in the terminal whilst in the top level directory (i.e. Where the puzzle.py file is found). This application was developed and tested using the linux distribution "Ubuntu", it is assumed whomever runs this application will also run it in "Ubuntu" or a similar linux distribution.

Once the application is running, open the page in a browser by typing in the URL "localhost:5000/" (without the quotations of course).

# describe some unit tests for the web application, and how to run them.

To run the unit test, simply enter command (python -m tests.testing) in the terminal and it will activate the testing.py, which is the unit test python script.
The following unit tests are avaliable:

Comprehensive testing of the User Model

- Testing password hashing - against the same password and a different password.
- Accessing user information stored in the data base - username and email.
- Accessing score and puzzle information stored in the data base - highest_score, scores_array, difficulty_dict, and isComplete.

Testing of the major routes

- Access to different pages
- Trying to access to every page
- Trying to access to every page without login

# Include commit logs, showing contributions and review from both contributing students.

**TO BE ADDED ONCE PROJECT IS FINALISED**

# References:

External CSS(Bootstrap):
https://getbootstrap.com/docs/5.1/getting-started/introduction/#css
External JS(Bootstrap):
https://getbootstrap.com/docs/5.1/getting-started/introduction/#js

APA Referencing Guide for images (https://libguides.murdoch.edu.au/APA/images):

1. Minions.gif
   FoxIsHere. 10 Wacky And Silly Minion Gifs. LOVETHISPIC
   https://www.lovethispic.com/blog/49150/10-wacky-and-silly-minion-gifs
2. win.png
   https://www.ajournalofmusicalthings.com/wp-content/uploads/YouWin.png
3. GameOver.jpg
   https://npinopunintended.files.wordpress.com/2012/05/game-over-1.jpeg
