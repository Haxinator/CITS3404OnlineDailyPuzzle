//*----------------GLOBAL VARIABLES AND CONSTANTS-----------------------------------------------//

//******GLOBAL CONSTANTS********/
//need a color pallet that has black? Or maybe a larger pallet for future.
// Fixed color array for the palette(length must fit the palette total length, total length = row* column)
const PALETTE1 = {
    "#FFFFFF": "#FFFFFF",
    "#648FFF": "#648FFF",
    "#785EF0": "#785EF0",
    "#DC267F": "#DC267F",
    "#FE6100": "#FE6100",
    "#FFB000": "#FFB000",
    "eraser" : null
};

//may be a better way to do this, used to create IDs for colour pallet cells.
//also used for random puzzle generator
const PALETTEIDS = [
    "#FFFFFF", 
    "#648FFF",
    "#785EF0",
    "#DC267F",
    "#FE6100",
    "#FFB000", 
    "eraser"];


//SAMPLE PUZZLES
//puzzles may need to be changed to be for smaller grid sizes
//or better user feedback needed for puzzles.
const PUZZLE_HD = {
    99: "#648FFF",
    102: "#648FFF",
    104: "#648FFF",
    105: "#648FFF",
    115: "#648FFF",
    118: "#648FFF",
    120: "#648FFF",
    122: "#648FFF",
    131: "#648FFF",
    134: "#648FFF",
    136: "#648FFF",
    139: "#648FFF",
    147: "#648FFF",
    148: "#648FFF",
    149: "#648FFF",
    150: "#648FFF",
    152: "#648FFF",
    155: "#648FFF",
    163: "#648FFF",
    166: "#648FFF",
    168: "#648FFF",
    170: "#648FFF",
    179: "#648FFF",
    182: "#648FFF",
    184: "#648FFF",
    185: "#648FFF"
  }

//container for multiple puzzles
const PUZZLES = [];
//get value of difficulty
const DIFFICULTY = document.getElementById("Difficulty").innerHTML;
//incrementer/decrementer used for score
const INCREMENT = 10;
const DECREMENT = 20;

//****************Global Variables************//

// eraser selected by default
var COLOR = "eraser";
//record of user selected cells
var userCanvas = {};
//controls the number of rows and columns a grid has.
var GRIDCOL;
var GRIDROWS;
//puzzle currently selected
var puzzle;
var puzzleName;
var result = document.getElementById("result");


//*---------------SUPPORTING FUNCTIONS-------------------------------------------//
//ALL SUPPORTING FUNCTIONS ARE WRITTEN IN snake_case.

/*
Generates a random puzzle (supported for all grid sizes)
! NO LONGER USED. KEPT IN FILE FOR TESTING PURPOSES.
@param color_array is the array that we used as the colors for the palette
@return the generated puzzle
*/
function generate_random_puzzle(color_array){
    let num_cells = GRIDROWS * GRIDCOL;
    const puzzle_color_dict = {};

    for(let i = 0; i< num_cells; i++){
        //get a random cell
        let key = Math.round(Math.random()*(num_cells-1));
        //get a random colour
        //-2 instead of -1 so eraser isn't included
        let index = Math.round(Math.random()*(color_array.length-2));
        //add random color to random cell
        puzzle_color_dict[key] = color_array[index];
    }

    return puzzle_color_dict;
}


//Initalises the PUZZLES array
function initalize_puzzle(){
    // send a request to get the puzzles
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        
        if(this.response != "None" && this.response != "Complete" )
        {
            var puzzleData = {}
            let response = JSON.parse(this.response);
            console.log(response);

            for(const [key,value] of Object.entries(response))
            {
                //add puzzle as a dictionary
                puzzleData[key] = value;
                console.log(puzzleData)
                PUZZLES.push(puzzleData);
                puzzleData = {}
            }
            
            next_puzzle();
        } else if(this.response == "None"){
            // No puzzles found
            display_message("!!!!TERMINAL ERROR!!!!!! <br> NO PUZZLES FOUND! <br> Maybe try uploading your own?")
        } else {
            // puzzles already completed today
            document.getElementById("Start").style.display = "none";
            display_message("<span style='color:red;'>"+DIFFICULTY+" Puzzles already Completed!</span><br>Try doing another difficulty. <br>Otherwise new puzzles will be avaliable tomorrow.")
        }

    }
    // get puzzles of DIFFICULTY
    xhttp.open("GET", "/getData?Difficulty="+DIFFICULTY);
    xhttp.send();
}

//Goes to the next puzzle in PUZZLES
function next_puzzle(){
    //if PUZZLES is not empty
    if(PUZZLES.length != 0)
    {
        //get data
        let puzzleData = PUZZLES.shift();
        console.log(puzzleData);

        //assign new puzzle
        for(const [key,value] of Object.entries(puzzleData))
        {
            puzzle = JSON.parse(value);
            puzzleName = key;
        }

        //clear User array and canvas
        canvas.clear(userCanvas);
        table.classList.add("Q");
    } else {
        //wait one second before showing end game screen
        end_game();
    }

}

//events that occur when the game ends
//hides everything, except the results
function end_game(){
    if(score > 0)
    {
        //visual win screen
        display_image("win.png", "YOU WIN");
        scoreDisplay.innerHTML = `<p>YOUR FINAL SCORE IS:<br> ${score}!<br>Your score has been updated!</p>`

    } else {
        //visual lose
        display_image("GameOver.jpg", "YOU LOST");
        scoreDisplay.innerHTML = `<p>YOUR FINAL SCORE IS:<br> ${score}...</p>`
    }

    //always do this regardless of win or lose
    document.getElementById("Start").style.display = "none";
    document.getElementById("colorPallet").style.display = "none";
    document.getElementById("canvas").style.display = "none";
    document.querySelector("h2").style.display = "none";
    display_message("<h1>Daily Puzzle Supply Depleted <br> For Now...</h1>", false);
    //appearing FBshare button
    document.getElementById("FBSHARE").style.display = "inline-block";
    //upload score
    const xhr = new XMLHttpRequest();
    xhr.open('POST', "/getScore?Score="+score+"&Difficulty="+DIFFICULTY);
    xhr.send(); 
}

/*
Collapsed all button changes into one function
Nice clean code
@param from the button to hide
@param to the button to show
*/
function change_button(from, to) {
    //remove any messages
    display_message("");
    document.getElementById(from).style.display = "none";
    document.getElementById(to).style.display = "inline-block";

}

/*
    displays a message in the result section
    @param text text to display
*/ 
function display_message(text){
    //display text
    result.innerHTML = text;
}
/*
    displays an image in the result section
    @param image image name
    @param alt the value of the alt attribute of the image
*/
function display_image(image, alt)
{
    let img = document.createElement("img");
    img.setAttribute("alt", alt);
    img.setAttribute("src", "static/pictures/" + image);
    result.appendChild(img);
}

/*
    Creates a visual indication of color change
    @param colorSelected the new color selected
*/ 
function change_color(colorSelected)
{
    //responsible for CSS change when color is selected
    document.getElementById(COLOR).classList.remove("selected");
    COLOR = colorSelected
    document.getElementById(COLOR).classList.add("selected");
}

/*
Event Listener function for coloring canvas
@param index the index of the cell to color
@param cell the DOM reference of the cell
@param event the event
*/
function color(index, cell, event) {
    // console.log(event);

    //if ready and left mouse is down
    if(table.classList.contains("ready"))
    {
        //if the eraser is selected and the user is left clicking 
        //or if the user clicked mouse and the
        //color of the cell is the same as the color selected
        //remove the color of the cell
        if(COLOR === "eraser" && event.buttons === 1 || 
        (event.type === "mousedown" && COLOR === userCanvas[index]))
        {
            cell.style.backgroundColor = null;
            //console.log("deleted: " + userCanvas[index] + " at: " + index); //for debugging check function
            delete userCanvas[index];

            //else if not eraser and left mouse is down, color.
        } else if(event.buttons === 1){
            cell.style.backgroundColor = COLOR;
            //console.log("added: " + COLOR + " at: " + index); //for debugging check function
            userCanvas[index] = COLOR;
        }
        //if canvas isn't ready and the user tries to color 
        //display message
    } else if (event.buttons === 1) {
        display_message("Can only draw once ready is pressed!");
    }
}

//uses DIFFICUTLY to determine the size of the grid.
function determine_grid_size()
{
    console.log(DIFFICULTY);
    if(DIFFICULTY.toLowerCase() == "hard"){
        GRIDCOL = 16;
        GRIDROWS = 16;
    }
    else if(DIFFICULTY.toLowerCase() == "normal"){
        GRIDCOL = 8;
        GRIDROWS = 8;
    }
    else{
        GRIDCOL = 4;
        GRIDROWS = 4;
    }
}
//*----------------------------CREATETABLE-------------------------------------------------------------//
//Below are the functions used to initalise and create the canvas and pallet.

/* Multipurpose function(prototype/Object)
Creates a canvas with a specified number of rows and 
columns.
@param numRows - number of rows the table will have.
@param numColumns - number of columns the table will have.
@param location - the id that the table html will be appended to
@param data - the color array that is intended for the respective canvas that will be created(e.g. if creating grid 8*8, the lenght of the color array will be 8*8 = 64)
*/
function CreateTable(numRows,numColumns,location,data){
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.location = location;
    this.data = data;

}

/* make method for CreateTable
Creates a grid (for canvas or pallet) with a specified number of rows and columns.
@return the table html
*/
CreateTable.prototype.make = function(){
    let locationHTML = document.getElementById(this.location);
    let table = document.createElement("table");

    for(let r = 0; r<this.numRows; r++){
        let row = document.createElement("tr");

        for (let c = 0; c < this.numColumns; c++) {
            //allocating index to element in the Table
            let index = c + (this.numColumns * r);
            let cell = document.createElement("td");
            if(DIFFICULTY.toLowerCase() == "hard"){
            cell.style.padding = "1.2vh";
            }
            else if(DIFFICULTY.toLowerCase() == "normal"){
            cell.style.padding = "2.4vh";
            }
            //Apply relevant settings.
            switch(this.location)
            {
                //If the table is for canvas
                case "canvas":
                    cell.classList.add("box");
                    cell.setAttribute("id", index.toString());

                    //adding addEventListener after click change the color
                    //adding addEventListener after mouse over to change the color (if left mouse is pressed)
                    //adding addEventListener after drag to change the color (if left mouse is pressed)
                    cell.addEventListener("mousedown", (e) => color(index, cell, e));
                    cell.addEventListener("mouseover", (e) => color(index, cell, e));
                    cell.addEventListener("dragenter", (e) => color(index, cell, e));
                break;

                //If the table is for colorPallet
                case "colorPallet": 
                    let colorName = PALETTEIDS[c];
                    let cellColor = PALETTE1[colorName]; //number of colours match the number of columns

                    cell.classList.add("colorPallet");
                    cell.setAttribute("id", colorName);
                    cell.style.backgroundColor = cellColor;
                    cell.style.padding = "2vh";
                    //Event listener to remember color chosen
                    cell.addEventListener("click", () => change_color(colorName));
                break;
            } 
            row.appendChild(cell);
          }

        table.appendChild(row);
    }
    locationHTML.appendChild(table);

    return table;
}

/* draw method for CreateTable
Fills the respective table (grid or palette) with colors according to the input 
color array property of createTable*/
CreateTable.prototype.draw = function() {

    //retrieves each key value pair in puzzle as an array
    for (const [key, value] of Object.entries(this.data)) {
        console.log(this.data);
        console.log(key);
        //get cell
        let box = document.getElementById(key.toString());
        console.log(box);
        //change color of cell
        box.style.backgroundColor = value;
      }
}

/* clear method for CreateTable
clears all colours from the respective table (grid or palette) 
! SHOULD ONLY BE USED FOR CANVAS
AKA changing the colour of all cells to null (white)*/
CreateTable.prototype.clear = function() {
    //get cell.
    let cell = document.getElementById(this.location).getElementsByTagName("td");

    // Assign the background color of each cell to null (white).
    for(let c = 0; c < (this.numRows * this.numColumns); c++){
        cell[c].style.backgroundColor = null;   
        cell[c].classList.remove("wrong");
    }

    //if an argument is given, clear the user canvas.
    if(arguments.length > 0)
    {
        //clear user canvas.
        userCanvas = {};
    }
}


//*-----------------------------------------INITALISATION---------------------------------------------------------------------------//
//below are the function calls

/*
First we create a new instance of CreateTable and assign it to a variable to store it (this object is for the palette).
Then we create the palette using make() and fill in the color using the constant array that stores the colors of the pallet (PALETTE1).
!NOTE:
    * The color array length should match the number of cells in the color pallet.
    * Note that the palette's row should always be 1(becuase we are doing it horizontally) and the column size is flexible.
*/ 

//Create a new CreateTable object with all the parameters needed for creation.
let pallet = new CreateTable(1,PALETTEIDS.length,"colorPallet",PALETTE1);
//create a table for the pallet.
pallet.make();
//color the pallet.
pallet.draw();

/*
generate_random_puzzle function uses the color pallet to generate the random puzzle dictionary.
Create the canvas using make()
!NOTE: At the moment the data parameter for canvas starts an empty. Puzzle data is assigned on start.
*/ 
//uses difficulty to determine size of grid.
determine_grid_size();
let canvas = new CreateTable(GRIDROWS,GRIDCOL,"canvas", {});
canvas.make();

//for visuals
let table = document.getElementById(canvas.location).querySelector("table");
let score = 0  
scoreDisplay = document.getElementById("scores");
//initalises the puzzles array
initalize_puzzle();

//*-----------------------------------------Buttons---------------------------------------------------------------------------//

document.getElementById("Start").addEventListener("click", () => {
    //clear the canvas and inital Question Mark. 
    canvas.clear(); 
    table.classList.remove("Q");
    //give canvas puzzle data.
    canvas.data = puzzle; 
    document.querySelector("h2").innerHTML = puzzleName;
    //initalise canvas using the new puzzle.
    canvas.draw(); 
    //visual indication of start
    table.classList.add("start");
    //change start button to ready
    change_button("Start", "Ready");
    document.getElementById("Draw").style.display = "none";
});


//Clear the Canvas for Drawing when user clicks "Ready" Button.
document.getElementById("Ready").addEventListener("click", () => {
    //clear cavnas for drawing
    canvas.clear();
    //draw user's canvas
    canvas.data = userCanvas;
    canvas.draw();
    //Visual indication of ready
    table.classList.add("ready");
    //change ready button to check
    change_button("Ready", "Check");
});


//check if the user canvas matches the puzzle
document.getElementById("Check").addEventListener("click", () => {

    //Get the keys of the Puzzle and userCanvas dictionaries.
    let puzzleKeys = Object.keys(puzzle);
    let choosenArray = Object.keys(userCanvas);
    let hasWon = true

    let count = 0;    

   //item that exist in original array but not in the choosen array
    let diff1 = puzzleKeys.filter(x => !choosenArray.includes(x));
    
    //check all the element of chosen cells
    for(let i=0; i < choosenArray.length; i++){
        let item = choosenArray[i];
        let cell = document.getElementById(item);

        //if item is not in puzzle or if it is in puzzle
        //and the wrong colour
        if((!puzzleKeys.includes(item)) || 
        (puzzleKeys.includes(item) && puzzle[item] != userCanvas[item])){
            hasWon = false;
            cell.classList.add("wrong");
            //remove item from canvas
            delete userCanvas[item];

            //Deducts from the score as wrong cell or color
            score = score - DECREMENT;
        }
        //Adds points to the score for each correct cell
        else{
            count++;
            score = score + INCREMENT; 
        }
    }
    //Check items that have been in puzzle and conestant missed it
    if(diff1.length!==0){
        hasWon = false;

        for(let i = 0; i < diff1.length; i++){
            let item = diff1[i];
            let cell = document.getElementById(item);
            cell.classList.add("wrong");
            //remove item from canvas
            delete userCanvas[item];   
        }
    }
    

    if(hasWon) {
        //Displays the score
        scoreDisplay.innerHTML = "Score: " + score;

        console.log("you win");
        //Visual indication of win
        table.classList.remove("start");
        table.classList.remove("ready");
        change_button("Check", "Next");
        //display correct puzzle message
        display_message('<h3><span style ="color:green">Correct!</span></h3>');
    }else{
        //Displays the score
        scoreDisplay.innerHTML = "Score: " + score;

        console.log("you lost");
       
        console.log("User: " + JSON.stringify(userCanvas) + "\nPuzzle " + JSON.stringify(puzzle));

        //change check button to start
        change_button("Check", "Start");
        //If user lose and tries again, it deducts the score for the correct cells.
        score = score - (INCREMENT * count);
        //Display incorrect puzzle message
        display_message(`<h3><span style ="color:red">Incorrect.</span>
        <br>Wrong cells are outlined in <span style ="color:white">WHITE</span></h3>`);
        
        //don't allow user to draw
        table.classList.remove("ready");
    }
});

document.getElementById("Next").addEventListener("click", () => {
    //change next to start
    change_button("Next", "Start");
    document.getElementById("FBSHARE").style.display = "none";
    //go to next puzzle and remove puzzle name
    document.querySelector("h2").innerHTML = "";
    next_puzzle();
});

//*-------------------------Uploading puzzle to database------------------------//
document.getElementById("Draw").addEventListener("click", () => {
    //completely clear canvas
    canvas.clear(userCanvas);
    //clear Q mark
    table.classList.remove("Q");
    document.getElementById("Start").style.display = "none";
    canvas.draw();
    //Visual indication of ready
    table.classList.add("ready");
    //change draw button to upload
    change_button("Draw", "Upload");
    document.getElementById("name").style.display = "inline-block";
    document.getElementById("scores").style.display = "none";
});

document.getElementById("Upload").addEventListener("click", () => 
{
    //get name
    puzzle_name = document.getElementById("name").value;
    //collect data
    db_data = JSON.stringify(userCanvas) + "|" + DIFFICULTY + "|" + puzzle_name;
    //add data to form
    document.getElementById("PuzzleDb").value= db_data;
});
// 
//*-------------------------Sharing to facebook------------------------//
document.getElementById("FBSHARE").addEventListener("click", () => {

    // Send score to flask
    final_score = score;
    const http = new XMLHttpRequest();
    http.open("POST", "/FBsharing?Score="+ String(score)+"&difficulty="+DIFFICULTY);
    http.send();
    http.onreadystatechange=(e)=>{
        console.log(http.responseText);
    }
    // change button to go to FB page
    change_button("FBSHARE", "FBPage");
    display_message('<h3><span style ="color:green">Your result has been shared to our Facebook page!</span></h3>');
});