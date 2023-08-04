//Require modules

const express = require("express");
const path = require("path");
const fs = require ("fs");
 //For the unique IDs
  //used for deleting notes by ID
const uuid = require("./uuid");

const app = express();
const PORT = process.env.PORT || 3001;

//Middle ware
app.use(express.json()); //method of express.js
// Parses incoming JSON data from requests and makes it accessible in req.body.
app.use(express.urlencoded({ extended: true }));
//parses incoming URL-encoded data from form submissions and makes it accessible in req.body.
app.use(express.static("public"));
//Express.js will look for stuff "public" directory and serve them directly to the client.

//Gets the index.html file
  //GET requests to the root URL 
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//Gets the notes.html file
   //Response is to send the index.html file from public
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Sends notes in db.json to client
 
app.get("/api/notes", (req, res) => {
  const grabNotes = fs.readFileSync("./db/db.json");
  const displayNotes = JSON.parse(grabNotes);
  return res.json(displayNotes);
});

// Save new notes to JSON file
 //POST request to the /notes URL which adds a new note to a JSON file 
app.post("/notes", (req, res) => {
  
  // Adds a unique ID to each note, useful for the delete feature

  const { title, text } = req.body; //destructuring assignment to extract title and text from req.body
  const id = uuid(); //Universally Unique Identifier used to generate unique IDs
  const newNote = { title, text, id }; 

  const savedNotes = fs.readFileSync("./db/db.json"); //reads notes from db.json and also parses the JSON data into an array 
  const notesArray = JSON.parse(savedNotes);
//notes added into new array with push
  notesArray.push(newNote);

  const addData = JSON.stringify(notesArray);
fs.writeFile("./db/db.json", addData, (err) => {
  if (err) {
    console.error("Unsuccessful! No new note was added");
  } else {
    console.log("Successful!!");
  }
});
res.json("A new note has been added!");
});

// Deletes a note and updates/refreshes the page

app.delete("/api/notes/:id", (req, res) => { // need to stringify the data  because fs.writeFile needs it in string format 
  // Reads the existing notes data from the JSON file
  const existingData = fs.readFileSync("./db/db.json");
  const notesArray = JSON.parse(existingData);

  // Creates a new array without the note with the specific ID
  const updatedArray = notesArray.filter(item => item.id !== req.params.id);

  // Convert the updated array to JSON format
  const updatedData = JSON.stringify(updatedArray);

  // Write the updated data back to the JSON file
  fs.writeFile("./db/db.json", updatedData, (err) => {
    if (err) {
      console.error("Unsuccessful!");
    } else {
      console.log("Successful!");
    }
  });

  // Send a response indicating the note was deleted
  res.json("A note has successfully been deleted!");
});


// Listening at PORT 3001
 //starts the express.js server and makes it listen on the PORT using the app.listern(port... method)
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));

