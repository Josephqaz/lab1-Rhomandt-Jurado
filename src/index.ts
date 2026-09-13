import "dotenv/config";
import { app } from "./app";

const port = Number(process.env.APP_PORT) || 8000;

app.listen(port, () => {
  console.log(`team-notes-api listening on port ${port}`);
});
