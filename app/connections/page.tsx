"use client";

import React, { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Search, Users, UserPlus, Clock } from "lucide-react";

interface Connection {
  id: string;
  name: string;
  role: string;
  location: string;
  connectedAt?: number;
  avatar: string; // initials
}

interface PendingRequest {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  direction: "received" | "sent";
  requestedAt: number;
}

interface Suggestion {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  mutuals?: number;
}

const seedConnections: Connection[] = [
  { id: "1", name: "Sarah Johnson", role: "Producer", location: "Los Angeles, CA", connectedAt: Date.now() - 1000 * 60 * 60 * 24 * 10, avatar: "SJ" },
  { id: "2", name: "Michael Chen", role: "Colorist", location: "Vancouver, BC", connectedAt: Date.now() - 1000 * 60 * 60 * 24 * 20, avatar: "MC" },
  { id: "3", name: "Amelia Brown", role: "Editor", location: "London, UK", connectedAt: Date.now() - 1000 * 60 * 60 * 24 * 35, avatar: "AB" },
  { id: "4", name: "Leo Park", role: "Cinematographer", location: "Seoul, KR", connectedAt: Date.now() - 1000 * 60 * 60 * 24 * 50, avatar: "LP" },
];

const seedPending: PendingRequest[] = [
  { id: "p1", name: "Nina Rossi", role: "Sound Designer", location: "Rome, IT", avatar: "NR", direction: "received", requestedAt: Date.now() - 1000 * 60 * 60 * 48 },
  { id: "p2", name: "David Kim", role: "Composer", location: "New York, NY", avatar: "DK", direction: "sent", requestedAt: Date.now() - 1000 * 60 * 60 * 12 },
];

const seedSuggestions: Suggestion[] = [
  { id: "s1", name: "Priya Singh", role: "VFX Artist", location: "Mumbai, IN", avatar: "PS", mutuals: 6 },
  { id: "s2", name: "Owen Wright", role: "Gaffer", location: "Sydney, AU", avatar: "OW", mutuals: 2 },
  { id: "s3", name: "Hiro Tanaka", role: "1st AC", location: "Tokyo, JP", avatar: "HT", mutuals: 4 },
];

type TabKey = "all" | "pending" | "suggested";
type SortKey = "recent" | "az" | "location";

export default function ConnectionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [connections, setConnections] = useState<Connection[]>(seedConnections);
  const [pending, setPending] = useState<PendingRequest[]>(seedPending);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(seedSuggestions);
  const [pendingView, setPendingView] = useState<"received" | "sent">("received");

  const filteredConnections = useMemo(() => {
    const q = search.toLowerCase();
    let items = connections.filter(
      (c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
    if (sortBy === "recent") {
      items = items.sort((a, b) => (b.connectedAt ?? 0) - (a.connectedAt ?? 0));
    } else if (sortBy === "az") {
      items = items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "location") {
      items = items.sort((a, b) => a.location.localeCompare(b.location));
    }
    return items;
  }, [connections, search, sortBy]);

  function handleOpenProfile(id: string) {
    router.push(`/directory?user=${id}`);
  }

  function handleMessage(id: string) {
    router.push("/messages");
  }

  function handleRemove(id: string) {
    setConnections((prev) => prev.filter((c) => c.id !== id));
    toast.success("Connection removed");
  }

  function handleAccept(requestId: string) {
    const req = pending.find((p) => p.id === requestId);
    if (!req) return;
    setPending((prev) => prev.filter((p) => p.id !== requestId));
    setConnections((prev) => [
      { id: req.id, name: req.name, role: req.role, location: req.location, avatar: req.avatar, connectedAt: Date.now() },
      ...prev,
    ]);
    toast.success(`Connected with ${req.name}`);
  }

  function handleDecline(requestId: string) {
    const req = pending.find((p) => p.id === requestId);
    setPending((prev) => prev.filter((p) => p.id !== requestId));
    if (req) toast("Not interested in " + req.name);
  }

  function handleConnect(suggestionId: string) {
    const sug = suggestions.find((s) => s.id === suggestionId);
    if (!sug) return;
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    setPending((prev) => [
      ...prev,
      { id: "sent-" + sug.id, name: sug.name, role: sug.role, location: sug.location, avatar: sug.avatar, direction: "sent", requestedAt: Date.now() },
    ]);
    toast.success("Request sent");
  }

  function handleDismissSuggestion(suggestionId: string) {
    const sug = suggestions.find((s) => s.id === suggestionId);
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    if (sug) toast("Not interested in " + sug.name);
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or profession"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Sort</label>
            <select
              className="border bg-background text-foreground rounded-md px-2 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
            >
              <option value="recent">Recently Added</option>
              <option value="az">A–Z</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b">
          <button
            className={`px-3 py-2 text-sm border-b-2 -mb-px ${activeTab === "all" ? "border-primary" : "border-transparent text-muted-foreground"}`}
            onClick={() => setActiveTab("all")}
          >
            All Connections
          </button>
          <button
            className={`px-3 py-2 text-sm border-b-2 -mb-px ${activeTab === "pending" ? "border-primary" : "border-transparent text-muted-foreground"}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Requests
          </button>
          <button
            className={`px-3 py-2 text-sm border-b-2 -mb-px ${activeTab === "suggested" ? "border-primary" : "border-transparent text-muted-foreground"}`}
            onClick={() => setActiveTab("suggested")}
          >
            Suggested
          </button>
        </div>

        {/* Content */}
        {activeTab === "all" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> All Connections</CardTitle>
              <CardDescription>Manage your network</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredConnections.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  You have no connections yet. Start connecting with others to grow your network.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredConnections.map((c) => (
                    <div key={c.id} className="border rounded-lg p-4 bg-card text-card-foreground flex flex-col gap-3">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleOpenProfile(c.id)}>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-semibold">
                          {c.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{c.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{c.role} • {c.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {c.connectedAt ? new Date(c.connectedAt).toLocaleDateString() : "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleMessage(c.id)}>Message</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRemove(c.id)}>Remove</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "pending" && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Accept or review connection requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPendingView("received")}
                  className={`px-3 py-1.5 text-sm rounded-md ${pendingView === "received" ? "bg-primary text-primary-foreground" : "border"}`}
                >
                  Received
                </button>
                <button
                  onClick={() => setPendingView("sent")}
                  className={`px-3 py-1.5 text-sm rounded-md ${pendingView === "sent" ? "bg-primary text-primary-foreground" : "border"}`}
                >
                  Sent
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pending
                  .filter((p) => p.direction === pendingView)
                  .map((p) => (
                    <div key={p.id} className="border rounded-lg p-4 bg-card text-card-foreground flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white flex items-center justify-center font-semibold">
                          {p.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{p.role} • {p.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">Requested {new Date(p.requestedAt).toLocaleDateString()}</div>
                        {p.direction === "received" ? (
                          <div className="flex items-center gap-2">
                            <Button size="sm" onClick={() => handleAccept(p.id)}>Accept</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDecline(p.id)}>Not Interested</Button>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">Awaiting response</div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {pending.filter((p) => p.direction === pendingView).length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">No {pendingView} requests.</div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "suggested" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Suggested Connections</CardTitle>
              <CardDescription>People you may know</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {suggestions.map((s) => (
                  <div key={s.id} className="border rounded-lg p-4 bg-card text-card-foreground flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center font-semibold">
                        {s.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{s.role} • {s.location}</div>
                        {typeof s.mutuals === "number" && (
                          <div className="text-[11px] text-muted-foreground">{s.mutuals} mutual connections</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" onClick={() => handleConnect(s.id)}>Connect</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDismissSuggestion(s.id)}>Not Interested</Button>
                    </div>
                  </div>
                ))}
              </div>

              {suggestions.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">No suggestions at the moment.</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}


