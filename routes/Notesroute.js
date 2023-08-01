const { Router } = require("express");
const NoteModel = require("../models/NotesModel");
const fetchUser = require("../middleware/fetchUser");

const notes = Router();
//fetch all notes of particular user
notes.get("/", fetchUser, async (req, res) => {
  let note = await NoteModel.find({ user: req.user.id });
  res.send(note);
});

//add note
notes.post("/add", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    let note = new NoteModel({
      title,
      description,
      tag,
      user: req.user.id,
    });
    await note.save();
    res.send({ msg: "Note Added Sucessfully" });
  } catch (error) {
    res.send(error.message);
  }
});

//update note

notes.patch("/update/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  //create a new note object
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
 

  //find a note and update it
  try {
    let note = await NoteModel.findById(req.params.id);
    if (!note) {
      return res.send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.send("Not Allowed");
    } else {
      note = await NoteModel.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.send({note});
    }
  } catch (error) {
    res.send({msg:"Something went wrong",error:error.message});
  }
});


notes.delete("/delete/:id", fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
  
    //find a note and date it
    try {
      let note = await NoteModel.findById(req.params.id);
      if (!note) {
        return res.send("Not found");
      }
  
      if (note.user.toString() !== req.user.id) {
        return res.send("Not Allowed");
      } else {
        note = await NoteModel.findByIdAndDelete(
          req.params.id
        );
        res.send("Sucessfully deleted");
      }
    } catch (error) {
      res.send({msg:"Something went wrong",error:error.message});
    }
  });
module.exports = notes;
