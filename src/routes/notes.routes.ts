import { Router } from "express";
import { pool } from "../db";

export const notesRouter = Router();

notesRouter.get("/notes", async (req, res) => {
    const resoult = await pool.query("SELECT * FROM notes ORDER BY id");
    res.json(resoult.rows);
});

notesRouter.get("/notes/:id", async (req, res) => {
    const id = Number(req.params.id);
    const resoult = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);

    if(resoult.rows.length === 0) {
        return res.status(404).json({ message: "Note not found" });
    }

    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }

    res.json(resoult.rows[0]);
});