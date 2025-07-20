# ⬢ NodeTune 🎵

A sleek, terminal-based music player and downloader built with Node.js and a love for CLI aesthetics.

<img width="1903" height="1031" alt="image" src="https://github.com/user-attachments/assets/11da99e5-c4ee-416a-898c-2fd63c3ae1b3" />


---

## Features

- **Search and stream** songs directly from the terminal  
- **Install tracks** to your machine while streaming  
- **Minimal TUI controls** for quick access  
- Built for devs 

---

## Requirements

- **Node.js** (v16+ recommended)
- **FFmpeg** must be installed and available in your system's PATH  
  NodeTune uses FFmpeg to handle audio streaming and downloading.

## Install FFmpeg:

**Linux (Debian/Ubuntu):**
sudo apt install ffmpeg

**Linux (Arch):**
sudo pacman -Syu 
sudo pacman -S ffmpeg

**MacOS(via Homebrew)**
brew install ffmpeg

**Windows**
install from https://ffmpeg.org/download.html

## Getting Started

```bash
git clone https://github.com/yourusername/nodetune.git
cd nodetune
npm install
node index.js
```
**If using a CLI entry**
make it executable by:

```bash
chmod +x index.js
./index.js
```
## Credits

Built with Node.js

Powered by chalk and inquirer

FFmpeg does the heavy lifting under the hood

## ⚠️ Disclaimer
NodeTune is a personal/educational project and should not be used to violate copyright laws. Please support the artists you love.
