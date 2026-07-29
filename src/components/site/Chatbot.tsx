import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const predefinedQA: Record<string, string> = {
  "How to register?": "You can register by clicking the 'REGISTER NOW' button on the homepage or navigating to the Register page. Fill in your details, select your events, and submit the form.",
  "Event Guidelines": "Each event has its own set of rules. Please visit the Events page, click on 'View Details' for your specific event, and read the guidelines carefully.",
  "Other College Participants": "Yes! Students from other colleges are absolutely welcome. Make sure to bring your college ID card on the day of the symposium for verification.",
  "Accommodations?": "We currently do not provide accommodations. However, there are many affordable stays near the campus.",
  "Contact Info": "You can reach out to us at dxm26@velammal.edu.in or call +91 98765 43210. You can also visit our Contact page.",
  "default": "I'm sorry, I didn't quite understand that. Please try asking about registration, events, other colleges, or contact information."
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "bot", text: "Hello! I am Nexus Bot 🤖. How can I guide you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // Simulate bot thinking and response
    setTimeout(() => {
      let botResponse = predefinedQA["default"];
      
      // Simple keyword matching if not a direct predefined question
      const lowerText = text.toLowerCase();
      if (lowerText.includes("register") || lowerText.includes("apply") || lowerText.includes("join")) {
        botResponse = predefinedQA["How to register?"];
      } else if (lowerText.includes("rule") || lowerText.includes("guide") || lowerText.includes("event")) {
        botResponse = predefinedQA["Event Guidelines"];
      } else if (lowerText.includes("other college") || lowerText.includes("outside") || lowerText.includes("id card")) {
        botResponse = predefinedQA["Other College Participants"];
      } else if (lowerText.includes("stay") || lowerText.includes("accommodation") || lowerText.includes("room")) {
        botResponse = predefinedQA["Accommodations?"];
      } else if (lowerText.includes("contact") || lowerText.includes("phone") || lowerText.includes("email") || lowerText.includes("reach")) {
        botResponse = predefinedQA["Contact Info"];
      } else if (predefinedQA[text]) {
        botResponse = predefinedQA[text];
      }

      const botMsg: Message = { id: (Date.now() + 1).toString(), sender: "bot", text: botResponse };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const handleOptionClick = (option: string) => {
    handleSend(option);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform ${
            isOpen ? "bg-muted text-muted-foreground border border-border" : "glow-orange text-white"
          }`}
          style={!isOpen ? { background: "var(--gradient-orange)" } : {}}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[350px] h-[500px] max-h-[80vh] flex flex-col glass neon-border rounded-2xl overflow-hidden z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="bg-primary/10 border-b border-primary/20 p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground tracking-wider">NEXUS BOT</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === "user" 
                      ? "bg-primary/20 text-primary-foreground border border-primary/30 rounded-br-sm" 
                      : "bg-muted/50 text-foreground border border-border rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Options (only show if last message was from bot and not a lot of messages) */}
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {Object.keys(predefinedQA).filter(k => k !== "default").map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className="text-[10px] bg-background border border-primary/30 hover:border-primary text-primary px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-background/50 border-t border-border flex gap-2">
              <input
                type="text"
                placeholder="Type your question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-muted/50 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 disabled:hover:bg-primary/20 transition-colors shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
