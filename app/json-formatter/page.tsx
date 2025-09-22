"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, CheckCircle, XCircle } from "lucide-react";

export default function JsonFormatterPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [error, setError] = useState("");

    const formatJson = () => {
        if (!input.trim()) {
            toast.error("Please enter some JSON to format.");
            return;
        }
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setOutput(formatted);
            setIsValid(true);
            setError("");
        } catch (err) {
            setIsValid(false);
            setError(err instanceof Error ? err.message : "Invalid JSON");
            setOutput("");
        }
    };

    const minifyJson = () => {
        if (!input.trim()) {
            toast.error("Please enter some JSON to minify.");
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setIsValid(true);
            setError("");
        } catch (err) {
            setIsValid(false);
            setError(err instanceof Error ? err.message : "Invalid JSON");
            setOutput("");
        }
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        toast.success("JSON copied to clipboard.");
    };

    const handleReset = () => {
        setInput("");
        setOutput("");
        setIsValid(null);
        setError("");
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold gradient-text">Json Formatter</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Input JSON
                        <div className="flex items-center space-x-2">
                            {isValid !== null && (
                                <Badge variant={isValid ? "default" : "destructive"} className="flex items-center">
                                    {isValid ? (
                                        <>
                                            <CheckCircle className="h-3 w-3 mr-1" /> Valid
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-3 w-3 mr-1" /> Invalid
                                        </>
                                    )}
                                </Badge>
                            )}
                            <Button onClick={formatJson} size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                                Format
                            </Button>
                            <Button onClick={minifyJson} variant="outline" size="sm">
                                Minify
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder='{"key": "value", "array": [1, 2, 3]}'
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setIsValid(null);
                            setError("");
                        }}
                        className="code-font"
                    />
                    {error && (
                        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Formatted JSON
                        <div className="space-x-2">
                            {output && (
                                <Button
                                    onClick={() => handleCopy(output)}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                            )}
                            <Button onClick={handleReset} variant="outline" size="sm">
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted/50 rounded-md p-4 code-font text-sm">
                        {output ? (
                            <pre className="whitespace-pre-wrap text-foreground">{output}</pre>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                Formatted JSON will appear here
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}