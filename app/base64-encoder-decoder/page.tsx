"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, ArrowUpDown } from "lucide-react";


const sampleData = {
    text: "Hello, DevTools Hub! This is a sample text for Base64 encoding demonstration.",
    base64: "SGVsbG8sIERldlRvb2xzIEh1YiEgVGhpcyBpcyBhIHNhbXBsZSB0ZXh0IGZvciBCYXNlNjQgZW5jb2RpbmcgZGVtb25zdHJhdGlvbi4="
};

export default function Base64EncoderDecoderPage() {
    const [input, setInput] = useState(sampleData.text);
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");

    const handleEncode = () => {
        if (!input.trim()) {
            toast.error("Please enter text to encode.");
            return;
        }
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
    };


    const handleDecode = () => {
        if (!input.trim()) {
            toast.error("Please enter Base64 text to decode.");
            return;
        }
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
    };

    const handleProcess = () => {
        if (mode === "encode") {
            handleEncode();
        } else {
            handleDecode();
        }
    };

    const toggleMode = () => {
        const newMode = mode === "encode" ? "decode" : "encode";
        setMode(newMode);
        setInput(newMode === "encode" ? sampleData.text : sampleData.base64);
        setOutput("");
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        toast.success("Text copied to clipboard.");
    };

    const handleReset = () => {
        setInput(mode === "encode" ? sampleData.text : sampleData.base64);
        setOutput("");
    };

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold gradient-text">Base64 Encoder/Decoder</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span>Mode: {mode === "encode" ? "Encode" : "Decode"}</span>
                            <Button
                                onClick={toggleMode}
                                variant="outline"
                                size="sm"
                                className="ml-2"
                            >
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                Switch to {mode === "encode" ? "Decode" : "Encode"}
                            </Button>
                        </div>
                        <div className="space-x-2">
                            <Button onClick={handleProcess} size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                                {mode === "encode" ? "Encode" : "Decode"}
                            </Button>
                            <Button onClick={handleReset} variant="outline" size="sm">
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
                        </label>
                        <Textarea
                            placeholder={mode === "encode"
                                ? "Enter your text here..."
                                : "Enter Base64 encoded text here..."
                            }
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="min-h-32 code-font"
                        />
                    </div>

                    {output && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">
                                    {mode === "encode" ? "Base64 Encoded" : "Decoded Text"}
                                </label>
                                <Button
                                    onClick={() => handleCopy(output)}
                                    variant="ghost"
                                    size="sm"
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                            </div>
                            <div className="bg-muted/50 rounded-md p-4 code-font text-sm">
                                <pre className="whitespace-pre-wrap break-all">{output}</pre>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info card */}
            <Card className="bg-muted/20">
                <CardHeader>
                    <CardTitle className="text-lg">About Base64</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <p>
                            Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
                        </p>
                        <p>
                            <strong>Common uses:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Encoding binary data for transmission over text-based protocols</li>
                            <li>Embedding images in CSS or HTML (data URLs)</li>
                            <li>Storing binary data in databases that only support text</li>
                            <li>API authentication tokens</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}