let fs = require("fs");
let path = require("path");

let watchFolder = path.join(__dirname, "files");
let fsTimeout;

fs.watch(watchFolder, (eventType, filename) => {
  console.log(eventType);

  let currentDay = new Date();

  let month = currentDay.getMonth().toString();
  let day = currentDay.getDate().toString();
  let year = currentDay.getFullYear().toString();

  let todaysFolderPath = path.join(watchFolder, year, month, day);

  if (!fsTimeout) {
    fsTimeout = setTimeout(function () {
      fsTimeout = null;
    }, 6000); // give 5 seconds for multiple events
    if (filename) {
      setTimeout(function () {
        let fileName = path.basename(filename);
        if (fs.existsSync(todaysFolderPath)) {
          fs.renameSync(
            path.join(watchFolder, filename),
            path.join(todaysFolderPath, fileName)
          );
          console.log(`Moved ${filename} to ${todaysFolderPath}`)
        } else {
          fs.mkdirSync(todaysFolderPath, { recursive: true });
          fs.renameSync(
            path.join(watchFolder, filename),
            path.join(todaysFolderPath, fileName)
          );
          console.log(`Moved ${filename} to ${todaysFolderPath}`)
        }
      }, 6000);
    }
  }
});
