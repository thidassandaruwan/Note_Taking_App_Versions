const eventSource = new EventSource("/api/notesFeed");
const noteTitle = document.querySelector(".title-note-feed");
const noteBody = document.querySelector(".body-note-feed");

// handle live note updates
eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const note = data.note;

    noteTitle.textContent = note.title;
    noteBody.textContent = note.body;
}

// handle connectin loss
eventSource.onerror = () => {
    console.log("Connection lost. Attempting to reconnect...");
}