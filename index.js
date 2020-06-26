const chokidar = require("chokidar");
const path = require("path");
const { spawn } = require("child_process");

const getContainerId = () =>
  new Promise((res) => {
    spawn("docker", ["container", "ls", "-q"]).stdout.on("data", (payload) => {
      res(payload);
    });
  });

(async function () {
  const containerId = (await getContainerId()).toString();

  if (!containerId) {
    return;
  }

  chokidar.watch("./raw").on("add", async function (filePath) {
    const ext = path.extname(filePath).trim();
    
    if(ext !== '.mp4' && ext !== '.mov') {
      return;
    }
    
    const process = spawn("docker", [
      "exec",
      containerId.trim(),
      "build/bin/FeatureExtraction",
      "-f",
      filePath,
    ]);

    process.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });
    process.stderr.on("data", (data) => {
      console.log(`err: ${data}`);
    });
  });
})();
