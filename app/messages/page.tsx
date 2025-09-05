"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Search,
  MoreHorizontal,
  Paperclip,
  Send,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Music,
  Check,
  CheckCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";

type MessageType = "text" | "image" | "video" | "document" | "audio";

interface ChatMessage {
  id: string;
  sender: "me" | "them";
  type: MessageType;
  content: string; // text or url for media
  timestamp: number;
  read: boolean;
}

interface Conversation {
  id: string;
  username: string;
  avatar: string; // initials
  messages: ChatMessage[];
  unread: number;
}

const seedConversations: Conversation[] = [
  {
    id: "c1",
    username: "Sarah Johnson",
    avatar: "SJ",
    unread: 2,
    messages: [
      { id: "m1", sender: "them", type: "text", content: "Hey! Are you free to review the teaser?", timestamp: Date.now() - 1000 * 60 * 60 * 5, read: false },
      { id: "m2", sender: "me", type: "text", content: "Yes, send it over.", timestamp: Date.now() - 1000 * 60 * 60 * 4.9, read: true },
      { id: "m3", sender: "them", type: "image", content: "/placeholder/640x360.png", timestamp: Date.now() - 1000 * 60 * 60 * 4.5, read: false },
    ],
  },
  {
    id: "c2",
    username: "Michael Chen",
    avatar: "MC",
    unread: 0,
    messages: [
      { id: "m1", sender: "me", type: "text", content: "Color grade is looking great!", timestamp: Date.now() - 1000 * 60 * 60 * 24, read: true },
      { id: "m2", sender: "them", type: "text", content: "Thanks! Final draft by EOD.", timestamp: Date.now() - 1000 * 60 * 60 * 23.5, read: true },
    ],
  },
  {
    id: "c3",
    username: "Amelia Brown",
    avatar: "AB",
    unread: 0,
    messages: [
      { id: "m1", sender: "them", type: "video", content: "/placeholder/640x360.mp4", timestamp: Date.now() - 1000 * 60 * 90, read: true },
      { id: "m2", sender: "me", type: "text", content: "Watching now.", timestamp: Date.now() - 1000 * 60 * 85, read: true },
    ],
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const [convSearch, setConvSearch] = useState("");
  const [input, setInput] = useState("");
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const activeConv = useMemo(() => conversations.find((c) => c.id === activeId) || null, [conversations, activeId]);

  useEffect(() => {
    // Auto-scroll to bottom on active conversation change or messages update
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, activeConv?.messages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate incoming message to a random non-active conversation
      if (conversations.length === 0) return;
      const others = conversations.filter((c) => c.id !== activeId);
      if (others.length === 0) return;
      const target = others[Math.floor(Math.random() * others.length)];
      const newMsg: ChatMessage = {
        id: String(Date.now()),
        sender: "them",
        type: "text",
        content: "New update just arrived!",
        timestamp: Date.now(),
        read: false,
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === target.id ? { ...c, messages: [...c.messages, newMsg], unread: c.unread + 1 } : c))
      );
      toast("New message from " + target.username);
    }, 15000);
    return () => clearInterval(interval);
  }, [conversations, activeId]);

  function getLastPreview(c: Conversation): string {
    const m = c.messages[c.messages.length - 1];
    if (!m) return "";
    if (m.type === "text") return m.content.slice(0, 40);
    if (m.type === "image") return "[Image]";
    if (m.type === "video") return "[Video]";
    if (m.type === "document") return "[Document]";
    return "[Audio]";
  }

  function formatTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function selectConversation(id: string) {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) } : c))
    );
  }

  function sendMessage(type: MessageType = "text", contentOverride?: string) {
    if (!activeConv) return;
    const content = contentOverride ?? input.trim();
    if (!content) return;
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "me",
      type,
      content,
      timestamp: Date.now(),
      read: true,
    };
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConv.id ? { ...c, messages: [...c.messages, newMsg] } : c))
    );
    setInput("");
    setAttachMenuOpen(false);
  }

  function loadOlder() {
    if (!activeConv) return;
    setLoadingOlder(true);
    setTimeout(() => {
      const older: ChatMessage[] = [
        { id: "old-" + Date.now(), sender: "them", type: "text", content: "Earlier message...", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, read: true },
        { id: "old-" + (Date.now() + 1), sender: "me", type: "text", content: "Got it.", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 + 60000, read: true },
      ];
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConv.id ? { ...c, messages: [...older, ...c.messages] } : c))
      );
      setLoadingOlder(false);
      // keep approximate scroll position
      chatBodyRef.current?.scrollTo({ top: 100, behavior: "smooth" });
    }, 800);
  }

  const filteredConversations = useMemo(() => {
    const q = convSearch.toLowerCase();
    return conversations.filter((c) => c.username.toLowerCase().includes(q));
  }, [conversations, convSearch]);

  return (
    <AppLayout>
      <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-112px)] grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
        {/* Left: Conversations */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Messages</CardTitle>
            <CardDescription>Search conversations</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex-1 flex flex-col overflow-hidden">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by username"
                value={convSearch}
                onChange={(e) => setConvSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="overflow-y-auto rounded-md border border-border divide-y">
              {filteredConversations.map((c) => {
                const last = getLastPreview(c);
                const lastTs = c.messages[c.messages.length - 1]?.timestamp;
                const isActive = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectConversation(c.id)}
                    className={`w-full text-left p-3 flex items-start gap-3 hover:bg-accent transition-colors ${
                      isActive ? "bg-accent" : ""
                    }`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-sm font-semibold">
                        {c.avatar}
                      </div>
                      {c.unread > 0 && (
                        <div className="absolute -right-1 -bottom-1 text-[10px] bg-primary text-primary-foreground rounded-full px-1.5">
                          {c.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate">{c.username}</div>
                        <div className="text-xs text-muted-foreground ml-2">{lastTs ? formatTime(lastTs) : ""}</div>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{last}</div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
              {filteredConversations.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">No conversations found</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: Chat Window */}
        <Card className="flex flex-col overflow-hidden">
          {activeConv ? (
            <>
              <div className="border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-sm font-semibold">
                    {activeConv.avatar}
                  </div>
                  <div>
                    <div className="font-semibold leading-tight">{activeConv.username}</div>
                    <div className="text-xs text-muted-foreground">Conversation</div>
                  </div>
                </div>
              </div>
              {/* Chat body */}
              <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-center">
                  <Button variant="outline" size="sm" onClick={loadOlder} disabled={loadingOlder}>
                    {loadingOlder ? "Loading..." : "Load older messages"}
                  </Button>
                </div>
                {activeConv.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm border ${
                        m.sender === "me"
                          ? "bg-primary text-primary-foreground border-transparent"
                          : "bg-background text-foreground"
                      }`}
                    >
                      {m.type === "text" && <div>{m.content}</div>}
                      {m.type === "image" && (
                        <img src={m.content} alt="image" className="rounded-md max-w-full" />
                      )}
                      {m.type === "video" && (
                        <video src={m.content} controls className="rounded-md max-w-full" />
                      )}
                      {m.type === "document" && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <a href={m.content} className="underline" target="_blank" rel="noreferrer">Open document</a>
                        </div>
                      )}
                      {m.type === "audio" && (
                        <audio src={m.content} controls className="w-full" />
                      )}
                      <div className={`mt-1 flex items-center gap-1 text-[10px] ${m.sender === "me" ? "opacity-80" : "text-muted-foreground"}`}>
                        <span>{formatTime(m.timestamp)}</span>
                        {m.sender === "me" && (m.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              {/* Composer */}
              <div className="border-t p-3">
                <div className="flex items-end gap-2">
                  <div className="relative flex-1">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message"
                      className="w-full min-h-[44px] max-h-40 border border-border rounded-md bg-background px-3 py-2 text-sm resize-y"
                    />
                    {attachMenuOpen && (
                      <div className="absolute bottom-full mb-2 left-0 bg-popover text-popover-foreground border border-border rounded-md shadow p-2 flex gap-2 z-10">
                        <Button variant="ghost" size="sm" onClick={() => sendMessage("image", "/placeholder/640x360.png")}>
                          <ImageIcon className="w-4 h-4 mr-1" /> Image
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => sendMessage("video", "/placeholder/640x360.mp4")}>
                          <VideoIcon className="w-4 h-4 mr-1" /> Video
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => sendMessage("document", "/placeholder/script.pdf")}>
                          <FileText className="w-4 h-4 mr-1" /> Doc
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => sendMessage("audio", "/placeholder/audio.mp3")}>
                          <Music className="w-4 h-4 mr-1" /> Audio
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => setAttachMenuOpen((s) => !s)}>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => sendMessage()} disabled={!input.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <CardTitle className="text-xl mb-2">Select a conversation to start messaging.</CardTitle>
                <CardDescription>Choose someone from the list on the left to view messages here.</CardDescription>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}


