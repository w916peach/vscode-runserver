"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (dirnames) => {
    return (req, res, next) => {
        const noPass = dirnames.some((dirname) => req.url.startsWith(dirname));
        if (noPass) {
            res.send('<h1>404</h1>');
            return;
        }
        if (req.path === '/api' || req.path === '/api/') {
            res.send('<h1>404</h1>');
            return;
        }
        next();
    };
};
//# sourceMappingURL=noResponseDir.js.map