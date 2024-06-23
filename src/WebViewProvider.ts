import * as vscode from "vscode";

export class WebViewProvider implements vscode.WebviewViewProvider {

  private view?: vscode.WebviewView;

  constructor(private extensionUri: vscode.Uri) { }

  //
  public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext) {
    this.view = webviewView;

    // 永続化した値を取得する
    const state = context.state;

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
          var json = JSON.parse( data.text );
          console.log(json.name + json.uppercaseLetter + json.wordSearch);
          break;

        case "any-event":
          console.log(data.text);
          break;

      }
    });

    webviewView.title = '複数単語用の蛍光ペン';
    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

  }



  public getWebviewContent(webview: vscode.Webview) {
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


      <br>

      <input type="text" id="input2" name="input2" size="30" />
      <br>

      <input type="text" id="input3" name="input3" size="30" />
      <br>

      <input type="text" id="input4" name="input4" size="30" />
      <br>

      <input type="text" id="input5" name="input5" size="30" />
      <br>

      <input type="text" id="input6" name="input6" size="30" />
      <br>

      <input type="text" id="input7" name="input7" size="30" />
      <br>

      <input type="text" id="input8" name="input8" size="30" />
      <br>
      
    
      <script>
          function butotnClick(){
            reviewTextarea_8.value = reviewTextarea_1.value;
   
            let check_1 = document.getElementById("checkbox1_1");
            let check_1_1 = false;
            if (check_1.checked){
              // チェックあり の場合
              check_1_1 = true;
            }

            let check_2 = document.getElementById("checkbox1_2");
            let check_1_2 = false;
            if (check_2.checked){
              // チェックあり の場合
              check_1_2 = true;
            }

            let obj  = {
                "name": reviewTextarea_1.value,
                "uppercaseLetter": check_1_1,
                "wordSearch": check_1_2
            }

            let json = JSON.stringify(obj);

            // 拡張側にイベントを送信します
            vscode.postMessage({ type: "change-event", text: json})

            reviewTextarea_7.value = "test2";
            // objbk2.name = reviewTextarea_1.value;
            // namebk = reviewTextarea_1.value;
            counter.textContent = count++;         

           
            updateColorList(count);

            // Update the saved state
            vscode.setState({ count });
           reviewTextarea_7.value = "test3";
          }

          function updateColorList(count) {
            reviewTextarea_7.value = "test";
            reviewTextarea_6.value = count;
          }
 
          // let objbk = {
          //     "name": "",
          //     "uppercaseLetter": false,
          //     "wordSearch": false
          // }

          const vscode = acquireVsCodeApi();
          // const oldState = vscode.getState() || { name: string };
          const oldState = vscode.getState();

          // let namebk = oldState ? oldState.name: "";
          let count = oldState ? oldState.count : 0;
          let counter = document.getElementById('input6');
          counter.value = count;

          let reviewTextarea_1 = document.getElementById('input1');
          reviewTextarea_1.addEventListener('change', butotnClick);


          let reviewcheckbox1_1 = document.getElementById('checkbox1_1');
          reviewcheckbox1_1.addEventListener('click', butotnClick);

          let reviewcheckbox1_2 = document.getElementById('checkbox1_1');
          reviewcheckbox1_2.addEventListener('click', butotnClick);
          
          
          let reviewTextarea_2 = document.getElementById('input2');
          let reviewTextarea_3 = document.getElementById('input3');
          let reviewTextarea_4 = document.getElementById('input4');
          let reviewTextarea_5 = document.getElementById('input5');
          let reviewTextarea_6 = document.getElementById('input6');
          let reviewTextarea_7 = document.getElementById('input7');
          let reviewTextarea_8 = document.getElementById('input8');


          // updateColorList(count);

      </script>

      </body>

      </html>
    `;
  }

  public chgComment(description: string, commnent: string) {

    if (this.view) {

      // XSS対策で、HTML特殊文字をエスケープさせて対策
      const descriptionTmp = this.escapeHTML(description);
      const commnentTmp = this.escapeHTML(commnent);

      // 改行コードを判定し、HTMLの<BR>に変換する
      const commnentTmp2 = commnentTmp.replace(/\r?\n/g, '<br>');

      // this.view.webview.html = this.getWebviewContent(descriptionTmp, commnentTmp2);
    }
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



