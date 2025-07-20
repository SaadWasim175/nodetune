const chalk = require("chalk");

module.exports = function showSplash() {
  console.clear();
  const gradient = (text) =>
    chalk.hex("#ff5ec9")(text.slice(0, 10)) +
    chalk.hex("#ff94b8")(text.slice(10, 20)) +
    chalk.hex("#ffc6a0")(text.slice(20));

  console.log(
    chalk.bold(
      gradient(`
╔════════════════════════════════════════════╗
║                                            ║
║   🎵  ${chalk.whiteBright("Welcome to")} ${chalk.cyanBright.bold("NodeTune")}  🎵     ║
║                                            ║
║   ${chalk.gray("A terminal-native music player")}          ║
║   ${chalk.gray("Stream and install your favorite songs.")}     ║
║                                            ║
╚════════════════════════════════════════════╝
`)
    )
  );

  console.log(chalk.dim("Press Ctrl+C anytime to exit\n"));
  console.log(chalk.dim("Command List:\n"));
  console.log(chalk.dim("press i to install song while streaming.\n"));
  console.log(chalk.dim("press ctrl + c or q to quit the program.\n"));
  console.log(chalk.dim("press n to search for another song.\n"));

};
