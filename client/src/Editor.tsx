import React, { useState, useRef, useEffect } from "react";

const Editor = () => {
  const [text, setText] = useState("");
  const [keystrokes, setKeystrokes] = useState<any[]>([]);
  const [pasteEvents, setPasteEvents] = useState<any[]>([]);
  const lastTimeRef = useRef<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = Date.now();

    if (lastTimeRef.current) {
      const diff = now - lastTimeRef.current;

      setKeystrokes(prev => [
        ...prev,
        {
          timeDiff: diff
        }
      ]);
    }

    lastTimeRef.current = now;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");

    setPasteEvents(prev => [
      ...prev,
      {
        length: pastedText.length,
        timestamp: Date.now()
      }
    ]);
  };

  const saveSession = async () => {
    try {
      const res = await fetch("http://localhost:5000/save-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          keystrokes,
          pasteEvents
        })
      });
      const data = await res.json();
      console.log(data);
      alert("Session Saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save session");
    }
  };
  useEffect(() => {
    setKeystrokes([]);
    setPasteEvents([]);
  }, []);

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5"
    }}>
      <div style={{
        width: "600px", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center" }}>Vi-Notes Editor</h2>

        <textarea placeholder="Start writing here..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} onPaste={handlePaste}
          style={{
            width: "100%", height: "200px", border: "none", outline: "none", resize: "none", fontSize: "16px"
          }}
        />

        <button onClick={saveSession} style={{
          marginTop: "10px", width: "100%", padding: "10px", backgroundColor: "black", color: "white", border: "none", cursor: "pointer"
        }}
        >
          Save Session Data
        </button>
        <p> Keystrokes captured: {keystrokes.length}</p>
        <p>Paste events: {pasteEvents.length}</p>
        <p>Last Delay: {keystrokes.length > 0 ? keystrokes[keystrokes.length - 1].timeDiff : 0} ms</p>

        {pasteEvents.length > 0 && (
          <p style={{ color: "red", marginTop: "10px" }}>
            Pasted content detected
          </p>
        )}
      </div>
    </div>
  );
};

export default Editor;