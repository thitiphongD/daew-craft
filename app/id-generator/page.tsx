"use client";

import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4, v1 as uuidv1, v7 as uuidv7 } from "uuid";
import { createId } from "@paralleldrive/cuid2";
import { nanoid, customAlphabet } from "nanoid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Hash, Copy, RefreshCw, Plus } from "lucide-react";

interface IdFormat {
    value: string;
    label: string;
    description: string;
    example: string;
    characteristics: string[];
}

const ID_FORMATS: IdFormat[] = [
    {
        value: "uuid_v4",
        label: "UUID v4 (Random)",
        description: "Universally unique identifier version 4, generated using random numbers",
        example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        characteristics: ["Random", "36 characters", "Hyphenated", "RFC 4122 standard"]
    },
    {
        value: "uuid_v1",
        label: "UUID v1 (Timestamp)",
        description: "UUID based on timestamp and MAC address",
        example: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        characteristics: ["Timestamp-based", "36 characters", "Sortable", "Contains MAC address"]
    },
    {
        value: "uuid_v7",
        label: "UUID v7 (Timestamp + Random)",
        description: "Time-ordered UUID with embedded timestamp",
        example: "017f22e2-79b0-7cc3-98c4-dc0c0c07398f",
        characteristics: ["Timestamp prefix", "Sortable", "Database-friendly", "Modern standard"]
    },
    {
        value: "cuid2",
        label: "CUID2",
        description: "Collision-resistant unique identifier, optimized for databases",
        example: "ckl8x9w4x0000qzrmn831i7rn",
        characteristics: ["URL-safe", "Sortable", "No hyphens", "Collision-resistant"]
    },
    {
        value: "nanoid",
        label: "Nano ID",
        description: "Small, secure, URL-friendly unique string ID generator",
        example: "V1StGXR8_Z5jdHi6B-myT",
        characteristics: ["Compact", "URL-safe", "Customizable", "Fast generation"]
    },
    {
        value: "nanoid_custom",
        label: "Nano ID (Custom)",
        description: "Customizable Nano ID with custom alphabet and length",
        example: "ABC123XYZ789",
        characteristics: ["Custom alphabet", "Custom length", "Flexible", "Use case specific"]
    }
];


export default function IdGeneratorPage() {
    const [selectedFormat, setSelectedFormat] = useState("uuid_v4");
    const [generatedIds, setGeneratedIds] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);

    // NanoID custom settings
    const [nanoidLength, setNanoidLength] = useState(21);
    const [customAlphabets, setCustomAlphabets] = useState({
        numbers: true,
        lowercase: true,
        uppercase: true,
        symbols: false
    });

    const formatData = ID_FORMATS.find(f => f.value === selectedFormat);

    const generateCustomAlphabet = () => {
        let alphabet = "";
        if (customAlphabets.numbers) alphabet += "0123456789";
        if (customAlphabets.lowercase) alphabet += "abcdefghijklmnopqrstuvwxyz";
        if (customAlphabets.uppercase) alphabet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (customAlphabets.symbols) alphabet += "-_";
        return alphabet || "0123456789"; // fallback to numbers if nothing selected
    };

    const generateSingleId = (): string => {
        switch (selectedFormat) {
            case "uuid_v4":
                return uuidv4();
            case "uuid_v1":
                return uuidv1();
            case "uuid_v7":
                return uuidv7();
            case "cuid2":
                return createId();
            case "nanoid":
                return nanoid();
            case "nanoid_custom": {
                const customNanoid = customAlphabet(generateCustomAlphabet(), nanoidLength);
                return customNanoid();
            }
            default:
                return uuidv4();
        }
    };

    const generateIds = () => {
        const newIds: string[] = [];
        for (let i = 0; i < quantity; i++) {
            newIds.push(generateSingleId());
        }
        setGeneratedIds(newIds);
        toast.success(`Generated ${quantity} ID${quantity > 1 ? 's' : ''}`);
    };

    const copyId = async (id: string) => {
        await navigator.clipboard.writeText(id);
        toast.success("ID copied to clipboard");
    };

    const copyAllIds = async () => {
        if (generatedIds.length === 0) {
            toast.error("No IDs to copy");
            return;
        }
        const allIds = generatedIds.join('\n');
        await navigator.clipboard.writeText(allIds);
        toast.success(`Copied ${generatedIds.length} IDs to clipboard`);
    };

    const addMoreIds = () => {
        const newIds: string[] = [];
        for (let i = 0; i < quantity; i++) {
            newIds.push(generateSingleId());
        }
        setGeneratedIds([...generatedIds, ...newIds]);
        toast.success(`Added ${quantity} more ID${quantity > 1 ? 's' : ''}`);
    };

    const clearIds = () => {
        setGeneratedIds([]);
        toast.success("Cleared all IDs");
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold gradient-text">ID Generator</h1>

            <Card>
                <CardHeader>
                    <CardTitle>ID Generation Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Format Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">ID Format</Label>
                        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select ID format" />
                            </SelectTrigger>
                            <SelectContent>
                                {ID_FORMATS.map((format) => (
                                    <SelectItem key={format.value} value={format.value}>
                                        {format.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Format Info */}
                    {formatData && (
                        <div className="bg-muted/50 rounded-lg p-4 text-sm">
                            <div className="space-y-3">
                                <div>
                                    <strong>Description:</strong> {formatData.description}
                                </div>
                                <div>
                                    <strong>Example:</strong> <code className="bg-background px-2 py-1 rounded text-xs">{formatData.example}</code>
                                </div>
                                <div>
                                    <strong>Characteristics:</strong>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {formatData.characteristics.map((char) => (
                                            <Badge key={char} variant="secondary" className="text-xs">
                                                {char}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Custom NanoID Settings */}
                    {selectedFormat === "nanoid_custom" && (
                        <div className="space-y-4 p-4 border rounded-lg">
                            <h4 className="font-medium">Custom NanoID Settings</h4>

                            {/* Length */}
                            <div className="space-y-2">
                                <Label className="text-sm">Length: {nanoidLength}</Label>
                                <Slider
                                    value={[nanoidLength]}
                                    onValueChange={(value) => setNanoidLength(value[0])}
                                    max={50}
                                    min={5}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>5</span>
                                    <span>50</span>
                                </div>
                            </div>

                            {/* Alphabet Selection */}
                            <div className="space-y-2">
                                <Label className="text-sm">Character Types</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="numbers"
                                            checked={customAlphabets.numbers}
                                            onCheckedChange={(checked) =>
                                                setCustomAlphabets(prev => ({ ...prev, numbers: !!checked }))
                                            }
                                        />
                                        <Label htmlFor="numbers" className="text-sm">Numbers (0-9)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="lowercase"
                                            checked={customAlphabets.lowercase}
                                            onCheckedChange={(checked) =>
                                                setCustomAlphabets(prev => ({ ...prev, lowercase: !!checked }))
                                            }
                                        />
                                        <Label htmlFor="lowercase" className="text-sm">Lowercase (a-z)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="uppercase"
                                            checked={customAlphabets.uppercase}
                                            onCheckedChange={(checked) =>
                                                setCustomAlphabets(prev => ({ ...prev, uppercase: !!checked }))
                                            }
                                        />
                                        <Label htmlFor="uppercase" className="text-sm">Uppercase (A-Z)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="symbols"
                                            checked={customAlphabets.symbols}
                                            onCheckedChange={(checked) =>
                                                setCustomAlphabets(prev => ({ ...prev, symbols: !!checked }))
                                            }
                                        />
                                        <Label htmlFor="symbols" className="text-sm">Symbols (-_)</Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Quantity: {quantity}</Label>
                        <Slider
                            value={[quantity]}
                            onValueChange={(value) => setQuantity(value[0])}
                            max={100}
                            min={1}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1</span>
                            <span>100</span>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center space-x-2">
                        <Button onClick={generateIds} className="bg-success text-success-foreground hover:bg-success/90">
                            <Hash className="h-4 w-4 mr-2" />
                            Generate {quantity} ID{quantity > 1 ? 's' : ''}
                        </Button>
                        {generatedIds.length > 0 && (
                            <>
                                <Button onClick={addMoreIds} variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add More
                                </Button>
                                <Button onClick={clearIds} variant="outline">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Clear
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Generated IDs */}
            {generatedIds.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Generated IDs ({generatedIds.length})
                            <Button onClick={copyAllIds} variant="outline" size="sm">
                                <Copy className="h-4 w-4 mr-2" />
                                Copy All
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {generatedIds.map((id) => (
                                <div key={id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <code className="code-font text-sm break-all flex-1 mr-2">{id}</code>
                                    <Button
                                        onClick={() => copyId(id)}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Card */}
            <Card className="bg-muted/20">
                <CardHeader>
                    <CardTitle className="text-lg">About ID Formats</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold mb-2">UUID (Universally Unique Identifier)</h4>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li>v4: Random-based, most common</li>
                                <li>v1: Timestamp + MAC address</li>
                                <li>v7: Timestamp-ordered, database-friendly</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Modern Alternatives</h4>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li>CUID2: Collision-resistant, sortable</li>
                                <li>NanoID: Compact, URL-safe</li>
                                <li>Custom: Tailored for specific needs</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}