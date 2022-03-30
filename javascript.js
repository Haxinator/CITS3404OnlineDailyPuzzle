//Constants //!but they change? Shouldn't they be a global var?
COLOR = "rgb(255, 168, 168)"
CHOSENCELLS = []


/*             //!     #TODO
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
createCanvas(8, 8);

/* createCanvas
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
      let index = c + (numColumns * r); //!added brackets for readability
      let cell = document.createElement("td");

      //setting box classname so we can give style
      cell.setAttribute("class", "box");
      cell.setAttribute("id", index.toString());

      //adding addEventListener after click change the color
      cell.addEventListener("click", () => {

        console.log(cell.style.backgroundColor);

        if (cell.style.backgroundColor == COLOR) {

          cell.style.backgroundColor = null;
          CHOSENCELLS.pop(index);
          // console.log(CHOSENCELLS);

        } else {

          cell.style.backgroundColor = COLOR;
          CHOSENCELLS.push(index);
          // console.log(CHOSENCELLS);

        }
      });
      row.appendChild(cell);
    }

    table.appendChild(row);
  }
  canvas.appendChild(table);
}

/*         //!         #TODO Add function description

@param array of colours we need
*/

function createColorPallet(colorArray) {
  var colorPallet = document.getElementById("colorPallet");
  var table = document.createElement("table");


  var row = document.createElement("tr");

  //going through color element that we get from each image
  colorArray.forEach(item => {

    let color = document.createElement("td");
    color.setAttribute("class", "colorPallet");
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
   "rgb(255, 168, 168)", "rgb(240, 165, 0)","rgb(228, 88, 38)",
    "rgb(27, 26, 23)"];

createColorPallet(color);