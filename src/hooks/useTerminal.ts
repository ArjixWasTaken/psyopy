import { useState, useRef, useEffect } from 'react';
import { SSHConnection } from '../types';
import { sshService } from '../services/sshService';

// Store terminal outputs for each tab
const terminalOutputsStore = new Map<string, string[]>();

export const useTerminal = (activeConnection: SSHConnection | null, activeTabId: string | null) => {
  const [terminalOutputs, setTerminalOutputs] = useState<Map<string, string[]>>(terminalOutputsStore);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const commandBufferRef = useRef<string>('');
  
  // Connect to SSH server when connection changes
  useEffect(() => {
    if (activeConnection && activeTabId) {
      connectToServer(activeConnection, activeTabId);
    }
  }, [activeConnection, activeTabId]);
  
  // Get terminal output for active tab
  const getTerminalOutput = () => {
    if (!activeTabId) return [];
    
    if (!terminalOutputs.has(activeTabId)) {
      const initialOutput = [
        'Welcome to SSH Manager Terminal',
        '$ '
      ];
      terminalOutputs.set(activeTabId, initialOutput);
      terminalOutputsStore.set(activeTabId, initialOutput);
    }
    
    return terminalOutputs.get(activeTabId) || [];
  };
  
  // Connect to SSH server
  const connectToServer = async (connection: SSHConnection, tabId: string) => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    // Update terminal output
    const currentOutput = [...getTerminalOutput()];
    currentOutput.push(`Connecting to ${connection.host} (${connection.name})...`);
    
    terminalOutputs.set(tabId, currentOutput);
    terminalOutputsStore.set(tabId, currentOutput);
    setTerminalOutputs(new Map(terminalOutputs));
    
    try {
      // Connect to server
      await sshService.connect(connection);
      
      // Update terminal output
      const updatedOutput = [...terminalOutputs.get(tabId) || []];
      updatedOutput.push(`Connected to ${connection.host} (${connection.name})`);
      updatedOutput.push(`${connection.username}@${connection.host}:~$ `);
      
      terminalOutputs.set(tabId, updatedOutput);
      terminalOutputsStore.set(tabId, updatedOutput);
      setTerminalOutputs(new Map(terminalOutputs));
      
      setIsConnected(true);
    } catch (error) {
      // Update terminal output with error
      const updatedOutput = [...terminalOutputs.get(tabId) || []];
      updatedOutput.push(`Failed to connect: ${error instanceof Error ? error.message : String(error)}`);
      updatedOutput.push('$ ');
      
      terminalOutputs.set(tabId, updatedOutput);
      terminalOutputsStore.set(tabId, updatedOutput);
      setTerminalOutputs(new Map(terminalOutputs));
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle terminal input
  const handleTerminalInput = async (input: string) => {
    if (!activeTabId) return;
    
    // Handle special keys
    if (input === '\r') { // Enter key
      const currentOutput = [...getTerminalOutput()];
      const lastLine = currentOutput[currentOutput.length - 1];
      const promptParts = lastLine.split('$ ');
      const promptParts2 = lastLine.split('~$ ');
      
      // Extract command from the last line
      let command = '';
      if (promptParts.length > 1) {
        command = promptParts[promptParts.length - 1];
      } else if (promptParts2.length > 1) {
        command = promptParts2[promptParts2.length - 1];
      } else {
        command = commandBufferRef.current;
      }
      
      // Reset command buffer
      commandBufferRef.current = '';
      
      // Remove the last line (command prompt + input)
      currentOutput.pop();
      
      // Add the command line
      currentOutput.push(`${activeConnection?.username || 'user'}@${activeConnection?.host || 'localhost'}:~$ ${command}`);
      
      // Execute command if connected
      if (isConnected && activeConnection) {
        try {
          const result = await sshService.executeCommand(command);
          
          if (result.stdout) {
            currentOutput.push(result.stdout);
          }
          
          if (result.stderr) {
            currentOutput.push(result.stderr);
          }
        } catch (error) {
          currentOutput.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        // Simulate command response if not connected
        if (command.trim().toLowerCase() === 'ls') {
          currentOutput.push('Documents  Downloads  Pictures  Videos');
        } else if (command.trim().toLowerCase() === 'whoami') {
          currentOutput.push(activeConnection?.username || 'user');
        } else if (command.trim().toLowerCase() === 'clear') {
          // Clear the terminal
          const prompt = `${activeConnection?.username || 'user'}@${activeConnection?.host || 'localhost'}:~$ `;
          terminalOutputs.set(activeTabId, [prompt]);
          terminalOutputsStore.set(activeTabId, [prompt]);
          setTerminalOutputs(new Map(terminalOutputs));
          return;
        } else if (command.trim().toLowerCase() === 'connect' && activeConnection) {
          // Connect to server
          connectToServer(activeConnection, activeTabId);
          return;
        } else if (command.trim().toLowerCase() !== '') {
          currentOutput.push(`Command not found: ${command}`);
        }
      }
      
      // Add new prompt
      currentOutput.push(`${activeConnection?.username || 'user'}@${activeConnection?.host || 'localhost'}:~$ `);
      
      terminalOutputs.set(activeTabId, currentOutput);
      terminalOutputsStore.set(activeTabId, currentOutput);
      setTerminalOutputs(new Map(terminalOutputs));
    } else if (input === '\u007F') { // Backspace
      if (commandBufferRef.current.length > 0) {
        // Remove the last character from the command buffer
        commandBufferRef.current = commandBufferRef.current.substring(0, commandBufferRef.current.length - 1);
        
        // Update the last line in the terminal
        const currentOutput = [...getTerminalOutput()];
        const lastLine = currentOutput[currentOutput.length - 1];
        const promptParts = lastLine.split('$ ');
        const promptParts2 = lastLine.split('~$ ');
        
        if (promptParts.length > 1) {
          currentOutput[currentOutput.length - 1] = promptParts[0] + '$ ' + commandBufferRef.current;
        } else if (promptParts2.length > 1) {
          currentOutput[currentOutput.length - 1] = promptParts2[0] + '~$ ' + commandBufferRef.current;
        }
        
        terminalOutputs.set(activeTabId, currentOutput);
        terminalOutputsStore.set(activeTabId, currentOutput);
        setTerminalOutputs(new Map(terminalOutputs));
      }
    } else {
      // Regular input - add to command buffer
      commandBufferRef.current += input;
      
      // Update the last line in the terminal
      const currentOutput = [...getTerminalOutput()];
      const lastLine = currentOutput[currentOutput.length - 1];
      const promptParts = lastLine.split('$ ');
      const promptParts2 = lastLine.split('~$ ');
      
      if (promptParts.length > 1) {
        currentOutput[currentOutput.length - 1] = promptParts[0] + '$ ' + commandBufferRef.current;
      } else if (promptParts2.length > 1) {
        currentOutput[currentOutput.length - 1] = promptParts2[0] + '~$ ' + commandBufferRef.current;
      }
      
      terminalOutputs.set(activeTabId, currentOutput);
      terminalOutputsStore.set(activeTabId, currentOutput);
      setTerminalOutputs(new Map(terminalOutputs));
    }
  };

  // Update terminal output when connection changes
  const updateTerminalForConnection = (connection: SSHConnection, tabId: string) => {
    // Reset connection state
    setIsConnected(false);
    
    const newOutput = [
      `Connecting to ${connection.host} (${connection.name})...`,
    ];
    
    // Reset command buffer
    commandBufferRef.current = '';
    
    terminalOutputs.set(tabId, newOutput);
    terminalOutputsStore.set(tabId, newOutput);
    setTerminalOutputs(new Map(terminalOutputs));
    
    // Connect to server
    connectToServer(connection, tabId);
  };
  
  return {
    terminalOutput: getTerminalOutput(),
    handleTerminalInput,
    updateTerminalForConnection,
    isConnecting,
    isConnected
  };
};