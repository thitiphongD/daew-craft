"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { SEARCH_DATA, type NavigationItem } from "@/lib/navigation-data";

interface SearchModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<NavigationItem[]>([]);
    const router = useRouter();

    const performSearch = (query: string) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const filtered = SEARCH_DATA.filter(item => {
            const searchTerm = query.toLowerCase();
            return (
                item.title.toLowerCase().includes(searchTerm) ||
                item.description!.toLowerCase().includes(searchTerm) ||
                item.category!.toLowerCase().includes(searchTerm) ||
                item.keywords!.some(keyword => keyword.toLowerCase().includes(searchTerm))
            );
        });

        setResults(filtered);
    };

    const handleResultClick = (url: string) => {
        router.push(url);
        onClose();
        setSearchQuery("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        } else if (e.key === "Enter" && results.length > 0) {
            handleResultClick(results[0].url);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setSearchQuery("");
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        performSearch(searchQuery);
    }, [searchQuery]);

    const getCategoryColor = (category: string | undefined) => {
        if (!category) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";

        switch (category) {
            case "Data Tools": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "Encoding Tools": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "Security Tools": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            case "Generator Tools": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            case "Network Tools": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
            case "Development Tools": return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
            case "Text Tools": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Search className="h-5 w-5 mr-2" />
                        Search Tools
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search for tools, features, or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pl-10"
                            autoFocus
                        />
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {(() => {
                            if (searchQuery && results.length === 0) {
                                return (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No tools found for "{searchQuery}"</p>
                                        <p className="text-sm mt-1">Try different keywords or browse all tools</p>
                                    </div>
                                );
                            }

                            if (searchQuery === "") {
                                return (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground mb-3">All Tools</h4>
                                        {SEARCH_DATA.map((item) => {
                                            const IconComponent = item.icon;
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleResultClick(item.url)}
                                                    className="flex items-start p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors w-full text-left"
                                                    type="button"
                                                    aria-label={`Go to ${item.title} - ${item.description}`}
                                                >
                                                    <IconComponent className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h3 className="font-medium text-sm">{item.title}</h3>
                                                            <Badge variant="outline" className={`text-xs ${getCategoryColor(item.category)}`}>
                                                                {item.category}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            }

                            return (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-muted-foreground mb-3">
                                        Search Results ({results.length})
                                    </h4>
                                    {results.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleResultClick(item.url)}
                                                className="flex items-start p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors w-full text-left"
                                                type="button"
                                                aria-label={`Go to ${item.title} - ${item.description}`}
                                            >
                                                <IconComponent className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-medium text-sm">{item.title}</h3>
                                                        <Badge variant="outline" className={`text-xs ${getCategoryColor(item.category)}`}>
                                                            {item.category}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>

                    {searchQuery && (
                        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                            Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">Enter</kbd> to go to first result or <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">Esc</kbd> to close
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}