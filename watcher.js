let fs = require("fs");
let path = require("path");

let watchFolder = path.join(__dirname, "files");
let fsTimeout;

function isDirectory(pathString) {
  return fs.lstatSync(pathString).isDirectory();
}

console.log("+|| Watching folder for changes..... ||+ ")

fs.watch(watchFolder, (eventType, filename) => {
  // be sure we don't run this more than once every 6 seconds (debounce)
  if (!fsTimeout) {
    fsTimeout = setTimeout(function () {
      let currentDay = new Date();

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let month = currentDay.getMonth().toString();
      let day = currentDay.getDate().toString();
      let monthName = monthNames[month]
      let year = currentDay.getFullYear().toString();

      let todaysFolderPath = path.join(watchFolder, year, monthName, day);

      let fileName = path.basename(filename);
      let filePath = path.join(__dirname, "files", fileName);

      let IsDirectory = true;
      let fileExtension = filename.split(".").pop();
      console.log(fileExtension);
      if (fileExtension === "pdf") {
        IsDirectory = false;
      } else {
        IsDirectory = true;
      }
      fsTimeout = null;
      console.log(`File Modification: ${fileName}`);
      console.log(`Is Directory? ${IsDirectory}`);

      if (!IsDirectory) {
        console.log(`EventType: ${eventType} | FileName: ${fileName}`);

        setTimeout(function () {
          fs.mkdirSync(todaysFolderPath, { recursive: true });
          if (fs.existsSync(path.join(watchFolder, fileName))) {
            // only do this if the file still exists in the original location.
            // have to do this because the call is made so many times in a row
            fs.renameSync(
              path.join(watchFolder, fileName),
              path.join(todaysFolderPath, fileName)
            );
          }
        }, 3000);
      } else {
        console.log('-|| was directory or duplicate event. No Action Needed. ||-')
        return;
      }
    }, 3000); // give 5 seconds for multiple events
  }
});
