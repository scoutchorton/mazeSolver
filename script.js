//Unicode arrows: ←→↑↓

//A list of elements to access on the webpage
let elements = {"prompt":document.getElementById("directionPrompt"),"yes":document.getElementById("directionYes"),"no":document.getElementById("directionNo"),"maze":document.getElementById("maze").children[0], "Instructions": document.getElementById("instructionWrapper"), "InstructionsOpen": document.getElementById("instructionOpen")};
//Cursor location in the table
let cursor = {"x": 0, "y":0, "o":0};
//Orientation number to English
let orientation = ["up", "right", "down", "left"];
let orientationBorder = ["Top", "Right", "Bottom", "Left"];
let orientationArrow = ["↑", "→", "↓", "←"];

//Flashing cursor
let delay = 300;
setInterval(() => {
	for(let v = 245; v >= 127.5; v -= 0.01) {
		setTimeout(() => {
			//console.log(`l: ${l}`, elements.maze.children[cursor.y].children[cursor.x])
			elements.maze.children[cursor.y].children[cursor.x].style.background = `rgb(${v}, ${v}, ${v})`
		}, delay);
	}
	for(let v = 127.5; v <= 245; v += 0.01) {
		setTimeout(() => {
			//console.log(`l: ${l}`, elements.maze.children[cursor.y].children[cursor.x])
			elements.maze.children[cursor.y].children[cursor.x].style.background = `rgb(${v}, ${v}, ${v})`
		}, delay);
	}
}, delay * 4);

//Refresh the text displayed to the user about direction to go
function refreshPrompt() {
	//Set the prompt text
	elements.prompt.innerText = orientation[cursor.o];
}

//Validate cell orientation
function validateOrient() {
	//Check the orientation:
	console.log("Testing orientation case: " + orientation[cursor.o], cursor);
	switch(cursor.o){
		//If up:
		case 0:
			//If there is a cell above the cursor
			if(cursor.y > 0) {
				//Check if that cell has a bottom border
				if(elements.maze.children[cursor.y - 1].children[cursor.x].style.borderBottom) {
					noHandler();
				//Check if that cell has an arrow the opposite direction of the current direction
				} else if(elements.maze.children[cursor.y - 1].children[cursor.x].innerText === orientationArrow[(cursor.o + 2) % 4]) {
					yesHandler();
				}
			}
			break;
		//If down:
		case 2:
			//If there is a cell above the cursor
			if(cursor.y < elements.maze.children.length - 1) {
				//Check if that cell has a top border
				if(elements.maze.children[cursor.y + 1].children[cursor.x].style.borderTop) {
					noHandler();
				//Check if that cell has an arrow the opposite direction of the current direction
				} else if(elements.maze.children[cursor.y + 1].children[cursor.x].innerText === orientationArrow[(cursor.o + 2) % 4]) {
					yesHandler();
				}
			}
			break;
		//If right:
		case 1:
			//If the cursor is not at the right end of the row
			if(cursor.x < elements.maze.children[0].children.length - 1) {
				//Check if the next cell has a left border
				if(elements.maze.children[cursor.y].children[cursor.x + 1].style.borderLeft) {
					//Run no since you can't turn in that direction
					noHandler();
				//Check if the next cell points in the opposite direction of orientation (should the cursor go back on itself)
				} else if(elements.maze.children[cursor.y].children[cursor.x + 1].innerText === orientationArrow[(cursor.o + 2) % 4]) {
					//Actually move back path
					yesHandler();
				}
			}
			break;
		//If left:
		case 3:
			//If the cursor is not at the left end of the row
			if(cursor.x > 0) {
				//Check if the next cell has a right border
				if(elements.maze.children[cursor.y].children[cursor.x - 1].style.borderRight) {
					//Run no since you can't turn in that direction
					noHandler();
				//Check if the next cell points in the opposite direction of orientation (should the cursor go back on itself)
				} else if(elements.maze.children[cursor.y].children[cursor.x - 1].innerText === orientationArrow[(cursor.o + 2) % 4]) {
					//Actually move back path
					yesHandler();
				}
			}
			break;
		//Edge case
		default:
			console.log("Error testing")
	}
}

function noHandler() {
	console.log("NO")
	//console.log(e);
	//Set the border for that orientation to black (signifying a wall)
	elements.maze.children[cursor.y].children[cursor.x].style[`border${orientationBorder[cursor.o]}`] = "2px solid black";
	//Rotate orientation clockwise
	cursor.o += 1;
	//If the cursor is more than 4 (amount of turns possible)
	if(cursor.o === 4) {
		//Remove 4 to get back into the range
		cursor.o -= 4;
	}

	//Write a new arrow based on the orientation
	elements.maze.children[cursor.y].children[cursor.x].innerText = orientationArrow[cursor.o];

	validateOrient();

	//Load the new orientation to the text
	refreshPrompt();
}

function yesHandler() {
	elements.maze.children[cursor.y].children[cursor.x].style.background = "lightgrey";
	console.log(orientation[cursor.o]);
	//When the cursor orientation is up
	if(cursor.o === 0) {
		console.log(`y: ${cursor.y}`);
		//If the cursor is at the first row
		if(cursor.y === 0) {
			//Create a new row
			let row = document.createElement("tr");
			for(let i = 0; i < elements.maze.children[0].children.length; i++) {
				row.append(document.createElement("td"));
			}
			//Insert row as the first element in the table
			elements.maze.insertBefore(row, elements.maze.children[0]);
		} else {
			//Move the cursor up one row
			cursor.y -= 1;
		}
	//When the cursor orientation is down
	} else if(cursor.o === 2) {
		console.log(`y: ${cursor.y}`);
		//If the cursor is at the end of the rows
		if(cursor.y === elements.maze.children.length - 1) {
			//Create a new row
			let row = document.createElement("tr");
			//For every table data in the first row of the table
			for(let i = 0; i < elements.maze.children[0].children.length; i++) {
				//Add a new table data to the new row
				row.append(document.createElement("td"));
			}
			//Insert row as the last element in the table
			elements.maze.append(row);
		}
		//Move the cursor down one row
		cursor.y += 1;
	//When the cursor orientation is right
	} else if(cursor.o === 1) {
		//debugger;
		console.log(`x: ${cursor.x}`);
		//If the cursor is at the end of the row
		if(cursor.x === elements.maze.children[0].children.length - 1) {
			//For every table row
			for(let i = 0; i < elements.maze.children.length; i++) {
				//Add a new table data to the end of each row
				elements.maze.children[i].append(document.createElement("td"));
			}
		}
		//Move the cursor right one row
		cursor.x += 1;
	//When the cursor orientation is left
	} else if(cursor.o === 3) {
		console.log(`x: ${cursor.x}`);
		//If there is no cell before the cursor
		if(cursor.x === 0) {
			//For every table row
			console.log(elements.maze.children.length);
			for(let i = 0; i < elements.maze.children.length; i++) {
				console.log(i);
				//Add a new table data to the beginning of each row
				elements.maze.children[i].insertBefore(document.createElement("td"), elements.maze.children[i].children[0]);
			}
		} else {
			//Move the cursor down one row
			cursor.x -= 1;
		}
	}

	//Rotate orientation counter-clockwise
	cursor.o -= 1;
	//If the cursor is more than 4 (amount of turns possible)
	if(cursor.o === -1) {
		//Remove 4 to get back into the range
		cursor.o += 4;
	}

	//debugger;
	//Write a new arrow based on the orientation
	elements.maze.children[cursor.y].children[cursor.x].innerText = orientationArrow[cursor.o];

	validateOrient();

	//Load the new orientation to the text
	refreshPrompt();
}

//When the yes button is clicked
elements.yes.addEventListener("click", yesHandler);

//When the no button is clicked
elements.no.addEventListener("click", noHandler);

refreshPrompt();

elements.Instructions.addEventListener("click", (e) => {
	elements.Instructions.classList.remove("visible");
});
elements.InstructionsOpen.addEventListener("click", (e) => {
	elements.Instructions.classList.add("visible");
});
