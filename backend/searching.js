function controlIndex(i, len) {
  if (i + 2 < len) {
    if (i < 2) {
      return [0, i + 2];
    } else {
      return [i - 2, i + 2];
    }
  } else {
    if (i < 2) {
      return [0, len - 1];
    } else {
      return [i - 2, len - 1];
    }
  }
}

async function searchInScript(str, targetword) {
  const splitedScript = str.split(" ");

  const word = targetword.replace(/\s/g, "");
  const stamps = [];
  const sentence = [];

  let i = 0;
  while (i < splitedScript.length - 1) {
    if (splitedScript[i].includes(word)) {
      stamps.push(i);
      const range = controlIndex(i, splitedScript.length);
      let prepSentence = "";
      for (let j = range[0]; j <= range[1]; j++) {
        prepSentence = prepSentence + splitedScript[j] + " ";
      }
      sentence.push(prepSentence);
      i++;
    } else if (splitedScript[i + 1].includes(word)) {
      stamps.push(i + 1);
      const range = controlIndex(i + 1, splitedScript.length);
      let prepSentence = "";
      for (let j = range[0]; j <= range[1]; j++) {
        prepSentence = prepSentence + splitedScript[j] + " ";
      }
      sentence.push(prepSentence);
      i = i + 2;
    } else if ((splitedScript[i] + splitedScript[i + 1]).includes(word)) {
      stamps.push(i);
      const range = controlIndex(i, splitedScript.length);
      let prepSentence = splitedScript[i] + splitedScript[i + 1];
      for (let j = range[0]; j < i; j++) {
        prepSentence = splitedScript[j] + " " + prepSentence;
      }
      for (let j = i + 2; j <= range[1]; j++) {
        prepSentence = prepSentence + " " + splitedScript[j];
      }
      sentence.push(prepSentence);
      i = i + 2;
    } else {
      i++;
    }
  }

  let dict = {};
  if (sentence.length >= 3) {
    dict = {
      index: stamps,
      sentence: sentence.slice(0, 3),
    };
  } else {
    dict = {
      index: stamps,
      sentence: sentence.slice(0, sentence.length),
    };
  }
  return dict;
}

async function searchInKeywords(list, targetword) {
  let dict = {};
  stamps = [];
  wordsResult = [];
  const targetWithoutSpace = targetword.replace(/\s/g, "");

  for (let i = 0; i < list.length; i++) {
    const keywordWithoutSpace = list[i].replace(/\s/g, "");

    if (keywordWithoutSpace.includes(targetWithoutSpace)) {
      stamps.push(i);
      wordsResult.push(list[i]);
    }
  }

  dict = {
    index: stamps,
    sentence: [],
  };
  return dict;
}

module.exports = {
  searchInKeywords,
  searchInScript,
};
