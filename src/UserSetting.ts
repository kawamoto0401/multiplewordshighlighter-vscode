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

    private decorationTypeList : vscode.TextEditorDecorationType[] = [];
    private activeEditor : vscode.TextEditor | undefined;
    private timeout : NodeJS.Timer | undefined = undefined;
    private json : any | undefined;


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

        const text = this.activeEditor.document.getText();
        const textToUpperCase = this.activeEditor.document.getText().toUpperCase();

        const decorationOptionsList: vscode.DecorationOptions[][] = [];

        for (let index = 0; index < this.json.searchData.length; index++) {
            const element = this.json.searchData[index];

            if( 0 === element.name.length) {
                continue;
            }

            let regEx : RegExp = new RegExp(element.name, "g");
            let match;
            while ((match = regEx.exec(text))) {
                const startPos = this.activeEditor.document.positionAt(match.index);
                const endPos = this.activeEditor.document.positionAt(match.index + match[0].length);
                const decoration = { range: new vscode.Range(startPos, endPos)};
                // const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
                
                const decorationOptions: vscode.DecorationOptions[] = [];
                decorationOptions.push(decoration);
                decorationOptionsList.push(decorationOptions);
            }                
        }

        const mutex = new Mutex();
        const release = await mutex.acquire();
        try {
            // 排他処理
            for (let index = 0; index < this.decorationTypeList.length && index < decorationOptionsList.length ; index++) {
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
			this.timeout = setTimeout(() => {this.updateDecorations();}, 100);
		} else {
			this.updateDecorations();
		}
	}

    // タブ変更などのactiveEditorを変更時
    public setActiveEditor(activeEditor : vscode.TextEditor | undefined) {
        this.activeEditor = activeEditor;
    }

    // 検索情報の変更時
    public setSearchData(json : any) {
        console.log("setSearchData");

        this.json = json;
        this.triggerUpdateDecorations();
    }

    // 設定画面よりDecorationTypeを生成
    private setDecorationTypeList() {
        const configuration = vscode.workspace.getConfiguration();

        const color = configuration.get('conf.resource.01.backgroundColor', '');
        this.decorationTypeList.push(vscode.window.createTextEditorDecorationType({
            backgroundColor: color,
        }));

        const color2 = configuration.get('conf.resource.02.backgroundColor', '');
        this.decorationTypeList.push(vscode.window.createTextEditorDecorationType({
            backgroundColor: color2,
        }));
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
}

