import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const STORAGE_KEY = "usa-conversations";
const AVATARS = ["🎓", "📘", "💡", "🗓️", "🏫", "📝", "🎯", "🧠"];

function createId() {
  return crypto.randomUUID();
}

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function avatarFor(title) {
  let hash = 0;
  for (const char of title || "") hash += char.charCodeAt(0);
  return AVATARS[hash % AVATARS.length];
}

function App() {
  const [conversations, setConversations] = useState(loadConversations);
  const [activeId, setActiveId] = useState(conversations[0]?.id || null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) || null,
    [conversations, activeId]
  );

  const messages = activeConversation?.messages || [];

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!query) return list;
    return list.filter((item) => item.title.toLowerCase().includes(query));
  }, [conversations, search]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startNewChat = () => {
    setActiveId(null);
    setInput("");
    textareaRef.current?.focus();
  };

  const updateConversation = (id, updater) => {
    setConversations((prev) =>
      prev.map((item) => (item.id === id ? updater(item) : item))
    );
  };

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const now = Date.now();
    let conversation = activeConversation;
    const userTurn = { role: "user", content: userMessage };

    if (!conversation) {
      conversation = {
        id: createId(),
        backendId: null,
        title: userMessage.slice(0, 42),
        updatedAt: now,
        messages: [userTurn],
      };
      setConversations((prev) => [conversation, ...prev]);
      setActiveId(conversation.id);
    } else {
      updateConversation(conversation.id, (item) => ({
        ...item,
        title: item.messages.length === 0 ? userMessage.slice(0, 42) : item.title,
        updatedAt: now,
        messages: [...item.messages, userTurn],
      }));
    }

    const targetId = conversation.id;

    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversation.backendId,
        }),
      });

      const data = await response.json();

      updateConversation(targetId, (item) => ({
        ...item,
        backendId: data.conversation_id || item.backendId,
        updatedAt: Date.now(),
        messages: [
          ...item.messages,
          { role: "assistant", content: data.response },
        ],
      }));
    } catch (error) {
      console.error(error);
      updateConversation(targetId, (item) => ({
        ...item,
        updatedAt: Date.now(),
        messages: [
          ...item.messages,
          { role: "assistant", content: "Sorry, something went wrong." },
        ],
      }));
    } finally {
      setLoading(false);
    }
  };

  const resizeTextarea = (event) => {
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">🎓</div>
          <div>
            <h1>CampusHub</h1>
            <p>University support</p>
          </div>
        </div>

        <button className="new-chat" type="button" onClick={startNewChat}>
          + New chat
        </button>

        <div className="sidebar-search">
          <input
            type="search"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="history-label">Recent prompts</div>
        <div className="history-list">
          {filteredHistory.length === 0 && (
            <p className="empty-history">No previous chats yet.</p>
          )}
          {filteredHistory.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`history-item ${item.id === activeId ? "active" : ""}`}
              onClick={() => setActiveId(item.id)}
            >
              <span className="history-avatar">{avatarFor(item.title)}</span>
              <span className="history-copy">
                <span className="history-title">{item.title}</span>
                <span className="history-preview">
                  {item.messages.at(-1)?.content || "Empty conversation"}
                </span>
              </span>
              <span className="history-time">{formatTime(item.updatedAt)}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="conversation">
        <header className="conversation-header">
          <div className="header-identity">
            <span className="header-avatar">🤖</span>
            <div>
              <h2>University AI Assistant</h2>
              <p>Ask about courses, deadlines, campus services, and more</p>
            </div>
          </div>
        </header>

        <div className="chat-messages">
          {messages.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-orb">✨</div>
              <h3>Start a conversation</h3>
              <p>Your previous prompts stay in the left sidebar, like Gemini.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`message-row ${message.role}`}>
              {message.role === "assistant" && (
                <span className="bubble-avatar">🤖</span>
              )}
              <div className={`message ${message.role}`}>{message.content}</div>
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <span className="bubble-avatar">🤖</span>
              <div className="message assistant typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask a campus question..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              resizeTextarea(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button type="submit" disabled={!input.trim() || loading}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
