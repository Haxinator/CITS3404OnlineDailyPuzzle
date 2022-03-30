
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



/* createCanvas
Creates a canvas with a specified number of rows and
columns.
@param numRows - number of rows the table will have.
@param numColumns - number of columns the table will have.*/



/*create the canvas
#Not sure yet how large the canvas should be
#Need to consider how well it would feel on a phone*/


/* Multipurpose function
Creates a canvas with a specified number of rows and 
columns.
@param numRows - number of rows the table will have.
@param numColumns - number of columns the table will have.*/
COLOR = "rgb(255, 255, 255)";
CHOSENCELLS = [];



function generate_random_color(rows,columns){
    const num_cells = rows * columns;
    const col_array = [];
    for(let i = 0; i< num_cells; i++){
        var r = Math.round(Math.random()*255);
        var g = Math.round(Math.random()*255);
        var b = Math.round(Math.random()*255);
        col_array.splice(i,0,`rgb(${r}, ${g}, ${b})`);
    }
    return col_array

}

function CreateCanvas(numRows,numColumns,location = "canvas",color = ["red","green","blue","yellow"],type = "grid"){
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.location = location;
    this.color = color;
    this.type = type;

}

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
               // console.log(COLOR);
              } 
              else {
                cell.style.backgroundColor = COLOR;
                CHOSENCELLS.push(index)
                //console.log(CHOSENCELLS);
                //console.log(COLOR);
                //console.log(cell.style.backgroundColor);
              }
            });
            row.appendChild(cell);
          }

        table.appendChild(row);
    }
    canvas.appendChild(table);
    return table;
}


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

CreateCanvas.prototype.initialise_color = function() {
    var cell = document.getElementById(this.location).getElementsByTagName("td");
    
    for(let c = 0; c<this.color.length;c++){
        cell[c].style.backgroundColor = this.color[c];   
        
    }
             

}

CreateCanvas.prototype.reset = function() {
    var cell = document.getElementById(this.location).getElementsByTagName("td");
    
    for(let c = 0; c<this.color.length;c++){
        cell[c].style.backgroundColor = "transparent";   
    }




}



var col_array = generate_random_color(6,6);
var canvas = new CreateCanvas(6,6,"canvas",col_array);
canvas.grid();
canvas.initialise_color();
//canvas.reset();


var col_array = generate_random_color(5,2);
var canvas2 = new CreateCanvas(5,2,"colorPallet",col_array);
canvas2.palette();
canvas2.initialise_color();





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