import {
  Code2,
  Type,
  Braces,
  Link as LinkIcon,
  FileText,
  Key,
  LockIcon,
  QrCodeIcon,
  BarcodeIcon,
  Hash,
  GlobeIcon
} from "lucide-react";

export interface NavigationItem {
  id: string;
  title: string;
  url: string;
  icon: any;
  description?: string;
  category?: string;
  keywords?: string[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "snippets",
    title: "Snippet",
    url: "/snippets",
    icon: Code2,
    description: "Manage and organize your code snippets with syntax highlighting",
    category: "Development Tools",
    keywords: ["code", "snippet", "syntax", "highlighting", "development"]
  },
  {
    id: "text",
    title: "Text Transform",
    url: "/text",
    icon: Type,
    description: "Transform text with various formatting and case conversion options",
    category: "Text Tools",
    keywords: ["text", "transform", "case", "format", "convert"]
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    url: "/json-formatter",
    icon: Braces,
    description: "Format, validate, and minify JSON data with syntax highlighting",
    category: "Data Tools",
    keywords: ["json", "format", "validate", "minify", "syntax", "prettify"]
  },
  {
    id: "url-encoder-decoder",
    title: "URL Encoder/Decoder",
    url: "/url-encoder-decoder",
    icon: LinkIcon,
    description: "Encode and decode URLs with percent encoding for web development",
    category: "Encoding Tools",
    keywords: ["url", "encode", "decode", "percent", "web", "uri", "link"]
  },
  {
    id: "base64-encoder-decoder",
    title: "Base64 Encoder/Decoder",
    url: "/base64-encoder-decoder",
    icon: FileText,
    description: "Encode and decode Base64 strings with URL-safe character handling",
    category: "Encoding Tools",
    keywords: ["base64", "encode", "decode", "binary", "text", "url-safe"]
  },
  {
    id: "jwt-encoder-decoder",
    title: "JWT Encoder/Decoder",
    url: "/jwt-encoder-decoder",
    icon: Key,
    description: "Encode, decode, and validate JSON Web Tokens with header and payload inspection",
    category: "Security Tools",
    keywords: ["jwt", "json", "web", "token", "auth", "authentication", "security"]
  },
  {
    id: "strong-random-password-generator",
    title: "Strong Random Password Generator",
    url: "/strong-random-password-generator",
    icon: LockIcon,
    description: "Generate secure passwords with customizable length and character types",
    category: "Security Tools",
    keywords: ["password", "generator", "random", "secure", "strong", "characters"]
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    url: "/qr-code-generator",
    icon: QrCodeIcon,
    description: "Generate QR codes from text, URLs, or any content with customizable size",
    category: "Generator Tools",
    keywords: ["qr", "code", "generator", "barcode", "scan", "mobile", "url"]
  },
  {
    id: "barcode-generator",
    title: "Barcode Generator",
    url: "/barcode-generator",
    icon: BarcodeIcon,
    description: "Generate various barcode formats including Code 128, EAN, UPC, and more",
    category: "Generator Tools",
    keywords: ["barcode", "code128", "ean", "upc", "generator", "retail", "inventory"]
  },
  {
    id: "id-generator",
    title: "ID Generator",
    url: "/id-generator",
    icon: Hash,
    description: "Generate unique identifiers including UUID, CUID, and NanoID formats",
    category: "Generator Tools",
    keywords: ["id", "uuid", "cuid", "nanoid", "unique", "identifier", "random"]
  },
  {
    id: "ip-address-checker",
    title: "IP Address Checker",
    url: "/ip-address-checker",
    icon: GlobeIcon,
    description: "Check your IPv4 and IPv6 addresses with detailed browser information",
    category: "Network Tools",
    keywords: ["ip", "address", "ipv4", "ipv6", "network", "browser", "information"]
  }
];

// For backward compatibility with sidebar
export const SIDEBAR_ITEMS = NAVIGATION_ITEMS.map(item => ({
  title: item.title,
  url: item.url,
  icon: item.icon
}));

// For search functionality
export const SEARCH_DATA = NAVIGATION_ITEMS.filter(item =>
  // Only include items that have description and category (exclude snippets and text for now)
  item.description && item.category
);