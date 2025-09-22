"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, ArrowUpDown } from "lucide-react";

const sampleUrls = {
    encode: "https://example.com/search?q=hello world&category=development tools",
    decode: "https%3A//example.com/search%3Fq%3Dhello%20world%26category%3Ddevelopment%20tools"
};

export default function UrlEncoderDecoderPage() {
    const [input, setInput] = useState(sampleUrls.encode);
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");

    const handleEncode = () => {
        if (!input.trim()) {
            toast.error("Please enter a URL to encode.");
            return;
        }
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
    };

    const handleDecode = () => {
        if (!input.trim()) {
            toast.error("Please enter a URL to decode.");
            return;
        }
        const decoded = decodeURIComponent(input);
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
        setInput(newMode === "encode" ? sampleUrls.encode : sampleUrls.decode);
        setOutput("");
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        toast.success("URL copied to clipboard.");
    };

    const handleReset = () => {
        setInput(mode === "encode" ? sampleUrls.encode : sampleUrls.decode);
        setOutput("");
    };

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold gradient-text">Url Encoder/Decoder</h1>
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
                            {mode === "encode" ? "URL to Encode" : "URL to Decode"}
                        </label>
                        <Textarea
                            placeholder={mode === "encode"
                                ? "https://example.com/search?q=hello world"
                                : "https%3A//example.com/search%3Fq%3Dhello%20world"
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
                                    {mode === "encode" ? "Encoded URL" : "Decoded URL"}
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

            {/* Common URL encoding reference */}
            <Card className="bg-muted/20">
                <CardHeader>
                    <CardTitle className="text-lg">Common URL Encoding Reference</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h4 className="font-medium mb-2">Special Characters</h4>
                            <div className="space-y-1 text-sm code-font">
                                <div>Space: %20</div>
                                <div>!: %21</div>
                                <div>": %22</div>
                                <div>#: %23</div>
                                <div>$: %24</div>
                                <div>%: %25</div>
                                <div>&: %26</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Common Symbols</h4>
                            <div className="space-y-1 text-sm code-font">
                                <div>+: %2B</div>
                                <div>/: %2F</div>
                                <div>=: %3D</div>
                                <div>?: %3F</div>
                                <div>@: %40</div>
                                <div>[: %5B</div>
                                <div>]: %5D</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}