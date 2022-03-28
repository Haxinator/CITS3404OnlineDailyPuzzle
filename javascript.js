
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
createCanvas(16,16);

/* Multipurpose function
Creates a canvas with a specified number of rows and 
columns.
@param numRows - number of rows the table will have.
@param numColumns - number of columns the table will have.*/
function createCanvas(numRows, numColumns){
    var canvas = document.getElementById("canvas");
    var table = document.createElement("table");
    
    for(let r = 0; r<numRows; r++){
        var row = document.createElement("tr");

        for(let c = 0; c<numColumns; c++){
            let cell = document.createElement("td");
            row.appendChild(cell);
        }

        table.appendChild(row);
    }
    canvas.appendChild(table);
}

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