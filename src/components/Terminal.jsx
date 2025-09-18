import React, { useState, useEffect } from 'react';
import '../assets/styles.css';

const Terminal = () => {
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Initialize terminal with welcome sequence
    const welcomeSequence = [
      { type: 'command', text: './welcome.sh' },
      { type: 'output', text: '▌ Welcome to the Terminal, wanderer…' },
      { type: 'command', text: './boot_sequence.sh' },
      { type: 'system', text: '[SYSTEM] Allocating memory…' },
      { type: 'system', text: '[SYSTEM] Mounting knowledge base…' },
      { type: 'system', text: '[SYSTEM] Loading entries: 0 found' },
      { type: 'output', text: '[…]' },
      { type: 'command', text: 'system_info' },
      { type: 'info', text: 'OS: Portfolio Terminal v1.0' },
      { type: 'info', text: 'Status: ONLINE' },
      { type: 'info', text: 'Purpose: Journey Log Repository' },
      { type: 'info', text: 'Last Update: INITIALIZING…' }
    ];

    let delay = 0;
    welcomeSequence.forEach((item, index) => {
      setTimeout(() => {
        setCommandHistory(prev => [...prev, item]);
      }, delay);
      delay += 1000;
    });

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 1000);

    return () => clearInterval(cursorInterval);
  }, []);

  const executeCommand = (command) => {
    const newCommand = { type: 'command', text: command };
    setCommandHistory(prev => [...prev, newCommand]);

    // Add command output based on command
    setTimeout(() => {
      const output = getCommandOutput(command);
      if (output) {
        setCommandHistory(prev => [...prev, output]);
      }
    }, 500);
  };

  const getCommandOutput = (command) => {
    switch (command.toLowerCase()) {
      case 'logs':
        return {
          type: 'output',
          text: `[SYSTEM] Fetching latest entries...
[SYSTEM] Sync complete.

[INFO] Recent journey logs:
[ENTRY] 2025-02-20: Completed CompTIA Project+ certification
[ENTRY] 2025-02-14: Hardened Ubuntu VM against CIS Benchmarks
[ENTRY] 2025-02-10: Completed CCNA Routing & Switching labs (OSPF, EIGRP)
[ENTRY] 2025-01-28: Built interactive Terminal portfolio module (v2.1)
[ENTRY] 2025-01-12: Studied AWS SysOps Administrator concepts
[ENTRY] 2025-01-05: Migrated logs into Notion → GitHub sync pipeline

[INFO] Total entries: 6
[SYSTEM] Log retrieval successful`
        };
      case 'about':
        return {
          type: 'output',
          text: `[SYSTEM] Loading profile: about.txt

Ezekiel Obeisun Jr
Cloud Computing Student @ Western Governors University
Cybersecurity + Network Engineering — building toward Defense Sector

Core Skills:
• AWS, Azure, & Hybrid Cloud Infrastructure
• Cisco Networking (CCNA-level + labs in progress)
• Linux Administration & Python Automation
• Security Hardening (STIG, CIS Benchmarks)
• Incident Response & Threat Analysis

Mindset:
"Every log is a step forward. 1% better each day."

Favorite Tool: tmux + coffee
Currently Reading: "Atomic Habits" by James Clear

[INFO] Profile loaded successfully
EOF — signed: Ezekiel (nerdpioneer)`
        };
      case 'rss':
        return {
          type: 'output',
          text: `[SYSTEM] Initializing RSS fetch...
[INFO] Sending GET request → https://1percentnerd.com/feed.xml
200 OK
[INFO] Content-Type: application/rss+xml
[INFO] Connected to feed server

[FEED] Latest available items:
• [2025-02-20] CompTIA Project+ Certification Completed
• [2025-02-20] Building Defense-Grade Networks
• [2025-02-14] Hardened Ubuntu VM Against CIS Benchmarks
• [2025-02-10] CCNA Routing & Switching Labs (OSPF, EIGRP)
• [2025-01-28] Terminal Portfolio v2.1 Released
• [2025-01-12] AWS SysOps Study Notes

[WARN] Full RSS feed sync not yet active.
[HINT] Subscribe at: https://1percentnerd.com/feed.xml

[SYSTEM] Feed retrieval complete. Logs archived.
Type 'subscribe' to auto-add this feed (demo mode only).`
        };
      case 'exit':
        return {
          type: 'output',
          text: `[SESSION CLOSED] Returning to portfolio...
[SYSTEM] Terminal session terminated
[INFO] Redirecting in 2 seconds...`
        };
      default:
        return {
          type: 'error',
          text: `[ERROR] Unknown command: ${command}
Type 'help' for available commands`
        };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  const handleBreadcrumbClick = (command) => {
    executeCommand(command);
  };

  return (
    <div className="terminal-container">
      {/* Compact Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <a href="index.html" className="nav-link">NerdPioneer</a>
          <span className="nav-separator">·</span>
          <a href="terminal.html" className="nav-link active">Terminal</a>
        </div>
        <div className="nav-right">
          <a href="#" className="nav-action">Subscribe</a>
          <span className="nav-separator">·</span>
          <a href="#" className="nav-action">GitHub</a>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="#" className="breadcrumb-link" onClick={() => handleBreadcrumbClick('exit')}>Exit</a>
        <span className="breadcrumb-separator">/</span>
        <span>Terminal</span>
        <span className="breadcrumb-separator">/</span>
        <a href="#" className="breadcrumb-link" onClick={() => handleBreadcrumbClick('logs')}>Logs</a>
        <span className="breadcrumb-separator">/</span>
        <a href="#" className="breadcrumb-link" onClick={() => handleBreadcrumbClick('about')}>About</a>
        <span className="breadcrumb-separator">/</span>
        <a href="#" className="breadcrumb-link" onClick={() => handleBreadcrumbClick('rss')}>RSS</a>
      </div>

      {/* Main Wrapper */}
      <div className="wrapper">
        {/* Terminal Container */}
        <div className="terminal">
          {/* Terminal Header */}
          <div className="term-header">
            <div className="led"></div>
            <span className="term-title">TERMINAL_ACCESS_v2.1</span>
          </div>
          
          {/* Terminal Body */}
          <div className="term-body">
            {/* Log Stream */}
            <div className="stream" id="log">
              {commandHistory.map((item, index) => (
                <div key={index} className={`terminal-line ${item.type}`}>
                  {item.type === 'command' && <span className="prompt">root@portfolio:~$</span>}
                  <span className={item.type === 'command' ? 'command' : 'output'}>
                    {item.text}
                  </span>
                </div>
              ))}
              
              {/* Center Panel */}
              <div className="center-panel">
                <h2>JR'S TERMINAL — MY JOURNEY LOGS</h2>
                <div className="system-messages">
                  <div className="info-message">
                    <span className="status-label info-label">[INFO]</span>
                    <span className="message-text">Monitoring activity: builds, lessons, and milestones</span>
                  </div>
                  <div className="warn-message">
                    <span className="status-label warning-label">[STATUS]</span>
                    <span className="message-text">Sync in progress — new entries will be available shortly...</span>
                  </div>
                </div>
              </div>

              {/* Terminal Footer */}
              <div className="term-footer">
                <span className="prompt">root@portfolio:~$</span>
                <span className="dim">Click breadcrumb links to explore. Demo mode only.</span>
                {showCursor && <span className="cursor">_</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
