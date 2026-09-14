import express from "express"
import { healthRouter } from "./routes/health.routes";
import { notesRouter } from "./routes/notes.routes";

export const app = express();

app.use(express.json());
app.use(healthRouter);
app.use(notesRouter);