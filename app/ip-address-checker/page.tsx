"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Globe, Monitor, RefreshCw } from "lucide-react";

interface IpInfo {
    ipv4?: string;
    ipv6?: string;
    loading: boolean;
    error?: string;
}

interface BrowserInfo {
    userAgent: string;
    language: string;
    cookieEnabled: boolean;
    screenSize: string;
    devicePixelRatio: number;
    colorDepth: number;
    availableScreenSize: string;
    windowSize: string;
    timezone: string;
    displayLanguage: string;
    retrievedAt: string;
}

export default function IpAddressCheckerPage() {
    const [ipInfo, setIpInfo] = useState<IpInfo>({ loading: true });
    const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);

    const getBrowserInfo = (): BrowserInfo => {
        const now = new Date();
        return {
            userAgent: navigator.userAgent,
            language: navigator.languages ? navigator.languages.join(", ") : navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            screenSize: `${screen.width} × ${screen.height}`,
            devicePixelRatio: window.devicePixelRatio,
            colorDepth: screen.colorDepth,
            availableScreenSize: `${screen.availWidth} × ${screen.availHeight}`,
            windowSize: `${window.innerWidth} × ${window.innerHeight}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            displayLanguage: navigator.language,
            retrievedAt: now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            })
        };
    };

    const fetchIpAddress = async () => {
        setIpInfo({ loading: true });

        try {
            const results = await Promise.allSettled([
                // Get IPv4
                fetch('https://api.ipify.org?format=json').then(res => res.json()),
                // Get IPv6 - try different endpoints
                fetch('https://api6.ipify.org?format=json').then(res => res.json()).catch(() =>
                    fetch('https://ipv6.icanhazip.com/', {
                        headers: { 'Accept': 'application/json' }
                    }).then(res => res.text()).then(ip => ({ ip: ip.trim() }))
                )
            ]);

            const ipv4Result = results[0];
            const ipv6Result = results[1];

            let ipv4 = undefined;
            let ipv6 = undefined;

            if (ipv4Result.status === 'fulfilled') {
                ipv4 = ipv4Result.value.ip;
            }

            if (ipv6Result.status === 'fulfilled') {
                const ipv6Address = ipv6Result.value.ip;
                // Check if it's a valid IPv6 address and different from IPv4
                if (ipv6Address && ipv6Address !== ipv4 && ipv6Address.includes(':')) {
                    ipv6 = ipv6Address;
                }
            }

            setIpInfo({
                ipv4,
                ipv6,
                loading: false
            });
        } catch (error) {
            setIpInfo({
                loading: false,
                error: 'Failed to fetch IP address'
            });
        }
    };

    const copyToClipboard = async (text: string, label: string) => {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const refreshInfo = () => {
        fetchIpAddress();
        setBrowserInfo(getBrowserInfo());
        toast.success('Information refreshed');
    };

    useEffect(() => {
        fetchIpAddress();
        setBrowserInfo(getBrowserInfo());

        // Update window size on resize
        const handleResize = () => {
            setBrowserInfo(prev => prev ? {
                ...prev,
                windowSize: `${window.innerWidth} × ${window.innerHeight}`
            } : null);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold gradient-text">IP Address Checker</h1>
                <Button onClick={refreshInfo} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* IP Address Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        Your IP Address
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(() => {
                        if (ipInfo.loading) {
                            return (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            );
                        }

                        if (ipInfo.error) {
                            return (
                                <div className="text-center py-8 text-destructive">
                                    {ipInfo.error}
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-4">
                                {/* IPv4 */}
                                {ipInfo.ipv4 && (
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div>
                                            <Badge variant="secondary" className="mb-2">IPv4</Badge>
                                            <div className="code-font text-lg font-semibold">{ipInfo.ipv4}</div>
                                        </div>
                                        <Button
                                            onClick={() => copyToClipboard(ipInfo.ipv4!, 'IPv4 address')}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy
                                        </Button>
                                    </div>
                                )}

                                {/* IPv6 */}
                                {ipInfo.ipv6 && (
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div>
                                            <Badge variant="secondary" className="mb-2">IPv6</Badge>
                                            <div className="code-font text-lg font-semibold break-all">{ipInfo.ipv6}</div>
                                        </div>
                                        <Button
                                            onClick={() => copyToClipboard(ipInfo.ipv6!, 'IPv6 address')}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy
                                        </Button>
                                    </div>
                                )}

                                {!ipInfo.ipv6 && ipInfo.ipv4 && (
                                    <div className="text-sm text-muted-foreground text-center">
                                        IPv6 address not detected or same as IPv4
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </CardContent>
            </Card>

            {/* Browser Information */}
            {browserInfo && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Monitor className="h-5 w-5 mr-2" />
                            🔍 Browser Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div>
                                    <div className="font-medium text-sm mb-1">User Agent</div>
                                    <div className="text-sm bg-muted/50 p-2 rounded code-font break-all">
                                        {browserInfo.userAgent}
                                    </div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm mb-1">Language</div>
                                    <div className="text-sm">{browserInfo.language}</div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm mb-1">Cookie Enabled</div>
                                    <div className="text-sm">{browserInfo.cookieEnabled ? 'true' : 'false'}</div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm mb-1">Screen Size</div>
                                    <div className="text-sm">{browserInfo.screenSize}</div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm mb-1">Device Pixel Ratio</div>
                                    <div className="text-sm">{browserInfo.devicePixelRatio}</div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm mb-1">Color Depth</div>
                                    <div className="text-sm">{browserInfo.colorDepth} bits</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="font-medium text-sm mb-1">Available Screen Size</div>
                                    <div className="text-sm">{browserInfo.availableScreenSize}</div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm mb-1">Window Size</div>
                                    <div className="text-sm">{browserInfo.windowSize}</div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm mb-1">Timezone</div>
                                    <div className="text-sm">{browserInfo.timezone}</div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm mb-1">Display Language</div>
                                    <div className="text-sm">{browserInfo.displayLanguage}</div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm mb-1">Information Retrieved At</div>
                                    <div className="text-sm">{browserInfo.retrievedAt}</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Card */}
            <Card className="bg-muted/20">
                <CardHeader>
                    <CardTitle className="text-lg">About IP Addresses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <p>
                            Your IP address is a unique identifier assigned to your device when connected to the internet.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <h4 className="font-semibold mb-2">IPv4</h4>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    <li>32-bit address format</li>
                                    <li>Example: 192.168.1.1</li>
                                    <li>Most common standard</li>
                                    <li>Limited address space</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">IPv6</h4>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    <li>128-bit address format</li>
                                    <li>Example: 2001:db8::1</li>
                                    <li>Newer standard</li>
                                    <li>Vast address space</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}