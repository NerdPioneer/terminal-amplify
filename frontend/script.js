// Terminal Journal v3.0 - Advanced Interactive Scripts

class TerminalJournal {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentTheme = 'dark';
        this.isFullscreen = false;
        this.currentLogFile = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTerminal();
        this.loadSampleData();
        this.loadMobileData();
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

        // Theme toggle (now in left controls)
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Fullscreen toggle (now in left controls)
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


        // Mobile log panel toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.log-files-header::after') || e.target.textContent === '✕') {
                this.toggleLogPanel();
            }
        });

        // Add mobile menu button for logs
        this.addMobileLogButton();

        // Handle window resize for mobile responsiveness
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Add touch gestures for mobile
        this.addTouchGestures();

        // Mobile-specific event listeners
        this.setupMobileEventListeners();

    }

    initializeTerminal() {
        // Add authentic terminal startup sequence with realistic timing
        const startupSequence = [
            { text: 'NerdPioneer Terminal v3.0 - Initializing...', type: 'system', delay: 0 },
            { text: 'Loading configuration...', type: 'system', delay: 800 },
            { text: 'Mounting file systems...', type: 'system', delay: 1600 },
            { text: 'Starting services...', type: 'system', delay: 2400 },
            { text: 'Terminal ready. Type "help" for available commands.', type: 'success', delay: 3200 },
            { text: 'Connected to user@bunker', type: 'info', delay: 4000 }
        ];

        startupSequence.forEach(({ text, type, delay }) => {
            setTimeout(() => {
                this.addCommandOutput(type, text);
            }, delay);
        });

        // Add final welcome message after startup
        setTimeout(() => {
            this.addCommandOutput('info', 'Welcome to your learning journey terminal!');
            // Focus input after startup is complete
            document.getElementById('commandInput').focus();
        }, 5000);
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
            case 'cls':
                this.clearTerminal();
                return null;
            case 'logs':
            case 'list':
            case 'ls':
                return {
                    type: 'logs',
                    content: this.getLogsListContent()
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
            case 'ps':
                return {
                    type: 'status',
                    content: this.getStatusContent()
                };
            case 'version':
            case 'ver':
                return {
                    type: 'info',
                    content: 'Terminal Journal v3.0 - Modern Web Terminal Interface'
                };
            case 'date':
            case 'time':
                return {
                    type: 'info',
                    content: `Current time: ${new Date().toLocaleString()}`
                };
            case 'uptime':
                return {
                    type: 'info',
                    content: `System uptime: ${this.getUptime()}`
                };
            case 'neofetch':
                return {
                    type: 'neofetch',
                    content: this.getNeofetchContent()
                };
            case 'matrix':
                return {
                    type: 'matrix',
                    content: this.getMatrixContent()
                };
            case 'weather':
                return {
                    type: 'weather',
                    content: this.getWeatherContent()
                };
            case 'joke':
            case 'fun':
                return {
                    type: 'joke',
                    content: this.getJokeContent()
                };
            case 'projects':
            case 'proj':
                return {
                    type: 'projects',
                    content: this.getProjectsContent()
                };
            case 'contact':
            case 'social':
                return {
                    type: 'contact',
                    content: this.getContactContent()
                };
            case 'history':
            case 'hist':
                return {
                    type: 'history',
                    content: this.getHistoryContent()
                };
            case 'tree':
                return {
                    type: 'tree',
                    content: this.getTreeContent()
                };
            case 'cat':
                const filename = command.split(' ')[1];
                if (filename) {
                    const logFile = this.findLogFile(filename);
                    if (logFile) {
                        return {
                            type: 'info',
                            content: this.formatLogContent(logFile.content)
                        };
                    } else {
                return {
                    type: 'error',
                            content: `cat: ${filename}: No such file or directory`
                        };
                    }
                } else {
                    return {
                        type: 'error',
                        content: 'Usage: cat <filename> - Display file contents'
                    };
                }
            case 'pwd':
                return {
                    type: 'info',
                    content: '/home/user/terminal-journal'
                };
            case 'who':
                return {
                    type: 'info',
                    content: 'user     pts/0        ' + new Date().toLocaleString() + ' (terminal)'
                };
            case 'uname':
                return {
                    type: 'info',
                    content: 'TerminalOS 1.0.0 x86_64'
                };
            case 'echo':
                return {
                    type: 'info',
                    content: command.substring(5).trim() || 'echo: missing operand'
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
            <span class="prompt">user@bunker:~/bunker$</span>
            <span class="command">${command}</span>
        `;
        
        history.appendChild(commandLine);
    }

    addCommandOutput(type, content) {
        const history = document.getElementById('commandHistory');
        const output = document.createElement('div');
        output.className = `command-output ${type} fade-in`;
        
        // Add typing animation for terminal output
        this.typeText(output, content, type);
        history.appendChild(output);
    }

    typeText(element, text, type) {
        const outputContent = document.createElement('div');
        outputContent.className = 'output-content';
        element.appendChild(outputContent);
        
        let i = 0;
        // Adjust typing speed for mobile devices
        const isMobile = window.innerWidth <= 768;
        const typingSpeed = isMobile ? 
            (type === 'system' ? 10 : 15) : 
            (type === 'system' ? 20 : 30);
        
        const typeChar = () => {
            if (i < text.length) {
                outputContent.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeChar, typingSpeed);
            } else {
                // Add cursor blink effect at the end
                const cursor = document.createElement('span');
                cursor.className = 'typing-cursor';
                cursor.textContent = '█';
                outputContent.appendChild(cursor);
                
                // Remove cursor after a delay
                setTimeout(() => {
                    if (cursor.parentNode) {
                        cursor.parentNode.removeChild(cursor);
                    }
                }, 1000);
            }
        };
        
        typeChar();
    }

    getHelpContent() {
        return `
            <h3>Available Commands:</h3>
            <div class="help-sections">
                <div class="help-section">
                    <h4>System Commands</h4>
                    <ul>
                        <li><strong>help</strong> - Show this help message</li>
                        <li><strong>clear/cls</strong> - Clear terminal screen</li>
                        <li><strong>status/ps</strong> - System status</li>
                        <li><strong>uptime</strong> - System uptime</li>
                        <li><strong>date/time</strong> - Current date and time</li>
                        <li><strong>who</strong> - Show who is logged in</li>
                        <li><strong>uname</strong> - System information</li>
                        <li><strong>pwd</strong> - Print working directory</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>File & Content</h4>
                    <ul>
                        <li><strong>logs/ls/list</strong> - View journey logs</li>
                        <li><strong>tree</strong> - Display directory structure</li>
                        <li><strong>cat</strong> - Display file contents</li>
                        <li><strong>history/hist</strong> - Command history</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>Information</h4>
                    <ul>
                        <li><strong>projects/proj</strong> - Current projects</li>
                        <li><strong>contact/social</strong> - Contact information</li>
                        <li><strong>rss/feed</strong> - RSS feed information</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>Fun & Interactive</h4>
                    <ul>
                        <li><strong>neofetch</strong> - System information display</li>
                        <li><strong>matrix</strong> - Matrix-style animation</li>
                        <li><strong>weather</strong> - Weather information</li>
                        <li><strong>joke/fun</strong> - Random joke</li>
                        <li><strong>echo</strong> - Display text</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>Settings</h4>
                    <ul>
                        <li><strong>theme</strong> - Toggle dark/light theme</li>
                        <li><strong>version/ver</strong> - Show version information</li>
                    </ul>
                </div>
            </div>
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


    getUptime() {
        const startTime = new Date(Date.now() - (this.commandHistory.length * 1000 * 60));
        const uptime = Math.floor((Date.now() - startTime.getTime()) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    getNeofetchContent() {
        return `
            <div class="neofetch">
                <div class="neofetch-left">
                    <pre>
    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
                    </pre>
                </div>
                <div class="neofetch-right">
                    <p><strong>OS:</strong> TerminalOS 1.0.0 x86_64</p>
                    <p><strong>Host:</strong> terminal-amplify</p>
                    <p><strong>Kernel:</strong> 5.4.0-74-generic</p>
                    <p><strong>Uptime:</strong> ${this.getUptime()}</p>
                    <p><strong>Shell:</strong> Terminal Journal v3.0</p>
                    <p><strong>Theme:</strong> ${this.currentTheme}</p>
                    <p><strong>Terminal:</strong> Web Terminal</p>
                    <p><strong>CPU:</strong> Intel i7-12700K</p>
                    <p><strong>Memory:</strong> 32GB DDR4</p>
                    <p><strong>GPU:</strong> RTX 3080</p>
                </div>
            </div>
        `;
    }

    getMatrixContent() {
        return `
            <div class="matrix-container">
                <pre class="matrix-text">
01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100
01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100
01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100
01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100
01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100
                </pre>
                <p><em>Matrix mode activated! Welcome to the digital realm.</em></p>
            </div>
        `;
    }

    getWeatherContent() {
        const weatherData = [
            "☀️ Sunny - 72°F (22°C) - Perfect for coding!",
            "⛅ Partly Cloudy - 68°F (20°C) - Great weather for learning",
            "🌧️ Light Rain - 65°F (18°C) - Cozy indoor study weather",
            "❄️ Snow - 32°F (0°C) - Hot coffee and terminal time",
            "🌤️ Clear - 75°F (24°C) - Ideal for cloud computing studies"
        ];
        const randomWeather = weatherData[Math.floor(Math.random() * weatherData.length)];
        return `
            <h3>Current Weather</h3>
            <p><strong>Location:</strong> Terminal City</p>
            <p><strong>Condition:</strong> ${randomWeather}</p>
            <p><strong>Humidity:</strong> 45%</p>
            <p><strong>Wind:</strong> 5 mph NW</p>
            <p><strong>Visibility:</strong> 10 miles</p>
            <p><em>Weather data simulated for terminal environment</em></p>
        `;
    }

    getJokeContent() {
        const jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
            "Why don't programmers like nature? It has too many bugs! 🌿",
            "What do you call a programmer from Finland? Nerdic! 🇫🇮",
            "Why did the programmer quit his job? He didn't get arrays! 📊",
            "What's a programmer's favorite hangout place? The Foo Bar! 🍺",
            "Why do Java developers wear glasses? Because they can't C#! 👓",
            "What do you call a programmer who doesn't comment their code? A silent partner! 🤐"
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        return `
            <h3>Random Joke</h3>
            <p>${randomJoke}</p>
            <p><em>Type 'joke' for another one!</em></p>
        `;
    }


    getProjectsContent() {
        return `
            <h3>Current Projects</h3>
            <div class="project-list">
                <div class="project-item">
                    <h4>Terminal Amplify</h4>
                    <p>A serverless terminal portfolio built with AWS Amplify, S3, and Lambda</p>
                    <p><strong>Tech Stack:</strong> AWS, JavaScript, HTML/CSS</p>
                    <p><strong>Status:</strong> In Development</p>
                </div>
                <div class="project-item">
                    <h4>Cloud Infrastructure Lab</h4>
                    <p>Building scalable cloud infrastructure with Terraform and Ansible</p>
                    <p><strong>Tech Stack:</strong> AWS, Terraform, Ansible, Docker</p>
                    <p><strong>Status:</strong> Planning Phase</p>
                </div>
                <div class="project-item">
                    <h4>Network Monitoring Tool</h4>
                    <p>Python-based network monitoring and alerting system</p>
                    <p><strong>Tech Stack:</strong> Python, SNMP, Grafana, InfluxDB</p>
                    <p><strong>Status:</strong> Research Phase</p>
                </div>
            </div>
        `;
    }

    getContactContent() {
        return `
            <h3>Contact Information</h3>
            <div class="contact-grid">
                <div class="contact-item">
                    <strong>🌐 Website:</strong> <a href="https://1percentnerd.com" target="_blank" rel="noopener">1percentnerd.com</a>
                </div>
                <div class="contact-item">
                    <strong>📧 Email:</strong> hello@1percentnerd.com
                </div>
                <div class="contact-item">
                    <strong>💼 LinkedIn:</strong> <a href="https://linkedin.com/in/nerdpioneer" target="_blank" rel="noopener">linkedin.com/in/nerdpioneer</a>
                </div>
                <div class="contact-item">
                    <strong>🐙 GitHub:</strong> <a href="https://github.com/NerdPioneer" target="_blank" rel="noopener">github.com/NerdPioneer</a>
                </div>
                <div class="contact-item">
                    <strong>🐦 Twitter:</strong> <a href="https://twitter.com/nerdpioneer" target="_blank" rel="noopener">@nerdpioneer</a>
                </div>
            </div>
        `;
    }

    getHistoryContent() {
        if (this.commandHistory.length === 0) {
            return '<p>No commands in history yet.</p>';
        }
        
        let historyList = '<h3>Command History</h3><ul>';
        this.commandHistory.slice(0, 20).forEach((cmd, index) => {
            historyList += `<li>${index + 1}. ${cmd}</li>`;
        });
        historyList += '</ul>';
        
        if (this.commandHistory.length > 20) {
            historyList += `<p><em>Showing last 20 commands. Total: ${this.commandHistory.length}</em></p>`;
        }
        
        return historyList;
    }

    getTreeContent() {
        return `
            <h3>Directory Structure</h3>
            <pre class="tree-structure">
terminal-amplify/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── lambda/
│   ├── generateMetadata.js
│   └── package.json
├── logs/
│   ├── 2025-09-01-vpc.md
│   ├── 2025-09-02-lambda-deployment.md
│   └── 2025-09-03-amplify-setup.md
├── src/
│   ├── App.js
│   ├── components/
│   │   └── Terminal.jsx
│   └── assets/
│       ├── styles.css
│       └── terminal.js
├── public/
│   └── index.html
├── amplify.yml
├── package.json
└── README.md
            </pre>
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
        const commands = [
            'help', 'clear', 'cls', 'logs', 'list', 'ls', 'rss', 'feed',
            'status', 'ps', 'theme', 'version', 'ver', 'date', 'time', 'uptime', 'neofetch',
            'matrix', 'weather', 'joke', 'fun', 'projects', 'proj',
            'contact', 'social', 'history', 'hist', 'tree', 'cat', 'pwd', 'who', 'uname', 'echo'
        ];
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
        document.body.classList.toggle('light-theme', this.currentTheme === 'light');
        
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
        // Load sample log files into left sidebar
        const logFilesList = document.getElementById('logFilesList');
        const sampleLogFiles = [
            {
                name: 'learning-aws-vpc.md',
                date: '2025-09-01',
                preview: 'Today I dove deep into AWS VPC concepts. Finally understanding the difference between public and private subnets...',
                content: `# Learning AWS VPC - My Journey Begins

*September 1, 2025*

## What I Learned Today

Today was a breakthrough day! I finally wrapped my head around AWS VPC (Virtual Private Cloud) concepts that had been confusing me for weeks.

### The "Aha!" Moment

The biggest realization was understanding that **VPC is like creating your own private section of AWS**. It's not just about security - it's about having complete control over your network architecture.

### Key Concepts That Clicked

- **CIDR Blocks**: I used to think these were just random numbers, but now I understand they define the IP address range for your VPC
- **Subnets**: The difference between public and private subnets finally made sense when I visualized them as "rooms" in your VPC "house"
- **Route Tables**: These are like the "traffic directors" telling data where to go

### What I Built

I set up a basic VPC with:
- Public subnets for web-facing resources
- Private subnets for databases and internal services
- Security groups that actually make sense (not just random rules!)

### Challenges I Faced

- **NAT Gateway costs** - Ouch! $45/month just for internet access in private subnets
- **Route table confusion** - Took me 3 hours to figure out why my private subnet couldn't reach the internet
- **Security group rules** - Still learning the difference between inbound and outbound rules

### Tomorrow's Goals

- Set up a NAT Gateway (and budget for it!)
- Learn about VPC endpoints
- Experiment with VPC Flow Logs

*This learning journey is getting exciting!*`,
                tags: ['#learning', '#aws', '#networking', '#breakthrough']
            },
            {
                name: 'serverless-first-steps.md',
                date: '2025-09-02',
                preview: 'My first Lambda function deployment! The serverless world is fascinating but also intimidating...',
                content: `# My First Serverless Adventure

*September 2, 2025*

## The Serverless Learning Curve

Wow, serverless is a completely different mindset! Coming from traditional server management, this feels like magic - but expensive magic if you're not careful.

### What I Built Today

I created my first Lambda function that processes log files automatically. The idea is simple but powerful:
- When I upload a new learning log to S3
- Lambda automatically processes it
- Updates my learning index

### The "Magic" Moment

Watching my function trigger automatically when I uploaded a file was incredible. No servers to manage, no infrastructure to worry about - just code that runs when needed.

### Lessons Learned

**The Good:**
- **Pay-per-use pricing** - Only pay when your code actually runs
- **Automatic scaling** - Handles traffic spikes without thinking about it
- **No server management** - Focus on code, not infrastructure

**The Challenges:**
- **Cold starts** - First request can be slow (up to 10 seconds!)
- **Memory limits** - Only 10GB max, had to optimize my code
- **Timeout limits** - 15 minutes max execution time
- **Debugging is harder** - Can't just SSH into a server

### Code I Wrote

\`\`\`javascript
exports.handler = async (event) => {
    // Process the uploaded log file
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    
    console.log('Processing:', key);
    // ... rest of the processing logic
};
\`\`\`

### What Surprised Me

- **Event-driven architecture** is actually pretty elegant once you get it
- **Environment variables** are much easier to manage than I thought
- **IAM roles** are crucial - spent 2 hours debugging permissions!

### Next Steps

- Learn about EventBridge for more complex event routing
- Experiment with different Lambda runtimes
- Figure out how to handle errors gracefully

*Serverless is definitely the future, but it requires a different way of thinking!*`,
                tags: ['#learning', '#serverless', '#lambda', '#automation']
            },
            {
                name: 'frontend-deployment-joy.md',
                date: '2025-09-03',
                preview: 'Deployed my first frontend to AWS Amplify! The CI/CD pipeline is like having a personal DevOps engineer...',
                content: `# Frontend Deployment Made Simple

*September 3, 2025*

## From Localhost to Production

Today I deployed my terminal portfolio to AWS Amplify, and I'm honestly amazed at how smooth the process was. Coming from manual FTP uploads, this feels like magic.

### The Amplify Experience

**What I Love:**
- **Git-based deployment** - Push to GitHub, automatically deploys
- **Built-in CI/CD** - No need to set up Jenkins or GitHub Actions
- **Custom domains** - Easy SSL certificate management
- **Performance optimization** - Automatic image optimization and compression

### My Deployment Workflow

1. **Code locally** - Make changes to my terminal interface
2. **Commit and push** - \`git push origin main\`
3. **Watch the magic** - Amplify automatically builds and deploys
4. **Test in production** - Usually live within 2-3 minutes

### What I Learned About Frontend Hosting

**Before Amplify:**
- Manual file uploads via FTP
- No version control for deployments
- Manual SSL certificate management
- No performance optimization

**With Amplify:**
- Everything is automated
- Every deployment is tracked
- Built-in CDN for global performance
- Automatic HTTPS

### The Technical Details

- **Framework**: Plain HTML/CSS/JavaScript (no build process needed)
- **Custom Domain**: terminal.1percentnerd.com
- **CDN**: CloudFront distribution included
- **SSL**: Automatic certificate from AWS Certificate Manager

### Challenges I Overcame

- **Build failures** - Had to learn about build specifications
- **Environment variables** - Took time to understand how to pass them
- **Caching issues** - Learned about cache invalidation strategies

### Performance Wins

- **Page load time**: Under 2 seconds globally
- **Image optimization**: Automatic WebP conversion
- **Code splitting**: Automatic JavaScript bundling
- **Compression**: Gzip enabled by default

### What's Next

- Set up staging environment for testing
- Learn about Amplify's authentication features
- Experiment with server-side rendering

*This is exactly how modern web development should feel - simple, fast, and reliable!*`,
                tags: ['#learning', '#frontend', '#deployment', '#amplify']
            }
        ];

        sampleLogFiles.forEach((logFile, index) => {
            const logFileItem = document.createElement('div');
            logFileItem.className = 'log-file-item';
            if (index === 0) {
                logFileItem.classList.add('active');
                this.currentLogFile = logFile;
            }
            
            // Get icon based on log type
            const getLogIcon = (tags) => {
                if (tags.includes('#aws')) return '☁️';
                if (tags.includes('#lambda')) return '⚡';
                if (tags.includes('#amplify')) return '🚀';
                if (tags.includes('#security')) return '🔒';
                if (tags.includes('#networking')) return '🌐';
                return '📝';
            };
            
            logFileItem.innerHTML = `
                <div class="log-file-header">
                    <span class="log-file-icon">${getLogIcon(logFile.tags)}</span>
                    <div class="log-file-name">${logFile.name}</div>
                    <div class="log-file-date">${logFile.date}</div>
                </div>
                <div class="log-file-tags">
                    ${logFile.tags.map(tag => `<span class="log-file-tag">${tag.replace('#', '')}</span>`).join('')}
                </div>
                <div class="log-file-preview">${logFile.preview}</div>
            `;
            
            logFileItem.addEventListener('click', () => {
                this.selectLogFile(logFile, logFileItem);
            });
            
            logFilesList.appendChild(logFileItem);
        });
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


    selectLogFile(logFile, logFileItem) {
        // Remove active class from all log file items
        document.querySelectorAll('.log-file-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to selected item
        logFileItem.classList.add('active');
        
        // Set current log file
        this.currentLogFile = logFile;
        
        // Display log content in terminal
        this.displayLogContent(logFile);
    }

    displayLogContent(logFile) {
        // Clear terminal
        this.clearTerminal();
        
        // Add log file content as command output
        this.addCommandOutput('info', `Viewing log file: ${logFile.name}`);
        this.addCommandOutput('system', `Last updated: ${logFile.date}`);
        this.addCommandOutput('logs', this.formatLogContent(logFile.content));
    }

    formatLogContent(content) {
        // Simple markdown-like formatting for terminal display
        return content
            .replace(/^# (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h4>$1</h4>')
            .replace(/^### (.*$)/gim, '<h5>$1</h5>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>')
            .replace(/^✅ (.*$)/gim, '<span style="color: var(--text-success);">✅ $1</span>')
            .replace(/^❌ (.*$)/gim, '<span style="color: var(--text-error);">❌ $1</span>')
            .replace(/\n/g, '<br>');
    }


    updateActiveNavButton(activeBtn) {
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        activeBtn.classList.add('active');
    }

    findLogFile(filename) {
        const logFiles = [
            {
                name: 'vpc-setup.md',
                date: '2025-09-01',
                content: `# VPC Setup Log - 2025-09-01

## Overview
Setting up a comprehensive VPC infrastructure for the terminal-amplify project.

## Architecture
- **VPC CIDR**: 10.0.0.0/16
- **Public Subnets**: 10.0.1.0/24, 10.0.2.0/24
- **Private Subnets**: 10.0.10.0/24, 10.0.20.0/24
- **Availability Zones**: us-east-1a, us-east-1b

## Security Groups
- **Web Tier**: Allow HTTP/HTTPS from internet
- **App Tier**: Allow traffic from Web Tier only
- **DB Tier**: Allow traffic from App Tier only

## Next Steps
- Configure NAT Gateway for private subnet internet access
- Set up VPC endpoints for S3 access
- Implement VPC Flow Logs for monitoring`,
                tags: ['#aws', '#vpc', '#networking', '#security']
            },
            {
                name: 'lambda-deployment.md',
                date: '2025-09-02',
                content: `# Lambda Deployment Log - 2025-09-02

## Functions Deployed
1. **generateMetadata.js** - Processes log files and generates metadata
2. **updateIndex.js** - Updates the main index file

## Configuration
- **Runtime**: Node.js 18.x
- **Memory**: 256MB
- **Timeout**: 30 seconds
- **Environment Variables**:
  - S3_BUCKET: terminal-logs-bucket
  - REGION: us-east-1

## EventBridge Rules
- Trigger on S3 object creation
- Filter for .md files in logs/ prefix
- Target: generateMetadata function

## Testing
- ✅ S3 upload triggers Lambda
- ✅ Metadata generation works
- ✅ Error handling implemented`,
                tags: ['#aws', '#lambda', '#serverless', '#automation']
            },
            {
                name: 'amplify-setup.md',
                date: '2025-09-03',
                content: `# Amplify Setup Log - 2025-09-03

## Frontend Hosting
- **Framework**: Static HTML/CSS/JS
- **Build Command**: npm run build
- **Publish Directory**: frontend/
- **Custom Domain**: terminal.1percentnerd.com

## CI/CD Pipeline
- **Source**: GitHub repository
- **Branch**: main
- **Build Spec**: amplify.yml
- **Auto Deploy**: Enabled

## Environment Variables
- **NODE_ENV**: production
- **API_ENDPOINT**: https://api.terminal.1percentnerd.com

## Performance
- **CDN**: CloudFront distribution
- **Caching**: 24 hours for static assets
- **Compression**: Gzip enabled

## Security
- **HTTPS**: SSL certificate from ACM
- **Headers**: Security headers configured
- **CORS**: Properly configured for API access`,
                tags: ['#aws', '#amplify', '#frontend', '#cicd']
            }
        ];

        return logFiles.find(file => file.name === filename);
    }

    getLogsListContent() {
        const logFiles = [
            { name: 'vpc-setup.md', size: '2.1K', modified: '2025-09-01' },
            { name: 'lambda-deployment.md', size: '1.8K', modified: '2025-09-02' },
            { name: 'amplify-setup.md', size: '2.3K', modified: '2025-09-03' }
        ];
        
        let content = '<h3>Log Files Directory</h3><pre>';
        content += 'total ' + logFiles.length + '\n';
        content += 'drwxr-xr-x 3 user user 4096 Sep 18 10:32 .\n';
        content += 'drwxr-xr-x 5 user user 4096 Sep 18 10:32 ..\n';
        
        logFiles.forEach(file => {
            content += `-rw-r--r-- 1 user user ${file.size} ${file.modified} ${file.name}\n`;
        });
        
        content += '</pre>';
        content += '<p><em>Use "cat &lt;filename&gt;" to view file contents</em></p>';
        
        return content;
    }

    addMobileLogButton() {
        // Only add on mobile
        if (window.innerWidth <= 768) {
            const terminalStatus = document.querySelector('.terminal-status');
            
            // Check if button already exists
            if (!document.querySelector('.mobile-log-btn') && terminalStatus) {
                const mobileLogBtn = document.createElement('button');
                mobileLogBtn.className = 'mobile-log-btn';
                mobileLogBtn.innerHTML = '<i class="fas fa-list"></i>';
                mobileLogBtn.title = 'Toggle Log Files';
                mobileLogBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMobileLogView();
                });
                
                terminalStatus.appendChild(mobileLogBtn);
            }
        }
    }

    toggleLogPanel() {
        const logPanel = document.getElementById('logFilesPanel');
        logPanel.classList.toggle('open');
        
        // Prevent body scroll when panel is open
        if (logPanel.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    toggleMobileLogView() {
        const mobileLogView = document.getElementById('mobileLogView');
        const mainContent = document.querySelector('.main-content');
        
        if (mobileLogView && mainContent) {
            if (mobileLogView.style.display === 'none' || mobileLogView.style.display === '') {
                // Show mobile log view
                mobileLogView.style.display = 'block';
                mainContent.style.display = 'none';
                this.populateMobileLogList();
            } else {
                // Show terminal
                mobileLogView.style.display = 'none';
                mainContent.style.display = 'block';
            }
        }
    }

    handleResize() {
        // Re-add mobile log button if needed
        if (window.innerWidth <= 768) {
            this.addMobileLogButton();
            // Load mobile data if not already loaded
            this.loadMobileData();
        } else {
            // Remove mobile log button on desktop
            const mobileBtn = document.querySelector('.mobile-log-btn');
            if (mobileBtn) {
                mobileBtn.remove();
            }
            
            // Close log panel on desktop
            const logPanel = document.getElementById('logFilesPanel');
            logPanel.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    addTouchGestures() {
        const logPanel = document.getElementById('logFilesPanel');
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        // Touch start
        logPanel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        // Touch move
        logPanel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            // Only allow swipe to close from the right
            if (diffX < -50 && logPanel.classList.contains('open')) {
                this.toggleLogPanel();
                isDragging = false;
            }
        }, { passive: true });

        // Touch end
        logPanel.addEventListener('touchend', () => {
            isDragging = false;
        }, { passive: true });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (logPanel.classList.contains('open') && 
                !logPanel.contains(e.target) && 
                !e.target.closest('.mobile-log-btn')) {
                this.toggleLogPanel();
            }
        });
    }

    setupMobileEventListeners() {
        // Back button for mobile markdown viewer
        const backBtn = document.getElementById('backToLogs');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showMobileLogList();
            });
        }
    }

    loadMobileData() {
        // Only load mobile data if on mobile
        if (window.innerWidth <= 768) {
            this.populateMobileLogList();
        }
    }

    populateMobileLogList() {
        const mobileLogList = document.getElementById('mobileLogList');
        const mobileLogCount = document.getElementById('mobileLogCount');
        
        if (!mobileLogList) return;

        const logFiles = [
            {
                name: 'learning-aws-vpc.md',
                date: '2025-09-01',
                preview: 'Today I dove deep into AWS VPC concepts. Finally understanding the difference between public and private subnets...',
                content: `# Learning AWS VPC - My Journey Begins

*September 1, 2025*

## What I Learned Today

Today was a breakthrough day! I finally wrapped my head around AWS VPC (Virtual Private Cloud) concepts that had been confusing me for weeks.

### The "Aha!" Moment

The biggest realization was understanding that **VPC is like creating your own private section of AWS**. It's not just about security - it's about having complete control over your network architecture.

### Key Concepts That Clicked

- **CIDR Blocks**: I used to think these were just random numbers, but now I understand they define the IP address range for your VPC
- **Subnets**: The difference between public and private subnets finally made sense when I visualized them as "rooms" in your VPC "house"
- **Route Tables**: These are like the "traffic directors" telling data where to go

### What I Built

I set up a basic VPC with:
- Public subnets for web-facing resources
- Private subnets for databases and internal services
- Security groups that actually make sense (not just random rules!)

### Challenges I Faced

- **NAT Gateway costs** - Ouch! $45/month just for internet access in private subnets
- **Route table confusion** - Took me 3 hours to figure out why my private subnet couldn't reach the internet
- **Security group rules** - Still learning the difference between inbound and outbound rules

### Tomorrow's Goals

- Set up a NAT Gateway (and budget for it!)
- Learn about VPC endpoints
- Experiment with VPC Flow Logs

*This learning journey is getting exciting!*`,
                tags: ['#learning', '#aws', '#networking', '#breakthrough']
            },
            {
                name: 'serverless-first-steps.md',
                date: '2025-09-02',
                preview: 'My first Lambda function deployment! The serverless world is fascinating but also intimidating...',
                content: `# My First Serverless Adventure

*September 2, 2025*

## The Serverless Learning Curve

Wow, serverless is a completely different mindset! Coming from traditional server management, this feels like magic - but expensive magic if you're not careful.

### What I Built Today

I created my first Lambda function that processes log files automatically. The idea is simple but powerful:
- When I upload a new learning log to S3
- Lambda automatically processes it
- Updates my learning index

### The "Magic" Moment

Watching my function trigger automatically when I uploaded a file was incredible. No servers to manage, no infrastructure to worry about - just code that runs when needed.

### Lessons Learned

**The Good:**
- **Pay-per-use pricing** - Only pay when your code actually runs
- **Automatic scaling** - Handles traffic spikes without thinking about it
- **No server management** - Focus on code, not infrastructure

**The Challenges:**
- **Cold starts** - First request can be slow (up to 10 seconds!)
- **Memory limits** - Only 10GB max, had to optimize my code
- **Timeout limits** - 15 minutes max execution time
- **Debugging is harder** - Can't just SSH into a server

### Code I Wrote

\`\`\`javascript
exports.handler = async (event) => {
    // Process the uploaded log file
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    
    console.log('Processing:', key);
    // ... rest of the processing logic
};
\`\`\`

### What Surprised Me

- **Event-driven architecture** is actually pretty elegant once you get it
- **Environment variables** are much easier to manage than I thought
- **IAM roles** are crucial - spent 2 hours debugging permissions!

### Next Steps

- Learn about EventBridge for more complex event routing
- Experiment with different Lambda runtimes
- Figure out how to handle errors gracefully

*Serverless is definitely the future, but it requires a different way of thinking!*`,
                tags: ['#learning', '#serverless', '#lambda', '#automation']
            },
            {
                name: 'frontend-deployment-joy.md',
                date: '2025-09-03',
                preview: 'Deployed my first frontend to AWS Amplify! The CI/CD pipeline is like having a personal DevOps engineer...',
                content: `# Frontend Deployment Made Simple

*September 3, 2025*

## From Localhost to Production

Today I deployed my terminal portfolio to AWS Amplify, and I'm honestly amazed at how smooth the process was. Coming from manual FTP uploads, this feels like magic.

### The Amplify Experience

**What I Love:**
- **Git-based deployment** - Push to GitHub, automatically deploys
- **Built-in CI/CD** - No need to set up Jenkins or GitHub Actions
- **Custom domains** - Easy SSL certificate management
- **Performance optimization** - Automatic image optimization and compression

### My Deployment Workflow

1. **Code locally** - Make changes to my terminal interface
2. **Commit and push** - \`git push origin main\`
3. **Watch the magic** - Amplify automatically builds and deploys
4. **Test in production** - Usually live within 2-3 minutes

### What I Learned About Frontend Hosting

**Before Amplify:**
- Manual file uploads via FTP
- No version control for deployments
- Manual SSL certificate management
- No performance optimization

**With Amplify:**
- Everything is automated
- Every deployment is tracked
- Built-in CDN for global performance
- Automatic HTTPS

### The Technical Details

- **Framework**: Plain HTML/CSS/JavaScript (no build process needed)
- **Custom Domain**: terminal.1percentnerd.com
- **CDN**: CloudFront distribution included
- **SSL**: Automatic certificate from AWS Certificate Manager

### Challenges I Overcame

- **Build failures** - Had to learn about build specifications
- **Environment variables** - Took time to understand how to pass them
- **Caching issues** - Learned about cache invalidation strategies

### Performance Wins

- **Page load time**: Under 2 seconds globally
- **Image optimization**: Automatic WebP conversion
- **Code splitting**: Automatic JavaScript bundling
- **Compression**: Gzip enabled by default

### What's Next

- Set up staging environment for testing
- Learn about Amplify's authentication features
- Experiment with server-side rendering

*This is exactly how modern web development should feel - simple, fast, and reliable!*`,
                tags: ['#learning', '#frontend', '#deployment', '#amplify']
            }
        ];

        // Update count
        if (mobileLogCount) {
            mobileLogCount.textContent = `${logFiles.length} entries`;
        }

        // Clear existing content
        mobileLogList.innerHTML = '';

        // Populate mobile log list
        logFiles.forEach((logFile, index) => {
            const logItem = document.createElement('div');
            logItem.className = 'mobile-log-item';
            
            // Get icon based on log type
            const getLogIcon = (tags) => {
                if (tags.includes('#aws')) return '☁️';
                if (tags.includes('#lambda')) return '⚡';
                if (tags.includes('#amplify')) return '🚀';
                if (tags.includes('#security')) return '🔒';
                if (tags.includes('#networking')) return '🌐';
                return '📝';
            };
            
            logItem.innerHTML = `
                <div class="mobile-log-item-header">
                    <span class="mobile-log-icon">${getLogIcon(logFile.tags)}</span>
                    <div class="mobile-log-title">
                        <div class="mobile-log-name">${logFile.name}</div>
                        <div class="mobile-log-date">${logFile.date}</div>
                    </div>
                </div>
                <div class="mobile-log-tags">
                    ${logFile.tags.map(tag => `<span class="mobile-log-tag">${tag.replace('#', '')}</span>`).join('')}
                </div>
                <div class="mobile-log-preview">${logFile.preview}</div>
            `;
            
            logItem.addEventListener('click', () => {
                this.showMobileMarkdownViewer(logFile);
            });
            
            mobileLogList.appendChild(logItem);
        });
    }

    showMobileMarkdownViewer(logFile) {
        const logView = document.getElementById('mobileLogView');
        const markdownViewer = document.getElementById('mobileMarkdownViewer');
        const viewerTitle = document.getElementById('viewerTitle');
        const viewerContent = document.getElementById('mobileViewerContent');
        
        if (!logView || !markdownViewer || !viewerTitle || !viewerContent) return;
        
        // Hide log list, show markdown viewer
        logView.style.display = 'none';
        markdownViewer.classList.add('active');
        
        // Set title and content
        viewerTitle.textContent = logFile.name;
        viewerContent.innerHTML = this.formatMarkdownContent(logFile.content);
    }

    showMobileLogList() {
        const logView = document.getElementById('mobileLogView');
        const markdownViewer = document.getElementById('mobileMarkdownViewer');
        
        if (!logView || !markdownViewer) return;
        
        // Show log list, hide markdown viewer
        logView.style.display = 'block';
        markdownViewer.classList.remove('active');
    }

    formatMarkdownContent(content) {
        return content
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$3</h3>')
            .replace(/^#### (.*$)/gim, '<h4>$4</h4>')
            .replace(/^##### (.*$)/gim, '<h5>$5</h5>')
            .replace(/^###### (.*$)/gim, '<h6>$6</h6>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>')
            .replace(/^✅ (.*$)/gim, '<span style="color: var(--text-success);">✅ $1</span>')
            .replace(/^❌ (.*$)/gim, '<span style="color: var(--text-error);">❌ $1</span>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
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
    
    /* New command output styles */
    .help-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .help-section h4 {
        color: var(--text-accent);
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .help-section ul {
        margin: 0;
        padding-left: 1rem;
    }
    
    .help-section li {
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
    }
    
    .neofetch {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
    }
    
    .neofetch-left pre {
        margin: 0;
        font-size: 0.6rem;
        line-height: 1.2;
        color: var(--text-accent);
    }
    
    .neofetch-right {
        flex: 1;
    }
    
    .neofetch-right p {
        margin: 0.25rem 0;
        font-size: 0.875rem;
    }
    
    .matrix-container {
        text-align: center;
    }
    
    .matrix-text {
        font-family: 'Courier New', monospace;
        font-size: 0.7rem;
        line-height: 1.1;
        color: var(--text-accent);
        margin: 1rem 0;
        overflow-x: auto;
    }
    
    .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .skill-category h4 {
        color: var(--text-accent);
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .skill-category ul {
        margin: 0;
        padding-left: 1rem;
    }
    
    .skill-category li {
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
    }
    
    .project-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .project-item {
        padding: 1rem;
        background: var(--bg-glass);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-primary);
    }
    
    .project-item h4 {
        color: var(--text-accent);
        margin-bottom: 0.5rem;
    }
    
    .project-item p {
        margin: 0.25rem 0;
        font-size: 0.875rem;
    }
    
    .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 0.5rem;
        margin: 1rem 0;
    }
    
    .contact-item {
        padding: 0.5rem;
        background: var(--bg-glass);
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
    }
    
    .contact-item a {
        color: var(--text-accent);
        text-decoration: none;
    }
    
    .contact-item a:hover {
        text-decoration: underline;
    }
    
    .tree-structure {
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        line-height: 1.4;
        color: var(--text-secondary);
        background: var(--bg-glass);
        padding: 1rem;
        border-radius: var(--radius-md);
        overflow-x: auto;
        margin: 1rem 0;
    }
    
    .command-output.neofetch {
        border-left-color: var(--text-success);
    }
    
    .command-output.matrix {
        border-left-color: var(--text-accent);
    }
    
    .command-output.weather {
        border-left-color: var(--text-info);
    }
    
    .command-output.joke {
        border-left-color: var(--text-warning);
    }
    
    .command-output.skills {
        border-left-color: var(--text-accent);
    }
    
    .command-output.projects {
        border-left-color: var(--text-info);
    }
    
    .command-output.contact {
        border-left-color: var(--text-success);
    }
    
    .command-output.history {
        border-left-color: var(--text-muted);
    }
    
    .command-output.tree {
        border-left-color: var(--text-secondary);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
