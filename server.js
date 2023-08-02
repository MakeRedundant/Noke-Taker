//Require modules

const express = require("express");
const path = require("path");
const fs = require ("fs");

const app = express();
const PORT = process.env.PORT || 3001;

//Middle ware
app.use(express.json());
// Parses incoming JSON data from requests and makes it accessible in req.body.
app.use(express.urlencoded({ extended: true }));
//parses incoming URL-encoded data from form submissions and makes it accessible in req.body.
app.use(express.static("public"));
//Express.js will look for stuff "public" directory and serve them directly to the client.

//Gets the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

//Gets the notes.html file

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

// Sends notes in db.json to client

app.get("/api/notes", (req, res) => {
  const grabNotes = fs.readFileSync("./db/db.json");
  const displayNotes = JSON.parse(grabNotes);
  return res.json(displayNotes);
});

// Save new notes to JSON file

app.post("/notes", (req, res) => {
  // Adds a unique ID to each note being added to the JSON file

  const { title, text } = req.body;
  const id = uuid();
  const newNote = { title, text, id };

  const savedNotes = fs.readFileSync("./db/db.json");
  const savedArray = JSON.parse(savedNotes);

  savedArray.push(newNote);

  const newData = JSON.stringify(savedArray);
  fs.writeFile("./db/db.json", newData, (err) => {
    err ? console.error("Unsuccessful!") : console.log("Successful!");
  });
  res.json("A new note has been added!");
});

// Deletes a note and updates/refreshes the page

app.delete("/api/notes/:id", (req, res) => {
  const deleteData = fs.readFileSync("./db/db.json");
  const deleteArray = JSON.parse(deleteData);

  newArray = deleteArray.filter(function (item) {
    return item.id != req.params.id;
  });

  const newArrayFile = JSON.stringify(newArray);
  fs.writeFile("./db/db.json", newArrayFile, (err) => {
    err ? console.error("Unsuccessful!") : console.log("Successful!");
  });
  res.json("The note has successfully been deleted!");
});

// Listening on PORT 3001

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
