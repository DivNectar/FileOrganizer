let fs = require("fs");
let path = require("path");

let watchFolder = path.join(__dirname, "files");
let fsTimeout;

fs.watch(watchFolder, (eventType, filename) => {
  let currentDay = new Date();

  let month = currentDay.getMonth().toString();
  let day = currentDay.getDate().toString();
  let year = currentDay.getFullYear().toString();

  let todaysFolderPath = path.join(watchFolder, year, month, day);

  if (!fsTimeout) {
    fsTimeout = setTimeout(function () {
      fsTimeout = null;
    }, 5000); // give 5 seconds for multiple events
    if (filename) {
      setTimeout(function () {
        console.log(filename);
        let fileName = path.basename(filename);
        if (fs.existsSync(todaysFolderPath)) {
          console.log("folder already exists");
          fs.renameSync(
            path.join(watchFolder, filename),
            path.join(todaysFolderPath, fileName)
          );
        } else {
          console.log("folder does not exist yet");
          fs.mkdirSync(todaysFolderPath, { recursive: true });
          fs.renameSync(
            path.join(watchFolder, filename),
            path.join(todaysFolderPath, fileName)
          );
        }
      }, 3000);
    }
  }
});
