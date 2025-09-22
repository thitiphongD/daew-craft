"use client";

import { Button } from "@/components/ui/button";
import { mockSnippets } from "@/mock-data/snippets";
import { Grid, List } from "lucide-react";
import { useState } from "react";
import SnippetCard from "./SnippetCard";

export default function SnippetsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold gradient-text">Code Snippets</h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className={`grid gap-6 ${viewMode === "grid"
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1"
                }`}>
                {mockSnippets.map((snippet) => (
                    <SnippetCard
                        key={snippet.id}
                        snippet={snippet}
                    />
                ))}
            </div>
        </div>
    )
}