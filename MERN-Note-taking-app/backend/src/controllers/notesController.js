
// converting the entire routes into functions

// router.get("/", (req, res) => {
//     res.status(200).send("You've got 10 notes!");
// });
import Note from "../model/Note.js";

export async function getAllNotes(req, res){
    try {
        // fetching all notes           // sorting the results from newest to oldest
        const notes = await Note.find().sort({createdAt : -1});

        // if no notes found
        if (notes.length == 0){res.status(200).json({message : "No Notes Found!"});}

        res.status(200).json(notes);
    } 
    catch (error) {
        console.error("Error ! : " + error)
        res.status(500).json({message : "Internal Server Error!"})
    }
};

export async function getNoteById(req, res){
    try {
        // fetching note for id
        const notes = await Note.findById(req.params.id);

        // if no notes found
        if (!notes){ return res.status(404).json({message : "No Notes Found!"}); }

        res.status(200).json(notes);
    } 
    catch (error) {
        console.error("Error ! : " + error)
        res.status(500).json({message : "Internal Server Error!"})
    }
};

export async function createNote(req, res){
    try {
        const {title, content} = req.body;
        // since the Keys for title, and content are also "title", "content"
        // we can skip the {title:title, contenet:content}
        // and just put {title, content}
        const note = new Note({title, content});  
        
        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } 
    catch (error) {
        console.error("Error ! : " + error)
        res.status(500).json({message : "Internal Server Error!"})
    }
}

export async function updateNote(req, res){
    try {
        // geting the new content
        const {title, content} = req.body;
        // router.put("/:id", updateNote), id of the note the update request is being sent is embedded in the request URL
        // the "id" is "named" in the url as "id", if it was /:noteID, the parameter finding method would be req.params.noteID

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, {title, content}, 
            {returnDocument : "after"}
        );

        // if user has tried to update a note that doesn't exist
        if (!updatedNote){ return res.status(404).json({message: `Note ${req.params.id} doesn't exit!`});}

        res.status(200).json(updatedNote);
    } 
    catch (error) {
        console.error("Error ! : " + error)
        res.status(500).json({message : "Internal Server Error!"})
    }
}

export async function deleteNote(req, res){
    try {
        // mongoose findByIdAndDelet returns the object/data or "model" id deleted as a json
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) { return res.status(404).json({message: `Note ${req.params.id} id not found!`});}

        res.status(200).json(deletedNote);
    } 
    catch (error) {
        console.error("Error ! : " + error)
        res.status(500).json({message : "Internal Server Error!"})
    }
}