import { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickPrompts = [
  "Find projects by department",
  "Avoid duplicate topics",
  "How to submit my project",
  "Search publications",
];

export function AcademIQButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    const userMsg = { role: "user" as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `I found some results related to "${text}". This is a demo response — connect Lovable Cloud to enable real AI-powered search and recommendations.`,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-ai text-ai-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="Open AcademIQ"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed right-0 top-0 h-full w-[400px] max-w-full bg-card border-l border-border shadow-2xl z-50 flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="bg-primary px-5 py-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
            <div className="flex-1">
              <h3 className="text-primary-foreground font-heading font-semibold text-sm">AcademIQ</h3>
              <p className="text-primary-foreground/70 text-xs">Your Academic Assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center py-4">
                  Hi! I'm AcademIQ. Ask me anything about projects, publications, or submissions.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="px-3 py-1.5 text-xs bg-muted text-primary rounded-full hover:bg-accent/40 transition-colors border border-border"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border-l-4 border-primary border rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-1 px-4 py-3">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-dot" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) sendMessage(input.trim());
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AcademIQ..."
                className="flex-1 h-10 px-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" size="icon" className="h-10 w-10" disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
