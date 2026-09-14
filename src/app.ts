import express from "express"
import type { Request, Response, NextFunction } from "express";
import { healthRouter } from "./routes/health.routes";
import { notesRouter } from "./routes/notes.routes";

export const app = express();

app.use(express.json());
app.use(healthRouter);
app.use(notesRouter);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON body" });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});