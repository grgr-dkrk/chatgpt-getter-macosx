'use strict';

const { Plugin } = require('obsidian');

const { execSync } = require('child_process');

class ChatGPTGetterPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'chatgpt-getter',
      name: 'Get ChatGPT',
      callback: async () => {
        const script = `tell application "Google Chrome"
          set tabText to {}
          set tabCount to count tabs of front window
          repeat with i from 1 to tabCount
            set tabUrl to URL of tab i of front window
            if tabUrl starts with "https://chat.openai.com/" then
              tell tab i of front window
                set theText to execute javascript "document.body.innerText"
                copy theText to the end of tabText
              end tell
            end if
          end repeat
          return tabText
          end tell`;

        const result = execSync(`osascript -e '${script}'`).toString();

        const lines = result.trim().split('\n');
        const output = [];
        for (const line of lines) {
          if (line === 'Regenerate response') {
            break;
          }
          output.push(line);
        }
        const body = output.join('\n');

        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hour = ('0' + now.getHours()).slice(-2);
        const minute = ('0' + now.getMinutes()).slice(-2);
        const second = ('0' + now.getSeconds()).slice(-2);
        const formattedDate = `${year}-${month}-${day}-${hour}-${minute}-${second}`;

        await this.app.vault.create(`ChatGPT/${formattedDate}.md`, body);
      },
    });
  }
}

module.exports = ChatGPTGetterPlugin;
