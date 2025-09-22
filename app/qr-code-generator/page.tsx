"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { QrCode, Download, Copy, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function QrCodeGeneratorPage() {
    const [text, setText] = useState("https://daew-craft.vercel.app");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [size, setSize] = useState(256);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateQrCode = async () => {
        if (!text.trim()) {
            toast.error("Please enter text to generate QR code.");
            return;
        }

        try {
            const qrUrl = await QRCode.toDataURL(text, {
                width: size,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#FFFFFF"
                }
            });
            setQrCodeUrl(qrUrl);

            // Also generate to canvas for download functionality
            if (canvasRef.current) {
                await QRCode.toCanvas(canvasRef.current, text, {
                    width: size,
                    margin: 2,
                    color: {
                        dark: "#000000",
                        light: "#FFFFFF"
                    }
                });
            }
        } catch (error) {
            toast.error("Failed to generate QR code.");
            console.error(error);
        }
    };

    const downloadQrCode = () => {
        if (!canvasRef.current) {
            toast.error("No QR code to download.");
            return;
        }

        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = `qrcode-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        toast.success("QR code downloaded successfully.");
    };

    const copyQrCode = async () => {
        if (!qrCodeUrl) {
            toast.error("No QR code to copy.");
            return;
        }
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
        ]);
        toast.success("QR code copied to clipboard.");
    };

    const handleReset = () => {
        setText("https://daew-craft.vercel.app");
        setQrCodeUrl("");
        setSize(256);
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold gradient-text">QR Code Generator</h1>

            <Card>
                <CardHeader>
                    <CardTitle>QR Code Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Text Input */}
                    <div className="space-y-2">
                        <Label htmlFor="qr-text" className="text-sm font-medium">
                            Text or URL to encode
                        </Label>
                        <Input
                            id="qr-text"
                            placeholder="Enter text, URL, or any content you want to encode..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    {/* Size Slider */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">QR Code Size: {size}px</Label>
                        <Slider
                            value={[size]}
                            onValueChange={(value) => setSize(value[0])}
                            max={512}
                            min={128}
                            step={32}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>128px</span>
                            <span>512px</span>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center space-x-2">
                        <Button onClick={generateQrCode} className="bg-success text-success-foreground hover:bg-success/90">
                            <QrCode className="h-4 w-4 mr-2" />
                            Generate QR Code
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* QR Code Result */}
            {qrCodeUrl && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Generated QR Code
                            <div className="space-x-2">
                                <Button onClick={copyQrCode} variant="outline" size="sm">
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                                <Button onClick={downloadQrCode} variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <div className="bg-white p-4 rounded-lg shadow-sm border">
                                <img
                                    src={qrCodeUrl}
                                    alt="Generated QR Code"
                                    className="max-w-full h-auto"
                                    style={{ width: size, height: size }}
                                />
                            </div>
                        </div>

                        {/* Hidden canvas for download functionality */}
                        <canvas
                            ref={canvasRef}
                            style={{ display: "none" }}
                            width={size}
                            height={size}
                        />

                        {/* QR Code Info */}
                        <div className="text-sm text-muted-foreground space-y-1 text-center">
                            <p>Size: {size} × {size} pixels</p>
                            <p>Content: {text.length > 50 ? `${text.substring(0, 50)}...` : text}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Card */}
            <Card className="bg-muted/20">
                <CardHeader>
                    <CardTitle className="text-lg">About QR Codes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <p>
                            QR (Quick Response) codes are two-dimensional barcodes that can store various types of data including:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Website URLs and links</li>
                            <li>Plain text messages</li>
                            <li>Contact information (vCard)</li>
                            <li>Wi-Fi network credentials</li>
                            <li>Email addresses and phone numbers</li>
                            <li>SMS messages</li>
                        </ul>
                        <p className="text-muted-foreground">
                            Simply scan the generated QR code with any QR code reader or smartphone camera to access the encoded content.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}