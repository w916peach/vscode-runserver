// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as express from 'express';
import * as childProcess from 'child_process';
import * as http from 'http';
import * as serveStatic from 'serve-static';
import * as serveIndex from 'serve-index';
import portIsOccupied from './portIsOccupied';
import api from './api';
import noResponseDir from './noResponseDir';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let server: http.Server;
	let disposable_runserver: vscode.Disposable = vscode.commands.registerCommand('app.runserverless', async (uri) => {
		const app: express.Express = express();
		if (uri) {
			// 解析请求体数据
			app.use(express.json());
			app.use(express.urlencoded());
			// 设置不响应的目录
			app.use(noResponseDir(['/data', '/assets', '/utils', '/common']));
			api(uri.fsPath, app); // 解析 api目录中的接口
			// 设置静态资源响应
			app.use(serveStatic(uri.fsPath, { 'index': ['index.html'] }));
			app.use(serveIndex(uri.fsPath, { 'icons': true }));
			// 导向404页面
			app.use('*', (req: any, res: any) => res.send('<h1>404</h1>'));
			if (server) { // 如果该服务已经启动过了，则停止该服务
				server.close();
			}
			server = http.createServer(app);
			// 检测端口是否被占用
			let port: number = 3000;
			let portAble: boolean = await portIsOccupied(port);
			while (!portAble) {
				port += 1; //如果被占用就每次给端口加1再进行检测
				portAble = await portIsOccupied(port);
			}
			server.listen(port, () => {
				childProcess.exec('start http://localhost:' + port);
				vscode.window.setStatusBarMessage(`服务器地址：http://localhost:${port},静态资源目录：${uri.fsPath}`);
				vscode.window.showInformationMessage('serverless启动成功');
			});
		} else {
			vscode.window.showInformationMessage('未找到静态资源目录，所以serverless并未启动,请在左侧资源管理器中通过右键启动！');
		}
	});
	let disposable_stopserver = vscode.commands.registerCommand('app.stopserverless', uri => {
		server.close();
		vscode.window.showInformationMessage('serverless已经停止');
		vscode.window.setStatusBarMessage('');
	});
	context.subscriptions.push(disposable_runserver);
	context.subscriptions.push(disposable_stopserver);
}

// this method is called when your extension is deactivated
export function deactivate() { }
