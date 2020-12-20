const fs = require("fs");
const process = require("process");
const axios = require("axios");
const { exec } = require("child_process");

const chromeLauncher = require("chrome-launcher");

const testsContent = [];
let fileName = "";
let debugFlag = false;
const TESTS_FILES_PATH = "__tests__";

printErr = (err) => {
  console.error(err);
};

sendTestsToRemote = async () => {
  const testResults = await axios.post("/api/runtests", {
    testFilesContentList: testsContent,
    debugFlag: debugFlag,
  });
  if (testResults.data == "debug") {
    exec(`node --inspect-brk=127.0.0.1:9229 ./${TESTS_FILES_PATH}/${fileName}`);

    chromeLauncher
      .launch({
        startingUrl: "chrome://inspect/#devices",
      })
      .then((chrome) => {
        console.log(`Chrome debugging port running on ${chrome.port}`);
      });
  } else {
    console.log(testResults.data);
  }
};

extractTestsAndSendToRemote = (argList) => {
  fs.readdir(TESTS_FILES_PATH, function (err, files) {
    if (argList.length > 0) {
      for (let i = 0; i < argList.length; i++) {
        if (argList[i].split(".")[1] == "spec") {
          files.forEach(function (file, index) {
            if (file.toString() == argList[i]) {
              testsContent.push(
                fs
                  .readFileSync(TESTS_FILES_PATH + "\\" + file.toString())
                  .toString()
              );
              fileName = file.toString();
            }
          });
        } else if (argList[i] == "DEBUG=true") {
          debugFlag = true;
        }
      }
    } else {
      files.forEach(function (file, index) {
        testsContent.push(
          fs.readFileSync(TESTS_FILES_PATH + "\\" + file.toString()).toString()
        );
      });
    }
    try {
      sendTestsToRemote();
    } catch (error) {
      printErr(error);
    }
  });
};

class MyCustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunStart() {
    extractTestsAndSendToRemote(process.argv.slice(2));
  }
}

module.exports = MyCustomReporter;
