import { randomUUID } from "node:crypto";
import { sendResponse } from "../utils/sendResponse.js";
import { deleteNote, getNotes, saveNote, updateNote } from "../utils/storage.js";
import { parseReqBody } from "../utils/parseReqBody.js";

export async function handleGetNotes(req, res) {
    try{
        const notes = await getNotes();
        sendResponse(res, 200, "application/json", JSON.stringify(notes))
    }
    catch(error){
        console.log(`Error when geting notes`, error);

        sendResponse( 
            res,
            500, 
            'application/json', 
            JSON.stringify({ 
                error : "Internal Server Error", 
                message : "An error occured when retrieving notes data" 
            })
        );
    }
}

export async function handleGetNote(req, res, noteId) {
    try{
        const notes = await getNotes();
        const note = notes.find(note => note.id === noteId);

        if (!note){
            return sendResponse(
                res, 
                404, 
                'application/json', 
                JSON.stringify({ 
                    error : "Note not found", 
                    message : `Note ID : ${noteId} is invalid ` 
                })
            );
        }

        sendResponse(res, 200, "application/json", JSON.stringify(note));

    }
    catch(error){
        // check if error is while reading the file
        console.log(`Error when geting note ${noteId}`, error);

        sendResponse( 
            res,
            500, 
            'application/json', 
            JSON.stringify({ 
                error: "Internal Server Error", 
                message: "An error occurred while retrieving notes data"
            })
        );
    }
}

export async function handlePostNote(req, res) {
    try{
        // get the new note
        const {title, body} = await parseReqBody(req);
        const newNote = {
            id : randomUUID(), // generate ta new UID with node randomUUID
            title : title,
            body : body
        }

        // save the note
        await saveNote(newNote);

        // return the response
        sendResponse(res, 201, "application/json", JSON.stringify(newNote));
    }
    catch(error){
        console.log(`Error when creating note`, error);

        // catch invalid JSON in req body
        if (error instanceof SyntaxError || error.name === 'ValidationError') {
            return sendResponse(
                res,
                400,
                'application/json',
                JSON.stringify({ error: 'Invalid data format in request body' })
            );
        }

        // every other erors
        sendResponse(
            res,
            500,
            'application/json',
            JSON.stringify({ error: 'Internal server error while creating note' })
        );
    }
}

export async function handleUpdateNote(req, res, noteId) {
    try{
        // get the new note
        const {title, body} = await parseReqBody(req);

        // save the note
        const updatedNote = await updateNote(noteId, title, body);
        if(!updatedNote){
            return sendResponse(
                res, 
                404, 
                'application/json', 
                JSON.stringify({ 
                    error : "Note not found", 
                    message : `Note ID : ${noteId} is invalid ` 
                })
            );
        }

        // return the response
        sendResponse(res, 200, "application/json", JSON.stringify(updatedNote));
    }
    catch(error){
        console.log(`Error when updating note`, error);

        // catch invalid JSON in req body
        if (error instanceof SyntaxError || error.name === 'ValidationError') {
            return sendResponse(
                res,
                400,
                'application/json',
                JSON.stringify({ error: 'Invalid data format in request body' })
            );
        }

        // every other erors
        sendResponse(
            res,
            500,
            'application/json',
            JSON.stringify({ error: 'Internal server error while updating note' })
        );
    }
}

export async function handleDeleteNote(req, res, noteId) {
    try{
        // save the note
        const deletedNote = await deleteNote(noteId);
        if(!deletedNote){
            return sendResponse(
                res, 
                404, 
                'application/json', 
                JSON.stringify({ 
                    error : "Note not found", 
                    message : `Note ID : ${noteId} is invalid ` 
                })
            );
        }

        // return the response
        sendResponse(res, 200, "application/json", JSON.stringify(deletedNote));
    }
    catch(error){
        console.log(`Error when Deleting note`, error);
        
        sendResponse(
            res,
            500,
            'application/json',
            JSON.stringify({ error: 'Internal server error while deleting note' })
        );
    }
}

export async function handleNoteFeed(req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const notes = await getNotes();

    setInterval(() => {
        let randomIndex  = Math.floor(Math.random() * notes.length)
        res.write(
            `data: ${JSON.stringify({event : "Note-updated", note : notes[randomIndex]})}\n\n`
            
        )
        console.log("sending note feed update...")
    }, 3000);
}