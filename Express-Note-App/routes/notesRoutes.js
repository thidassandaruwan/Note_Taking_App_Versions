import express from "express";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controllers/notesControllers.js";

const notesRouter = express.Router();

notesRouter.get("/", getAllNotes);
notesRouter.get("/:noteId", getNoteById);
notesRouter.post("/", createNote);
notesRouter.put("/:noteId", updateNote);
notesRouter.delete("/:noteId", deleteNote);

export default notesRouter;