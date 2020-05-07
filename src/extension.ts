// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as express from 'express';
import * as childProcess from 'child_process';
import * as http from 'http';
import * as serveStatic from 'serve-static';
import * as serveIndex from 'serve-index';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let server: any;
	let disposable_runserver = vscode.commands.registerCommand('app.runserver', (uri) => {
		// vscode.window.showInformationMessage('hello vs code');
		const app = express();
		if (uri) {
			app.use(serveStatic(uri.fsPath, { 'index': ['index.html'] }));
			app.use(serveIndex(uri.fsPath, { 'icons': true }));
		}
		server = http.createServer(app);
		const port: number = 3000;
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

// this method is called when your extension is deactivated
export function deactivate() { }
