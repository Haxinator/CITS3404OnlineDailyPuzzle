//Constants
COLOR = "rgb(255, 168, 168)"
COLOR1 = "rgb(182, 255, 206)"
CHOSENCELLS = {}
CANVAS_SIZE = 16 * 16
STARTING_ARRAY = {
  133: COLOR,
  116: COLOR1,
  100: COLOR,
  85: COLOR1,
  70: COLOR,
  71: COLOR1,
  72: COLOR,
  89: COLOR1,
  106: COLOR,
  122: COLOR1,
  138: COLOR,
  153: COLOR1,
  168: COLOR,
  183: COLOR1,
  199: COLOR,
  231: COLOR1
}
SAMPLE_ARRAY = {
  99: 'rgb(27, 26, 23)',
  102: 'rgb(27, 26, 23)',
  104: 'rgb(27, 26, 23)',
  105: 'rgb(27, 26, 23)',
  115: 'rgb(27, 26, 23)',
  118: 'rgb(27, 26, 23)',
  120: 'rgb(27, 26, 23)',
  122: 'rgb(27, 26, 23)',
  131: 'rgb(27, 26, 23)',
  134: 'rgb(27, 26, 23)',
  136: 'rgb(27, 26, 23)',
  139: 'rgb(27, 26, 23)',
  147: 'rgb(27, 26, 23)',
  148: 'rgb(27, 26, 23)',
  149: 'rgb(27, 26, 23)',
  150: 'rgb(27, 26, 23)',
  152: 'rgb(27, 26, 23)',
  155: 'rgb(27, 26, 23)',
  163: 'rgb(27, 26, 23)',
  166: 'rgb(27, 26, 23)',
  168: 'rgb(27, 26, 23)',
  170: 'rgb(27, 26, 23)',
  179: 'rgb(27, 26, 23)',
  182: 'rgb(27, 26, 23)',
  184: 'rgb(27, 26, 23)',
  185: 'rgb(27, 26, 23)'
}

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
createCanvas(16, 16);

/* Multipurpose function
Creates a canvas with a specified number of rows and
columns.
@param numRows - number of rows the table will have.
@param numColumns - number of columns the table will have.*/
function createCanvas(numRows, numColumns) {
  var canvas = document.getElementById("canvas");
  var table = document.createElement("table");

  for (let r = 0; r < numRows; r++) {
    var row = document.createElement("tr");

    for (let c = 0; c < numColumns; c++) {
      //allocating index to element in the Table
      let index = c + numColumns * r
      let cell = document.createElement("td");
      //setting box classname so we can give style
      cell.setAttribute("class", "box");
      cell.setAttribute("id", index.toString());
      //adding addEventListener after click and dragg change the color
      ['click', 'dragenter'].forEach(evt =>
        cell.addEventListener(evt, () => {
          //console.log(cell.style.backgroundColor);
          if (cell.style.backgroundColor == COLOR  ) {
            cell.style.backgroundColor = null;

            delete CHOSENCELLS[index]
            console.log(CHOSENCELLS);
          } else {
            cell.style.backgroundColor = COLOR;
            CHOSENCELLS[index] = COLOR
            console.log(CHOSENCELLS);


          }
        }, false)
      );

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

@param array of colours we need
*/

function createColorPallet(colorArray) {
  var colorPallet = document.getElementById("colorPallet");
  var table = document.createElement("table");

  var row = document.createElement("tr");

  //going through color element that we get from each image
  colorArray.forEach(item => {

    let color = document.createElement("td");

    //we might need id later

    color.setAttribute("id", item);

    color.style.backgroundColor = item;
    //Choosing the desired color
    color.addEventListener("click", () => {
      COLOR = item;
    });

    row.appendChild(color);

  });
  //console.log(row);
  table.appendChild(row);

  colorPallet.appendChild(table);
}
//Totally random color pallete
//why rgb because document item return rgb if we wanna check we need rgb
color = ["rgb(182, 255, 206)", "rgb(246, 255, 164)", "rgb(253, 215, 170)",
  "rgb(255, 168, 168)", "rgb(240, 165, 0)", "rgb(228, 88, 38)",
  "rgb(27, 26, 23)"
];
createColorPallet(color)

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
/*
Drawing function
Which will draw the wanted sample which get as input as a dictionary
*/

function draw(canvasSize, index) {
  for (const [key, value] of Object.entries(index)) {
    let box = document.getElementById(key.toString());
    box.style.backgroundColor = value
  }
}

draw(CANVAS_SIZE, STARTING_ARRAY);
/*
Reset the Canvas
Which will
*/
function reset() {
  for (let i = 0; i < CANVAS_SIZE; i++) {
    let box = document.getElementById(i.toString());
    box.style.backgroundColor = "rgb(255,255, 255)";
  }
  CHOSENCELLS = {}
}
/*
Adding functionality to start the game wich will draw base on the sample wanted
*/
document.getElementById("Start").addEventListener("click", () => {
  reset()
  draw(CANVAS_SIZE, SAMPLE_ARRAY)
});

/*
Clear the Canvas for Drawing
*/
document.getElementById("Ready").addEventListener("click", reset);

/*
Adding functionality to start the game wich will draw base on the sample wanted
*/
document.getElementById("Check").addEventListener("click", () => {
let sampleArray = Object.keys(SAMPLE_ARRAY).sort()
let choosenArray = Object.keys(CHOSENCELLS).sort()
let flag = true
console.log("hello");
if(sampleArray.length === choosenArray.length){
  for(let i =0; i<sampleArray.length; i++){
    if(SAMPLE_ARRAY[sampleArray[i]] != CHOSENCELLS[choosenArray[i]]){
      flag =false;
    }
  }
}else{
  flag =false
}
if (flag){
  alert("You Won the game")
}else{
  alert("You Lost the game")
}

});

/*
Clear the Canvas for Drawing
*/


document.getElementById("Eraser").addEventListener("click", () => {
  COLOR = "rgb(255, 255, 255)"
});
