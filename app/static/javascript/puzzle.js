//*----------------GLOBAL VARIABLES AND CONSTANTS-----------------------------------------------//

//need a color pallet that has black? Or maybe a larger pallet for future.
// Fixed color array for the palette(length must fit the palette total length, total length = row* column)
const PALETTE1 = {
    "#648FFF": "#648FFF",
    "#785EF0": "#785EF0",
    "#DC267F": "#DC267F",
    "#FE6100": "#FE6100",
    "#FFB000": "#FFB000",
    "eraser" : null
};

//may be a better way to do this, used to create IDs for colour pallet cells.
//also used for random puzzle generator
const PALETTEIDS = ["#648FFF","#785EF0","#DC267F","#FE6100","#FFB000", "eraser"];

//controls the number of rows and columns a grid has.
//! Small sizes for easy testing. Size to be determined.
const GRIDROWS = 4;
const GRIDCOL = 4;

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

  //for 7x7 grid size
const QMARK = {
    16: PALETTE1["#648FFF"],
    10: PALETTE1["#785EF0"],
    18: PALETTE1["#648FFF"],
    25: PALETTE1["#785EF0"],
    31: PALETTE1["#648FFF"],
    45: PALETTE1["#785EF0"],
  }


  //Global Variables
var WRONGCELL = "#FF0000"; 
var COLOR = null;
var USERCANVAS = {};
var CHECKEDCANVAS = {};
//puzzle currently selected
var puzzle;
//container for multiple puzzles
const PUZZLES = [];
//number of puzzles
const PUZZLENO = 2;
//length of delays
const TIMER = 2000;


//*---------------SUPPORTING FUNCTIONS-------------------------------------------//
//ALL SUPPORTING FUNCTIONS ARE WRITTEN IN snake_case.

/*
Generates a random puzzle (supported for all grid sizes)
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
        let index = Math.round(Math.random()*(color_array.length-1));
        //add random color to random cell
        puzzle_color_dict[key] = color_array[index];
    }

    return puzzle_color_dict;
}


//Initalises the PUZZLES array
function initalize_puzzle(){
    //add as many puzzles as directed by PUZZLENO
    for(let i = 0; i<PUZZLENO; i++)
    {
        //add random puzzle
        PUZZLES.push(generate_random_puzzle(PALETTEIDS));
    }
}

//Goes to the next puzzle in PUZZLES
function next_puzzle(){
    //if PUZZLES is not empty
    if(PUZZLES.length != 0)
    {
        //assign new puzzle
        puzzle = PUZZLES.shift();

        //clear User array and canvas
        canvas.clear(USERCANVAS);
        //change data to QMARK and draw
        // canvas.data = QMARK;
        // canvas.draw();
        table.classList.add("Q");
    } else {
        //wait one second before showing end game screen
        async function delay() {
            await new Promise(resolve => setTimeout(resolve, TIMER));
            //end the game
            end_game();
        }
        
        delay();
    }

}

//events that occur when the game ends
//hides everything, except the results
function end_game(){
    document.getElementById("Start").style.display = "none";
    document.getElementById("colorPallet").style.display = "none";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("Eraser").style.display = "none";
    display_message("<h1>Daily Puzzle Supply Depleted <br> For Now...</h1>", false);
    display_image("win.png", "YOU WIN");
}

/*
Collapsed all button changes into one function
Nice clean code
@param from the button to hide
@param to the button to show
*/
function change_button(from, to) {
    document.getElementById(from).style.display = "none";

    result.innerHTML = "Please wait..." + "<br>" + result.innerHTML;

    //wait one second before showing next button
    async function delay() {
        await new Promise(resolve => setTimeout(resolve, TIMER));
        document.getElementById(to).style.display = "inline-block";
        //hide lose screen
        result.innerHTML='';
    }
      
    delay();

}

function display_message(text, clear){
    //display text
    result.innerHTML = text;

    //if it should be cleared after displayed
    if(clear === true)
    {
        //wait few seconds before removing the message
        async function delay() {
            await new Promise(resolve => setTimeout(resolve, TIMER));
            result.innerHTML = "";
        }
    
        delay();
    }
}

function display_image(image, alt)
{
    let img = document.createElement("img");
    img.setAttribute("alt", alt);
    img.setAttribute("src", "static/pictures/" + image);
    result.appendChild(img);
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
///! USED TO BE TWO SEPERATE METHODS, NOW JUST ONE.
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

            //Apply relevant settings.
            switch(this.location)
            {
                //If the table is for canvas
                case "canvas":
                    cell.classList.add("box");
                    cell.setAttribute("id", index.toString());

                    //adding addEventListener after click change the color
                    //adding addEventListener after drag to change the color (if left mouse is pressed)
                    //adding addEventListener after drag to change the color (if left mouse is pressed)
                    cell.addEventListener("mousedown", () => color(index, cell));
                    cell.addEventListener("mouseover", (e) => dragColor(index, cell, e));
                    cell.addEventListener("dragenter", (e) => dragColor(index, cell, e));
                break;

                //If the table is for colorPallet
                case "colorPallet": 
                    let colorName = PALETTEIDS[c];
                    let cellColor = PALETTE1[colorName]; //number of colours match the number of columns

                    cell.classList.add("colorPallet");
                    cell.setAttribute("id", colorName);
                    cell.style.backgroundColor = cellColor;

                    //Event listener to remember color chosen
                    cell.addEventListener("click", () => COLOR = cellColor);
                break;
            } 
            row.appendChild(cell);
          }

        table.appendChild(row);
    }
    locationHTML.appendChild(table);

    return table;
}

/*
Event Listener function for clicking canvas
*/
function color(index, cell) {
    if(table.classList.contains("ready"))
    {
        //if COLOR===null isn't specifided it will add null to the USERCANVAS
        //which causes the check function to break
        //same color click to remove functionality (Drag colouring doesn't work well with it on)
        if (COLOR === USERCANVAS[index] || COLOR === null) { 
            cell.style.backgroundColor = null;
            console.log("deleted: " + USERCANVAS[index] + " at: " + index); //for debugging check function
            delete USERCANVAS[index];

        } else {
            cell.style.backgroundColor = COLOR;
            console.log("added: " + COLOR + " at: " + index); //for debugging check function
            USERCANVAS[index] = COLOR;
        }
    } else {
        //wait few seconds before removing the message
        display_message("Can only draw once ready is pressed!", true);
    }
}

/*
Event Listener function for click dragging canvas
*/
function dragColor(index, cell, e) {

    console.log(e.buttons);

    if(table.classList.contains("ready") && e.buttons === 1)
    {
        if(COLOR === null)
        {
            cell.style.backgroundColor = null;
            console.log("deleted: " + USERCANVAS[index] + " at: " + index); //for debugging check function
            delete USERCANVAS[index];
        } else {
            cell.style.backgroundColor = COLOR;
            console.log("added: " + COLOR + " at: " + index); //for debugging check function
            USERCANVAS[index] = COLOR;
        }
    } else if (e.buttons === 1) {
           //wait few seconds before removing the message
           
        //wait few seconds before removing the message
        display_message("Can only draw once ready is pressed!", true);
    }
}


/* draw method for CreateTable
Fills the respective table (grid or palette) with colors according to the input 
! Merged Amir's draw function and Will's initalise_color function
color array property of createTable*/
CreateTable.prototype.draw = function() {

    //retrieves each key value pair in puzzle as an array
    for (const [key, value] of Object.entries(this.data)) {
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
    }

    //if an argument is given, clear the user canvas.
    if(arguments.length > 0)
    {
        //clear user canvas.
        USERCANVAS = {};
    }
}


//*-----------------------------------------INITALISATION---------------------------------------------------------------------------//
//below are the function calls

//! Need to have initalization only occur in dailypuzzle.html

/*
First we create a new instance of CreateTable and assign it to a variable to store it (this object is for the palette).
Then we create the palette using make() and fill in the color using the constant array that stores the colors of the pallet (PALETTE1).
!NOTE:
    * The color array length should match the number of cells in the color pallet.
    * Note that the palette's row should always be 1(becuase we are doing it horizontally) and the column size is flexible.
*/ 

//Create a new CreateTable object with all the parameters needed for creation.
var pallet = new CreateTable(1,6,"colorPallet",PALETTE1);
//create a table for the pallet.
pallet.make();
//color the pallet.
pallet.draw();

/*
generate_random_puzzle function uses the color pallet to generate the random puzzle dictionary.
Create the canvas using make() and fill in the color (according to the data parameter of Createtable object) using draw().
!NOTE: At the moment the data parameter for canvas starts an empty. Puzzle data is assigned on start.
*/ 

var canvas = new CreateTable(GRIDROWS,GRIDCOL,"canvas", {});
canvas.make();

//for visuals
var table = document.getElementById(canvas.location).querySelector("table"); 

//initalises the puzzles array
initalize_puzzle();
//gets first puzzle
next_puzzle();

//*-----------------------------------------Buttons---------------------------------------------------------------------------//

document.getElementById("Start").addEventListener("click", () => {
    //clear the canvas and inital Question Mark. 
    canvas.clear(); 
    table.classList.remove("Q");
    //give canvas puzzle data.
    canvas.data = puzzle; 
    //initalise canvas using the new puzzle.
    canvas.draw(); 
    //visual indication of start
    table.classList.add("start");
    //change start button to ready
    change_button("Start", "Ready");
});


//Clear the Canvas for Drawing when user clicks "Ready" Button.
document.getElementById("Ready").addEventListener("click", () => {
    //clear cavnas for drawing
    canvas.clear();
    //draw user's canvas
    canvas.data = USERCANVAS;
    canvas.draw();
    //Visual indication of ready
    table.classList.add("ready");
    //change ready button to check
    change_button("Ready", "Check");
});


//check if the user canvas matches the puzzle
document.getElementById("Check").addEventListener("click", () => {

    //Get the keys of the Puzzle and UserCanvas dictionaries.
    let puzzleKeys = Object.keys(puzzle); //!used to have sort(), not needed
    let choosenArray = Object.keys(USERCANVAS); //!only used for length
    let hasWon = true
    let correctCells = {};
    let result = document.getElementById("result");

   //item that exist in original array but not in the choosen array
    let diff1 = puzzleKeys.filter(x => !choosenArray.includes(x));
    //item that exist in choosen array but not in the original
    let diff2 = choosenArray.filter(x => !puzzleKeys.includes(x));
    
    //check all the element of chosen cells
    for(let i=0; i < choosenArray.length; i++){
        let item = choosenArray[i]
        if(puzzleKeys.includes(item)){
            if(puzzle[item] != USERCANVAS[item]){
                hasWon = false;
                CHECKEDCANVAS[item] = WRONGCELL;
                //should remove incorrect cell from user canvas
                // delete USERCANVAS[item]; 
            }else{
                CHECKEDCANVAS[item] = USERCANVAS[item];
                correctCells[item] = USERCANVAS[item];
            }
        }
    }
    //Check items that have been in puzzle and conestant missed it
    if(diff1.length!==0){
        hasWon = false;
        for(let i = 0; i < diff1.length; i++){
            let item = diff1[i];
            CHECKEDCANVAS[item] = WRONGCELL;
        }
    }
    //check items that have been choosen but not in the puzzle
    if(diff2.length!==0){
        hasWon = false;
        for(let i = 0; i < diff2.length; i++){
            let item = diff2[i];
            CHECKEDCANVAS[item] = WRONGCELL;
        }
    }
    
    //check if dictionaries have the same length
    // if(puzzleKeys.length === choosenArray.length){
    //   for(let i = 0 ; i < puzzleKeys.length ; i++){
    //     //if one colour doesn't match, user has not won
    //     if(PUZZLE[puzzleKeys[i]] != USERCANVAS[puzzleKeys[i]]){
    //       hasWon = false;
    //     }
    //   }
    // }else{
    //   //if dictionary lengths don't match, user has not won
    //   hasWon = false;
    // }

    //remember the correct cells in the user canvas
    USERCANVAS = correctCells;

    if(hasWon) {
        console.log("you win");
        //Visual indication of win
        table.classList.remove("start");
        table.classList.remove("ready");
        
        //show win screen
        display_image("win.png", "YOU WIN");
        change_button("Check", "Next");
    }else{
        console.log("you lost");
        //------------------------------- This will display the wrong cells in red color ----------------
        console.log(CHECKEDCANVAS);
        //clear the inital Question Mark. //! Question mark not supported yet, need better user hints for larger puzzles, or smaller Question mark size.
        canvas.clear(); 
        //give canvas puzzle data.
        canvas.data = CHECKEDCANVAS; 
        //initalise canvas using the new puzzle.
        canvas.draw();

        //show picture
        display_message('<h3>Wrong cells are filled <span style ="color:red">Red</span></h3>', true);
        display_image("GameOver.jpg", "Game Over");
        
        
        //don't allow user to draw
        table.classList.remove("ready");

        //change check button to start
        change_button("Check", "Ready");

        //waiting for 2 seconds and then reset the display
        //after delay it will show the correct answer
        //user presses ready again to begin

        async function delay() {
            
            await new Promise(resolve => setTimeout(resolve, TIMER));
            //clearing canvas
            canvas.clear();
            //Return to start state
            canvas.data = puzzle;
            canvas.draw(); 
        }
          
        delay();
    }

    //reset checked canvas
    CHECKEDCANVAS = {};
});

document.getElementById("Next").addEventListener("click", () => {
    //change next to start
    change_button("Next", "Start");
    //go to next puzzle
    next_puzzle();
});

//Activates the eraser.
document.getElementById("Eraser").addEventListener("click", () => COLOR = null);

//*-------------------------MISC------------------------//

//!RANDOM COLOR GEN IF NEEDED
// function generate_random_color(rows,columns){
//     const num_cells = rows * columns;
//     const col_array = [];
//     for(let i = 0; i< num_cells; i++){
//         var r = Math.round(Math.random()*255);
//         var g = Math.round(Math.random()*255);
//         var b = Math.round(Math.random()*255);
//         col_array.splice(i,0,`rgb(${r}, ${g}, ${b})`);
//     }
//     return col_array

// }