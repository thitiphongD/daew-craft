"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import JsBarcode from "jsbarcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, Copy, RotateCcw } from "lucide-react";

interface BarcodeFormat {
    value: string;
    label: string;
    example: string;
    description: string;
    usage: string;
}

const BARCODE_FORMATS: BarcodeFormat[] = [
    {
        value: "CODE128",
        label: "Code 128",
        example: "ABC123",
        description: "ASCII ครบ (ตัวอักษร, ตัวเลข, สัญลักษณ์)",
        usage: "Warehouse, logistics, บอร์ดดิ้งพาส, ฉลากขนส่ง"
    },
    {
        value: "CODE39",
        label: "Code 39",
        example: "ABC123",
        description: "ตัวอักษร A–Z, ตัวเลข 0–9, สัญลักษณ์บางตัว",
        usage: "อุตสาหกรรม, โลจิสติกส์, ป้ายสินทรัพย์"
    },
    {
        value: "EAN13",
        label: "EAN-13",
        example: "1234567890123",
        description: "13 หลัก",
        usage: "ใช้ในยุโรปและหลายประเทศทั่วโลก บนสินค้าทั่วไป"
    },
    {
        value: "EAN8",
        label: "EAN-8",
        example: "12345678",
        description: "8 หลัก",
        usage: "ใช้บนสินค้าขนาดเล็ก พื้นที่พิมพ์จำกัด"
    },
    {
        value: "UPC",
        label: "UPC-A",
        example: "123456789012",
        description: "12 หลัก",
        usage: "ใช้ในอเมริกา/แคนาดา สำหรับสินค้าในซูเปอร์มาร์เก็ต"
    },
    {
        value: "ITF14",
        label: "ITF (Interleaved 2 of 5)",
        example: "1234567890",
        description: "ตัวเลขคู่เท่านั้น",
        usage: "ใช้บนกล่อง, บรรจุภัณฑ์, โลจิสติกส์"
    },
    {
        value: "MSI",
        label: "MSI / Plessey",
        example: "1234567890",
        description: "ตัวเลข 0–9",
        usage: "ใช้ใน inventory, warehouse, ระบบ POS"
    },
    {
        value: "pharmacode",
        label: "Pharmacode",
        example: "12345",
        description: "ตัวเลข 3-6 หลัก",
        usage: "ใช้ในอุตสาหกรรมยา"
    },
    {
        value: "codabar",
        label: "Codabar",
        example: "A123456789B",
        description: "ตัวเลข 0–9 + A–D",
        usage: "ใช้ในธนาคารเลือด, library, logistics"
    }
];

export default function BarcodeGeneratorPage() {
    const [text, setText] = useState("123456789012");
    const [format, setFormat] = useState("CODE128");
    const [barcodeUrl, setBarcodeUrl] = useState("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [error, setError] = useState("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const selectedFormat = BARCODE_FORMATS.find(f => f.value === format);

    const validateInput = (value: string, barcodeFormat: string): boolean => {
        switch (barcodeFormat) {
            case "EAN13":
                return /^\d{13}$/.test(value);
            case "EAN8":
                return /^\d{8}$/.test(value);
            case "UPC":
                return /^\d{12}$/.test(value);
            case "ITF14":
                return /^\d+$/.test(value) && value.length % 2 === 0;
            case "MSI":
            case "pharmacode":
                return /^\d+$/.test(value);
            case "CODE39":
                return /^[A-Z0-9\-. $\/+%]+$/.test(value);
            case "codabar":
                return /^[A-D][0-9\-$:/.+]+[A-D]$/.test(value);
            case "CODE128":
            default:
                return value.length > 0;
        }
    };

    const generateBarcode = () => {
        console.log("generateBarcode called with text:", text, "format:", format);

        if (!text.trim()) {
            toast.error("Please enter text to generate barcode.");
            return;
        }

        const isValidInput = validateInput(text, format);
        console.log("Input validation result:", isValidInput);

        if (!isValidInput) {
            setIsValid(false);
            setError(`Invalid format for ${selectedFormat?.label}. Expected: ${selectedFormat?.description}`);
            setBarcodeUrl("");
            return;
        }

        try {
            console.log("Canvas ref:", canvasRef.current);
            if (canvasRef.current) {
                JsBarcode(canvasRef.current, text, {
                    format: format,
                    width: 2,
                    height: 100,
                    displayValue: true,
                    fontSize: 14,
                    margin: 10
                });

                const dataUrl = canvasRef.current.toDataURL("image/png");
                console.log("Generated dataUrl:", dataUrl.substring(0, 50) + "...");
                setBarcodeUrl(dataUrl);
                setIsValid(true);
                setError("");
            } else {
                console.log("Canvas ref is null");
            }
        } catch (err) {
            console.error("Error generating barcode:", err);
            setIsValid(false);
            setError(err instanceof Error ? err.message : "Failed to generate barcode");
            setBarcodeUrl("");
        }
    };

    const downloadBarcode = () => {
        if (!canvasRef.current || !barcodeUrl) {
            toast.error("No barcode to download.");
            return;
        }

        const link = document.createElement("a");
        link.download = `barcode-${format}-${Date.now()}.png`;
        link.href = barcodeUrl;
        link.click();
        toast.success("Barcode downloaded successfully.");
    };

    const copyBarcode = async () => {
        if (!barcodeUrl) {
            toast.error("No barcode to copy.");
            return;
        }
        const response = await fetch(barcodeUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
        ]);
        toast.success("Barcode copied to clipboard.");
    };

    const handleReset = () => {
        setText("123456789012");
        setFormat("CODE128");
        setBarcodeUrl("");
        setIsValid(null);
        setError("");
    };

    const handleFormatChange = (newFormat: string) => {
        setFormat(newFormat);
        const formatData = BARCODE_FORMATS.find(f => f.value === newFormat);
        if (formatData) {
            setText(formatData.example);
        }
        setBarcodeUrl("");
        setIsValid(null);
        setError("");
    };


    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold gradient-text">Barcode Generator</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Barcode Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Format Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Barcode Format</Label>
                        <Select value={format} onValueChange={handleFormatChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select barcode format" />
                            </SelectTrigger>
                            <SelectContent>
                                {BARCODE_FORMATS.map((fmt) => (
                                    <SelectItem key={fmt.value} value={fmt.value}>
                                        {fmt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Text Input */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="barcode-text" className="text-sm font-medium">
                                Data to encode
                            </Label>
                            {isValid !== null && (
                                <Badge variant={isValid ? "default" : "destructive"}>
                                    {isValid ? "Valid" : "Invalid"}
                                </Badge>
                            )}
                        </div>
                        <Input
                            id="barcode-text"
                            placeholder={selectedFormat?.example || "Enter data to encode..."}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="code-font"
                        />
                        {error && (
                            <div className="text-sm text-destructive">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Format Info */}
                    {selectedFormat && (
                        <div className="bg-muted/50 rounded-lg p-4 text-sm">
                            <div className="space-y-2">
                                <div>
                                    <strong>Format:</strong> {selectedFormat.label}
                                </div>
                                <div>
                                    <strong>Description:</strong> {selectedFormat.description}
                                </div>
                                <div>
                                    <strong>Usage:</strong> {selectedFormat.usage}
                                </div>
                                <div>
                                    <strong>Example:</strong> <code className="bg-background px-1 rounded">{selectedFormat.example}</code>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Generate Button */}
                    <div className="flex justify-center space-x-2">
                        <Button onClick={generateBarcode} variant="default">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Generate Barcode
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Barcode Result */}
            {barcodeUrl && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Generated Barcode
                            <div className="space-x-2">
                                <Button onClick={copyBarcode} variant="outline" size="sm">
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                                <Button onClick={downloadBarcode} variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <img
                                    src={barcodeUrl}
                                    alt="Generated Barcode"
                                    className="max-w-full h-auto"
                                />
                            </div>
                        </div>


                        {/* Barcode Info */}
                        <div className="text-sm text-muted-foreground space-y-1 text-center">
                            <p>Format: {selectedFormat?.label}</p>
                            <p>Data: {text}</p>
                            <p>Length: {text.length} characters</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Hidden canvas for generation */}
            <canvas
                ref={canvasRef}
                style={{ display: "none" }}
            />
        </div>
    );
}