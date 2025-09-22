"use client"

interface SyntaxHighlighterProps {
  code: string
  language: string
  className?: string
}

export function SyntaxHighlighter({ code, language, className = "" }: SyntaxHighlighterProps) {
  const highlightCode = (code: string, language: string) => {
    // Escape HTML first
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // JavaScript/TypeScript keywords
    if (language === 'javascript' || language === 'typescript') {
      highlighted = highlighted
        // Comments first (to avoid highlighting inside comments)
        .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
        // Strings
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/`([^`]*)`/g, '<span class="string">`$1`</span>')
        // TypeScript specific keywords
        .replace(/\b(type|interface|extends|keyof|typeof|infer|readonly|as|in|is|never|unknown|any|object|string|number|boolean|void|null|undefined)\b/g, '<span class="keyword">$1</span>')
        // General keywords
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|finally|throw|new|this|super|implements|public|private|protected|static)\b/g, '<span class="keyword">$1</span>')
        // TypeScript utility types
        .replace(/\b(Partial|Required|Pick|Omit|Record|Exclude|Extract|NonNullable|Parameters|ReturnType|ConstructorParameters|InstanceType)\b/g, '<span class="function">$1</span>')
        // Numbers
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
        // Functions and types
        .replace(/\b([A-Z][a-zA-Z0-9_$]*)/g, '<span class="function">$1</span>')
        .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="function">$1</span>')
    }

    // Python keywords
    if (language === 'python') {
      highlighted = highlighted
        .replace(/#.*$/gm, '<span class="comment">$&</span>')
        .replace(/"""[\s\S]*?"""/g, '<span class="comment">$&</span>')
        .replace(/'''[\s\S]*?'''/g, '<span class="comment">$&</span>')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/\b(def|class|if|elif|else|for|while|try|except|finally|import|from|return|yield|with|as|lambda|async|await|global|nonlocal|and|or|not|in|is|None|True|False)\b/g, '<span class="keyword">$1</span>')
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
        .replace(/\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, 'def <span class="function">$1</span>')
    }

    // CSS
    if (language === 'css') {
      highlighted = highlighted
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
        // CSS selectors and classes
        .replace(/(\.|#)([a-zA-Z_-][a-zA-Z0-9_-]*)/g, '<span class="function">$1$2</span>')
        // CSS properties
        .replace(/([a-zA-Z-]+)\s*(?=:)/g, '<span class="property">$1</span>')
        // Strings and colors
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/#[0-9a-fA-F]{3,6}\b/g, '<span class="string">$&</span>')
        .replace(/rgba?\([^)]+\)/g, '<span class="string">$&</span>')
        // CSS functions
        .replace(/\b(linear-gradient|radial-gradient|calc|clamp|repeat|minmax|auto-fit|translateY|rect|inset)\b/g, '<span class="function">$1</span>')
        // CSS keywords
        .replace(/\b(auto|none|inherit|initial|unset|grid|flex|block|inline|absolute|relative|fixed|hidden|visible|solid|dashed|dotted|ease|linear)\b/g, '<span class="keyword">$1</span>')
        // Numbers and units
        .replace(/\b(\d+\.?\d*)(px|em|rem|%|vh|vw|deg|s|ms|fr)?\b/g, '<span class="number">$1$2</span>')
        // Media queries
        .replace(/@(media|import|keyframes|supports)\b/g, '<span class="keyword">$1</span>')
    }

    // SQL
    if (language === 'sql') {
      highlighted = highlighted
        .replace(/--.*$/gm, '<span class="comment">$&</span>')
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|ORDER|BY|HAVING|LIMIT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|DATABASE|INDEX|WITH|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|CASE|WHEN|THEN|ELSE|END|UNION|ALL)\b/gi, '<span class="keyword">$1</span>')
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
    }

    // Go
    if (language === 'go') {
      highlighted = highlighted
        .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/`([^`]*)`/g, '<span class="string">`$1`</span>')
        .replace(/\b(package|import|func|var|const|type|struct|interface|if|else|for|range|switch|case|default|return|defer|go|chan|select|map|slice|make|new|nil|true|false)\b/g, '<span class="keyword">$1</span>')
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
        .replace(/\bfunc\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, 'func <span class="function">$1</span>')
    }

    // YAML
    if (language === 'yaml') {
      highlighted = highlighted
        .replace(/#.*$/gm, '<span class="comment">$&</span>')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/^(\s*)([a-zA-Z_][a-zA-Z0-9_-]*)\s*:/gm, '$1<span class="property">$2</span>:')
        .replace(/\b(true|false|null|yes|no|on|off)\b/gi, '<span class="keyword">$1</span>')
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
    }

    // Dockerfile
    if (language === 'dockerfile') {
      highlighted = highlighted
        .replace(/#.*$/gm, '<span class="comment">$&</span>')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        // Dockerfile instructions
        .replace(/^(FROM|RUN|CMD|LABEL|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL|AS)\b/gm, '<span class="keyword">$1</span>')
        // Dockerfile flags
        .replace(/--([a-zA-Z-]+)/g, '<span class="property">--$1</span>')
        // Image names and tags
        .replace(/\b([a-zA-Z0-9_.-]+):([a-zA-Z0-9_.-]+)/g, '<span class="function">$1</span>:<span class="string">$2</span>')
        // Port numbers
        .replace(/\b(\d{1,5})\b/g, '<span class="number">$1</span>')
    }

    return highlighted
  }

  return (
    <pre className={`syntax-highlight code-font ${className}`}>
      <code
        dangerouslySetInnerHTML={{
          __html: highlightCode(code, language)
        }}
      />
    </pre>
  )
}