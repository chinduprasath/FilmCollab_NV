"use client";

import React, { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  AtSign,
  Hash,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Search,
  Filter,
  Clock,
  Flame,
  Users,
} from "lucide-react";

type MediaType = "none" | "image" | "video";

interface PostComment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies?: PostComment[];
}

interface PostItem {
  id: string;
  user: string;
  avatar: string;
  timestamp: string;
  content: string;
  hashtags?: string[];
  mediaType?: MediaType;
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  saved?: boolean;
  network?: boolean;
  commentsThread?: PostComment[];
}

const samplePosts: PostItem[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    avatar: "SJ",
    timestamp: "2h",
    content: "Wrapped the final cut today! Huge thanks to the amazing crew. #postproduction #editing",
    hashtags: ["postproduction", "editing"],
    mediaType: "image",
    mediaUrl: "/placeholder/800x450.png",
    likes: 128,
    comments: 14,
    shares: 7,
    saved: false,
    network: true,
    commentsThread: [
      {
        id: "c1",
        user: "Michael Chen",
        avatar: "MC",
        content: "Congrats! The color looks fantastic.",
        timestamp: "1h",
        replies: [
          {
            id: "c1r1",
            user: "Sarah Johnson",
            avatar: "SJ",
            content: "Thanks Michael! Grading took a while but worth it.",
            timestamp: "55m",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    user: "Raj Patel",
    avatar: "RP",
    timestamp: "6h",
    content: "Casting call for our short film in Mumbai next week. DM if interested! #casting #shortfilm",
    hashtags: ["casting", "shortfilm"],
    mediaType: "none",
    likes: 64,
    comments: 9,
    shares: 3,
    saved: true,
    network: false,
  },
  {
    id: "3",
    user: "Amelia Brown",
    avatar: "AB",
    timestamp: "1d",
    content: "How we lit the rooftop scene using only practicals. Breakdown video below.",
    mediaType: "video",
    mediaUrl: "/placeholder/800x450.mp4",
    likes: 210,
    comments: 32,
    shares: 18,
    saved: false,
    network: true,
  },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<PostItem[]>(samplePosts);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "popular" | "network">("recent");
  const [composerText, setComposerText] = useState("");
  const [composerMediaType, setComposerMediaType] = useState<MediaType>("none");
  const [composerMediaUrl, setComposerMediaUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "published" | "saved">("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    let list = [...posts];
    // Tab filters
    if (activeTab === "trending") {
      list = list.filter((p) => p.likes + p.comments + p.shares >= 50);
    } else if (activeTab === "published") {
      list = list.filter((p) => p.network); // demo: treat network flag as "published by me/team"
    } else if (activeTab === "saved") {
      list = list.filter((p) => p.saved);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.content.toLowerCase().includes(q) || (p.hashtags || []).some((h) => `#${h}`.toLowerCase().includes(q))
      );
    }
    if (sort === "popular") {
      list.sort((a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares));
    } else if (sort === "network") {
      list = list.filter((p) => p.network);
    } else {
      // recent: assume array order is recent first in this demo
    }
    return list;
  }, [posts, query, sort]);

  const canPost = composerText.trim().length > 0 || (composerMediaType !== "none" && composerMediaUrl.trim().length > 0);

  function handlePost() {
    if (!canPost) return;
    const newPost: PostItem = {
      id: String(Date.now()),
      user: "You",
      avatar: "YY",
      timestamp: "Just now",
      content: composerText,
      mediaType: composerMediaType,
      mediaUrl: composerMediaUrl || undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      saved: false,
      network: true,
      hashtags: (composerText.match(/#[\w-]+/g) || []).map((t) => t.replace('#', '')),
    };
    setPosts([newPost, ...posts]);
    setComposerText("");
    setComposerMediaType("none");
    setComposerMediaUrl("");
  }

  function toggleLike(id: string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  }

  function toggleSave(id: string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)));
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Posts</h1>
            <p className="text-muted-foreground">Share updates, work-in-progress, and ideas with the community</p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts or #hashtags"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="border border-border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="network">My Network</option>
            </select>
            <Button onClick={() => setShowCreate(true)}>Create Post</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: "all", label: "All Posts" },
            { id: "trending", label: "Trending Posts" },
            { id: "published", label: "Published Posts" },
            { id: "saved", label: "Saved Posts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feed */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Start by creating one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-semibold">
                        {post.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-base">{post.user}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-xs"><Clock className="w-3 h-3" /> {post.timestamp}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                  {post.mediaType === "image" && post.mediaUrl && (
                    <div className="rounded-md overflow-hidden border border-border">
                      <img src={post.mediaUrl} alt="post media" className="w-full object-cover" />
                    </div>
                  )}
                  {post.mediaType === "video" && post.mediaUrl && (
                    <div className="rounded-md overflow-hidden border border-border">
                      <video src={post.mediaUrl} controls className="w-full" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground" onClick={() => toggleLike(post.id)}>
                        <Heart className="w-4 h-4" /> Like
                      </button>
                      <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                        <MessageCircle className="w-4 h-4" /> Comment
                      </a>
                      <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                        <Share2 className="w-4 h-4" /> Share
                      </a>
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground" onClick={() => toggleSave(post.id)}>
                        <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-current' : ''}`} /> Save
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>

                  {/* Comments */}
                  {post.commentsThread && post.commentsThread.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">View comments</summary>
                      <div className="mt-3 space-y-3">
                        {post.commentsThread.map((c) => (
                          <div key={c.id} className="pl-0">
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold">
                                {c.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{c.user} <span className="ml-2 text-xs text-muted-foreground">{c.timestamp}</span></div>
                                <div className="text-sm">{c.content}</div>
                              </div>
                            </div>
                            {c.replies && c.replies.length > 0 && (
                              <div className="mt-2 pl-6 space-y-2">
                                {c.replies.map((r) => (
                                  <div key={r.id} className="flex items-start gap-2">
                                    <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-semibold">
                                      {r.avatar}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium">{r.user} <span className="ml-2 text-xs text-muted-foreground">{r.timestamp}</span></div>
                                      <div className="text-sm">{r.content}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        {/* Reply box (static demo) */}
                        <div className="flex items-center gap-2">
                          <Input placeholder="Write a comment..." />
                          <Button size="sm" variant="outline">Reply</Button>
                        </div>
                      </div>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Post Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Create Post</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
                </div>
                <div className="space-y-3">
                  <textarea
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    placeholder="Write something... Use #hashtags and @mentions"
                    className="w-full min-h-[120px] border border-border rounded-md bg-background px-3 py-2 text-sm resize-y"
                  />
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setComposerMediaType("image")}>
                      <ImageIcon className="w-4 h-4 mr-2" /> Image URL
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setComposerMediaType("video")}>
                      <VideoIcon className="w-4 h-4 mr-2" /> Video URL
                    </Button>
                  </div>
                  {composerMediaType !== "none" && (
                    <Input
                      placeholder={composerMediaType === "image" ? "Paste image URL" : "Paste video URL"}
                      value={composerMediaUrl}
                      onChange={(e) => setComposerMediaUrl(e.target.value)}
                    />
                  )}
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => { setComposerMediaType("none"); setComposerMediaUrl(""); setComposerText(""); setShowCreate(false); }}>Cancel</Button>
                  <Button disabled={!canPost} onClick={() => { handlePost(); setShowCreate(false); }}>Post</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}


