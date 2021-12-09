"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
// 检测端口是否被占用
function portIsOccupied(port) {
    return new Promise((resolve) => {
        // 创建服务并监听该端口
        const server = net.createServer().listen(port);
        server.on('listening', function () {
            server.close(); // 关闭服务
            resolve(true); // 端口没有被占用
        });
        server.on('error', function (err) {
            if (err.code === 'EADDRINUSE') { // 端口已经被使用
                resolve(false); // 端口已经被占用
            }
        });
    });
}
exports.default = portIsOccupied;
//# sourceMappingURL=portIsOccupied.js.map