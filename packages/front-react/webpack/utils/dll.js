const path = require("path");
const fs = require("fs");

function getDll(dllPath, manifestJson = false) {
    const files = fs.readdirSync(dllPath);
    return files.filter(item => {
        return manifestJson ? item.match(/manifest\.json$/) : item.match(/dll\.js$/);
    })
}

function getDllManifest(dllPath) {
    return getDll(dllPath, true);
}

module.exports = {
    getDll,
    getDllManifest
};