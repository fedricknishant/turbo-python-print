const getHeirarchy = (fullText, lineNumber, document) => {
    let firstCharPosition = fullText.search(/\S/);
    let tempLineNumber = lineNumber

    // const keywordsThatIndent = ['if', 'elif', 'else', 'for', 'while', 'def', 'class', 'try', 'except', 'finally', 'with']
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

    heirarchy.reverse();
    return heirarchy.join(' ~ ')
}

module.exports = {
    getHeirarchy,
}