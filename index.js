const express = require("express");
const { searchSongs, getAudioStreamURL } = require("./backend/stream");
const askUserToChoose = require("./frontend/ui");
const showSplash = require("./frontend/splash");
const open = require("open");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const { spawn } = require("child_process");
const ytdl = require("@distube/ytdl-core");

const app = express();
const PORT = 3000;
let currentPlayerProcess = null;

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query param" });
  try {
    const results = await searchSongs(query);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(PORT, async () => {
  console.log(`\n🎧 Backend API running at http://localhost:${PORT}\n`);
  showSplash();

  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async function playSong(term) {
    try {
      const songs = await searchSongs(term);
      const selected = await askUserToChoose(songs);
      const streamUrl = await getAudioStreamURL(selected.id);

      console.log(
        `\n🎶 Now playing: ${chalk.bold(selected.title)} by ${chalk.yellow(
          selected.author
        )}\n`
      );
      console.log("🎧 Press ESC to search for another song");
      console.log(`🔗 Streaming URL: ${chalk.gray(streamUrl)}\n`);

      // Equalizer
      const bars = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
      let isPlaying = true;
      const interval = setInterval(() => {
        if (!isPlaying) return;
        const line = Array.from(
          { length: 30 },
          () => bars[Math.floor(Math.random() * bars.length)]
        ).join("");
        process.stdout.write(`\r${chalk.hex("#ff6f61")(line)}`);
      }, 80);

      currentPlayerProcess = spawn("ffplay", ["-nodisp", "-autoexit", streamUrl], {
        stdio: "ignore",
      });

      // Enable raw mode input for key listening
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");

      const safeTitle = selected.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 100);

      const keyHandler = async (key) => {
        if (key === "q") {
          if (currentPlayerProcess) currentPlayerProcess.kill();
          console.log(chalk.yellow("\n👋 Goodbye!\n"));
          process.exit();
        }

        if (key === "s") {
          if (currentPlayerProcess) {
            currentPlayerProcess.kill();
            console.log(chalk.cyan("\n⏹️ Playback stopped.\n"));
            currentPlayerProcess = null;
          } else {
            console.log(chalk.gray("\n🔇 Nothing is playing.\n"));
          }
        }

        if (key === "i") {
          console.log(chalk.blue(`\n⬇️ Downloading "${selected.title}" as .mp3...`));

          const outputDir = "song-downloads";
          const tempPath = path.join(outputDir, `${safeTitle}.webm`);
          const finalPath = path.join(outputDir, `${safeTitle}.mp3`);

          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          const info = await ytdl.getInfo(selected.url);
          const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });

          const writeStream = fs.createWriteStream(tempPath);
          ytdl.downloadFromInfo(info, { format })
            .pipe(writeStream)
            .on("finish", () => {
              const ffmpeg = spawn("ffmpeg", [
                "-y",
                "-i", tempPath,
                "-vn",
                "-ab", "192k",
                "-ar", "44100",
                "-f", "mp3",
                finalPath,
              ]);

              ffmpeg.on("close", (code) => {
                if (code === 0) {
                  fs.unlinkSync(tempPath);
                  console.log(chalk.green(`\n✅ Saved as ${finalPath}\n`));
                } else {
                  console.log(chalk.red("\n❌ ffmpeg conversion failed."));
                }
              });
            });
        }

        // ESC key pressed: switch song
        if (key === "\x1B") {
          isPlaying = false;
          if (currentPlayerProcess) currentPlayerProcess.kill();
          process.stdin.removeListener("data", keyHandler);
          process.stdin.setRawMode(false);
          process.stdin.pause();

          console.clear();
          console.log(chalk.yellow("\n🔄 Switching song...\n"));

          clearInterval(interval);
          setTimeout(() => newPrompt(), 200);
        }
      };

      process.stdin.on("data", keyHandler);

      currentPlayerProcess.on("exit", () => {
        isPlaying = false;
        clearInterval(interval);
        currentPlayerProcess = null;
        console.log(chalk.green("\n✅ Playback finished.\n"));
      });
    } catch (err) {
      console.error("❌ Error during playback:", err);
    }
  }

  async function newPrompt() {
    rl.question("\n🎵 Enter a song name: ", async (term) => {
      rl.pause(); // prevent duplicates
      await playSong(term);
    });
  }

  await newPrompt();
});
