import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// when a website tries to request from a another website in a seperate url/server/port the browser might block it for security reasons
// when both frontend and backend are running in seperate ports the browser might block the API requests from frontend to backend as well 
// it's called a CORSError
// using corse() from cors library will allow ur server/backend/website to accept requets from other websties/servers/
// in this case this allows our backend to accept requets from our frontend.
// app.use(cors()) by default will allow any requests from any url/server/website
// but we could be specific on which urls to allow within cors() 
if (process.env.NODE_ENV !== "production")
{
    app.use(cors({
        origin : "http://localhost:5173"
    }));
}
// used for passing in values with the request 
app.use(express.json());
app.use(rateLimiter);

///////////////////////////////
// OPTIONAL 
// custom middleware
app.use((req, res, next) => {
    // currently just print out the reqest method and request url
    console.log(`Request method ${req.method} & Request URL ${req.url}`)
    next();
    // with middlewares like app.use .post .get .. if you don't end the function with a reposnse you NEED to end the function
    // with a next(); it's a way of telling express, that the function is done running and move on to the next router
    // some methods automatically calls the next(), so we don't havet to
});

// if the server request starts with /api/notes/ hit the notesRoutes file
app.use("/api/notes", notesRoutes);

// build script under frontEnd build a special , optimised and static version of the frontend application we developed.
// we are asking the express to server users the frontend application in the same PORT as the backend as well
// for that we are passing in the folder/directory name of that optimised frontend application
// path.resolve() without arguments get the file path of the current working directory,
const __dirname = path.resolve();
// id the current state of the program is Production (this just a value saved in .env)
if (process.env.NODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    // if we get any requests other than the pre defined routes in the program, 
    // serve the prebuild index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// make is so that, Only when the database connection with mongoDB is established, 
// start the app on port 5001
connectDB().then( () => {
    app.listen(PORT, ()=>{
        console.log("Server started on PORT 5001");
    }); 
});


