//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  
  function butotnClick(){
    console.log("Debug:butotnClick");

    let check_view = false;
    if (document.getElementById('checkbox_view').checked){
      // チェックあり の場合
      check_view = true;
    }

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
      "view": check_view,
      "searchData": [
        {
          "name": reviewTextarea_1.value,
          "uppercaseLetter": check_1_1,
          "wordSearch": check_1_2
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
    vscode.postMessage({ type: "change-event", text: json});

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
                                          "view": true,
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
  if( typeof oldState === 'string') {
    try {
      json = JSON.parse(oldState);
      
    } catch (e) {
    }          
  } 

  let reviewcheckbox_view = document.getElementById('checkbox_view');
  reviewcheckbox_view.addEventListener('click', butotnClick);

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


}());


