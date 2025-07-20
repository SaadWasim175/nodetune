const readline = require("readline");

let interval;

const bars = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

function getRandomBar() {
  return Array.from({ length: 12 }, () =>
    bars[Math.floor(Math.random() * bars.length)]
  ).join(" ");
}

module.exports.start = function () {
//   process.stdout.write("\n🎛️  Equalizer:\n");

  interval = setInterval(() => {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(getRandomBar());
  }, 120);
};

module.exports.stop = function () {
  clearInterval(interval);
  console.log("\n🛑 Equalizer stopped.");
};
