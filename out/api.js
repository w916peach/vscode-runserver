"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.default = (publicPath, app) => {
    const dirs = fs.readdirSync(publicPath);
    if (dirs.indexOf('api') === -1) {
        return;
    }
    const apiDirs = fs.readdirSync(path.join(publicPath, 'api'));
    const APIS = apiDirs.map((item) => {
        return {
            name: item,
            abs: path.join(path.join(publicPath, 'api'), item)
        };
    });
    APIS.forEach((item) => {
        const listener = require(item.abs);
        const index = item.name.lastIndexOf('.');
        const pathname = `/api/${item.name.slice(0, index)}`;
        app.get(pathname, listener);
        app.post(pathname, listener);
    });
};
//# sourceMappingURL=api.js.map