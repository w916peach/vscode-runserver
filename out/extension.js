"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const express = require("express");
const childProcess = require("child_process");
const http = require("http");
const serveStatic = require("serve-static");
const serveIndex = require("serve-index");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let server;
    let disposable_runserver = vscode.commands.registerCommand('app.runserver', (uri) => {
        // vscode.window.showInformationMessage('hello vs code');
        const app = express();
        if (uri) {
            app.use(serveStatic(uri.fsPath, { 'index': ['index.html'] }));
            app.use(serveIndex(uri.fsPath, { 'icons': true }));
        }
        server = http.createServer(app);
        const port = 3000;
        server.listen(port, () => {
            console.log('server had run at http://localhost:' + port);
            childProcess.exec('start http://localhost:' + port);
            vscode.window.setStatusBarMessage('http://localhost:3000');
        });
    });
    let disposable_stopserver = vscode.commands.registerCommand('app.stopserver', uri => {
        server.close();
        vscode.window.showInformationMessage('http:3000服务器已经停止');
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