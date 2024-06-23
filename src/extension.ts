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
	context.subscriptions.push(vscode.commands.registerCommand('multiplewordshighlighter-vscode.highlighterSetText1', async () => {
		setWebViewText(webViewProvider, 0);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('multiplewordshighlighter-vscode.highlighterSetText2', async () => {
		setWebViewText(webViewProvider, 1);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('multiplewordshighlighter-vscode.highlighterSetText3', async () => {
		setWebViewText(webViewProvider, 2);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('multiplewordshighlighter-vscode.highlighterSetText4', async () => {
		setWebViewText(webViewProvider, 3);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('multiplewordshighlighter-vscode.highlighterSetText5', async () => {
		setWebViewText(webViewProvider, 4);
	}));


	// WebView を登録
	const webViewProvider = new WebViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider( "multiplewordshighlighter-explorer.webview", webViewProvider )	
	);

	vscode.workspace.onDidChangeConfiguration(async(event) => await onConfigurationChanged(event));

	// 現在のTextEditorを取得
	let activeEditor = vscode.window.activeTextEditor;

	// 設定情報を取得
	let userSetting = UserSetting.getInstance();
	userSetting.init();

	if (activeEditor) {
		// 現在のTextEditorを登録
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

async function setWebViewText(webViewProvider: WebViewProvider, idx: number) {
	// InputBoxを呼び出す。awaitで完了を待つ。
	const result = await vscode.window.showInputBox();
	// ここで入力を処理する
	if (result) {
		webViewProvider.setWebViewText(idx, result);
	} else {
		// 入力がキャンセルされた
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
