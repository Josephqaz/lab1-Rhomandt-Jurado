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

    if (resoult.rows.length === 0) {
        return res.status(404).json({ message: "Note not found" });
    }

    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }

    res.json(resoult.rows[0]);
});

notesRouter.post("/notes", async (req, res) => {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({ message: "Title, content and author are required" });
    }


    const resoult = await pool.query(
        "INSERT INTO notes (title, content, author) VALUES ($1, $2, $3) RETURNING *",
        [title, content, author]
    );

    res.status(201).json(resoult.rows[0]);
});

notesRouter.put("/notes/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { title, content, author } = req.body;

    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }

    if (!title || !content || !author) {
        return res.status(400).json({ message: "Title, content and author are required" });
    }

    const resoult = await pool.query(
        "UPDATE notes SET title = $1, content = $2, author = $3 WHERE id = $4 RETURNING *",
        [title, content, author, id]
    );

    if (resoult.rows.length === 0) {
        return res.status(404).json({ message: "Note not found" });
    }

    res.json(resoult.rows[0]);
});


notesRouter.delete("/notes/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }

    const resoult = await pool.query("DELETE FROM notes WHERE id = $1 RETURNING *", [id]);

    if (resoult.rows.length === 0) {
        return res.status(404).json({ message: "Note not found" });
    }

    res.status(204).send("data deleted successfully");

});
