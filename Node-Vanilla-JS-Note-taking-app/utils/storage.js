import path from "node:path";
import fs from "node:fs/promises"

const NOTE_DATA_PATH = path.join(import.meta.dirname, "../data", "notes.json");

export async function getNotes() {
    const notesData = await fs.readFile(NOTE_DATA_PATH, "utf8");
    return JSON.parse(notesData)
}

export async function saveNote(newNote) {
    let notes = await getNotes();
    notes.unshift(newNote);

    // convere to obj to string with indentation
    const notesString = JSON.stringify(notes, null, 2)
    // write the file
    await fs.writeFile(NOTE_DATA_PATH, notesString, "utf8");
}


export async function updateNote(id, title, body) {
    let notes = await getNotes();
    //  check if noteExists
    const noteIndex = notes.findIndex(note => note.id === id);
    if(noteIndex < 0){
        return null;
    }

    notes[noteIndex].title = title;
    notes[noteIndex].body = body;

    // convere to obj to string with indentation
    const notesString = JSON.stringify(notes, null, 2)
    // write the file
    await fs.writeFile(NOTE_DATA_PATH, notesString, "utf8");

    return notes[noteIndex];
}

export async function deleteNote(id) {
    let notes = await getNotes();
    //  check if noteExists
    const noteIndex = notes.findIndex(note => note.id === id);
    if(noteIndex < 0){
        return null;
    }
    
    // save the deleted note
    const deletedNote = notes[noteIndex];
    // remove the note
    notes.splice(noteIndex, 1);

    // convere to obj to string with indentation
    const notesString = JSON.stringify(notes, null, 2)
    // write the file
    await fs.writeFile(NOTE_DATA_PATH, notesString, "utf8");

    return deletedNote;
}

