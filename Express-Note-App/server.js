import express from "express";
import cors from "cors";
import notesRouter from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

// server static files
app.use(express.static("public"))

app.use("/api/notes", notesRouter);

connectDB().then( () => {
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    });
});
