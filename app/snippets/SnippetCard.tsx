import { useState } from "react";
import { Copy, Heart, Edit, Trash2, Eye, Calendar, Tag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SyntaxHighlighter } from "@/components/syntax-highlighter";

interface SnippetCardProps {
    readonly snippet: {
        id: string;
        title: string;
        language: string;
        description: string;
        code: string;
        tags: string[];
        createdAt: string;
        isFavorite: boolean;
    };
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
    const [showFullCode, setShowFullCode] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(snippet.code);
        toast.success("Copied to clipboard");
    };

    const truncatedCode = snippet.code.length > 150
        ? snippet.code.substring(0, 150) + "..."
        : snippet.code;

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg leading-none tracking-tight">
                            {snippet.title}
                        </h3>
                        {snippet.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {snippet.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={snippet.isFavorite ? "text-warning" : "text-muted-foreground"}
                        >
                            <Heart className={`h-4 w-4 ${snippet.isFavorite ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                            {snippet.language}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(snippet.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    {snippet.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <div className="flex space-x-1">
                                {snippet.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                                {snippet.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{snippet.tags.length - 2}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="relative">
                    <SyntaxHighlighter
                        code={showFullCode ? snippet.code : truncatedCode}
                        language={snippet.language}
                        className="rounded-md text-sm overflow-x-auto custom-scrollbar"
                    />

                    <div className="absolute top-2 right-2 flex space-x-1">
                        {snippet.code.length > 150 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFullCode(!showFullCode)}
                                className="h-6 px-2 text-xs bg-background/50 backdrop-blur"
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                {showFullCode ? "Less" : "More"}
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs bg-background/50 backdrop-blur"
                            onClick={handleCopy}
                        >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}