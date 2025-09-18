// Terminal Journal v3.0 - Advanced Interactive Scripts

class TerminalJournal {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentTheme = 'dark';
        this.isFullscreen = false;
        this.detectedTechStack = new Set();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTerminal();
        this.loadSampleData();
        this.hideLoadingOverlay();
    }

    setupEventListeners() {
        // Command input
        const commandInput = document.getElementById('commandInput');
        commandInput.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const command = e.currentTarget.dataset.command;
                this.executeCommand(command);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Fullscreen toggle
        document.getElementById('fullscreenToggle').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Terminal controls
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.classList[1];
                this.handleTerminalControl(action);
            });
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const command = link.querySelector('span').textContent.toLowerCase();
                this.executeCommand(command);
            });
        });
    }

    initializeTerminal() {
        // Add welcome message
        this.addCommandOutput('system', 'NerdPioneer Terminal initialized');
        this.addCommandOutput('system', 'Type "help" for available commands');
        this.addCommandOutput('info', 'Welcome to my learning journey terminal!');
        this.addCommandOutput('info', 'Explore my cloud computing and cybersecurity path');
        
        // Focus input
        document.getElementById('commandInput').focus();
    }

    handleKeyDown(e) {
        const input = e.target;
        
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand(input.value.trim());
                input.value = '';
                this.historyIndex = -1;
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory('down');
                break;
            case 'Tab':
                e.preventDefault();
                this.handleTabCompletion(input);
                break;
        }
    }

    executeCommand(command) {
        if (!command) return;

        // Add to history
        this.commandHistory.unshift(command);
        if (this.commandHistory.length > 50) {
            this.commandHistory.pop();
        }

        // Display command
        this.addCommandLine(command);

        // Execute command
        const result = this.processCommand(command);
        if (result) {
            this.addCommandOutput(result.type, result.content);
        }

        // Scroll to bottom
        this.scrollToBottom();
    }

    processCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        switch(cmd) {
            case 'help':
                return {
                    type: 'help',
                    content: this.getHelpContent()
                };
            case 'clear':
                this.clearTerminal();
                return null;
            case 'logs':
            case 'list':
                return {
                    type: 'logs',
                    content: this.getLogsContent()
                };
            case 'about':
                return {
                    type: 'about',
                    content: this.getAboutContent()
                };
            case 'rss':
            case 'feed':
                return {
                    type: 'rss',
                    content: this.getRSSContent()
                };
            case 'theme':
                this.toggleTheme();
                return {
                    type: 'system',
                    content: `Theme switched to ${this.currentTheme} mode`
                };
            case 'status':
                return {
                    type: 'status',
                    content: this.getStatusContent()
                };
            case 'version':
                return {
                    type: 'info',
                    content: 'Terminal Journal v3.0 - Modern Web Terminal Interface'
                };
            default:
                return {
                    type: 'error',
                    content: `Command not found: ${command}. Type "help" for available commands.`
                };
        }
    }

    addCommandLine(command) {
        const history = document.getElementById('commandHistory');
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line fade-in';
        
        commandLine.innerHTML = `
            <span class="prompt">user@terminal:~/journey$</span>
            <span class="command">${command}</span>
        `;
        
        history.appendChild(commandLine);
    }

    addCommandOutput(type, content) {
        const history = document.getElementById('commandHistory');
        const output = document.createElement('div');
        output.className = `command-output ${type} fade-in`;
        
        output.innerHTML = `<div class="output-content">${content}</div>`;
        history.appendChild(output);
    }

    getHelpContent() {
        return `
            <h3>Available Commands:</h3>
            <ul>
                <li><strong>help</strong> - Show this help message</li>
                <li><strong>clear</strong> - Clear terminal screen</li>
                <li><strong>logs</strong> - View journey logs</li>
                <li><strong>about</strong> - About this project</li>
                <li><strong>rss</strong> - RSS feed information</li>
                <li><strong>status</strong> - System status</li>
                <li><strong>theme</strong> - Toggle dark/light theme</li>
                <li><strong>version</strong> - Show version information</li>
            </ul>
            <p><em>Use Tab for command completion and arrow keys for command history.</em></p>
        `;
    }

    getLogsContent() {
        return `
            <h3>Recent Learning Journey Logs:</h3>
            <div class="log-entries">
                <div class="log-entry">
                    <span class="log-date">2025-02-20</span>
                    <span class="log-title">CompTIA Project+ Certification Completed</span>
                    <span class="log-status completed">Certified</span>
                </div>
                <div class="log-entry">
                    <span class="log-date">2025-02-14</span>
                    <span class="log-title">Ubuntu VM Hardening Against CIS Benchmarks</span>
                    <span class="log-status completed">Completed</span>
                </div>
                <div class="log-entry">
                    <span class="log-date">2025-02-10</span>
                    <span class="log-title">CCNA Routing & Switching Labs (OSPF, EIGRP)</span>
                    <span class="log-status completed">Completed</span>
                </div>
                <div class="log-entry">
                    <span class="log-date">2025-01-28</span>
                    <span class="log-title">Interactive Terminal Portfolio Module</span>
                    <span class="log-status completed">Deployed</span>
                </div>
                <div class="log-entry">
                    <span class="log-date">2025-01-12</span>
                    <span class="log-title">AWS SysOps Administrator Concepts Study</span>
                    <span class="log-status completed">Completed</span>
                </div>
            </div>
            <p><em>Total entries: 5 | Last updated: 2025-02-20</em></p>
        `;
    }

    getAboutContent() {
        return `
            <h3>About NerdPioneer Terminal</h3>
            <p><strong>Developer:</strong> Ezekiel Obeisun Jr</p>
            <p><strong>Education:</strong> Cloud Computing Student @ Western Governors University</p>
            <p><strong>Focus:</strong> Cybersecurity + Network Engineering — building toward Defense Sector</p>
            <p><strong>Core Skills:</strong></p>
            <ul>
                <li>AWS, Azure, & Hybrid Cloud Infrastructure</li>
                <li>Cisco Networking (CCNA-level + labs in progress)</li>
                <li>Linux Administration & Python Automation</li>
                <li>Security Hardening (STIG, CIS Benchmarks)</li>
                <li>Incident Response & Threat Analysis</li>
            </ul>
            <p><strong>Mindset:</strong> "Every log is a step forward. 1% better each day."</p>
            <p><strong>Favorite Tool:</strong> tmux + coffee</p>
            <p><strong>Currently Reading:</strong> "Atomic Habits" by James Clear</p>
            <p><em>Visit <a href="https://1percentnerd.com" target="_blank" style="color: var(--text-accent);">1percentnerd.com</a> for my full portfolio</em></p>
        `;
    }

    getRSSContent() {
        return `
            <h3>RSS Feed Information</h3>
            <p><strong>Feed URL:</strong> <a href="https://1percentnerd.com/feed.xml" target="_blank" style="color: var(--text-accent);">https://1percentnerd.com/feed.xml</a></p>
            <p><strong>Status:</strong> <span style="color: var(--text-accent);">Active</span></p>
            <p><strong>Last Updated:</strong> 2025-02-20</p>
            <p><strong>Recent Posts:</strong></p>
            <ul>
                <li>CompTIA Project+ Certification Completed</li>
                <li>Building Defense-Grade Networks</li>
                <li>Hardened Ubuntu VM Against CIS Benchmarks</li>
                <li>CCNA Routing & Switching Labs (OSPF, EIGRP)</li>
                <li>Terminal Portfolio v2.1 Released</li>
                <li>AWS SysOps Study Notes</li>
            </ul>
            <p><em>Subscribe to stay updated on my learning journey!</em></p>
        `;
    }

    getStatusContent() {
        return `
            <h3>System Status</h3>
            <p><strong>Terminal:</strong> <span style="color: var(--text-accent);">Online</span></p>
            <p><strong>Theme:</strong> ${this.currentTheme}</p>
            <p><strong>Fullscreen:</strong> ${this.isFullscreen ? 'Enabled' : 'Disabled'}</p>
            <p><strong>Commands Executed:</strong> ${this.commandHistory.length}</p>
        `;
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        const input = document.getElementById('commandInput');
        
        if (direction === 'up') {
            this.historyIndex = Math.min(this.historyIndex + 1, this.commandHistory.length - 1);
        } else {
            this.historyIndex = Math.max(this.historyIndex - 1, -1);
        }
        
        if (this.historyIndex === -1) {
            input.value = '';
        } else {
            input.value = this.commandHistory[this.historyIndex];
        }
    }

    handleTabCompletion(input) {
        const commands = ['help', 'clear', 'logs', 'about', 'rss', 'status', 'theme', 'version'];
        const value = input.value.toLowerCase();
        const matches = commands.filter(cmd => cmd.startsWith(value));
        
        if (matches.length === 1) {
            input.value = matches[0];
        } else if (matches.length > 1) {
            this.addCommandOutput('info', `Possible completions: ${matches.join(', ')}`);
        }
    }

    clearTerminal() {
        const history = document.getElementById('commandHistory');
        history.innerHTML = '';
        this.addCommandOutput('system', 'Terminal cleared');
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    toggleFullscreen() {
        if (!this.isFullscreen) {
            document.documentElement.requestFullscreen();
            this.isFullscreen = true;
        } else {
            document.exitFullscreen();
            this.isFullscreen = false;
        }
        
        const fullscreenIcon = document.querySelector('#fullscreenToggle i');
        fullscreenIcon.className = this.isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
    }

    handleTerminalControl(action) {
        switch(action) {
            case 'close':
                if (confirm('Are you sure you want to close the terminal?')) {
                    window.close();
                }
                break;
            case 'minimize':
                this.addCommandOutput('system', 'Terminal minimized (demo mode)');
                break;
            case 'maximize':
                this.toggleFullscreen();
                break;
        }
    }

    loadSampleData() {
        // Load sample log data into sidebar
        const logItems = document.getElementById('logItems');
        const sampleLogs = [
            { title: 'CompTIA Project+ Certified', date: '2025-02-20', status: 'certified', tags: ['#certification', '#project-management'] },
            { title: 'Ubuntu VM Hardening', date: '2025-02-14', status: 'completed', tags: ['#linux', '#security', '#hardening'] },
            { title: 'CCNA Labs (OSPF, EIGRP)', date: '2025-02-10', status: 'completed', tags: ['#cisco', '#networking', '#routing'] },
            { title: 'Terminal Portfolio v2.1', date: '2025-01-28', status: 'deployed', tags: ['#javascript', '#web-development'] },
            { title: 'AWS SysOps Study', date: '2025-01-12', status: 'completed', tags: ['#aws', '#cloud', '#sysops'] }
        ];

        sampleLogs.forEach(log => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.innerHTML = `
                <div class="log-title">${log.title}</div>
                <div class="log-date">${log.date}</div>
                <div class="log-status ${log.status}">${log.status}</div>
            `;
            logItems.appendChild(logItem);
            
            // Detect tech stack from tags
            this.detectTechStack(log.tags);
        });
        
        // Update tech stack display
        this.updateTechStackDisplay();
    }

    hideLoadingOverlay() {
        setTimeout(() => {
            const overlay = document.getElementById('loadingOverlay');
            overlay.classList.add('hidden');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }, 1500);
    }

    scrollToBottom() {
        const history = document.getElementById('commandHistory');
        history.scrollTop = history.scrollHeight;
    }

    detectTechStack(tags) {
        const techMapping = {
            '#azure': 'Azure',
            '#gcp': 'GCP',
            '#python': 'Python',
            '#docker': 'Docker',
            '#kubernetes': 'Kubernetes',
            '#terraform': 'Terraform',
            '#ansible': 'Ansible'
        };

        tags.forEach(tag => {
            const tech = techMapping[tag.toLowerCase()];
            if (tech) {
                this.detectedTechStack.add(tech);
            }
        });
    }

    updateTechStackDisplay() {
        const techStack = document.getElementById('techStack');
        techStack.innerHTML = '';

        if (this.detectedTechStack.size === 0) {
            techStack.innerHTML = '<span class="tech-badge">Learning Journey</span>';
            return;
        }

        Array.from(this.detectedTechStack).forEach(tech => {
            const badge = document.createElement('span');
            badge.className = 'tech-badge';
            badge.textContent = tech;
            techStack.appendChild(badge);
        });
    }
}

// Initialize the terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TerminalJournal();
});

// Add additional CSS for new elements
const additionalStyles = `
    .log-entries {
        margin: 1rem 0;
    }
    
    .log-entry {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        margin: 0.25rem 0;
        background: var(--bg-glass);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-primary);
    }
    
    .log-date {
        color: var(--text-muted);
        font-size: 0.875rem;
    }
    
    .log-title {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .log-status {
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .log-status.completed {
        background: var(--text-accent);
        color: var(--bg-primary);
    }
    
    .log-status.certified {
        background: var(--text-info);
        color: var(--bg-primary);
    }
    
    .log-status.deployed {
        background: var(--text-warning);
        color: var(--bg-primary);
    }
    
    .command-output.help,
    .command-output.logs,
    .command-output.about,
    .command-output.rss,
    .command-output.status {
        border-left-color: var(--text-info);
    }
    
    .command-output.error {
        border-left-color: var(--text-error);
    }
    
    .command-output.system {
        border-left-color: var(--text-accent);
    }
    
    .command-output.info {
        border-left-color: var(--text-info);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
