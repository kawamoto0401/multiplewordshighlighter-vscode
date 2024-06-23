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
        for (let index = 0; index < json.searchData.length; index++) {
          const element = json.searchData[index];
          console.log("context.state : " + element.name + " " + element.uppercaseLetter + " " + element.wordSearch);       
        }

        let userSetting = UserSetting.getInstance();
        userSetting.setSearchData(json);  
        
      } catch (e) {
        console.error(e); // SyntaxError: Unexpected token in JSON string
      }
    }

    // 特に設定するべきオプションは必要ありませんが、
    // オブジェクトは代入する必要があります
    webviewView.webview.options = {
      enableScripts: true,
      // `./public` 内のファイルのみ読み込めるように制限する
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'public')]
    };

    // WebView 内で`./public/index.css`を読み込み可能にするためのUri
    const styleUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "public", "index.css")
    );

    // WebView にイベントを送信します
    webviewView.webview.postMessage({ type: "setup" });

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

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebView Example</title>
      </head>
      <body>

      <div>
        <input type="text" id="input1" name="input1" size="30" />
        <br>
        <input type="checkbox" name="option" id="checkbox1_1">
        <label for="checkbox1_1">小/大文字</label>
        <input type="checkbox" name="option" id="checkbox1_2">
        <label for="checkbox1_2">単語検索</label>
      </div>

      <div>
        <input type="text" id="input2" name="input2" size="30" />
        <br>
        <input type="checkbox" name="option" id="checkbox2_1">
        <label for="checkbox2_1">小/大文字</label>
        <input type="checkbox" name="option" id="checkbox2_2">
        <label for="checkbox2_2">単語検索</label>
      </div>

      <div>
        <input type="text" id="input3" name="input3" size="30" />
        <br>
        <input type="checkbox" name="option" id="checkbox3_1">
        <label for="checkbox3_1">小/大文字</label>
        <input type="checkbox" name="option" id="checkbox3_2">
        <label for="checkbox3_2">単語検索</label>
      </div>

      <div>
        <input type="text" id="input4" name="input4" size="30" />
        <br>
        <input type="checkbox" name="option" id="checkbox4_1">
        <label for="checkbox4_1">小/大文字</label>
        <input type="checkbox" name="option" id="checkbox4_2">
        <label for="checkbox4_2">単語検索</label>
      </div>

      <div>
        <input type="text" id="input5" name="input5" size="30" />
        <br>
        <input type="checkbox" name="option" id="checkbox5_1">
        <label for="checkbox5_1">小/大文字</label>
        <input type="checkbox" name="option" id="checkbox5_2">
        <label for="checkbox5_2">単語検索</label>
      </div>

      <script>
          function butotnClick(){
            console.log("Debug:butotnClick");

            let check_1_1 = false;
            if (document.getElementById('checkbox1_1').checked){
              // チェックあり の場合
              check_1_1 = true;
            }

            let check_1_2 = false;
            if (document.getElementById('checkbox1_2').checked){
              // チェックあり の場合
              check_1_2 = true;
            }

            let check_2_1 = false;
            if (document.getElementById('checkbox2_1').checked){
              // チェックあり の場合
              check_2_1 = true;
            }

            let check_2_2 = false;
            if (document.getElementById('checkbox2_2').checked){
              // チェックあり の場合
              check_2_2 = true;
            }

            let check_3_1 = false;
            if (document.getElementById('checkbox3_1').checked){
              // チェックあり の場合
              check_3_1 = true;
            }

            let check_3_2 = false;
            if (document.getElementById('checkbox3_2').checked){
              // チェックあり の場合
              check_3_2 = true;
            }
            
            let check_4_1 = false;
            if (document.getElementById('checkbox4_1').checked){
              // チェックあり の場合
              check_4_1 = true;
            }

            let check_4_2 = false;
            if (document.getElementById('checkbox4_2').checked){
              // チェックあり の場合
              check_4_2 = true;
            }

            let check_5_1 = false;
            if (document.getElementById('checkbox5_1').checked){
              // チェックあり の場合
              check_5_1 = true;
            }

            let check_5_2 = false;
            if (document.getElementById('checkbox5_2').checked){
              // チェックあり の場合
              check_5_2 = true;
            }              
            
            const obj = {
              "searchData": [
                {
                  "name": reviewTextarea_1.value,
                  "uppercaseLetter": check_1_1,
                  "wordSearch": check_1_1
                },
                {
                  "name": reviewTextarea_2.value,
                  "uppercaseLetter": check_2_1,
                  "wordSearch": check_2_2
                },
                {
                  "name": reviewTextarea_3.value,
                  "uppercaseLetter": check_3_1,
                  "wordSearch": check_3_2
                },
                {
                  "name": reviewTextarea_4.value,
                  "uppercaseLetter": check_4_1,
                  "wordSearch": check_4_2
                },
                {
                  "name": reviewTextarea_5.value,
                  "uppercaseLetter": check_5_1,
                  "wordSearch": check_5_2
                },
                
                ]
            };

            let json = JSON.stringify(obj);

            // 拡張側にイベントを送信します
            vscode.postMessage({ type: "change-event", text: json})

            updateColorList(obj);

            // Update the saved state
            vscode.setState(json);

            console.log("Debug:butotnClick End");
          }

          function updateColorList(obj) {
            reviewTextarea_1.value = obj.searchData[0].name;
            reviewTextarea_2.value = obj.searchData[1].name;
            reviewTextarea_3.value = obj.searchData[2].name;
            reviewTextarea_4.value = obj.searchData[3].name;
            reviewTextarea_5.value = obj.searchData[4].name;

            if( obj.searchData[0].uppercaseLetter ) {
              reviewcheckbox1_1.checked = true;
            }
            if( obj.searchData[0].wordSearch ) {
              reviewcheckbox1_2.checked = true;
            }

            if( obj.searchData[1].uppercaseLetter ) {
              reviewcheckbox2_1.checked = true;
            }
            if( obj.searchData[1].wordSearch ) {
              reviewcheckbox2_2.checked = true;
            }
 
            if( obj.searchData[2].uppercaseLetter ) {
              reviewcheckbox3_1.checked = true;
            }
            if( obj.searchData[2].wordSearch ) {
              reviewcheckbox3_2.checked = true;
            }

            if( obj.searchData[3].uppercaseLetter ) {
              reviewcheckbox4_1.checked = true;
            }
            if( obj.searchData[3].wordSearch ) {
              reviewcheckbox4_2.checked = true;
            }
              
            if( obj.searchData[4].uppercaseLetter ) {
              reviewcheckbox5_1.checked = true;
            }
            if( obj.searchData[4].wordSearch ) {
              reviewcheckbox5_2.checked = true;
            }              
          }

          const vscode = acquireVsCodeApi();
          const oldState = vscode.getState() || {
                                                  "searchData": [
                                                    {
                                                      "name": "",
                                                      "uppercaseLetter": false,
                                                      "wordSearch": false
                                                    },
                                                    {
                                                      "name": "",
                                                      "uppercaseLetter": false,
                                                      "wordSearch": false
                                                    },
                                                    {
                                                      "name": "",
                                                      "uppercaseLetter": false,
                                                      "wordSearch": false
                                                    },
                                                    {
                                                      "name": "",
                                                      "uppercaseLetter": false,
                                                      "wordSearch": false
                                                    },
                                                    {
                                                      "name": "",
                                                      "uppercaseLetter": false,
                                                      "wordSearch": false
                                                    },
                                                    ]
                                                };
          let json;
          if( typeof oldState == 'string') {
            try {
              json = JSON.parse(oldState);
              
            } catch (e) {
            }          
          } 

          const HTMLElements = [8];
 
          let reviewTextarea_1 = document.getElementById('input1');
          reviewTextarea_1.addEventListener('change', butotnClick);

          let reviewcheckbox1_1 = document.getElementById('checkbox1_1');
          reviewcheckbox1_1.addEventListener('click', butotnClick);

          let reviewcheckbox1_2 = document.getElementById('checkbox1_2');
          reviewcheckbox1_2.addEventListener('click', butotnClick);
          
          
          let reviewTextarea_2 = document.getElementById('input2');
          reviewTextarea_2.addEventListener('change', butotnClick);

          let reviewcheckbox2_1 = document.getElementById('checkbox2_1');
          reviewcheckbox2_1.addEventListener('click', butotnClick);

          let reviewcheckbox2_2 = document.getElementById('checkbox2_2');
          reviewcheckbox2_2.addEventListener('click', butotnClick);

          
          let reviewTextarea_3 = document.getElementById('input3');
          reviewTextarea_3.addEventListener('change', butotnClick);

          let reviewcheckbox3_1 = document.getElementById('checkbox3_1');
          reviewcheckbox3_1.addEventListener('click', butotnClick);

          let reviewcheckbox3_2 = document.getElementById('checkbox3_2');
          reviewcheckbox3_2.addEventListener('click', butotnClick);

          
          let reviewTextarea_4 = document.getElementById('input4');
          reviewTextarea_4.addEventListener('change', butotnClick);

          let reviewcheckbox4_1 = document.getElementById('checkbox4_1');
          reviewcheckbox4_1.addEventListener('click', butotnClick);

          let reviewcheckbox4_2 = document.getElementById('checkbox4_2');
          reviewcheckbox4_2.addEventListener('click', butotnClick);


          let reviewTextarea_5 = document.getElementById('input5');
          reviewTextarea_5.addEventListener('change', butotnClick);     

          let reviewcheckbox5_1 = document.getElementById('checkbox5_1');
          reviewcheckbox5_1.addEventListener('click', butotnClick);

          let reviewcheckbox5_2 = document.getElementById('checkbox5_2');
          reviewcheckbox5_2.addEventListener('click', butotnClick);


          updateColorList(json);

          try {
            // 拡張側からのイベントを受け取ります
            window.addEventListener("message", (event) => {

              if(event.data.type === "setup") {
                const data = event.data.data;
                switch (data.index){
                  case 0:
                    reviewTextarea_1.value = data.message;
                    break;
                  case 1:
                    reviewTextarea_2.value = data.message;
                    break;
                  case 2:
                    reviewTextarea_3.value = data.message;
                    break;
                  case 3:
                    reviewTextarea_4.value = data.message;
                    break;
                  case 4:
                    reviewTextarea_5.value = data.message;
                    break;
                  default:
                    break;
                }

                butotnClick();
              }
            });
            } catch (e) {
          }


      </script>

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


