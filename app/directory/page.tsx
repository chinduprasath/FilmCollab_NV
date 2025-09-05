"use client";

import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Music,
  Calendar,
  User as UserIcon,
  Download,
  Share2,
  Eye,
  Play,
} from "lucide-react";

type DirType = "images" | "videos" | "documents" | "audios";

interface BaseItem {
  id: string;
  title: string;
  username: string;
  uploadDate: string; // YYYY-MM-DD
  views: number;
  tags?: string[];
}

interface ImageItem extends BaseItem {
  type: "images";
  thumbnailUrl: string;
}

interface VideoItem extends BaseItem {
  type: "videos";
  thumbnailUrl: string;
  videoUrl: string;
}

interface DocumentItem extends BaseItem {
  type: "documents";
  fileUrl: string;
  ext: string;
}

interface AudioItem extends BaseItem {
  type: "audios";
  audioUrl: string;
}

type DirItem = ImageItem | VideoItem | DocumentItem | AudioItem;

const initialItems: DirItem[] = [
  { id: "i1", type: "images", title: "Behind the Scenes", username: "Sarah", uploadDate: "2024-12-10", views: 240, tags: ["bts"], thumbnailUrl: "/placeholder/640x360.png" },
  { id: "i2", type: "images", title: "Location Scout", username: "Raj", uploadDate: "2024-12-05", views: 180, thumbnailUrl: "/placeholder/640x360.png" },
  { id: "v1", type: "videos", title: "Lighting Breakdown", username: "Amelia", uploadDate: "2024-12-08", views: 520, thumbnailUrl: "/placeholder/640x360.png", videoUrl: "/placeholder/640x360.mp4" },
  { id: "d1", type: "documents", title: "Final Script.pdf", username: "Alex", uploadDate: "2024-11-30", views: 98, fileUrl: "/placeholder/script.pdf", ext: "pdf" },
  { id: "a1", type: "audios", title: "Theme Track (Demo)", username: "Priya", uploadDate: "2024-12-01", views: 305, audioUrl: "/placeholder/audio.mp3" },
];

export default function DirectoryPage() {
  const [activeTab, setActiveTab] = useState<DirType>("images");
  const [items, setItems] = useState<DirItem[]>(initialItems);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "viewed" | "date">("recent");
  const [dateFilter, setDateFilter] = useState<"all" | "7d" | "30d">("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [showUpload, setShowUpload] = useState(false);

  const filtered = useMemo(() => {
    const now = new Date();
    const cutoffDays = dateFilter === "7d" ? 7 : dateFilter === "30d" ? 30 : 10000;
    const byTab = items.filter((it) => it.type === activeTab);
    const byDate = byTab.filter((it) => {
      if (dateFilter === "all") return true;
      const d = new Date(it.uploadDate);
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= cutoffDays;
    });
    const byQuery = byDate.filter((it) => {
      const q = query.toLowerCase();
      return (
        it.title.toLowerCase().includes(q) ||
        it.username.toLowerCase().includes(q) ||
        (it.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
    const sorted = [...byQuery].sort((a, b) => {
      if (sortBy === "viewed") return b.views - a.views;
      if (sortBy === "date") return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      // recent: keep as-is (assuming items list roughly recent-first in this demo)
      return 0;
    });
    return sorted;
  }, [items, activeTab, query, sortBy, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetPaging() {
    setPage(1);
  }

  function handleTabChange(tab: DirType) {
    setActiveTab(tab);
    resetPaging();
  }

  // Upload modal state
  const [upType, setUpType] = useState<DirType>("images");
  const [upTitle, setUpTitle] = useState("");
  const [upDesc, setUpDesc] = useState("");
  const [upTags, setUpTags] = useState("");
  const [upUrl, setUpUrl] = useState("");

  const canUpload = upTitle.trim().length > 0 && upUrl.trim().length > 0;

  function handleUpload() {
    if (!canUpload) return;
    const base: BaseItem = {
      id: String(Date.now()),
      title: upTitle,
      username: "You",
      uploadDate: new Date().toISOString().slice(0, 10),
      views: 0,
      tags: upTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    let newItem: DirItem;
    if (upType === "images") {
      newItem = { ...(base as any), type: "images", thumbnailUrl: upUrl } as ImageItem;
    } else if (upType === "videos") {
      newItem = { ...(base as any), type: "videos", thumbnailUrl: "/placeholder/640x360.png", videoUrl: upUrl } as VideoItem;
    } else if (upType === "documents") {
      const ext = upUrl.split(".").pop() || "doc";
      newItem = { ...(base as any), type: "documents", fileUrl: upUrl, ext } as DocumentItem;
    } else {
      newItem = { ...(base as any), type: "audios", audioUrl: upUrl } as AudioItem;
    }
    setItems([newItem, ...items]);
    setShowUpload(false);
    setUpTitle("");
    setUpDesc("");
    setUpTags("");
    setUpUrl("");
    setUpType("images");
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Directory</h1>
            <p className="text-muted-foreground">Browse and share images, videos, documents, and audio</p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, username, or tags"
                value={query}
                onChange={(e) => { setQuery(e.target.value); resetPaging(); }}
                className="pl-10"
              />
            </div>
            <select
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value as any); resetPaging(); }}
              className="border border-border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="all">All Dates</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as any); resetPaging(); }}
              className="border border-border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="recent">Most Recent</option>
              <option value="viewed">Most Viewed</option>
              <option value="date">Upload Date</option>
            </select>
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: "images", label: "Images", icon: ImageIcon },
            { id: "videos", label: "Videos", icon: VideoIcon },
            { id: "documents", label: "Documents", icon: FileText },
            { id: "audios", label: "Audios", icon: Music },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as DirType)}
              className={`px-6 py-3 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {pageItems.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found in this category</h3>
            <p className="text-muted-foreground">Be the first to upload!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pageItems.map((it) => (
              <Card key={it.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base line-clamp-1">{it.title}</CardTitle>
                  <CardDescription className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {it.username}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {it.uploadDate}</span>
                    <Badge variant="outline">{it.views} views</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {it.type === "images" && (
                    <div className="rounded-md overflow-hidden border border-border">
                      <img src={(it as ImageItem).thumbnailUrl} alt={it.title} className="w-full object-cover" />
                    </div>
                  )}
                  {it.type === "videos" && (
                    <div className="rounded-md overflow-hidden border border-border relative">
                      <img src={(it as VideoItem).thumbnailUrl} alt={it.title} className="w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-10 h-10 text-white drop-shadow" />
                      </div>
                    </div>
                  )}
                  {it.type === "documents" && (
                    <div className="rounded-md overflow-hidden border border-border flex items-center justify-center h-40">
                      <FileText className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  {it.type === "audios" && (
                    <div className="rounded-md overflow-hidden border border-border p-3">
                      <audio src={(it as AudioItem).audioUrl} controls className="w-full" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {(it.tags || []).slice(0, 3).map((t, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">#{t}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 px-2">
                        {it.type === "videos" ? <Play className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 px-2">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 px-2">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Upload Content</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>Close</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title *</label>
                    <Input value={upTitle} onChange={(e) => setUpTitle(e.target.value)} placeholder="Enter title" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type *</label>
                    <select
                      value={upType}
                      onChange={(e) => setUpType(e.target.value as DirType)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                    >
                      <option value="images">Image</option>
                      <option value="videos">Video</option>
                      <option value="documents">Document</option>
                      <option value="audios">Audio</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={upDesc}
                    onChange={(e) => setUpDesc(e.target.value)}
                    placeholder="Add a short description"
                    className="w-full min-h-[80px] border border-border rounded-md bg-background px-3 py-2 text-sm resize-y"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input value={upTags} onChange={(e) => setUpTags(e.target.value)} placeholder="e.g., bts, promo, soundtrack" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL *</label>
                    <Input value={upUrl} onChange={(e) => setUpUrl(e.target.value)} placeholder="Paste file URL (image/video/doc/audio)" />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
                  <Button disabled={!canUpload} onClick={handleUpload}>Upload</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
