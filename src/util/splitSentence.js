// takes a string and splits it into multiple lines, returns an array
module.exports = function splitSentence(text, wordsPerLine = 3) {
  const words = text.split(' ');
  let newSentence = [];

  for (let i = 0; i < words.length / wordsPerLine; i++) {
    newSentence.push(words.slice(i * wordsPerLine, i * wordsPerLine + wordsPerLine));
  }

  for (let k = 0; k < newSentence.length; k++) {
    newSentence[k] = newSentence[k].join(" ");
  }

  return newSentence;
}