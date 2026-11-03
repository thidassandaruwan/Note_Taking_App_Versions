import Note from "../model/Note.js"

export const getAllNotes = async (req, res) => {
    try{
        const notes  = await Note.find({});
        if (notes.length === 0){
            return res.status(200).json({message : "No notes found!"});

        }
        res.status(200).json(notes);
    }
    catch(error){
        console.error("Error ! : " + error)
        res.status(500).json({message : "Internal Server Error!"})
    }
}

export const getNoteById = async (req, res) => {
    try{
        // extract the note id from the url
        const noteId = req.params.noteId;
        // get the note from db
        const note = await Note.findById(noteId);

        if (!note){
            return res.status(404).json({message : `Note with id ${noteId} does not exist!`})
        }

        res.status(200).json(note);
    }
    catch(error){
        console.error("Error ! : " + error)
        res.status(500).json({message : "Internal Server Error!"})
    }
}

export const createNote = async (req, res) => {
    try{
        const {title, body} = req.body;

        if (!title || !body){
            return res.status(400).json({message : `Every note requires a title and a body`})
        }

        const note = await Note.create({title, body});
        res.status(201).json(note);
    }
    catch(error){
        console.error("Error ! : " + error)
        res.status(500).json({message : "Internal Server Error!"})
    }
}

export const updateNote = async (req, res) => {
    try{
        const {title, body} = req.body;
        if (!title || !body){
            return res.status(400).json({message : `Every note requires a title and a body`});
        }
        
        const noteId = req.params.noteId;
        // bydefault this returns the note before the update, {returnDocument: after} changes that
        const updatedNote = await Note.findByIdAndUpdate(noteId, {title, body},{returnDocument : "after"});
        if (!updateNote){
            return res.status(404).json({message : `Note with id ${noteId} does not exist!`});
        }

        res.status(200).json(updatedNote);
    }
    catch(error){
        console.error("Error ! : " + error)
        res.status(500).json({message : "Internal Server Error!"})
    }
}

export const deleteNote = async (req, res) => {
    try{
        const noteId = req.params.noteId;
        const deletedNote = await Note.findByIdAndDelete(noteId);
        
        if (!updateNote){
            return res.status(404).json({message : `Note with id ${noteId} does not exist!`});
        }

        res.status(200).json(deletedNote);
    }
    catch(error){
        console.error("Error ! : " + error)
        res.status(500).json({message : "Internal Server Error!"})
    }
}