// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const utils = require('./utils');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "turbo-python-print" is now active!');




	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable;

	disposable = vscode.commands.registerCommand('turbo-python-print.pythonPrint', async () => {
		// The code you place here will be executed every time your command is executed


		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		try {
			if (!editor) {
				throw 'No active editor';
			} else {
				const document = editor.document;
				const selection = editor.selections[0];
				const text = document.getText(selection);
				if (!text) {
					throw 'No text selected';
				} else {

					// get the os of the computer
					const isWindows = Boolean(vscode.env.appRoot && vscode.env.appRoot[0] !== "/");

					// get the current file name from the editor
					let splitter = isWindows ? '\\' : '/';
					const fileNameArray = document.fileName.split(splitter);

					// get last two elements of the file name
					const fileName = fileNameArray[fileNameArray.length - 2] + '/' + fileNameArray[fileNameArray.length - 1];
					// check if python file
					const fileExt = fileNameArray[fileNameArray.length - 1].split('.');
					if (fileExt[fileExt.length - 1] !== 'py') {
						throw 'Not a python file';
					}

					// get the line number of the selected text
					// const lineNumber = document.lineAt(selection.start.line).lineNumber;
					const lineNumber = selection.active.line;

					// get the character end of the selected text
					const characterEnd = document.lineAt(selection.end.line).range.end.character;

					const fullText = document.lineAt(selection.end.line).text;
					// get the position of first character of the fullText after spaces
					const firstCharPosition = fullText.search(/\S/);

					// get the indentation spaces count of the print statement	
					// get the heirarchy
					const heirarchy = utils.getHeirarchy(fullText, lineNumber, document)
					const { correctedLineNumber, indent } = utils.getLineNumberAndIndentToPrint(fullText, lineNumber, document)


					// add spaces for formating	
					const spaces = ' '.repeat(firstCharPosition);
					// insert comment in the editor
					editor.edit(editBuilder => {
						editBuilder.insert(new vscode.Position(correctedLineNumber, characterEnd), `\n${spaces}print("🐍 File: ${fileName} | Line: ${lineNumber + 2} | ${heirarchy} ~ ${text}",${text})`);
					});
				}

			}


		} catch (error) {
			vscode.window.showErrorMessage(error);
		}

	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('turbo-python-print.pythonRemoveAllPrint', async () => {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No active editor");
		}
		let start, end;
		let selection = editor.selection;
		if (selection.isEmpty) {
			start = 0;
			end = editor.document.lineCount - 1;
		} else {
			start = editor.selection.start.line;
			end = editor.selection.end.line;
		}
		let deleteLines = [];
		for (let i = start; i <= end; i++) {
			const line = editor.document.lineAt(i);
			const lineText = line.text.trim();
			if (lineText.startsWith("print(") || lineText.startsWith("# print(")) {
				deleteLines.push(line.lineNumber);
			}
		}
		for (let i = 0; i < deleteLines.length; i++) {
			const line = editor.document.lineAt(deleteLines[i] - i);
			await editor.edit(editBuilder => {
				editBuilder.delete(line.rangeIncludingLineBreak);
			});
		}
	})
	context.subscriptions.push(disposable);

}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
