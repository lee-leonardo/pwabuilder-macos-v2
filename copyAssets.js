var fs = require('fs-extra');

(async function () {
  try {
    console.log("Move assets script.");
    await fs.copy("src/assets/", "build/assets")
    console.log("assets folder copied!");
  } catch (error) {
    console.log("failed to copy assets folder, error");
  }
})();