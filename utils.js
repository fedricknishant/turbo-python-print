const getHeirarchy = (fullText, lineNumber, document) => {
    let firstCharPosition = fullText.search(/\S/);
    let tempLineNumber = lineNumber

    const heirarchicalKeywords = ['def ', 'class ']
    // Get the first character
    // if the position is not zero then we need to get the previous line
    // Run this loop until the first character is not a space

    let heirarchy = []

    while (firstCharPosition !== 0) {
        tempLineNumber--
        if (firstCharPosition === 0) {
            break
        }
        let text = document.lineAt(tempLineNumber).text
        let trimedText = text.trim()
        firstCharPosition = text.search(/\S/);
        if (heirarchicalKeywords.some(v => trimedText.startsWith(v))) {
            let splittedWords = trimedText.split(' ')
            let secondWord = splittedWords[1].split('(')[0]
            heirarchy.push(secondWord)
        }
    }

    return String(heirarchy[0])
}

// Get the line number to print the statement
// Logic
// Check if indent is 0
// if no go up until the indent is 0 or u find a ":" in the end of the line
// put the brackets in the stack and pop the brackets till the selection's line number
// if the stack is not empty then go to the next line until the stack is empty
// if the stack is empty then return the line number


// Have to think about the logic \
// If we encounter "\" then we need to check the next line 

const getLineNumberAndIndentToPrint = (fullText, lineNumber, document) => {
    const firstCharPosition = fullText.search(/\S/);
    let indent = firstCharPosition

    // if the text ends with ":" then indent is +4
    let trimedfullText = fullText.trim()
    if (trimedfullText.endsWith(':')) {
        indent += 4
    }


    if (firstCharPosition === 0) {
        return { correctedLineNumber: lineNumber, indent: indent }
    } else {
        let tempLineNumber = lineNumber
        let firstCharPosition = fullText.search(/\S/);
        while (firstCharPosition !== 0) {
            tempLineNumber--
            if (firstCharPosition === 0) {
                break
            }
            let text = document.lineAt(tempLineNumber).text
            let trimedText = text.trim()

            if (trimedText.endsWith(':')) {
                break
            }
            firstCharPosition = text.search(/\S/);
        }
        let startingBrackets = ['[', '{', '(']
        let endingBrackets = [']', '}', ')']
        let bracketsStack = []

        while (tempLineNumber !== lineNumber) {
            tempLineNumber++
            let text = document.lineAt(tempLineNumber).text
            let trimedText = [...text.trim()]
            modifyBracketsStack(trimedText, startingBrackets, bracketsStack, endingBrackets)
        }
        while (bracketsStack.length !== 0) {
            tempLineNumber++
            let text = document.lineAt(tempLineNumber).text
            let trimedText = [...text.trim()]
            modifyBracketsStack(trimedText, startingBrackets, bracketsStack, endingBrackets)
        }

        return { correctedLineNumber: tempLineNumber, indent: indent }
    }
}


const modifyBracketsStack = (trimedText, startingBrackets, bracketsStack, endingBrackets) => {
    trimedText.forEach(c => {
        if (startingBrackets.includes(c)) {
            bracketsStack.push(c)
        } else if (endingBrackets.includes(c)) {
            // check if corresponding bracket is in the stack
            if (c === ']') {
                // check if the last element is "[", if yes pop it
                if (bracketsStack[bracketsStack.length - 1] === '[') {
                    bracketsStack.pop()
                }
            } else if (c === '}') {
                if (bracketsStack[bracketsStack.length - 1] === '{') {
                    bracketsStack.pop()
                }
            } else if (c === ')') {
                if (bracketsStack[bracketsStack.length - 1] === '(') {
                    bracketsStack.pop()
                }
            }
        }
    })
}

module.exports = {
    getHeirarchy,
    getLineNumberAndIndentToPrint
}