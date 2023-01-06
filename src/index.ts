import express, { Application, Request, Response } from "express";

import routes from "./routes";
import errorMiddleware from "./middleware/error.middleware";
import config from "./config";
import db from "./database";

const PORT = config.port || 3000;
// create an instance server
const app: Application = express();
// Middleware to parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

app.use("/api", routes);

app.get("/", function (_req: Request, res: Response) {
  res.send("Hello World");
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: "ohh you are lost",
  });
});

db.connect().then((client) => {
  return client
    .query("SELECT NOW()")
    .then((res) => {
      client.release();
      console.log(res);
    })
    .catch((error: Error) => {
      client.release();
      console.log(error.stack);
    });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(PORT);
});

export default app;
