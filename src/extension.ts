// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WebViewProvider } from './WebViewProvider';
import { UserSetting } from './UserSetting';

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

	let activeEditor = vscode.window.activeTextEditor;

	let userSetting = UserSetting.getInstance();
	userSetting.init();

	if (activeEditor) {
		userSetting.triggerUpdateDecorations();
	}

	// アクティブなエディタが変更されたときに発生するイベントです。このイベントは、アクティブなエディタが変更されたときにも発生することに注意してください
	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			userSetting.setActiveEditor(activeEditor);
			userSetting.triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	// テキスト ドキュメントが変更されたときに発生するイベント。これは通常、発生します 内容が変わったときだけでなく、ダーティ状態など他のものも変わったとき。
	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			userSetting.triggerUpdateDecorations(true);
		}
	}, null, context.subscriptions);

	
	// 設定変更時のイベントハンドラ
	function onConfigurationChanged(e: vscode.ConfigurationChangeEvent) {
		// 排他して、createTextEditorDecorationTypeを更新する
		console.log("onConfigurationChanged");
		userSetting.configurationChanged();
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
