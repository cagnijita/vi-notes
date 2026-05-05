import express from "express";
import cors from "cors";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/vi-notes").then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

const app = express();

app.use(cors());
app.use(express.json());

//let sessions = [];
const sessionSchema= new mongoose.Schema({
  text:String,
  keystrokes:Array,
  pasteEvents:Array
});
const Session = mongoose.model("Session", sessionSchema);

app.post("/save-session", async (req, res) => {
  try{  
  const { text, keystrokes, pasteEvents } = req.body;

  const session = new Session({
    text,
    keystrokes,
    pasteEvents
  });

  await session.save();
res.json({ message: "Session saved to Database", session });
  //sessions.push(session);
  //res.json({ message: "Saved", session });

}
catch(err){
  res.status(500).json({ message: "Failed to save session"});
}
});

app.get("/sessions", async (req, res) => {
  try {
    const sessions = await Session.find();
    const resp = sessions.map((s, ind) => ({
      session: ind + 1,
      keystrokes: s.keystrokes.length,
      pasteEvents: s.pasteEvents.length,
  }));
  res.json({ totalSessions: sessions.length, data: resp });
} catch (err) {
  res.status(500).json({ message: "Failed to fetch sessions" });
}
});

app.listen(5000, () => console.log("Server running on port 5000"));