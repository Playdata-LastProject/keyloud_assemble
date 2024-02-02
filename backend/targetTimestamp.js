async function targetTimestamp(str, keyword) {
  const str2 = str.split(" ");

  //word="분산데이터베이스"
  const word = keyword.replace(/\s/g, "");
  const result = [];
  const sentence = [];
  for (let i = 0; i < str2.length - 1; i++) {
    if ((str2[i] + str2[i + 1]).includes(word)) {
      console.log(str2[i]);
      console.log("index :", i);
      result.push(i);
      if (i < 3) {
        sentence.push(
          str2[i] +
            " " +
            str2[i + 1] +
            " " +
            str2[i + 2] +
            " " +
            str2[i + 3] +
            " " +
            str2[i + 4] +
            " " +
            str2[i + 5]
        );
      } else {
        sentence.push(
          str2[i - 3] +
            " " +
            str2[i - 2] +
            " " +
            str2[i - 1] +
            " " +
            str2[i] +
            " " +
            str2[i + 1] +
            " " +
            str2[i + 2]
        );
      }
    }
  }

  const dict = {};
  if (sentence.length >= 3) {
    dict = {
      index: result,
      sentence: sentence.slice(0, 3),
    };
  } else {
    dict = {
      index: result,
      sentence: sentence.slice(0, sentence.length),
    };
  }
  return dict;
}

module.exports = targetTimestamp;
