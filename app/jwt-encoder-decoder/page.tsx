"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RotateCcw, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

const sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtEncoderDecoderPage() {
    const [jwtInput, setJwtInput] = useState(sampleJWT);
    const [headerInput, setHeaderInput] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
    const [payloadInput, setPayloadInput] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
    const [secretInput, setSecretInput] = useState("your-256-bit-secret");
    const [decodedHeader, setDecodedHeader] = useState("");
    const [decodedPayload, setDecodedPayload] = useState("");
    const [encodedJWT, setEncodedJWT] = useState("");
    const [isValidJWT, setIsValidJWT] = useState<boolean | null>(null);
    const [showSecret, setShowSecret] = useState(false);
    const [error, setError] = useState("");

    const base64UrlEncode = (str: string) => {
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    };

    const base64UrlDecode = (str: string) => {
        // Replace URL-safe characters with standard Base64 characters
        str = str.replace(/-/g, '+').replace(/_/g, '/');

        // Add padding if needed
        while (str.length % 4) {
            str += '=';
        }

        return atob(str);
    };

    const decodeJWT = () => {
        if (!jwtInput.trim()) {
            toast.error("Please enter a JWT token to decode.");
            return;
        }

        try {
            const parts = jwtInput.split('.');
            if (parts.length !== 3) {
                throw new Error("Invalid JWT format. JWT should have 3 parts separated by dots.");
            }

            const header = JSON.parse(base64UrlDecode(parts[0]));
            const payload = JSON.parse(base64UrlDecode(parts[1]));

            setDecodedHeader(JSON.stringify(header, null, 2));
            setDecodedPayload(JSON.stringify(payload, null, 2));
            setIsValidJWT(true);
            setError("");
        } catch (err) {
            setIsValidJWT(false);
            setError(err instanceof Error ? err.message : "Invalid JWT");
            setDecodedHeader("");
            setDecodedPayload("");
        }
    };

    const encodeJWT = () => {
        try {
            const header = JSON.parse(headerInput);
            const payload = JSON.parse(payloadInput);

            const encodedHeader = base64UrlEncode(JSON.stringify(header));
            const encodedPayload = base64UrlEncode(JSON.stringify(payload));

            const signature = base64UrlEncode(`HMACSHA256(${encodedHeader}.${encodedPayload},${secretInput})`);

            const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;
            setEncodedJWT(jwt);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid JSON in header or payload");
            setEncodedJWT("");
        }
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard.");
    };

    const handleReset = () => {
        setJwtInput(sampleJWT);
        setHeaderInput('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
        setPayloadInput('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
        setSecretInput("your-256-bit-secret");
        setDecodedHeader("");
        setDecodedPayload("");
        setEncodedJWT("");
        setIsValidJWT(null);
        setError("");
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold gradient-text">JWT Encoder/Decoder</h1>

            <Tabs defaultValue="decode" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="decode">Decode JWT</TabsTrigger>
                    <TabsTrigger value="encode">Encode JWT</TabsTrigger>
                </TabsList>

                <TabsContent value="decode" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                JWT Token
                                <div className="flex items-center space-x-2">
                                    {isValidJWT !== null && (
                                        <Badge variant={isValidJWT ? "default" : "destructive"} className="flex items-center">
                                            {isValidJWT ? (
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
                                    <Button onClick={decodeJWT} size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                                        Decode
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Paste your JWT token here..."
                                value={jwtInput}
                                onChange={(e) => {
                                    setJwtInput(e.target.value);
                                    setIsValidJWT(null);
                                    setError("");
                                }}
                                className="code-font min-h-32"
                            />
                            {error && (
                                <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-lg">
                                    Header
                                    {decodedHeader && (
                                        <Button
                                            onClick={() => handleCopy(decodedHeader)}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/50 rounded-md p-4 code-font text-sm">
                                    {decodedHeader ? (
                                        <pre className="whitespace-pre-wrap text-foreground">{decodedHeader}</pre>
                                    ) : (
                                        <div className="text-muted-foreground">Decoded header will appear here</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-lg">
                                    Payload
                                    {decodedPayload && (
                                        <Button
                                            onClick={() => handleCopy(decodedPayload)}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/50 rounded-md p-4 code-font text-sm">
                                    {decodedPayload ? (
                                        <pre className="whitespace-pre-wrap text-foreground">{decodedPayload}</pre>
                                    ) : (
                                        <div className="text-muted-foreground">Decoded payload will appear here</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="encode" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Header</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={headerInput}
                                    onChange={(e) => setHeaderInput(e.target.value)}
                                    className="code-font min-h-32"
                                    placeholder='{"alg": "HS256", "typ": "JWT"}'
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Payload</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={payloadInput}
                                    onChange={(e) => setPayloadInput(e.target.value)}
                                    className="code-font min-h-32"
                                    placeholder='{"sub": "1234567890", "name": "John Doe"}'
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Secret</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2">
                                <div className="flex-1 relative">
                                    <input
                                        type={showSecret ? "text" : "password"}
                                        value={secretInput}
                                        onChange={(e) => setSecretInput(e.target.value)}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm code-font"
                                        placeholder="Enter your secret key..."
                                    />
                                </div>
                                <Button
                                    onClick={() => setShowSecret(!showSecret)}
                                    variant="outline"
                                    size="sm"
                                >
                                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center space-x-2">
                        <Button onClick={encodeJWT} className="bg-success text-success-foreground hover:bg-success/90">
                            Generate JWT
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>

                    {encodedJWT && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Generated JWT
                                    <Button
                                        onClick={() => handleCopy(encodedJWT)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/50 rounded-md p-4 code-font text-sm">
                                    <pre className="whitespace-pre-wrap break-all">{encodedJWT}</pre>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {error && (
                        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                            {error}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <Card className="bg-muted/20">
                <CardHeader>
                    <CardTitle className="text-lg">About JWT</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <p>
                            JSON Web Token (JWT) is an open standard for securely transmitting information between parties as a JSON object.
                        </p>
                        <p>
                            <strong>JWT Structure:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li><strong>Header:</strong> Contains the signing algorithm and token type</li>
                            <li><strong>Payload:</strong> Contains the claims (user data)</li>
                            <li><strong>Signature:</strong> Used to verify the token hasn't been changed</li>
                        </ul>
                        <p className="text-amber-600 dark:text-amber-400">
                            <strong>Note:</strong> This tool provides a simplified JWT encoder for demonstration.
                            In production, use proper cryptographic libraries for signature generation and verification.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}