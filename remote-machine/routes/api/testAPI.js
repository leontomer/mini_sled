const express = require("express");
const router = express.Router();
const fs = require("fs");
const { exec } = require("child_process");

createTestsFromRequest = (testFilesContentList) => {
  fs.rmdirSync("__tests__", { recursive: true });
  fs.mkdirSync("__tests__", { recursive: true });
  for (let i = 0; i < testFilesContentList.length; i++) {
    fs.writeFile(
      `__tests__/test${i + 1}.js`,
      testFilesContentList[i],
      function (err) {
        if (err) {
          return console.log(err);
        }
      }
    );
  }
};

executeTests = (res) => {
  exec("./node_modules/.bin/jest", (error, _, stdout) => {
    if (error) {
      res.json(error.message);
      return;
    }

    res.json(stdout);
  });
};

executeDebugger = (res) => {
  exec("ssh -nNT -L 9229:127.0.0.1:9229 user@remote-server.com");

  res.json("debug");
};

router.post("/", async (req, res) => {
  try {
    const { testFilesContentList, debugFlag } = req.body;

    createTestsFromRequest(testFilesContentList);

    if (!debugFlag) {
      executeTests(res);
    } else {
      executeDebugger(res);
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
