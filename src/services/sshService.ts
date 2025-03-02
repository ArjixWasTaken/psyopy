import { SSHConnection } from '../types';

// Mock implementation of node-ssh
class NodeSSH {
  private _isConnected: boolean = false;
  private currentConnection: SSHConnection | null = null;
  private commandHistory: string[] = [];
  private mockFileSystem: Record<string, Record<string, string>> = {
    '/home/user': {
      'file1.txt': 'This is the content of file1.txt',
      'file2.txt': 'This is the content of file2.txt',
      '.bashrc': 'export PATH=$PATH:/usr/local/bin',
    },
    '/home/user/Documents': {
      'project1.md': '# Project 1\n\nThis is a markdown file for Project 1',
      'notes.txt': 'Important notes for the project',
    },
    '/home/user/Downloads': {
      'image.jpg': '[binary data]',
      'archive.zip': '[binary data]',
    },
    '/var/log': {
      'syslog': 'May 15 12:34:56 server systemd[1]: Started System Logging Service.',
      'auth.log': 'May 15 12:34:56 server sshd[1234]: Accepted publickey for user from 192.168.1.100',
    },
  };
  
  private currentDirectory: string = '/home/user';
  private connectionListeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    console.log('Mock SSH client initialized');
  }

  // Connect to SSH server
  async connect(config: {
    host: string;
    port: number;
    username: string;
    password?: string;
    privateKey?: string;
  }): Promise<NodeSSH> {
    return new Promise((resolve, reject) => {
      // Simulate connection delay
      setTimeout(() => {
        if (config.host && config.username) {
          this._isConnected = true;
          this.currentConnection = {
            id: 'mock-connection',
            name: 'Mock Connection',
            host: config.host,
            port: config.port,
            username: config.username,
            authType: config.password ? 'password' : 'key',
            password: config.password,
            keyPath: config.privateKey,
          };
          
          // Notify listeners
          this.notifyListeners('connected', {
            host: config.host,
            username: config.username,
          });
          
          resolve(this);
        } else {
          reject(new Error('Invalid connection parameters'));
        }
      }, 500);
    });
  }

  // Disconnect from SSH server
  async dispose(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this._isConnected) {
          this._isConnected = false;
          this.currentConnection = null;
          
          // Notify listeners
          this.notifyListeners('disconnected', {});
        }
        resolve();
      }, 200);
    });
  }

  // Execute command on SSH server
  async execCommand(command: string, options: any = {}): Promise<{
    stdout: string;
    stderr: string;
    code: number;
  }> {
    return new Promise((resolve, reject) => {
      if (!this._isConnected) {
        reject(new Error('Not connected to SSH server'));
        return;
      }

      // Add command to history
      this.commandHistory.push(command);
      
      // Notify listeners
      this.notifyListeners('command', { command });

      // Simulate command execution delay
      setTimeout(() => {
        // Process command
        const result = this.processCommand(command);
        resolve(result);
      }, 100);
    });
  }

  // Process command and return mock result
  private processCommand(command: string): {
    stdout: string;
    stderr: string;
    code: number;
  } {
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'ls':
        return this.handleLs(args);
      case 'cd':
        return this.handleCd(args);
      case 'cat':
        return this.handleCat(args);
      case 'pwd':
        return this.handlePwd();
      case 'echo':
        return this.handleEcho(args);
      case 'whoami':
        return this.handleWhoami();
      case 'ps':
        return this.handlePs();
      case 'grep':
        return this.handleGrep(args);
      case 'mkdir':
        return this.handleMkdir(args);
      case 'touch':
        return this.handleTouch(args);
      case 'rm':
        return this.handleRm(args);
      case 'uname':
        return this.handleUname(args);
      case 'df':
        return this.handleDf();
      case 'free':
        return this.handleFree();
      case 'uptime':
        return this.handleUptime();
      default:
        return {
          stdout: '',
          stderr: `${cmd}: command not found`,
          code: 127,
        };
    }
  }

  // Handle ls command
  private handleLs(args: string[]): { stdout: string; stderr: string; code: number } {
    let path = this.currentDirectory;
    
    if (args.length > 0 && args[0] !== '-l' && args[0] !== '-la' && args[0] !== '-a') {
      path = this.resolvePath(args[0]);
    }

    if (this.mockFileSystem[path]) {
      const files = Object.keys(this.mockFileSystem[path]);
      
      // Handle ls -l format
      if (args.includes('-l') || args.includes('-la')) {
        const output = files.map(file => {
          const isHidden = file.startsWith('.');
          if (isHidden && !args.includes('-a') && !args.includes('-la')) {
            return null;
          }
          
          const isDirectory = this.mockFileSystem[`${path}/${file}`] !== undefined;
          const permissions = isDirectory ? 'drwxr-xr-x' : '-rw-r--r--';
          const size = isDirectory ? 4096 : this.mockFileSystem[path][file].length;
          const date = 'May 15 12:34';
          
          return `${permissions} 1 ${this.currentConnection?.username} ${this.currentConnection?.username} ${size} ${date} ${file}`;
        }).filter(Boolean).join('\n');
        
        return {
          stdout: output,
          stderr: '',
          code: 0,
        };
      }
      
      // Regular ls
      const output = files
        .filter(file => !file.startsWith('.') || args.includes('-a') || args.includes('-la'))
        .join('  ');
      
      return {
        stdout: output,
        stderr: '',
        code: 0,
      };
    }

    return {
      stdout: '',
      stderr: `ls: cannot access '${path}': No such file or directory`,
      code: 1,
    };
  }

  // Handle cd command
  private handleCd(args: string[]): { stdout: string; stderr: string; code: number } {
    if (args.length === 0 || args[0] === '~') {
      this.currentDirectory = '/home/user';
      return {
        stdout: '',
        stderr: '',
        code: 0,
      };
    }

    const path = this.resolvePath(args[0]);
    
    if (this.mockFileSystem[path]) {
      this.currentDirectory = path;
      return {
        stdout: '',
        stderr: '',
        code: 0,
      };
    }

    return {
      stdout: '',
      stderr: `cd: no such directory: ${args[0]}`,
      code: 1,
    };
  }

  // Handle cat command
  private handleCat(args: string[]): { stdout: string; stderr: string; code: number } {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'cat: missing operand',
        code: 1,
      };
    }

    const path = this.resolvePath(args[0]);
    const dirPath = path.substring(0, path.lastIndexOf('/'));
    const fileName = path.substring(path.lastIndexOf('/') + 1);

    if (this.mockFileSystem[dirPath] && this.mockFileSystem[dirPath][fileName]) {
      return {
        stdout: this.mockFileSystem[dirPath][fileName],
        stderr: '',
        code: 0,
      };
    }

    return {
      stdout: '',
      stderr: `cat: ${args[0]}: No such file or directory`,
      code: 1,
    };
  }

  // Handle pwd command
  private handlePwd(): { stdout: string; stderr: string; code: number } {
    return {
      stdout: this.currentDirectory,
      stderr: '',
      code: 0,
    };
  }

  // Handle echo command
  private handleEcho(args: string[]): { stdout: string; stderr: string; code: number } {
    return {
      stdout: args.join(' '),
      stderr: '',
      code: 0,
    };
  }

  // Handle whoami command
  private handleWhoami(): { stdout: string; stderr: string; code: number } {
    return {
      stdout: this.currentConnection?.username || 'user',
      stderr: '',
      code: 0,
    };
  }

  // Handle ps command
  private handlePs(): { stdout: string; stderr: string; code: number } {
    return {
      stdout: `  PID TTY          TIME CMD
  1 ?        00:00:01 systemd
  2 ?        00:00:00 kthreadd
 10 ?        00:00:00 rcu_sched
 11 ?        00:00:00 rcu_bh
 12 ?        00:00:00 migration/0
 13 ?        00:00:00 watchdog/0
 14 ?        00:00:00 kdevtmpfs
 15 ?        00:00:00 netns
 16 ?        00:00:00 khungtaskd
 17 ?        00:00:00 oom_reaper
 18 ?        00:00:00 writeback
 19 ?        00:00:00 kcompactd0
 20 ?        00:00:00 ksmd
 21 ?        00:00:00 khugepaged
 22 ?        00:00:00 crypto
 23 ?        00:00:00 kintegrityd
 24 ?        00:00:00 bioset
 25 ?        00:00:00 kblockd
 26 ?        00:00:00 ata_sff
 27 ?        00:00:00 md
 28 ?        00:00:00 devfreq_wq
 29 ?        00:00:00 watchdogd
 30 ?        00:00:00 kswapd0
 31 ?        00:00:00 vmstat
 32 ?        00:00:00 ecryptfs-kthrea
 33 ?        00:00:00 kthrotld
 34 ?        00:00:00 acpi_thermal_pm
 35 ?        00:00:00 bioset
 36 ?        00:00:00 bioset
 37 ?        00:00:00 bioset
 38 ?        00:00:00 bioset
 39 ?        00:00:00 bioset
 40 ?        00:00:00 bioset
 41 ?        00:00:00 bioset
 42 ?        00:00:00 bioset
 43 ?        00:00:00 bioset
 44 ?        00:00:00 bioset
 45 ?        00:00:00 bioset
 46 ?        00:00:00 bioset
 47 ?        00:00:00 bioset
 48 ?        00:00:00 bioset
 49 ?        00:00:00 bioset
 50 ?        00:00:00 bioset
 51 ?        00:00:00 ipv6_addrconf
 52 ?        00:00:00 deferwq
 53 ?        00:00:00 charger_manager
 54 ?        00:00:00 bioset
 55 ?        00:00:00 bioset
 56 ?        00:00:00 bioset
 57 ?        00:00:00 bioset
 58 ?        00:00:00 bioset
 59 ?        00:00:00 bioset
 60 ?        00:00:00 bioset
 61 ?        00:00:00 bioset
 62 ?        00:00:00 bioset
 63 ?        00:00:00 bioset
 64 ?        00:00:00 bioset
 65 ?        00:00:00 bioset
 66 ?        00:00:00 bioset
 67 ?        00:00:00 bioset
 68 ?        00:00:00 bioset
 69 ?        00:00:00 bioset
 70 ?        00:00:00 scsi_eh_0
 71 ?        00:00:00 scsi_tmf_0
 72 ?        00:00:00 scsi_eh_1
 73 ?        00:00:00 scsi_tmf_1
 74 ?        00:00:00 scsi_eh_2
 75 ?        00:00:00 scsi_tmf_2
 76 ?        00:00:00 scsi_eh_3
 77 ?        00:00:00 scsi_tmf_3
 78 ?        00:00:00 scsi_eh_4
 79 ?        00:00:00 scsi_tmf_4
 80 ?        00:00:00 scsi_eh_5
 81 ?        00:00:00 scsi_tmf_5
 82 ?        00:00:00 bioset
 83 ?        00:00:00 bioset
 84 ?        00:00:00 bioset
 85 ?        00:00:00 bioset
 86 ?        00:00:00 bioset
 87 ?        00:00:00 bioset
 88 ?        00:00:00 bioset
 89 ?        00:00:00 bioset
 90 ?        00:00:00 bioset
 91 ?        00:00:00 bioset
 92 ?        00:00:00 bioset
 93 ?        00:00:00 bioset
 94 ?        00:00:00 bioset
 95 ?        00:00:00 bioset
 96 ?        00:00:00 bioset
 97 ?        00:00:00 bioset
 98 ?        00:00:00 kworker/0:1H
 99 ?        00:00:00 kworker/u2:1
100 ?        00:00:00 kworker/u2:2
101 ?        00:00:00 jbd2/sda1-8
102 ?        00:00:00 ext4-rsv-conver
103 ?        00:00:00 systemd-journal
104 ?        00:00:00 systemd-udevd
105 ?        00:00:00 systemd-network
106 ?        00:00:00 systemd-resolve
107 ?        00:00:00 systemd-timesyn
108 ?        00:00:00 accounts-daemon
109 ?        00:00:00 acpid
110 ?        00:00:00 avahi-daemon
111 ?        00:00:00 cron
112 ?        00:00:00 dbus-daemon
113 ?        00:00:00 NetworkManager
114 ?        00:00:00 irqbalance
115 ?        00:00:00 networkd-dispat
116 ?        00:00:00 polkitd
117 ?        00:00:00 rsyslogd
118 ?        00:00:00 snapd
119 ?        00:00:00 sshd
120 ?        00:00:00 systemd-logind
121 ?        00:00:00 udisksd
122 ?        00:00:00 wpa_supplicant
123 ?        00:00:00 avahi-daemon
124 ?        00:00:00 dhclient
125 ?        00:00:00 dnsmasq
126 ?        00:00:00 lightdm
127 ?        00:00:00 Xorg
128 ?        00:00:00 lightdm
129 ?        00:00:00 systemd
130 ?        00:00:00 (sd-pam)
131 ?        00:00:00 gnome-keyring-d
132 ?        00:00:00 upstart
133 ?        00:00:00 upstart-udev-br
134 ?        00:00:00 dbus-daemon
135 ?        00:00:00 window-stack-br
136 ?        00:00:00 ibus-daemon
137 ?        00:00:00 ibus-dconf
138 ?        00:00:00 ibus-ui-gtk3
139 ?        00:00:00 ibus-x11
140 ?        00:00:00 at-spi-bus-laun
141 ?        00:00:00 dbus-daemon
142 ?        00:00:00 at-spi2-registr
143 ?        00:00:00 bamfdaemon
144 ?        00:00:00 compiz
145 ?        00:00:00 ibus-engine-sim
146 ?        00:00:00 dconf-service
147 ?        00:00:00 nautilus
148 ?        00:00:00 nm-applet
149 ?        00:00:00 polkit-gnome-au
150 ?        00:00:00 indicator-messa
151 ?        00:00:00 indicator-bluet
152 ?        00:00:00 indicator-power
153 ?        00:00:00 indicator-datet
154 ?        00:00:00 indicator-keybo
155 ?        00:00:00 indicator-sound
156 ?        00:00:00 indicator-print
157 ?        00:00:00 indicator-sessi
158 ?        00:00:00 indicator-appli
159 ?        00:00:00 evolution-sourc
160 ?        00:00:00 unity-fallback-
161 ?        00:00:00 gnome-software
162 ?        00:00:00 update-notifier
163 ?        00:00:00 upowerd
164 ?        00:00:00 evolution-calen
165 ?        00:00:00 evolution-addre
166 ?        00:00:00 evolution-calen
167 ?        00:00:00 evolution-addre
168 ?        00:00:00 gvfsd
169 ?        00:00:00 gvfsd-fuse
170 ?        00:00:00 gvfs-udisks2-vo
171 ?        00:00:00 gvfs-goa-volume
172 ?        00:00:00 goa-daemon
173 ?        00:00:00 goa-identity-se
174 ?        00:00:00 gvfs-afc-volume
175 ?        00:00:00 gvfs-gphoto2-vo
176 ?        00:00:00 gvfs-mtp-volume
177 ?        00:00:00 bash
178 ?        00:00:00 ps
`,
      stderr: '',
      code: 0,
    };
  }

  // Handle grep command
  private handleGrep(args: string[]): { stdout: string; stderr: string; code: number } {
    if (args.length < 2) {
      return {
        stdout: '',
        stderr: 'grep: missing pattern',
        code: 1,
      };
    }

    const pattern = args[0];
    const filename = args[1];
    const path = this.resolvePath(filename);
    const dirPath = path.substring(0, path.lastIndexOf('/'));
    const fileName = path.substring(path.lastIndexOf('/') + 1);

    if (this.mockFileSystem[dirPath] && this.mockFileSystem[dirPath][fileName]) {
      const content = this.mockFileSystem[dirPath][fileName];
      const lines = content.split('\n');
      const matchedLines = lines.filter(line => line.includes(pattern));
      
      return {
        stdout: matchedLines.join('\n'),
        stderr: '',
        code: matchedLines.length > 0 ? 0 : 1,
      };
    }

    return {
      stdout: '',
      stderr: `grep: ${filename}: No such file or directory`,
      code: 1,
    };
  }

  // Handle mkdir command
  private handleMkdir(args: string[]): { stdout: string; stderr: string; code: number } {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'mkdir: missing operand',
        code: 1,
      };
    }

    const path = this.resolvePath(args[0]);
    
    // Mock creating directory
    this.mockFileSystem[path] = {};
    
    return {
      stdout: '',
      stderr: '',
      code: 0,
    };
  }

  // Handle touch command
  private handleTouch(args: string[]): { stdout: string; stderr: string; code: number } {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'touch: missing file operand',
        code: 1,
      };
    }

    const path = this.resolvePath(args[0]);
    const dirPath = path.substring(0, path.lastIndexOf('/'));
    const fileName = path.substring(path.lastIndexOf('/') + 1);

    if (this.mockFileSystem[dirPath]) {
      this.mockFileSystem[dirPath][fileName] = '';
      return {
        stdout: '',
        stderr: '',
        code: 0,
      };
    }

    return {
      stdout: '',
      stderr: `touch: cannot touch '${args[0]}': No such file or directory`,
      code: 1,
    };
  }

  // Handle rm command
  private handleRm(args: string[]): { stdout: string; stderr: string; code: number } {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'rm: missing operand',
        code: 1,
      };
    }

    const isRecursive = args.includes('-r') || args.includes('-rf');
    const fileArg = args.find(arg => !arg.startsWith('-'));
    
    if (!fileArg) {
      return {
        stdout: '',
        stderr: 'rm: missing operand',
        code: 1,
      };
    }

    const path = this.resolvePath(fileArg);
    const dirPath = path.substring(0, path.lastIndexOf('/'));
    const fileName = path.substring(path.lastIndexOf('/') + 1);

    if (this.mockFileSystem[path] && !isRecursive) {
      return {
        stdout: '',
        stderr: `rm: cannot remove '${fileArg}': Is a directory`,
        code: 1,
      };
    }

    if (this.mockFileSystem[path] && isRecursive) {
      delete this.mockFileSystem[path];
      return {
        stdout: '',
        stderr: '',
        code: 0,
      };
    }

    if (this.mockFileSystem[dirPath] && this.mockFileSystem[dirPath][fileName]) {
      delete this.mockFileSystem[dirPath][fileName];
      return {
        stdout: '',
        stderr: '',
        code: 0,
      };
    }

    return {
      stdout: '',
      stderr: `rm: cannot remove '${fileArg}': No such file or directory`,
      code: 1,
    };
  }

  // Handle uname command
  private handleUname(args: string[]): { stdout: string; stderr: string; code: number } {
    if (args.includes('-a')) {
      return {
        stdout: 'Linux hostname 5.4.0-42-generic #46-Ubuntu SMP Fri Jul 10 00:24:02 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux',
        stderr: '',
        code: 0,
      };
    }

    return {
      stdout: 'Linux',
      stderr: '',
      code: 0,
    };
  }

  // Handle df command
  private handleDf(): { stdout: string; stderr: string; code: number } {
    return {
      stdout: `Filesystem     1K-blocks    Used Available Use% Mounted on
udev             1939088       0   1939088   0% /dev
tmpfs             392736    1504    391232   1% /run
/dev/sda1       41251136 7154248  32045504  19% /
tmpfs            1963676    1076   1962600   1% /dev/shm
tmpfs               5120       4      5116   1% /run/lock
tmpfs            1963676       0   1963676   0% /sys/fs/cgroup
/dev/loop0         56832   56832         0 100% /snap/core18/1885
/dev/loop1         71552   71552         0 100% /snap/lxd/16099
/dev/loop2         31872   31872         0 100% /snap/snapd/10238
tmpfs             392736      24    392712   1% /run/user/1000`,
      stderr: '',
      code: 0,
    };
  }

  // Handle free command
  private handleFree(): { stdout: string; stderr: string; code: number } {
    return {
      stdout: `              total        used        free      shared  buff/cache   available
Mem:        3927352     1343284      761452       83636     1822616     2300432
Swap:       2097148           0     2097148`,
      stderr: '',
      code: 0,
    };
  }

  // Handle uptime command
  private handleUptime(): { stdout: string; stderr: string; code: number } {
    return {
      stdout: ' 14:23:45 up 3 days,  5:32,  2 users,  load average: 0.08, 0.03, 0.01',
      stderr: '',
      code: 0,
    };
  }

  // Resolve path (handle relative paths)
  private resolvePath(path: string): string {
    if (path.startsWith('/')) {
      return path;
    }
    
    if (path === '.' || path === './') {
      return this.currentDirectory;
    }
    
    if (path === '..' || path === '../') {
      const parts = this.currentDirectory.split('/');
      parts.pop();
      return parts.join('/') || '/';
    }
    
    if (path.startsWith('./')) {
      return `${this.currentDirectory}/${path.substring(2)}`;
    }
    
    if (path.startsWith('../')) {
      const parts = this.currentDirectory.split('/');
      parts.pop();
      const parentDir = parts.join('/') || '/';
      return `${parentDir}/${path.substring(3)}`;
    }
    
    if (path.startsWith('~/')) {
      return `/home/user/${path.substring(2)}`;
    }
    
    return `${this.currentDirectory}/${path}`;
  }

  // Add event listener
  on(event: string, listener: (data: any) => void): void {
    this.connectionListeners.push((e, data) => {
      if (e === event) {
        listener(data);
      }
    });
  }

  // Notify listeners
  private notifyListeners(event: string, data: any): void {
    this.connectionListeners.forEach(listener => listener(event, data));
  }

  // Get connection status
  isConnected(): boolean {
    return this._isConnected;
  }

  // Get current connection
  getConnection(): SSHConnection | null {
    return this.currentConnection;
  }

  // Get command history
  getCommandHistory(): string[] {
    return [...this.commandHistory];
  }
}

// SSH Service for the application
class SSHService {
  private clients: Map<string, NodeSSH> = new Map();
  private activeClient: NodeSSH | null = null;

  // Connect to SSH server
  async connect(connection: SSHConnection): Promise<NodeSSH> {
    // Check if already connected
    if (this.clients.has(connection.id)) {
      this.activeClient = this.clients.get(connection.id)!;
      return this.activeClient;
    }

    // Create new SSH client
    const client = new NodeSSH();
    
    try {
      // Connect to server
      await client.connect({
        host: connection.host,
        port: connection.port,
        username: connection.username,
        ...(connection.authType === 'password' 
          ? { password: connection.password } 
          : { privateKey: connection.keyPath }),
      });
      
      // Store client
      this.clients.set(connection.id, client);
      this.activeClient = client;
      
      return client;
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  // Disconnect from SSH server
  async disconnect(connectionId: string): Promise<void> {
    const client = this.clients.get(connectionId);
    
    if (client) {
      await client.dispose();
      this.clients.delete(connectionId);
      
      if (this.activeClient === client) {
        this.activeClient = null;
      }
    }
  }

  // Execute command on SSH server
  async executeCommand(command: string, options: any = {}): Promise<{
    stdout: string;
    stderr: string;
    code: number;
  }> {
    if (!this.activeClient) {
      throw new Error('No active SSH connection');
    }
    
    try {
      return await this.activeClient.execCommand(command, options);
    } catch (error) {
      console.error('Failed to execute command:', error);
      throw error;
    }
  }

  // Get active client
  getActiveClient(): NodeSSH | null {
    return this.activeClient;
  }

  // Set active client
  setActiveClient(connectionId: string): boolean {
    const client = this.clients.get(connectionId);
    
    if (client) {
      this.activeClient = client;
      return true;
    }
    
    return false;
  }

  // Get all connected clients
  getConnectedClients(): Map<string, NodeSSH> {
    return new Map(this.clients);
  }
}

export const sshService = new SSHService();
export { NodeSSH };