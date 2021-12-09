
import * as net from 'net';

// 检测端口是否被占用
function portIsOccupied(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        // 创建服务并监听该端口
        const server: net.Server = net.createServer().listen(port);
        server.on('listening', function () { // 执行这块代码说明端口未被占用
            server.close(); // 关闭服务
            resolve(true); // 端口没有被占用
        });
        server.on('error', function (err: any) {
            if (err.code === 'EADDRINUSE') { // 端口已经被使用
                resolve(false); // 端口已经被占用
            }
        });
    });

}
export default portIsOccupied;
