import React, { useRef, useEffect } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { SSHConnection } from "../../types";

interface TerminalProps {
    activeConnection: SSHConnection | null;
    terminalOutput: string[];
    onTerminalInput: (input: string) => void;
    onContextMenu: (e: React.MouseEvent) => void;
    settings?: {
        fontFamily: string;
        fontSize: number;
        colors: {
            background: string;
            foreground: string;
        };
        ligatures: boolean;
    };
}

const Terminal: React.FC<TerminalProps> = ({ activeConnection, terminalOutput, onTerminalInput, onContextMenu, settings }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    // Initialize xterm.js
    useEffect(() => {
        if (!terminalRef.current) return;

        // Create terminal instance
        const terminal = new XTerm({
            fontFamily: settings?.fontFamily || "monospace",
            fontSize: settings?.fontSize || 14,
            theme: {
                background: settings?.colors?.background || "#000000",
                foreground: settings?.colors?.foreground || "#ffffff",
                cursor: settings?.colors?.foreground || "#ffffff",
            },
            cursorBlink: true,
            allowTransparency: true,
            disableStdin: false,
            convertEol: true,
            fontWeightBold: "bold",
            allowProposedApi: true,
        });

        // Create addons
        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();

        // Load addons
        terminal.loadAddon(fitAddon);
        terminal.loadAddon(webLinksAddon);

        // Open terminal
        terminal.open(terminalRef.current);
        fitAddon.fit();

        // Set refs
        xtermRef.current = terminal;
        fitAddonRef.current = fitAddon;

        // Handle input
        terminal.onData((data) => {
            onTerminalInput(data);
        });

        // Handle resize
        const handleResize = () => {
            if (fitAddonRef.current) {
                fitAddonRef.current.fit();
            }
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            terminal.dispose();
        };
    }, []);

    // Update terminal when settings change
    useEffect(() => {
        if (!xtermRef.current) return;

        xtermRef.current.options.fontFamily = settings?.fontFamily || "monospace";
        xtermRef.current.options.fontSize = settings?.fontSize || 14;
        xtermRef.current.options.theme = {
            background: settings?.colors?.background || "#000000",
            foreground: settings?.colors?.foreground || "#ffffff",
            cursor: settings?.colors?.foreground || "#ffffff",
        };

        if (fitAddonRef.current) {
            fitAddonRef.current.fit();
        }
    }, [settings]);

    // Update terminal when output changes
    useEffect(() => {
        if (!xtermRef.current || terminalOutput.length === 0) return;

        // Clear terminal
        xtermRef.current.clear();

        // Write output
        for (let i = 0; i < terminalOutput.length; i++) {
            // For the last line, don't add a newline character
            if (i === terminalOutput.length - 1) {
                xtermRef.current.write(terminalOutput[i]);
            } else {
                xtermRef.current.write(terminalOutput[i] + "\r\n");
            }
        }

        // Scroll to bottom
        xtermRef.current.scrollToBottom();
    }, [terminalOutput]);

    return (
        <div className="flex flex-col h-full" onContextMenu={onContextMenu}>
            <div ref={terminalRef} className="flex-1 overflow-hidden" />
        </div>
    );
};

export default Terminal;
