const NOTES_API = "http://localhost:8000/api/notes";

const notesContainer = document.getElementById("notes-container");
const newNoteFormBtn = document.getElementById("new-note-form-btn");
const newNoteBtnTxt = document.getElementById("new-note-btn-txt");
const noteFormContainer = document.getElementById("note-form-container");
const noteEditor = document.getElementById("note-editor");
const noteTitleInput = document.getElementById("note-title");
const noteBodyInput = document.getElementById("note-body");
const noteFormStatus = document.getElementById("note-form-status");
const submitNoteBtn = document.getElementById("submit-note-btn");

newNoteFormBtn.addEventListener("click", toggleNoteEditor);
noteEditor.addEventListener("submit", (event) => handleFormSubmission(event));
notesContainer.addEventListener("click", (event) => handleNoteClick(event));

let selectedNoteId = null;

function toggleNoteEditor() {
    // clear the form content
    noteTitleInput.value = "";
    noteBodyInput.value = "";
    // reset form status elements
    noteFormStatus.textContent = "";
    noteFormStatus.className = "";

    // reset the selectedNoteId when closing the note editor
    selectedNoteId = null;

    if (noteFormContainer.classList.contains("hidden")) {
        noteFormContainer.classList.remove("hidden");
        newNoteBtnTxt.textContent = "Hide Editor";
        return;
    }

    noteFormContainer.classList.add("hidden");
    newNoteBtnTxt.textContent = "Create Note";
}

async function handleFormSubmission(event) {
    event.preventDefault();

    submitNoteBtn.textContent = "Submitting...";
    submitNoteBtn.disabled = true;

    const noteTitle = noteTitleInput.value.trim();
    const noteBody = noteBodyInput.value.trim();
    const note = {title : noteTitle, body : noteBody};

    if (!noteTitle || !noteBody) {
        alert("Note must contain both a title and a body");
        submitNoteBtn.textContent = "Submit";
        submitNoteBtn.disabled = false;
        return;
    }

    const response = (selectedNoteId)? 
        await updateNote(selectedNoteId, note) : 
        await createNote(note);

    if (!response) {
        noteFormStatus.textContent = "An error occurred";
        noteFormStatus.className = "error";
        submitNoteBtn.textContent = "Submit";
        submitNoteBtn.disabled = false;
        return;
    }
    
    noteFormStatus.textContent = `Note ${ selectedNoteId ?  "Updated" : "Created"} Successfully!`;
    noteFormStatus.className = "success";

    await renderNotes();

    // reset the selected note id
    selectedNoteId = null;

    // clear the form content and hide
    noteTitleInput.value = "";
    noteBodyInput.value = "";

    submitNoteBtn.textContent = "Submit";
    submitNoteBtn.disabled = false;
}

async function handleNoteClick(event) {
    // get the note id of the clicked note
    const clickedNote = event.target.closest(".note");
    const deleteRequest = event.target.closest(".note-delete-btn");
    if(!clickedNote){
        return;
    }

    // get the note id from the note element
    const noteId = clickedNote.dataset.noteId;

    // if delete note is clicked
    if (deleteRequest){
        handleNoteDelete(noteId)
    }
    else{
        handleDisplayNote(noteId);
    }    
}

async function handleDisplayNote(noteId) {
    const note = await getNote(noteId);

    if (!note){
        alert("An Error Occured!");
        return;
    }

    // add the note content to note editor 
    noteTitleInput.value = note.title;
    noteBodyInput.value = note.body;

    // disply the note editor
    noteFormContainer.classList.remove("hidden");
    newNoteBtnTxt.textContent = "Hide Editor";

    // update the selected note id 
    selectedNoteId = note._id;
}


async function handleNoteDelete(noteId) {
    //  ask user permission
    const userPermission = confirm("Do you want to delete the note?");
    if (!userPermission){
        return;
    }

    // delete the note
    const deletedNote = await deleteNote(noteId);
    if(!deletedNote){
        alert("Error Deleting the note!");
        return;
    }

    renderNotes();
    alert("Note Deleted Sucessfully!");
}



async function getAllNotes() {
    try {
        const response = await fetch(NOTES_API);
        if (!response.ok) {
            throw new Error(`ERROR: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getNote(noteId) {
    try{
        // get the note
        const response = await fetch(`${NOTES_API}/${noteId}`, {});
        if (!response.ok){
            throw new Error(`Error ${response.status}`)
        }

        return await response.json();
    }
    catch(error){
        console.log(error);
        return null
    }
    
}

async function createNote(note) {
    try {
        const response = await fetch(NOTES_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        });

        if (!response.ok) {
            throw new Error(`ERROR submitting note: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`ERROR: ${error}`);
        return null;
    }
}

async function updateNote(noteId, note) {
    try {
        const response = await fetch(`${NOTES_API}/${noteId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        });

        if (!response.ok) {
            throw new Error(`ERROR submitting note: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`ERROR: ${error}`);
        return null;
    }
}

async function deleteNote(noteId) {
    try {
        const response = await fetch(`${NOTES_API}/${noteId}`, {method: "DELETE"});

        if (!response.ok) {
            throw new Error(`ERROR deleting note: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`ERROR: ${error}`);
        return null;
    }
}

async function renderNotes() {
    const notes = await getAllNotes();
    if (!notes){
        alert("Something went wrong! Can't render notes!")
        return;
    }

    if(notes.length === 0){
        return`<h1> ERROR! </h1>`
    }

    const notesHTML = notes.map((note) => {
        return `
            <a class="note" data-note-id="${note._id}">
                <div>
                    <h2 class="note-title">${note.title}</h2>
                    <p class="note-body">${note.body}</p>
                </div>
                <button type="button" class="note-delete-btn"> 
                    <i class="fa-solid fa-trash" style="color: #c71313;"></i>
                </button>
            </a>
        `;
    });
    notesContainer.innerHTML = notesHTML.join("");
}

await renderNotes();