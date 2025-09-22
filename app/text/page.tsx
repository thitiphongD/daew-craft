"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, RotateCcw } from "lucide-react";

const transformations = [
    { name: "lowercase", label: "lowercase", fn: (text: string) => text.toLowerCase() },
    { name: "uppercase", label: "UPPERCASE", fn: (text: string) => text.toUpperCase() },
    { name: "titlecase", label: "Title Case", fn: (text: string) => text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) },
    { name: "camelcase", label: "camelCase", fn: (text: string) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '') },
    { name: "snakecase", label: "snake_case", fn: (text: string) => text.toLowerCase().replace(/\s+/g, '_') },
    { name: "kebabcase", label: "kebab-case", fn: (text: string) => text.toLowerCase().replace(/\s+/g, '-') },
];

export default function TextPage() {

    const [inputText, setInputText] = useState("");
    const [results, setResults] = useState<Record<string, string>>({});

    const handleTransform = () => {
        if (!inputText.trim()) {
            toast.error("Please enter some text to transform.")
            return;
        }
        const newResults: Record<string, string> = {};
        transformations.forEach((transform) => {
            newResults[transform.name] = transform.fn(inputText);
        });
        setResults(newResults);
    };

    const handleCopy = async (text: string, type: string) => {
        await navigator.clipboard.writeText(text);
        toast.success(`${type} copied to clipboard.`);
    };

    const handleReset = () => {
        setInputText("");
        setResults({});
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold gradient-text">Text Transform</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <p className="font-medium">Input Text</p>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleTransform}
                                size="sm"
                            >
                                Transform
                            </Button>
                            <Button
                                onClick={handleReset}
                                size="sm"
                                variant="outline"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Enter your text here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-32 code-font"
                    />
                </CardContent>
            </Card>

            {Object.keys(results).length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                    {transformations.map((transform) => (
                        <Card key={transform.name} className="bg-muted/20">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <Label className="font-medium">{transform.label}</Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopy(results[transform.name], transform.label)}
                                        className="h-8 px-2"
                                    >
                                        <Copy className="h-3 w-3 mr-1" />
                                        Copy
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <pre className="bg-card rounded-md p-3 text-sm code-font whitespace-pre-wrap break-all">
                                    {results[transform.name]}
                                </pre>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}