"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const express = require("express");
const childProcess = require("child_process");
const http = require("http");
const serveStatic = require("serve-static");
const serveIndex = require("serve-index");
const portIsOccupied_1 = require("./portIsOccupied");
const api_1 = require("./api");
const noResponseDir_1 = require("./noResponseDir");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let server;
    let disposable_runserver = vscode.commands.registerCommand('app.runserverless', (uri) => __awaiter(this, void 0, void 0, function* () {
        const app = express();
        if (uri) {
            // 解析请求体数据
            app.use(express.json());
            app.use(express.urlencoded());
            // 设置不响应的目录
            app.use(noResponseDir_1.default(['/data', '/assets', '/utils', '/common']));
            api_1.default(uri.fsPath, app); // 解析 api目录中的接口
            // 设置静态资源响应
            app.use(serveStatic(uri.fsPath, { 'index': ['index.html'] }));
            app.use(serveIndex(uri.fsPath, { 'icons': true }));
            // 导向404页面
            app.use('*', (req, res) => res.send('<h1>404</h1>'));
            if (server) { // 如果该服务已经启动过了，则停止该服务
                server.close();
            }
            server = http.createServer(app);
            // 检测端口是否被占用
            let port = 3000;
            let portAble = yield portIsOccupied_1.default(port);
            while (!portAble) {
                port += 1; //如果被占用就每次给端口加1再进行检测
                portAble = yield portIsOccupied_1.default(port);
            }
            server.listen(port, () => {
                childProcess.exec('start http://localhost:' + port);
                vscode.window.setStatusBarMessage(`服务器地址：http://localhost:${port},静态资源目录：${uri.fsPath}`);
                vscode.window.showInformationMessage('serverless启动成功');
            });
        }
        else {
            vscode.window.showInformationMessage('未找到静态资源目录，所以serverless并未启动,请在左侧资源管理器中通过右键启动！');
        }
    }));
    let disposable_stopserver = vscode.commands.registerCommand('app.stopserverless', uri => {
        server.close();
        vscode.window.showInformationMessage('serverless已经停止');
        vscode.window.setStatusBarMessage('');
    });
    context.subscriptions.push(disposable_runserver);
    context.subscriptions.push(disposable_stopserver);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map