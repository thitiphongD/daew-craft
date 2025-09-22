"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw } from "lucide-react";

interface PasswordOptions {
    length: number;
    includeLowercase: boolean;
    includeUppercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    excludeConfusing: boolean;
    excludeAmbiguous: boolean;
}

const CHARACTER_SETS = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!#$%&*+-=?@^_{}[]()/'\"`;:.<>\\",
    confusing: "il1Lo0O",
    ambiguous: "{}[]()/'\"`;:.<>\\"
};

export default function StrongRandomPasswordGeneratorPage() {
    const [password, setPassword] = useState("");
    const [options, setOptions] = useState<PasswordOptions>({
        length: 16,
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeConfusing: false,
        excludeAmbiguous: false
    });

    const getPasswordStrength = (password: string) => {
        if (!password) return { level: 0, text: "No password", color: "bg-gray-300" };

        let score = 0;

        // Length scoring
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;

        // Character variety scoring
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        // Uniqueness scoring
        const uniqueChars = new Set(password).size;
        if (uniqueChars / password.length > 0.8) score += 1;

        if (score <= 2) return { level: 1, text: "Weak", color: "bg-red-500" };
        if (score <= 4) return { level: 2, text: "Fair", color: "bg-orange-500" };
        if (score <= 6) return { level: 3, text: "Good", color: "bg-yellow-500" };
        if (score <= 7) return { level: 4, text: "Strong", color: "bg-green-500" };
        return { level: 5, text: "Very Strong", color: "bg-green-600" };
    };

    const generateCharacterSet = (options: PasswordOptions): string => {
        let charset = "";

        if (options.includeLowercase) charset += CHARACTER_SETS.lowercase;
        if (options.includeUppercase) charset += CHARACTER_SETS.uppercase;
        if (options.includeNumbers) charset += CHARACTER_SETS.numbers;
        if (options.includeSymbols) charset += CHARACTER_SETS.symbols;

        // Remove confusing characters
        if (options.excludeConfusing) {
            for (const char of CHARACTER_SETS.confusing) {
                charset = charset.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
            }
        }

        // Remove ambiguous characters
        if (options.excludeAmbiguous) {
            for (const char of CHARACTER_SETS.ambiguous) {
                charset = charset.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
            }
        }

        return charset;
    };

    const generatePassword = () => {
        if (!options.includeLowercase && !options.includeUppercase && !options.includeNumbers && !options.includeSymbols) {
            toast.error("Please select at least one character type.");
            return;
        }

        const charset = generateCharacterSet(options);

        if (charset.length === 0) {
            toast.error("No characters available with current settings.");
            return;
        }

        let newPassword = "";
        const array = new Uint32Array(options.length);
        crypto.getRandomValues(array);

        for (let i = 0; i < options.length; i++) {
            newPassword += charset[array[i] % charset.length];
        }

        setPassword(newPassword);
    };

    const handleCopy = async () => {
        if (!password) {
            toast.error("No password to copy.");
            return;
        }
        await navigator.clipboard.writeText(password);
        toast.success("Password copied to clipboard.");
    };

    const strength = getPasswordStrength(password);

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold gradient-text">Strong Random Password Generator</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Password Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Password Length */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Password Length: {options.length}</Label>
                        <Slider
                            value={[options.length]}
                            onValueChange={(value) => setOptions({ ...options, length: value[0] })}
                            max={128}
                            min={4}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>4</span>
                            <span>128</span>
                        </div>
                    </div>

                    {/* Character Type Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="lowercase"
                                    checked={options.includeLowercase}
                                    onCheckedChange={(checked) =>
                                        setOptions({ ...options, includeLowercase: !!checked })
                                    }
                                />
                                <Label htmlFor="lowercase" className="text-sm">
                                    Include lowercase letters
                                    <span className="text-muted-foreground ml-2">→ a b c d ...</span>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="uppercase"
                                    checked={options.includeUppercase}
                                    onCheckedChange={(checked) =>
                                        setOptions({ ...options, includeUppercase: !!checked })
                                    }
                                />
                                <Label htmlFor="uppercase" className="text-sm">
                                    Include uppercase letters
                                    <span className="text-muted-foreground ml-2">→ A B C D ...</span>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="numbers"
                                    checked={options.includeNumbers}
                                    onCheckedChange={(checked) =>
                                        setOptions({ ...options, includeNumbers: !!checked })
                                    }
                                />
                                <Label htmlFor="numbers" className="text-sm">
                                    Include numbers
                                    <span className="text-muted-foreground ml-2">→ 1 2 3 4 ...</span>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="symbols"
                                    checked={options.includeSymbols}
                                    onCheckedChange={(checked) =>
                                        setOptions({ ...options, includeSymbols: !!checked })
                                    }
                                />
                                <Label htmlFor="symbols" className="text-sm">
                                    Include symbols
                                    <span className="text-muted-foreground ml-2">→ ! # $ % & * + - = ? @ ^ _</span>
                                </Label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="excludeConfusing"
                                    checked={options.excludeConfusing}
                                    onCheckedChange={(checked) =>
                                        setOptions({ ...options, excludeConfusing: !!checked })
                                    }
                                />
                                <Label htmlFor="excludeConfusing" className="text-sm">
                                    Exclude confusing characters
                                    <span className="text-muted-foreground ml-2">→ i l L 1 o 0 O</span>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="excludeAmbiguous"
                                    checked={options.excludeAmbiguous}
                                    onCheckedChange={(checked) =>
                                        setOptions({ ...options, excludeAmbiguous: !!checked })
                                    }
                                />
                                <Label htmlFor="excludeAmbiguous" className="text-sm">
                                    Exclude ambiguous characters
                                    <span className="text-muted-foreground ml-2">→ {"{ } [ ] ( ) / \\ ' \" ` ~ , ; : . < >"}</span>
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button onClick={generatePassword} className="bg-success text-success-foreground hover:bg-success/90">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Generate Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {password && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Generated Password
                            <Button onClick={handleCopy} variant="outline" size="sm">
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted/50 rounded-md p-4 code-font text-lg break-all select-all">
                            {password}
                        </div>

                        {/* Password Strength Indicator */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Password Strength</Label>
                                <Badge variant="outline" className={`${strength.color} text-white border-0`}>
                                    {strength.text}
                                </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${strength.color} transition-all duration-300`}
                                    style={{ width: `${(strength.level / 5) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Password Info */}
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Length: {password.length} characters</p>
                            <p>Unique characters: {new Set(password).size}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Card */}
            <Card className="bg-muted/20">
                <CardHeader>
                    <CardTitle className="text-lg">Password Security Tips</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <ul className="list-disc list-inside space-y-1">
                            <li>Use at least 12 characters for strong passwords</li>
                            <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
                            <li>Avoid common words, personal information, or predictable patterns</li>
                            <li>Use unique passwords for each account</li>
                            <li>Consider using a password manager to store your passwords securely</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}