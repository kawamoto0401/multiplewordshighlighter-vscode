import * as vscode from "vscode";

export class UserSetting {

    constructor(private extensionUri: vscode.Uri) { }

    private decorationType : vscode.TextEditorDecorationType[] = [];
    private activeEditor : vscode.TextEditor | undefined;
    private timeout : NodeJS.Timer | undefined = undefined;


    public init() {
        const configuration = vscode.workspace.getConfiguration();
        const color = configuration.get('conf.resource.01.backgroundColor', '');

        // create a decorator type that we use to decorate small numbers
        this.decorationType.push(vscode.window.createTextEditorDecorationType({
            backgroundColor: { id: "#FF000055" }
        }));

        // create a decorator type that we use to decorate large numbers
        this.decorationType.push(vscode.window.createTextEditorDecorationType({
            backgroundColor: color,
        }));

        this.activeEditor = vscode.window.activeTextEditor;

    }

    private updateDecorations() {
        if (!this.activeEditor) {
            return;
        }
        let regEx = /\d+/g;
        const text = this.activeEditor.document.getText();
        const smallNumbers: vscode.DecorationOptions[] = [];
        const numbers1: vscode.DecorationOptions[] = [];
        let match;
        while ((match = regEx.exec(text))) {
            const startPos = this.activeEditor.document.positionAt(match.index);
            const endPos = this.activeEditor.document.positionAt(match.index + match[0].length);
            const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
            if (match[0].length < 3) {
                smallNumbers.push(decoration);
            }
        }

        regEx = /TODO/g;
        while ((match = regEx.exec(text))) {
            const startPos = this.activeEditor.document.positionAt(match.index);
            const endPos = this.activeEditor.document.positionAt(match.index + match[0].length);
            const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
            if (match[0].length < 3) {
                numbers1.push(decoration);
            }
        }

        this.activeEditor.setDecorations(this.decorationType[0], smallNumbers);
        this.activeEditor.setDecorations(this.decorationType[1], numbers1);
    }

	public triggerUpdateDecorations(throttle = false) {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = undefined;
		}
		if (throttle) {
			this.timeout = setTimeout(this.updateDecorations, 100);
		} else {
			this.updateDecorations();
		}
	}
}

