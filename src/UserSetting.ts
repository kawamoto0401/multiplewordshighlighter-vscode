import * as vscode from "vscode";
import { Mutex } from "./oss/await-semaphore-master";

export class UserSetting {

    /**
      *  インスタンス
      */
    private static _instance: UserSetting;

    /**
     * インスタンスの取得
     */
    public static getInstance(): UserSetting {
        // インスタンスが存在しない場合、new演算子でインスタンスを作成
        if (!this._instance) {
            this._instance = new UserSetting(UserSetting.getInstance);
        }

        // 生成済みのインスタンスを返す
        return this._instance;
    }

    /**
     * コンストラクタ
     */
    constructor(caller: Function) {
        if (caller === UserSetting.getInstance) {

        }
        else if (UserSetting._instance) {
            throw new Error("既にインスタンスが存在するためエラー。");
        }
        else {
            throw new Error("コンストラクタの引数が不正な為エラー。");
        }
    }

    private decorationTypeList: vscode.TextEditorDecorationType[] = [];
    private activeEditor: vscode.TextEditor | undefined;
    private timeout: NodeJS.Timer | undefined = undefined;
    private json: any | undefined;


    public init() {

        this.setDecorationTypeList();

        this.activeEditor = vscode.window.activeTextEditor;

    }

    private async updateDecorations() {
        if (!this.activeEditor) {
            return;
        }

        if (!this.json) {
            return;
        }

        console.log("updateDecorations");

        const text = this.activeEditor.document.getText();

        const decorationOptionsList: vscode.DecorationOptions[][] = new Array(5);

        if (!this.json.view) {
            for (let index = 0; index < this.json.searchData.length; index++) {
                const element = this.json.searchData[index];
    
                const decorationOptions: vscode.DecorationOptions[] = [];
                decorationOptionsList[index] = decorationOptions;
            }
        }
        else {  
            for (let index = 0; index < this.json.searchData.length; index++) {
                const element = this.json.searchData[index];
    
                if (0 === element.name.length) {
                    const decorationOptions: vscode.DecorationOptions[] = [];
                    decorationOptionsList[index] = decorationOptions;
                    continue;
                }
    
                let flags: string = "g";
                if( !element.uppercaseLetter ) {
                    flags = "gi";
                }
    
                let pattern: string = element.name;
                if( element.wordSearch ) {
                    // 前後に英数字・アンダースコアがない場合
                    pattern = "[^a-zA-Z0^9_]" + element.name + "[^a-zA-Z0^9_]";
                }
    
                try {
                    let regEx: RegExp = new RegExp(pattern, flags);
                    const decorationOptions: vscode.DecorationOptions[] = [];
                    let match;
                    while ((match = regEx.exec(text))) {
    
                        let indexStart = match.index;
                        let indexEnd = match.index + match[0].length;                    
                        if( element.wordSearch ) {
                            indexStart += +1;
                            indexEnd += -1;
                        }
            
                        const startPos = this.activeEditor.document.positionAt(indexStart);
                        const endPos = this.activeEditor.document.positionAt(indexEnd);
                        const decoration = { range: new vscode.Range(startPos, endPos) };
                        // const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
        
                        decorationOptions.push(decoration);
                    }
                    decorationOptionsList[index] = decorationOptions;
        
                }finally {
                    // 正規表現のルールに従っていない場合
                }    
            }
        }

        const mutex = new Mutex();
        const release = await mutex.acquire();
        try {
            // 排他処理
            for (let index = 0; index < this.decorationTypeList.length && index < decorationOptionsList.length; index++) {

                if( !decorationOptionsList[index] ) {
                    continue;
                }

                this.activeEditor.setDecorations(this.decorationTypeList[index], decorationOptionsList[index]);
            }
        } finally {
            // release を呼び出さないとデットロックになる
            release();
        }

    }

    public triggerUpdateDecorations(throttle = false) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        if (throttle) {
            // setTimeoutのthis問題を回避
            this.timeout = setTimeout(() => { this.updateDecorations(); }, 100);
        } else {
            this.updateDecorations();
        }
    }

    // タブ変更などのactiveEditorを変更時
    public setActiveEditor(activeEditor: vscode.TextEditor | undefined) {
        this.activeEditor = activeEditor;
    }

    // 検索情報の変更時
    public setSearchData(json: any) {
        console.log("setSearchData");

        this.json = json;
        this.triggerUpdateDecorations();
    }

    // 設定画面よりDecorationTypeを生成
    private setDecorationTypeList() {
        const configuration = vscode.workspace.getConfiguration();

        for (let index = 0; index < 5; index++) {
            let decorationRenderOptions: vscode.DecorationRenderOptions = {};

            const section: string = 'conf.resource.0' + (index + 1);

            const color = configuration.get(section + '.backgroundColor', '');
            decorationRenderOptions.backgroundColor = color;
    
            if (configuration.get(section + '.isBorderStyleSolid', false)) {
                decorationRenderOptions.borderWidth = '1px';
                decorationRenderOptions.borderStyle = 'solid';

                const color = configuration.get(section + '.borderStyleColor', '');
                decorationRenderOptions.borderColor = color;
            }
            this.decorationTypeList.push(vscode.window.createTextEditorDecorationType(decorationRenderOptions));           
        }
    }

    // 設定変更通知を受信時
    public async configurationChanged() {
        console.log("configurationChanged");

        const mutex = new Mutex();
        const release = await mutex.acquire();
        try {
            // 排他処理

            // DecorationTypeを破棄
            this.decorationTypeList.splice(0);

            // 新規のDecorationTypeを設定
            this.setDecorationTypeList();
        } finally {
            // release を呼び出さないとデットロックになる
            release();
        }

        this.triggerUpdateDecorations();
    }

    // 正規表現文字列を、通常の文字列に変換する
    private chgNotRegularExpression( str: string ): string{

        let result = str;
        
        result = result.replace("{", "\{");
        result = result.replace("}", "\}");
        result = result.replace("[", "\[");
        result = result.replace("]", "\]");
        result = result.replace(".", "\.");
        result = result.replace("*", "\*");
        result = result.replace("?", "\?");
        result = result.replace("^", "\^");
        result = result.replace("$", "\$");
        result = result.replace("+", "\+");
        result = result.replace("~", "\~");

        return str;
    }


}

