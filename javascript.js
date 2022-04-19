//*----------------GLOBAL VARIABLES AND CONSTANTS-----------------------------------------------//

//need a color pallet that has black? Or maybe a larger pallet for future.
// Fixed color array for the palette(length must fit the palette total length, total length = row* column)
const PALETTE1 = {
    "#648FFF": "#648FFF",
    "#785EF0": "#785EF0",
    "#DC267F": "#DC267F",
    "#FE6100": "#FE6100",
    "#FFB000": "#FFB000"
};

//may be a better way to do this, used to create IDs for colour pallet cells.
//also used for random puzzle generator
const PALETTEIDS = ["#648FFF","#785EF0","#DC267F","#FE6100","#FFB000"];

//controls the number of rows and columns a grid has.
//! Small sizes for easy testing. Size to be determined.
const GRIDROWS = 3;
const GRIDCOL = 3;

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
const QMARK = {
    133: PALETTE1["#648FFF"],
    116: PALETTE1["#785EF0"],
    100: PALETTE1["#648FFF"],
    85: PALETTE1["#785EF0"],
    70: PALETTE1["#648FFF"],
    71: PALETTE1["#785EF0"],
    72: PALETTE1["#648FFF"],
    89: PALETTE1["#785EF0"],
    106: PALETTE1["#648FFF"],
    122: PALETTE1["#785EF0"],
    138: PALETTE1["#648FFF"],
    153: PALETTE1["#785EF0"],
    168: PALETTE1["#648FFF"],
    183: PALETTE1["#785EF0"],
    199: PALETTE1["#648FFF"],
    231: PALETTE1["#785EF0"]
  }


  //Global Variables
var WRONGCELL = "#FF0000"; 
var COLOR = null;
var USERCANVAS = {};
var CHECKEDCANVAS = {}


//*---------------SUPPORTING FUNCTIONS-------------------------------------------//
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
                    //adding addEventListener after drag to change the color
                    cell.addEventListener("click", () => color(index, cell));
                    cell.addEventListener("dragenter", () => color(index, cell));
                break;

                //If the table is for colorPallet
                case "colorPallet": 
                    let cellColor = PALETTEIDS[c]; //number of colours match the number of columns

                    cell.classList.add("colorPallet");
                    cell.setAttribute("id", cellColor);
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

/*Event Listener function for canvas
may remove, "drag enter" doesn't work well.
*/
function color(index, cell) {
    if (COLOR === null) { //if using eraser //! same color click to remove functionality was removed (Drag colouring didn't work well with it on)
        cell.style.backgroundColor = null;
        console.log("deleted: " + USERCANVAS[index] + " at: " + index); //for debugging check function
        delete USERCANVAS[index];

    } else {
        cell.style.backgroundColor = COLOR;
        console.log("added: " + COLOR + " at: " + index); //for debugging check function
        USERCANVAS[index] = COLOR;
    }
}


/* initialise_color method for CreateTable
Fills the respective table (grid or palette) with colors according to the input 
! Merged Amir's draw function and Will's initalise_color function
color array property of createTable*/
CreateTable.prototype.initialise_color = function() {

    //retrieves each key value pair in puzzle as an array
    for (const [key, value] of Object.entries(this.data)) {
        //get cell
        let box = document.getElementById(key.toString());
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

    //clear user canvas.
    USERCANVAS = {};
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
var pallet = new CreateTable(1,5,"colorPallet",PALETTE1);
//create a table for the pallet.
pallet.make();
//color the pallet.
pallet.initialise_color();

/*
generate_random_puzzle function uses the color pallet to generate the random puzzle dictionary.
Create the canvas using make() and fill in the color (according to the data parameter of Createtable object) using initialise_color().
!NOTE: At the moment the data parameter for canvas starts an empty. Puzzle data is assigned on start.
*/ 

//generate random puzzle
var puzzle_random = generate_random_puzzle(PALETTEIDS);


//puzzle_random for random puzzle else use a predefined puzzle.
const PUZZLE = puzzle_random;

var canvas = new CreateTable(GRIDROWS,GRIDCOL,"canvas", {});
canvas.make();
canvas.initialise_color();

//for visuals
var table = document.getElementById(canvas.location).querySelector("table"); 

document.getElementById("Start").addEventListener("click", () => {
    //Visual indication of game start
    table.style.borderCollapse = null;
    //clear the inital Question Mark. //! Question mark not supported yet, need better user hints for larger puzzles, or smaller Question mark size.
    canvas.clear(); 
    //give canvas puzzle data.
    canvas.data = PUZZLE; 
    //initalise canvas using the new puzzle.
    canvas.initialise_color(); 
});


//Clear the Canvas for Drawing when user clicks "Ready" Button.
document.getElementById("Ready").addEventListener("click", () => {
    //clear cavnas for drawing
    canvas.clear()
    //Visual indication of game start
    table.style.borderCollapse = "separate";
});


//check if the user canvas matches the puzzle
document.getElementById("Check").addEventListener("click", () => {
    //Get the keys of the Puzzle and UserCanvas dictionaries.
    let puzzleKeys = Object.keys(PUZZLE); //!used to have sort(), not needed
    let choosenArray = Object.keys(USERCANVAS); //!only used for length
    let hasWon = true

   //item that exist in original array but not in the choosen array
    let diff1 = puzzleKeys.filter(x => !choosenArray.includes(x));
    //item that exist in choosen array but not in the original
    let diff2 = choosenArray.filter(x => !puzzleKeys.includes(x));
    
    //check all the element of chosen cells
    for(let i=0; i < choosenArray.length; i++){
        let item = choosenArray[i]
        if(puzzleKeys.includes(item)){
            if(PUZZLE[item] != USERCANVAS[item]){
                hasWon = false;
                CHECKEDCANVAS[item] = WRONGCELL;
            }else{
                CHECKEDCANVAS[item] = USERCANVAS[item];
            }
        }
    }
    //Check items that have been in puzzle and conestant missed it
    if(!diff1.length==0){
        hasWon = false;
        for(let i = 0; i < diff1.length; i++){
            let item = diff1[i];
            CHECKEDCANVAS[item] = WRONGCELL;
        }
    }
    //check items that have been choosen but not in the puzzle
    if(!diff2.length==0){
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

    if(hasWon) {
        //added to give a small visual indication of winning
        table.style.borderCollapse = null;
        //   alert("You Won!");
        document.getElementById("result").innerHTML = '<img src="pictures/win.png" class="rounded" alt=""></img>'
        
    }else{

        //------------------------------- This will display the wrong cells in red color ----------------
        console.log(CHECKEDCANVAS);
        //clear the inital Question Mark. //! Question mark not supported yet, need better user hints for larger puzzles, or smaller Question mark size.
        canvas.clear(); 
        //give canvas puzzle data.
        canvas.data = CHECKEDCANVAS; 
        //initalise canvas using the new puzzle.
        canvas.initialise_color();
        
        let result = document.getElementById("result");
        result.innerHTML= '<img src="pictures/GameOver.jpg" class="rounded" alt=""></img>' +
        '<h3>Wrong cells are filled <span style ="color:red">Red</span> </h3>';
        
    }
    
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

//-------------------------Game Buttons-------------------------------
//function hides start button and reveals Ready Button
function hideStart(){
    document.getElementById("Start").style.display = "none";
    document.getElementById("Ready").style.opacity = 1;
}

//hides Ready button and reveals Check Button
function hideReady(){
    document.getElementById("Ready").style.display = "none"; 
    document.getElementById("Check").style.opacity = 1;
}

//hides check button
function hideCheck(){
    document.getElementById("Check").style.display = "none";
}