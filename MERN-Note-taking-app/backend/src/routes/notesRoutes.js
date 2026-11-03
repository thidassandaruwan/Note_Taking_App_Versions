import express from "express";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controllers/notesController.js";

const router = express.Router(); 

router.get("/", getAllNotes);

router.get("/:id", getNoteById);

router.post("/", createNote);             

// id here would be the id of the note the client want to UPDATE, when client sends a update requests, the program would fetch the note id and send it with the endpoint
router.put("/:id", updateNote);

router.delete("/:id", deleteNote);


export default router;
// ======================================================NOTES===========================================================================
// Endpoint?
// An endpoint is a combination of URL + HTTP method (get, post, put, patch, delete) that lets client interacts with a specific resource

// from the below route, 
// get("/api/notes"
// this would be the endpoint

// this entire thing is called a route
// app.get("/api/notes", (req, res) => {
//     res.status(200).send("You've got 25 notes!");
// });
// =======================================================================================================================================
