import { userInfo } from "os";
import * as vscode from "vscode";
import { UserSetting } from "./UserSetting";
import internal = require("stream");

export class WebViewProvider implements vscode.WebviewViewProvider {

  private view?: vscode.WebviewView;

  constructor(private extensionUri: vscode.Uri) { }

  //
  public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext) {
    this.view = webviewView;

    // 永続化した値を取得する
    const state = context.state;
    if( typeof state === 'string') {
      try {
        var json = JSON.parse(state);

        // 初期起動時は表示状態とする
        json.view = true;

        console.log("resolveWebviewView view: " + json.view);       
        for (let index = 0; index < json.searchData.length; index++) {
          const element = json.searchData[index];
          console.log("resolveWebviewView : " + element.name + " " + element.uppercaseLetter + " " + element.wordSearch);       
        }

        let userSetting = UserSetting.getInstance();
        userSetting.setSearchData(json);  
        
      } catch (e) {
        console.error(e); // SyntaxError: Unexpected token in JSON string
      }
    }


    // WebViewViewでのJavaScriptの設定を行う
    webviewView.webview.options = {
      enableScripts: true,
      // `./public` 内のファイルのみ読み込めるように制限する
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')]
    };

    // WebView 内からのイベントを受け取ります
    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "change-event":
          try {
            var json = JSON.parse(data.text);

            for (let index = 0; index < json.searchData.length; index++) {
              const element = json.searchData[index];
              console.log("change-event : " + element.name + " " + element.uppercaseLetter + " " + element.wordSearch);
            }

            let userSetting = UserSetting.getInstance();
            userSetting.setSearchData(json);

          } catch (e) {
            console.error(e); // SyntaxError: Unexpected token in JSON string
          }

          break;

        case "any-event":
          console.log(data.text);
          break;
      }
    });

    webviewView.title = '複数単語用の蛍光ペン';
    webviewView.webview.html = this.getWebviewContent(webviewView.webview);
  }


  public setWebViewText(idx: number, str: string) {

    if( 5 <= idx || 0 > idx ) {
      return;
    }

    if( this.view ) {

      console.log("setText : " + idx + " " + str);
     
      // WebView にイベントを送信します
      this.view.webview.postMessage({ type: "setup", data: {
        index: idx,
        message: str,
      } });
    }
  }


  private getWebviewContent(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'main.js'));

		// Do the same for the stylesheet.
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'main.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">

 				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">

  			<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
   
      </head>
      <body>

      <label for="checkbox_view"><input type="checkbox" name="check" id="checkbox_view" checked>表示</label>
      <div class="box">
        <input type="text" id="input1" name="input1" size="30" />     
        <label for="checkbox1_1"><input type="checkbox" name="option" id="checkbox1_1">小/大文字</label>
        <label for="checkbox1_2"><input type="checkbox" name="option" id="checkbox1_2">単語検索</label>
      </div>

      <div class="box">
        <input type="text" id="input2" name="input2" size="30" />
        <label for="checkbox2_1"><input type="checkbox" name="option" id="checkbox2_1">小/大文字</label>
        <label for="checkbox2_2"><input type="checkbox" name="option" id="checkbox2_2">単語検索</label>
      </div>

      <div class="box">
        <input type="text" id="input3" name="input3" size="30" />
        <label for="checkbox3_1"><input type="checkbox" name="option" id="checkbox3_1">小/大文字</label>
        <label for="checkbox3_2"><input type="checkbox" name="option" id="checkbox3_2">単語検索</label>
      </div>

      <div class="box">
        <input type="text" id="input4" name="input4" size="30" />
        <label for="checkbox4_1"><input type="checkbox" name="option" id="checkbox4_1">小/大文字</label>
        <label for="checkbox4_2"><input type="checkbox" name="option" id="checkbox4_2">単語検索</label>
      </div>

      <div class="box">
        <input type="text" id="input5" name="input5" size="30" />
        <label for="checkbox5_1"><input type="checkbox" name="option" id="checkbox5_1">小/大文字</label>
        <label for="checkbox5_2"><input type="checkbox" name="option" id="checkbox5_2">単語検索</label>
      </div>

      <script nonce="${nonce}" src="${scriptUri}"></script>

      </body>

      </html>
    `;
  }


  // HTML特殊文字をエスケープさせて対策
  public escapeHTML(str: string) {
    return str.replace(/&/g, '&lt;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, "&#x27;");
  }
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}