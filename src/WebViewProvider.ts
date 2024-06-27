import * as vscode from "vscode";

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
      } catch (e) {
        console.error(e); // SyntaxError: Unexpected token in JSON string
      }
    }

    {
      const obj = {
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
        ]
      };
  
      var json2 = JSON.stringify(obj);
      var json3 = JSON.parse(json2);
      for (let index = 0; index < json3.searchData.length; index++) {
        const element = json3.searchData[index];
        console.log("test : " + element.name + " " + element.uppercaseLetter + " " + element.wordSearch);       
      }

      const array2: string[] = new Array(5);
      array2[0] = "";
      array2[1] = "";     
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
    // webviewView.webview.postMessage({ type: "setup" });

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
        <label>
          <input type="checkbox" name="option" id="checkbox1_1">
          小/大文字
          <input type="checkbox" name="option" id="checkbox1_2">
          単語検索
        </label>
      </div>

      <div>
        <input type="text" id="input2" name="input2" size="30" />
        <br>
        <label>
          <input type="checkbox" name="option" id="checkbox2_1">
          小/大文字
          <input type="checkbox" name="option" id="checkbox2_2">
          単語検索
        </label>
      </div>

      <div>
        <input type="text" id="input3" name="input3" size="30" />
        <br>
        <label>
          <input type="checkbox" name="option" id="checkbox3_1">
          小/大文字
          <input type="checkbox" name="option" id="checkbox3_2">
          単語検索
        </label>
      </div>

      <div>
        <input type="text" id="input4" name="input4" size="30" />
        <br>
        <label>
          <input type="checkbox" name="option" id="checkbox4_1">
          小/大文字
          <input type="checkbox" name="option" id="checkbox4_2">
          単語検索
        </label>
      </div>

      <div>
        <input type="text" id="input5" name="input5" size="30" />
        <br>
        <label>
          <input type="checkbox" name="option" id="checkbox5_1">
          小/大文字
          <input type="checkbox" name="option" id="checkbox5_2">
          単語検索
        </label>
      </div>

      <div>
        <input type="text" id="input6" name="input6" size="30" />
        <br>
        <label>
          <input type="checkbox" name="option" id="checkbox6_1">
          小/大文字
          <input type="checkbox" name="option" id="checkbox6_2">
          単語検索
        </label>
      </div>

      <div>
        <input type="text" id="input7" name="input7" size="30" />
        <br>
        <label>
          <input type="checkbox" name="option" id="checkbox7_1">
          小/大文字
          <input type="checkbox" name="option" id="checkbox7_2">
          単語検索
        </label>
      </div>

      <div>
        <input type="text" id="input8" name="input8" size="30" />
        <br>
        <label>
          <input type="checkbox" name="option" id="checkbox8_1">
          小/大文字
          <input type="checkbox" name="option" id="checkbox8_2">
          単語検索
        </label>
      </div>

      <br>    

      <div>
        <input type="text" id="input_debug" name="input_debug" size="30" />
      </div>

      <script>
          function butotnClick(){
            reviewTextarea_debug.value = "butotnClick_01";
   
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
              ]
            };

            let json = JSON.stringify(obj);

            // 拡張側にイベントを送信します
            vscode.postMessage({ type: "change-event", text: json})

            reviewTextarea_debug.value = "butotnClick_02";

            updateColorList(obj);

            // Update the saved state
            vscode.setState(json);

            reviewTextarea_debug.value = "butotnClick end";
          }

          function updateColorList(obj) {
            reviewTextarea_1.value = obj.searchData[0].name;
            reviewTextarea_2.value = obj.searchData[1].name;
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

          let reviewTextarea_debug = document.getElementById('input_debug');
          reviewTextarea_debug.value = "Start";

          const HTMLElements = [8];
 
          let reviewTextarea_1 = document.getElementById('input1');
          reviewTextarea_1.addEventListener('change', butotnClick);

          let reviewcheckbox1_1 = document.getElementById('checkbox1_1');
          reviewcheckbox1_1.addEventListener('click', butotnClick);

          let reviewcheckbox1_2 = document.getElementById('checkbox1_1');
          reviewcheckbox1_2.addEventListener('click', butotnClick);
          
          
          let reviewTextarea_2 = document.getElementById('input2');
          reviewTextarea_2.addEventListener('change', butotnClick);

          let reviewTextarea_3 = document.getElementById('input3');
          reviewTextarea_3.addEventListener('change', butotnClick);

          let reviewTextarea_4 = document.getElementById('input4');
          reviewTextarea_4.addEventListener('change', butotnClick);

          let reviewTextarea_5 = document.getElementById('input5');
          reviewTextarea_5.addEventListener('change', butotnClick);

          let reviewTextarea_6 = document.getElementById('input6');
          reviewTextarea_6.addEventListener('change', butotnClick);

          let reviewTextarea_7 = document.getElementById('input7');
          reviewTextarea_7.addEventListener('change', butotnClick);

          HTMLElements[7] = document.getElementById('input8');
          HTMLElements[7].addEventListener('change', butotnClick);
         

          updateColorList(json);

          reviewTextarea_debug.value = "Start end";

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


