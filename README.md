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

There are three difficulties: easy, medium and hard. The size of puzzle to remember increases with an increase in difficutly. Meaning each puzzle in the set will take a longer time to complete and there is a greater chance of the user making a mistake.

The puzzle colour pallet was specifically chosen to contrast the different colours for those whom are colourblind.

# the architecture of the web application.

Web pages in this application are rendered server side.

Model View Controller architecture.
Models are the tables stored in the database in this case the user and the puzzles.
The controller (flask) prepares the view based on the route and information given by the model.
View is what the client sees, which is what page the controller developed serverside and sent to the client's machine.

**NEEDS TO BE REVIEWED**

# describe how to launch the web application.

Provided flask is installed with the correct packages, as given in the requirements.txt file. The application should simply run once "flask run"
is typed in the terminal whilst in the top level directory (i.e. Where the puzzle.py file is found). This application was developed and tested using the linux distribution "Ubuntu", it is assumed whomever runs this application will also run it in "Ubuntu" or a similar linux distribution.

Once the application is running, open the page in a browser by typing in the URL "localhost:5000/" (without the quotations of course).

# describe some unit tests for the web application, and how to run them.

**UNIT TESTS TO BE ADDED**
**NEEDS TO BE COMPLETED**

# Include commit logs, showing contributions and review from both contributing students.

**TO BE ADDED ONCE PROJECT IS FINALISED**
