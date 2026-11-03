import http from "node:http";
import { serveStatic } from "./utils/serveStatic.js";
import { handleDeleteNote, handleGetNote, handleGetNotes, handleNoteFeed, handlePostNote, handleUpdateNote } from "./controllers/notesControllers.js";
import { sendResponse } from "./utils/sendResponse.js";
import { error } from "node:console";

const PORT = 8000;
const __dirname = import.meta.dirname;

const server = http.createServer(async (req, res) => {
    // api calls
    if (req.url === "/api/notes"){
        if ( req.method === "GET"){
            return await handleGetNotes(req, res)
        }

        if (req.method === "POST"){
            return await handlePostNote(req, res);
        }
    }

    // specific note related api calls
    // matching for api calls with pattern /api/notes/{nodeID}
    const urlMatches = req.url.match(/^\/api\/notes\/([a-zA-Z0-9-]+)$/);
    if (urlMatches){
        const noteId = urlMatches[1];
        if (req.method === "GET"){ return handleGetNote(req, res, noteId); }
        if (req.method === "PUT"){ return handleUpdateNote(req, res, noteId); }
        if (req.method === "DELETE"){ return handleDeleteNote(req, res, noteId); }
    }

    if (req.url === "/api/notesFeed" && req.method === "GET"){
        return await handleNoteFeed(req, res);
    }

    // web page content calls
    if(!req.url.startsWith("/api")){
        return serveStatic(req, res, __dirname);
    }

    sendResponse(
        res, 
        404, 
        "application/json", 
        JSON.stringify({
            error: 'Route Not Found',
            message: `Cannot ${req.method} ${req.url}. This endpoint does not exist.`
        }))
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))