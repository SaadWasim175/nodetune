const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = async function askUserToChoose(songs) {
  const choices = songs.map(song => ({
    name: `${chalk.cyan(song.title)} ${chalk.gray(`(${song.duration})`)} — ${chalk.magenta(song.author)}`,
    value: song
  }));

  const { selectedSong } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedSong",
      message: chalk.green("Select a song to play:"),
      choices
    }
  ]);

  return selectedSong;
};
