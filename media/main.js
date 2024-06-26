//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    
    const vscode = acquireVsCodeApi();
    const oldState = vscode.getState() || { "name" : "", "uppercaseLetter": false, "wordSearch": false };

    let name = "";
    if( typeof oldState == 'string') {
        try {
            var json = JSON.parse(oldState);
            name = json.name;
        } catch (e) {
        }          
    } 


    let reviewTextarea_1 = document.getElementById('input1');
    reviewTextarea_1.addEventListener('change', butotnClick);
    reviewTextarea_1.value = "test";

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
    let reviewTextarea_9 = document.getElementById('input9');


    updateColorList(name);


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

        updateColorList(reviewTextarea_1.value);

        // Update the saved state
        vscode.setState(json);
        reviewTextarea_7.value = "test3";
    }

    /**
     * @param {Array<{ value: string }>} colors
     */
    function updateColorList(name) {
        reviewTextarea_7.value = "test";
        reviewTextarea_1.value = name;
    }

}());


