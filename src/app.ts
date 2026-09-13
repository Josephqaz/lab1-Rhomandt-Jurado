import express from "express";

export const app = express();

app.use(express.json());

// Endpoints (/health, /notes) se agregan en las ramas
// feature/read-notes y feature/write-notes.
