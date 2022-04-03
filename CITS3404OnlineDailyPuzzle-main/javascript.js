//*----------------GLOBAL VARIABLES AND CONSTANTS-----------------------------------------------//

var COLOR = "rgb(255, 255, 255)";
var CHOSENCELLS = [];

// Fixed color array for the palette(length must fit the palette total length, total length = row* column)
const PALETTE1 = ["#648FFF","#785EF0","#DC267F","#FE6100","#FFB000"];

//*---------------SUPPORTING FUNCTIONS-------------------------------------------//
/*
Generates an array with size = rows*columns with color randomly chosen in the color_array
@param color_array is the array that we used as the colors for the palette
@param rows - number of rows the table will have.
@param columns - number of columns the table will have.
@return the generated array

*/
function generate_random_puzzle(color_array, rows,columns){
    let num_cells = rows * columns;
    const puzzle_color_array = [];

    for(let i = 0; i< num_cells; i++){
        let index = Math.round(Math.random()*(color_array.length-1));
        puzzle_color_array.splice(i,0,color_array[index]);
    }

    return puzzle_color_array;
}

//*----------------------------CREATETABLE-------------------------------------------------------------//
//Below are the functions used to initalise and create the canvas and pallet.

/* Multipurpose function(prototype/Object)
Creates a canvas with a specified number of rows and 
columns.
@param numRows - number of rows the table will have.
@param numColumns - number of columns the table will have.
@param location - the id that the table html will be appended to
@param color - the color array that is intended for the respective canvas that will be created(e.g. if creating grid 8*8, the lenght of the color array will be 8*8 = 64)
*/
function CreateTable(numRows,numColumns,location,color){
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.location = location;
    this.color = color;

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
                    cell.addEventListener("click", () => {
                    if (cell.style.backgroundColor == COLOR) {
                        cell.style.backgroundColor = null;
                        CHOSENCELLS.pop(index);
                        console.log(CHOSENCELLS);

                    } else {
                        cell.style.backgroundColor = COLOR;
                        CHOSENCELLS.push(index);
                    }
                    });
                break;

                //If the table is for colorPallet
                case "colorPallet": 
                    let cellColor = PALETTE1[c]; //number of colours match the number of columns

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

/* initialise_color method for CreateTable
Fills the respective table (grid or palette) with colors according to the input 
color array property of createTable*/
CreateTable.prototype.initialise_color = function() {
    let cell = document.getElementById(this.location).getElementsByTagName("td");

    // for each cell assign the background color of the cell according to the color array using the index c (e.g. c = 0 => the first index of the color array and the first index of the canvas(first cell))
    for(let c = 0; c<this.color.length;c++){
        cell[c].style.backgroundColor = this.color[c];   
        
    }
}

/* clear method for CreateTable
clears all colours from the respective table (grid or palette) 
AKA changing the colour of all cells to white*/
CreateTable.prototype.clear = function() {
    let cell = document.getElementById(this.location).getElementsByTagName("td");

    // for each cell assign the background color of the cell to white using the index c (e.g. c = 0 => the first index of the color array and the first index of the canvas(first cell))
    for(let c = 0; c<this.color.length;c++){
        cell[c].style.backgroundColor = "rbg(255,255,255)";   
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

var pallet = new CreateTable(1,5,"colorPallet",PALETTE1);
pallet.make();
pallet.initialise_color();

/*
Use the color array, that we used for the palette, to generate a random puzzle.
The generate_random_puzzle function is going to create another color array for the grid using the 
limited color choices that we used in the color array for palette.

e.g. The color array consist of red, blue, green, yellow, purple and the grid size is 8*8 = 64. 
The grid color array will be a 8*8 = 64 length array and will add red, blue, yellow, purple color in 
random order until the grid color array is filled.

Then we create the canvas using make() and fill in the color according to the array initialise_color()
*/ 

var puzzle_array = generate_random_puzzle(PALETTE1, 8,8);
var canvas = new CreateTable(8,8,"canvas",puzzle_array);
canvas.make();
canvas.initialise_color();

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