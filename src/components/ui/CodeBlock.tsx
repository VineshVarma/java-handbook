'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  beforeCode?: string;
}

// Java syntax highlighter tokenizer
function highlightJava(code: string): React.ReactNode[] {
  const lines = code.split('\n');

  return lines.map((line, lineIndex) => {
    // Regex for Java tokens
    const tokenRegex =
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@\w+|\b(?:public|private|protected|class|interface|abstract|static|final|void|int|long|double|float|boolean|char|byte|short|String|return|new|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|extends|implements|import|package|this|super|null|true|false|var|record|sealed|permits|yield|default|instanceof|synchronized|volatile|transient|native|assert|enum)\b|\b(?:System|Math|Arrays|Collections|List|Set|Map|HashMap|ArrayList|LinkedList|Optional|CompletableFuture|ExecutorService|Executors|Thread|Runnable|Stream|Collectors|Override|Autowired|Service|Repository|Component|RestController|GetMapping|PostMapping|RequestMapping|PathVariable|RequestBody|ResponseEntity|Mono|Flux)\b|\b\d+\b|[{}\[\](),;.:=+\-*/%&|^!<>?])/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith('//') || token.startsWith('/*')) {
        parts.push(
          <span key={match.index} className="token-comment">
            {token}
          </span>
        );
      } else if (token.startsWith('"') || token.startsWith("'")) {
        parts.push(
          <span key={match.index} className="token-string">
            {token}
          </span>
        );
      } else if (token.startsWith('@')) {
        parts.push(
          <span key={match.index} className="token-annotation">
            {token}
          </span>
        );
      } else if (
        /^(public|private|protected|class|interface|abstract|static|final|void|int|long|double|float|boolean|char|byte|short|return|new|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|extends|implements|import|package|this|super|null|true|false|var|record|sealed|permits|yield|default|instanceof|synchronized|volatile|transient|native|assert|enum)$/.test(
          token
        )
      ) {
        parts.push(
          <span key={match.index} className="token-keyword">
            {token}
          </span>
        );
      } else if (
        /^(System|Math|Arrays|Collections|List|Set|Map|HashMap|ArrayList|LinkedList|Optional|CompletableFuture|ExecutorService|Executors|Thread|Runnable|Stream|Collectors|String|Override|Autowired|Service|Repository|Component|RestController|GetMapping|PostMapping|RequestMapping|PathVariable|RequestBody|ResponseEntity|Mono|Flux)$/.test(
          token
        )
      ) {
        parts.push(
          <span key={match.index} className="token-type">
            {token}
          </span>
        );
      } else if (/^\d+$/.test(token)) {
        parts.push(
          <span key={match.index} className="token-number">
            {token}
          </span>
        );
      } else if (/^[=+\-*/%&|^!<>?:.]$/.test(token)) {
        parts.push(
          <span key={match.index} className="token-operator">
            {token}
          </span>
        );
      } else {
        parts.push(token);
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return (
      <div key={lineIndex} className="table-row">
        <span className="table-cell pr-4 text-right select-none text-charcoal-700/40 dark:text-cream-400/30 text-xs font-mono">
          {lineIndex + 1}
        </span>
        <span className="table-cell">{parts}</span>
      </div>
    );
  });
}

export function CodeBlock({
  code,
  language = 'java',
  title,
  beforeCode,
}: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');
  const [copied, setCopied] = useState(false);

  const displayCode = activeTab === 'before' && beforeCode ? beforeCode : code;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-cream-300 dark:border-charcoal-700 bg-[#FAF7F2] dark:bg-[#181715] shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-2 bg-cream-200/60 dark:bg-charcoal-800/80 border-b border-cream-300 dark:border-charcoal-700 text-xs">
        <div className="flex items-center gap-2">
          {beforeCode ? (
            <div className="flex bg-cream-300/60 dark:bg-charcoal-700 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveTab('before')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  activeTab === 'before'
                    ? 'bg-white dark:bg-charcoal-900 shadow-sm text-charcoal-900 dark:text-cream-100'
                    : 'text-charcoal-600 dark:text-cream-400 hover:text-charcoal-900'
                }`}
              >
                Before
              </button>
              <button
                onClick={() => setActiveTab('after')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  activeTab === 'after'
                    ? 'bg-white dark:bg-charcoal-900 shadow-sm text-charcoal-900 dark:text-cream-100'
                    : 'text-charcoal-600 dark:text-cream-400 hover:text-charcoal-900'
                }`}
              >
                After / Modern
              </button>
            </div>
          ) : (
            <span className="font-mono font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider text-[11px]">
              {title || language}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-charcoal-600 dark:text-cream-300 hover:bg-cream-300 dark:hover:bg-charcoal-700 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed text-charcoal-900 dark:text-cream-100">
        <div className="table w-full">{highlightJava(displayCode.trim())}</div>
      </div>
    </div>
  );
}
