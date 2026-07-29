import { ChangeEvent, FormEvent, KeyboardEvent, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Compass,
  ImageIcon,
  Leaf,
  LoaderCircle,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import logoUrl from "@assets/holistic-harmony-logo.png";
import arPreviewUrl from "@assets/holistic-harmony-ar-preview.png";
import brandBoardUrl from "@assets/holistic-harmony-brand-identity.png";
import flowBoardUrl from "@assets/holistic-harmony-flow-presentation.png";

type Role = "user" | "assistant";

type ConversationMessage = {
  id: string;
  role: Role;
  content: string;
};

type RoomImage = {
  name: string;
  dataUrl: string;
  previewUrl: string;
};

const MAX_FILE_SIZE = 6 * 1024 * 1024;

const guidanceScopes = [
  {
    id: "flow",
    title: "Flow & layout",
    description: "Movement, circulation, and sightlines.",
  },
  {
    id: "comfort",
    title: "Comfort & restoration",
    description: "Light, texture, and everyday ease.",
  },
  {
    id: "intention",
    title: "Intentional atmosphere",
    description: "A focused perspective for the room.",
  },
] as const;

type GuidanceScope = (typeof guidanceScopes)[number]["id"];

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-mark" aria-label="Holistic Harmony">
      <img src={logoUrl} alt="Holistic Harmony emblem" />
      {!compact && (
        <div className="brand-wordmark">
          <span>Holistic</span>
          <span>Harmony</span>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.role === "user";

  return (
    <article className={`message-row ${isUser ? "message-row-user" : "message-row-guide"}`}>
      {!isUser && (
        <div className="guide-avatar" aria-hidden="true">
          <Leaf size={15} strokeWidth={1.7} />
        </div>
      )}
      <div className={`message-bubble ${isUser ? "message-bubble-user" : "message-bubble-guide"}`}>
        <p>{message.content}</p>
      </div>
    </article>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [roomImage, setRoomImage] = useState<RoomImage | null>(null);
  const [scope, setScope] = useState<GuidanceScope>("flow");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedScope = useMemo(
    () => guidanceScopes.find((item) => item.id === scope) ?? guidanceScopes[0],
    [scope],
  );

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setError("");

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a PNG, JPEG, or WebP room image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Please choose an image smaller than 6 MB.");
      return;
    }

    try {
      const dataUrl = await readImage(file);
      setRoomImage({ name: file.name, dataUrl, previewUrl: dataUrl });
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : "The image could not be read.");
    }
  }

  function removeRoomImage() {
    setRoomImage(null);
    setError("");
  }

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const content = draft.trim();
    if (!content || isSending) return;

    setError("");
    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);

    const requestMessages = nextMessages.map(({ role, content: messageContent }) => ({
      role,
      content: messageContent,
    }));
    requestMessages[requestMessages.length - 1] = {
      role: "user",
      content: `Guidance focus: ${selectedScope.title}.\n\n${content}`,
    };

    try {
      const response = await fetch("/api/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: requestMessages,
          imageDataUrl: roomImage?.dataUrl,
        }),
      });
      const body = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
      if (!response.ok || !body?.message) {
        throw new Error(body?.error || "Holistic Harmony could not create guidance right now.");
      }
      const assistantContent = body.message;

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: assistantContent,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Holistic Harmony could not create guidance right now.",
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void sendMessage();
    }
  }

  function usePrompt(prompt: string) {
    setDraft(prompt);
  }

  return (
    <main className="harmony-shell">
      <aside className="harmony-rail" aria-label="Holistic Harmony navigation">
        <div className="rail-brand-wrap">
          <BrandMark compact />
        </div>
        <nav className="rail-nav" aria-label="Workspace sections">
          <a className="rail-link rail-link-active" href="#guidance">
            <MessageCircle size={18} strokeWidth={1.7} />
            <span>Guidance</span>
          </a>
          <a className="rail-link" href="#room-context">
            <Compass size={18} strokeWidth={1.7} />
            <span>Room context</span>
          </a>
          <button className="rail-link" type="button" onClick={() => setIsVisionOpen(true)}>
            <ImageIcon size={18} strokeWidth={1.7} />
            <span>Visual direction</span>
          </button>
        </nav>
        <div className="rail-footer">
          <div className="rail-note">
            <ShieldCheck size={15} strokeWidth={1.7} />
            <span>Your uploaded room image is sent only with your guidance request.</span>
          </div>
        </div>
      </aside>

      <section className="workspace" id="guidance">
        <header className="workspace-header">
          <div className="mobile-brand">
            <BrandMark />
          </div>
          <div className="workspace-title">
            <p className="eyebrow">Your space, one continuous conversation</p>
            <h1>Holistic Harmony guidance</h1>
          </div>
          <button className="vision-button" type="button" onClick={() => setIsVisionOpen(true)}>
            <Sparkles size={16} strokeWidth={1.7} />
            <span>View visual direction</span>
            <ArrowUpRight size={15} strokeWidth={1.7} />
          </button>
        </header>

        <div className="guidance-body">
          <section className="conversation-panel" aria-label="Holistic Harmony guidance conversation">
            <div className="conversation-scroll">
              {messages.length === 0 ? (
                <div className="empty-conversation">
                  <div className="empty-seal">
                    <img src={logoUrl} alt="" />
                  </div>
                  <p className="eyebrow">Begin with what matters to you</p>
                  <h2>Design your room with intention.</h2>
                  <p>
                    Attach a room photo when you want image-aware observations, then ask a specific question. Your conversation remains in one place as your ideas evolve.
                  </p>
                  <div className="prompt-grid" aria-label="Suggested questions">
                    <button type="button" onClick={() => usePrompt("What are a few practical ways to improve the flow of this room?")}>
                      <Compass size={16} strokeWidth={1.7} />
                      <span>Explore flow and circulation</span>
                      <ChevronRight size={15} strokeWidth={1.7} />
                    </button>
                    <button type="button" onClick={() => usePrompt("How could I make this room feel more restorative for everyday use?")}>
                      <Leaf size={16} strokeWidth={1.7} />
                      <span>Support a restorative mood</span>
                      <ChevronRight size={15} strokeWidth={1.7} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="message-stack">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {isSending && (
                    <div className="message-row message-row-guide" aria-live="polite">
                      <div className="guide-avatar" aria-hidden="true">
                        <Leaf size={15} strokeWidth={1.7} />
                      </div>
                      <div className="message-bubble message-bubble-guide message-bubble-loading">
                        <LoaderCircle size={16} className="spin" aria-hidden="true" />
                        <span>Preparing guidance from your request…</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="composer-wrap">
              {error && (
                <div className="inline-error" role="alert">
                  <span>{error}</span>
                  <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
                    <X size={16} />
                  </button>
                </div>
              )}
              {roomImage && (
                <div className="attached-image">
                  <img src={roomImage.previewUrl} alt="Attached room" />
                  <div>
                    <span className="attachment-label">Room image attached</span>
                    <span className="attachment-name">{roomImage.name}</span>
                  </div>
                  <button type="button" onClick={removeRoomImage} aria-label="Remove room image">
                    <X size={16} />
                  </button>
                </div>
              )}
              <form className="composer" onSubmit={sendMessage}>
                <button
                  className="attach-button"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach room image"
                >
                  <Plus size={20} strokeWidth={1.6} />
                </button>
                <input
                  ref={fileInputRef}
                  className="visually-hidden"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                />
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  placeholder="Ask about your room, layout, or atmosphere…"
                  aria-label="Guidance request"
                  rows={1}
                />
                <button className="send-button" type="submit" disabled={!draft.trim() || isSending} aria-label="Send guidance request">
                  {isSending ? <LoaderCircle size={18} className="spin" /> : <Send size={18} strokeWidth={1.7} />}
                </button>
              </form>
              <p className="composer-hint">Use ⌘/Ctrl + Enter to send. Guidance is contextual; it does not diagnose or guarantee outcomes.</p>
            </div>
          </section>

          <aside className="context-panel" id="room-context">
            <section className="context-card context-card-primary">
              <div className="card-heading">
                <span className="card-icon"><Compass size={17} strokeWidth={1.7} /></span>
                <div>
                  <p className="eyebrow">Guidance focus</p>
                  <h2>Choose a lens</h2>
                </div>
              </div>
              <div className="scope-list">
                {guidanceScopes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`scope-option ${scope === item.id ? "scope-option-active" : ""}`}
                    onClick={() => setScope(item.id)}
                    aria-pressed={scope === item.id}
                  >
                    <span className="scope-dot" />
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="context-card image-context-card">
              <div className="card-heading">
                <span className="card-icon"><Upload size={17} strokeWidth={1.7} /></span>
                <div>
                  <p className="eyebrow">Room context</p>
                  <h2>{roomImage ? "Image ready" : "Attach a room image"}</h2>
                </div>
              </div>
              {roomImage ? (
                <>
                  <img className="context-photo" src={roomImage.previewUrl} alt="Attached room preview" />
                  <p className="context-copy">Your next guidance request can use this image as visual context.</p>
                  <button className="subtle-action" type="button" onClick={() => fileInputRef.current?.click()}>
                    Choose another image <ChevronRight size={14} />
                  </button>
                </>
              ) : (
                <button className="image-dropzone" type="button" onClick={() => fileInputRef.current?.click()}>
                  <span className="dropzone-icon"><ImageIcon size={20} strokeWidth={1.6} /></span>
                  <span>
                    <strong>Choose a room photo</strong>
                    <small>PNG, JPEG, or WebP up to 6 MB</small>
                  </span>
                  <ChevronRight size={16} strokeWidth={1.7} />
                </button>
              )}
            </section>

            <section className="context-card session-card">
              <div className="card-heading">
                <span className="card-icon"><MessageCircle size={17} strokeWidth={1.7} /></span>
                <div>
                  <p className="eyebrow">Session</p>
                  <h2>One seamless thread</h2>
                </div>
              </div>
              <dl className="session-facts">
                <div><dt>Focus</dt><dd>{selectedScope.title}</dd></div>
                <div><dt>Messages</dt><dd>{messages.length}</dd></div>
                <div><dt>Room image</dt><dd>{roomImage ? "Attached" : "Not attached"}</dd></div>
              </dl>
              {messages.length > 0 && (
                <button className="clear-session" type="button" onClick={() => { setMessages([]); setError(""); }}>
                  <Trash2 size={14} strokeWidth={1.7} />
                  Start a new conversation
                </button>
              )}
            </section>
          </aside>
        </div>
      </section>

      {isVisionOpen && (
        <div className="vision-modal-backdrop" role="presentation" onMouseDown={() => setIsVisionOpen(false)}>
          <section
            className="vision-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vision-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="vision-modal-header">
              <div>
                <p className="eyebrow">Holistic Harmony visual direction</p>
                <h2 id="vision-title">A consistent visual language for your space.</h2>
              </div>
              <button type="button" onClick={() => setIsVisionOpen(false)} aria-label="Close visual direction">
                <X size={19} />
              </button>
            </header>
            <div className="vision-grid">
              <figure><img src={brandBoardUrl} alt="Holistic Harmony brand identity and room guidance concept" /><figcaption>Brand identity and interactive room guidance concept.</figcaption></figure>
              <figure><img src={arPreviewUrl} alt="Holistic Harmony AR room styling preview concept" /><figcaption>Room-scale styling preview concept.</figcaption></figure>
              <figure className="vision-grid-wide"><img src={flowBoardUrl} alt="Holistic Harmony whole-home room flow concept" /><figcaption>Whole-home flow and room-guidance concept.</figcaption></figure>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
