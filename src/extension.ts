// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WebViewProvider } from './WebViewProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "multiplewordshighlighter-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('multiplewordshighlighter-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from MultipleWordsHighlighter_vscode!');
	});


	// WebView を登録
	const webViewProvider = new WebViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider( "example.webview", webViewProvider )	
	);

	vscode.workspace.onDidChangeConfiguration(async(event) => await onConfigurationChanged(event));

	context.subscriptions.push(disposable);



	const configuration = vscode.workspace.getConfiguration();
	const color = configuration.get('conf.resource.01.backgroundColor', '');


	let timeout: NodeJS.Timer | undefined = undefined;

	// create a decorator type that we use to decorate small numbers
	const decorationType01 = vscode.window.createTextEditorDecorationType({
		backgroundColor: { id: "#FF000055"}
	});

	// create a decorator type that we use to decorate large numbers
	const decorationType02 = vscode.window.createTextEditorDecorationType({
		backgroundColor: color,
	});

	let activeEditor = vscode.window.activeTextEditor;

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		let regEx = /\d+/g;
		const text = activeEditor.document.getText();
		const smallNumbers: vscode.DecorationOptions[] = [];
		const numbers1: vscode.DecorationOptions[] = [];
		let match;
		while ((match = regEx.exec(text))) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
			if (match[0].length < 3) {
				smallNumbers.push(decoration);
			}
		}

		regEx = /TODO/g;
		while ((match = regEx.exec(text))) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
			if (match[0].length < 3) {
				numbers1.push(decoration);
			}
		}

		activeEditor.setDecorations(decorationType01, smallNumbers);
		activeEditor.setDecorations(decorationType02, numbers1);
	}

	function triggerUpdateDecorations(throttle = false) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		if (throttle) {
			timeout = setTimeout(updateDecorations, 100);
		} else {
			updateDecorations();
		}
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations(true);
		}
	}, null, context.subscriptions);

	
	// 設定変更時のイベントハンドラ
	function onConfigurationChanged(e: vscode.ConfigurationChangeEvent) {
		// 排他して、createTextEditorDecorationTypeを更新する

	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
