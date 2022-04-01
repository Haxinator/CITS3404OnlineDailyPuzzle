
/*                  #TODO
create inital array or randomly generate inital array 
(what the user has to copy), it's contents will be colours 
represented as strings (as they're known in css). To make 
your life easier maybe create a 2D array and use a nested 
loop to assign values to the array.

once you create the inital array assign the colours using the
second loop of the createCanvas function. E.g. I call the inital
array correct, since it's the pattern the user needs to copy.
cell.style.backgroundColor = correct[r][c];
*/



/*create the canvas
#Not sure yet how large the canvas should be
#Need to consider how well it would feel on a phone*/



COLOR = "rgb(255, 255, 255)";
CHOSENCELLS = [];
// Fixed color array for the palette(length must fit the palette total length, total length = row* column)
PALETTE1 = ["#648FFF","#785EF0","#DC267F","#FE6100","#FFB000"];


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

/*
Generates an array with size = rows*columns with color randomly chosen in the color_array
@param color_array is the array that we used as the colors for the palette
@param rows - number of rows the table will have.
@param columns - number of columns the table will have.
@return the generated array

*/
function generate_random_puzzle(color_array, rows,columns){
    const num_cells = rows * columns;
    const puzzle_color_array = [];
    for(let i = 0; i< num_cells; i++){
    let index = Math.round(Math.random()*(color_array.length-1));
    puzzle_color_array.splice(i,0,color_array[index]);
}
    return puzzle_color_array;
}

/* Multipurpose function(prototype/Object)
Creates a canvas with a specified number of rows and 
columns.
@param numRows - number of rows the table will have.
@param numColumns - number of columns the table will have.
@param location - the id that the table html will be appended to
@param color - the color array that is intended for the respective canvas that will be created(e.g. if creating grid 8*8, the lenght of the color array will be 8*8 = 64)
*/
function CreateCanvas(numRows,numColumns,location = "canvas",color){
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.location = location;
    this.color = color;

}
/* Grid method
Creates a grid with a specified number of rows and 
columns.
@return the table html
*/
CreateCanvas.prototype.grid = function(){
    var canvas = document.getElementById(this.location);
    var table = document.createElement("table");

    for(let r = 0; r<this.numRows; r++){
        var row = document.createElement("tr");

        for (let c = 0; c < this.numColumns; c++) {
            //allocating index to element in the Table
            let index = c + this.numColumns * r
            let cell = document.createElement("td");
            //setting box classname so we can give style
            cell.setAttribute("class", "box");
            cell.setAttribute("id", index.toString());
            //adding addEventListener after click change the color
            cell.addEventListener("click", () => {
              if (cell.style.backgroundColor == COLOR) {
                cell.style.backgroundColor = null;
                CHOSENCELLS.pop(index)
                console.log(CHOSENCELLS);

              } 
              else {
                cell.style.backgroundColor = COLOR;
                CHOSENCELLS.push(index)

              }
            });
            row.appendChild(cell);
          }

        table.appendChild(row);
    }
    canvas.appendChild(table);
    return table;
}

/* palette method
Creates a palette with a specified number of columns.
@return the table html
*/
CreateCanvas.prototype.palette = function(){
    var colorPallet = document.getElementById(this.location);
    var table = document.createElement("table");

    
    var row = document.createElement("tr");

    //going through color element that we get from each image
    this.color.forEach(item => {
        
        let cell = document.createElement("td");
        cell.setAttribute("class", "colorPallet");
        //we might need id later
        cell.setAttribute("id", item);

        cell.style.backgroundColor = item;
        //Choosing the desired color
        cell.addEventListener("click", () => {
        COLOR = item;
        });

        row.appendChild(cell);
       
    });
    
    table.appendChild(row);
    
    colorPallet.appendChild(table);
    return table;
}


/* initialise_color method
Fills the respective canvas(grid or palette) with colors according to the input color array*/
CreateCanvas.prototype.initialise_color = function() {
    // Select all the td(cells) within the id(location)
    var cell = document.getElementById(this.location).getElementsByTagName("td");
    // for each cell assign the background color of the cell according to the color array using the index c (e.g. c = 0 => the first index of the color array and the first index of the canvas(first cell))
    for(let c = 0; c<this.color.length;c++){
        cell[c].style.backgroundColor = this.color[c];   
        
    }
}

/* reset method
Reset the respective canvas(grid or palette) to transparent*/
CreateCanvas.prototype.reset = function() {
    // Select all the td(cells) within the id(location)
    var cell = document.getElementById(this.location).getElementsByTagName("td");
    // for each cell assign the background color of the cell to transparent using the index c (e.g. c = 0 => the first index of the color array and the first index of the canvas(first cell))
    for(let c = 0; c<this.color.length;c++){
        cell[c].style.backgroundColor = "transparent";   
    }




}


/*How the following works
First we create a object Create Canvas and assign it to a variable to store it(this object is for the palette)
Then we create the palette using palette() and fill in the color according to the array initialise_color()
* The color array length should be the same as the total cells/length of the palette created(e.g. palette with row = 1, columns = 5, col_array should have a length of 1*5 = 5)
* Note that the palette's row should always be 1(becuase we are doing it horizontally) and the column size is flexible
*/ 

var col_array = PALETTE1;
var canvas2 = new CreateCanvas(1,5,"colorPallet",col_array);
canvas2.palette();
canvas2.initialise_color();

/*How the following works
After creating the palette we should be the color array that we used for the palette into the generate_random_puzzle function.
The generate_random_puzzle function is going to create another color array for the grid using the limited color choices that we used in the color array for palette
e.g. The col_array consist of red, blue, green, yellow, purple and the grid size is 8*8 = 64. Then the the grid color array will be a 8*8 = 64 lenght array will add red, blue, yellow, purple color in random order until the grid color array is filled
Then we create the grid using palette() and fill in the color according to the array initialise_color()
*/ 

var puzzle_array = generate_random_puzzle(col_array, 8,8);
var canvas = new CreateCanvas(8,8,"canvas",puzzle_array);
canvas.grid();
canvas.initialise_color();










/*                  #TODO
------------------------Colour pallet.---------------
I think the best way is to make a new function similar 
to createCanvas, that assigns the each cell a colour in the second 
loop. You may need to make an array that contains the colors we'll use, 
to make your life easier. Name the function "createPallet". It may be
helpful to the guy doing the task below you for you to add text inside
the colour pallet cells (make them the same colour as the cell so
they're hidden). That way he can get the innerHTML to find out what
colour is selected. Unless you have a better way. 

May be helpful to read the comment on colour pallet functionality below.
*/




/*                  #TODO
------------------------Colour pallet functionality.---------------

I think the best way is
to add a event listener for a 'click' event to each cell
of the colour pallet, have it copy the color stored in the
cell to a global variable (lets call it colourSelected). 
Add another on 'click' event this time to the cells of 
the canvas, and use the global variable colourSelected to 
assign that colour to the canvas cell on click.

This should be simple, provided whoever does colour pallet does it
the way I suggested (if not use jQuery). You should be able to assign 
a 'click' eventto each cell of the colour pallet by using the second 
loop of "createPallet". You should also be able to assign a click 
event to each cell on the canvas using the second loop in createTable.

I'm pretty sure event listener have two arguments, the event and the
function to execute when the even occurs. So you will have to make
two functions one for the colour pallet event to assign a colour to
colourSelected and another for assigning a colour to a canvas cell
using colourSelected.

May be helpful to read the comment on colour pallet above.
*/