import express from "express";
import connectToDb from "./connection.js";
import { router } from "./router/user.js";
import cors from "cors";
const app = express();

//allowing cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//app url parser
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({
    message: "working",
  });
});

await connectToDb();

app.use("/api", router);

app.listen(1000, () => {
  console.log(`http://localhost:1000/`);
});
