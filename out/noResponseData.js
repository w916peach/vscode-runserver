"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    return (req, res, next) => {
        if (req.path.startsWith('/data')) {
            res.send('404');
            return;
        }
        next();
    };
};
//# sourceMappingURL=noResponseData.js.map