// Terminal Journal - Additional JavaScript Functionality

// Terminal command execution
function executeCommand(command) {
    const logStream = document.getElementById('log');
    
    // Add command prompt
    const commandLine = document.createElement('div');
    commandLine.style.marginTop = '10px';
    commandLine.innerHTML = `<span class="prompt">root@portfolio:~$</span> ${getCommandText(command)}`;
    logStream.appendChild(commandLine);
    
    // Add command output
    const output = document.createElement('div');
    output.innerHTML = getCommandOutput(command);
    logStream.appendChild(output);
    
    // Scroll to bottom
    logStream.scrollTop = logStream.scrollHeight;
}

function getCommandText(command) {
    switch(command) {
        case 'logs': return 'cat logs';
        case 'about': return 'cat about.txt';
        case 'rss': return 'curl rss.xml';
        default: return command;
    }
}

function getCommandOutput(command) {
    switch(command) {
        case 'exit':
            return `<div class="command-output">
                <div class="dim">[SESSION CLOSED] Returning to portfolio...</div>
                <div class="dim">[SYSTEM] Terminal session terminated</div>
                <div class="dim">[INFO] Redirecting in 2 seconds...</div>
            </div>`;
        case 'logs':
            return `<div class="command-output">
                <div class="dim">[SYSTEM] Fetching latest entries...</div>
                <div class="dim">[SYSTEM] Sync complete.</div>
                <div style="margin: 8px 0;">
                    <div class="dim">[INFO] Recent journey logs:</div>
                    <div>[ENTRY] 2025-02-20: Completed CompTIA Project+ certification</div>
                    <div>[ENTRY] 2025-02-14: Hardened Ubuntu VM against CIS Benchmarks</div>
                    <div>[ENTRY] 2025-02-10: Completed CCNA Routing & Switching labs (OSPF, EIGRP)</div>
                    <div>[ENTRY] 2025-01-28: Built interactive Terminal portfolio module (v2.1)</div>
                    <div>[ENTRY] 2025-01-12: Studied AWS SysOps Administrator concepts</div>
                    <div>[ENTRY] 2025-01-05: Migrated logs into Notion → GitHub sync pipeline</div>
                </div>
                <div class="dim">[INFO] Total entries: 6</div>
                <div class="dim">[SYSTEM] Log retrieval successful</div>
            </div>`;
        case 'about':
            return `<div class="command-output">
                <div class="dim">[SYSTEM] Loading profile: about.txt</div>
                <div style="margin: 8px 0;">
                    <div style="font-weight: 600; color: var(--text-primary);">Ezekiel Obeisun Jr</div>
                    <div>Cloud Computing Student @ Western Governors University</div>
                    <div>Cybersecurity + Network Engineering — building toward Defense Sector</div>
                </div>
                <div style="margin: 8px 0;">
                    <div style="font-weight: 600; color: var(--text-primary);">Core Skills:</div>
                    <div>• AWS, Azure, & Hybrid Cloud Infrastructure</div>
                    <div>• Cisco Networking (CCNA-level + labs in progress)</div>
                    <div>• Linux Administration & Python Automation</div>
                    <div>• Security Hardening (STIG, CIS Benchmarks)</div>
                    <div>• Incident Response & Threat Analysis</div>
                </div>
                <div style="margin: 8px 0;">
                    <div style="font-weight: 600; color: var(--text-primary);">Mindset:</div>
                    <div>"Every log is a step forward. 1% better each day."</div>
                </div>
                <div style="margin: 8px 0;">
                    <div>Favorite Tool: tmux + coffee</div>
                    <div>Currently Reading: "Atomic Habits" by James Clear</div>
                </div>
                <div class="dim">[INFO] Profile loaded successfully</div>
                <div class="dim">EOF — signed: Ezekiel (nerdpioneer)</div>
            </div>`;
        case 'rss':
            return `<div class="command-output">
                <div class="dim">[SYSTEM] Initializing RSS fetch...</div>
                <div class="dim">[INFO] Sending GET request → https://1percentnerd.com/feed.xml</div>
                <div style="color: var(--accent-green); font-weight: 600;">200 OK</div>
                <div class="dim">[INFO] Content-Type: application/rss+xml</div>
                <div class="dim">[INFO] Connected to feed server</div>
                <div style="margin: 8px 0;">
                    <div style="font-weight: 600; color: var(--text-primary);">[FEED] Latest available items:</div>
                    <div>• [2025-02-20] CompTIA Project+ Certification Completed</div>
                    <div>• [2025-02-20] Building Defense-Grade Networks</div>
                    <div>• [2025-02-14] Hardened Ubuntu VM Against CIS Benchmarks</div>
                    <div>• [2025-02-10] CCNA Routing & Switching Labs (OSPF, EIGRP)</div>
                    <div>• [2025-01-28] Terminal Portfolio v2.1 Released</div>
                    <div>• [2025-01-12] AWS SysOps Study Notes</div>
                </div>
                <div style="margin: 8px 0;">
                    <div style="color: #ffa500; font-weight: 600;">[WARN] Full RSS feed sync not yet active.</div>
                    <div class="dim">[HINT] Subscribe at: <a href="https://1percentnerd.com/feed.xml" target="_blank" style="color: var(--accent-blue); text-decoration: underline;">https://1percentnerd.com/feed.xml</a></div>
                </div>
                <div class="dim">[SYSTEM] Feed retrieval complete. Logs archived.</div>
                <div class="dim">Type 'subscribe' to auto-add this feed (demo mode only).</div>
            </div>`;
        default:
            return `<div class="command-output">
                <div class="dim">[ERROR] Unknown command: ${command}</div>
                <div>Type 'help' for available commands</div>
            </div>`;
    }
}

// Exit command
function executeExit() {
    const logStream = document.getElementById('log');
    
    // Add command prompt
    const commandLine = document.createElement('div');
    commandLine.style.marginTop = '10px';
    commandLine.innerHTML = `<span class="prompt">root@portfolio:~$</span> exit`;
    logStream.appendChild(commandLine);
    
    // Add command output
    const output = document.createElement('div');
    output.innerHTML = getCommandOutput('exit');
    logStream.appendChild(output);
    
    // Scroll to bottom
    logStream.scrollTop = logStream.scrollHeight;
    
    // Redirect after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000); // Redirect after 2 seconds
}

// Export functions for use in React components
export { executeCommand, executeExit };
