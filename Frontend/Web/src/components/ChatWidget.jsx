import React, { useState } from "react";
import "./ChatWidget.css";
import { RiChatAiFill } from "react-icons/ri";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (e) {
      setResponse("Błąd połączenia z AI.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {isOpen ? (
        <div className="chat-box">
          <div className="chat-header">
            <span>Asystent Kursów</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <div className="chat-body">
            {response && <div className="chat-response">{response}</div>}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Zadaj pytanie..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? "..." : "Wyślij"}
            </button>
          </div>
        </div>
      ) : (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
        <RiChatAiFill size={24} color="White" />
        </button>
      )}
    </div>
  );
}

export default ChatWidget;
