const { VertexAI } = require('@google-cloud/vertexai');

async function keywords(content) {
  try {
    const projectId = 'keyloud';
    const location = 'us-central1';
    const model = 'gemini-pro';

    // Initialize Vertex with your Cloud project and location
    const vertexAI = new VertexAI({ project: projectId, location: location });

    // Instantiate the model
    const generativeModel = vertexAI.preview.getGenerativeModel({ model: model });

    const chat = generativeModel.startChat({});
    const chatInput = `Extract 5 key keywords or phrases from the following text: ${content}
        Please respond Korean with the extracted keywords, prefixed with a dash (-).
        At this point, the extracted keywords may have different language formats.
        As an example, when extracting keywords from a sentence like '나는 apple을 바바나와 맛있게 먹었다' respond with keywords that match the language format of the input text, such as 'apple' and '바나나'.`;

    console.log(`User: ${chatInput}`);

    const result = await chat.sendMessageStream(chatInput);
    
    let tmp = '';
    for await (const item of result.stream) {
      const responseText = item.candidates[0].content.parts[0].text;
      const cleanedResponse = responseText.replace(/\n/g, ''); // Remove line breaks
      console.log(cleanedResponse);
      tmp = tmp + cleanedResponse;
    }

    const tmp2 = tmp.split(/(?=[^a-zA-Z0-9가-힣\s])/).filter(word => word.length > 0);
    const keywords = tmp2.map(word => `${word.replace(/^[^a-zA-Z0-9가-힣]+/, '').trim()}`);
    console.log(keywords);

    return keywords;
  } catch (error) {
    throw error;
  }
}

module.exports = keywords;


const { VertexAI } = require('@google-cloud/vertexai');

async function keywords(content) {
  return new Promise(async (resolve, reject) => {
    try {
      async function createStreamChat(
        projectId = 'keyloud',
        location = 'us-central1',
        model = 'gemini-pro'
      ) {
        // Initialize Vertex with your Cloud project and location
        const vertexAI = new VertexAI({ project: projectId, location: location });

        // Instantiate the model
        const generativeModel = vertexAI.preview.getGenerativeModel({
          model: model,
        });

        const chat = generativeModel.startChat({});
        chatInput1 = `Extract 5 key keywords or phrases from the following text: ${content}
        Please respond korean with the extracted keywords, prefixed with a dash (-).
        At this point, the extracted keywords may have different language formats.
        As an example, when extracting keywords from a sentence like '나는 apple을 바바나와 맛있게 먹었다' respond with keywords that match the language format of the input text, such as 'apple' and '바나나'.`;

        console.log(`User: ${chatInput1}`);

        const result1 = await chat.sendMessageStream(chatInput1);
        tmp = '';
        for await (const item of result1.stream) {
          const responseText = item.candidates[0].content.parts[0].text;
          const cleanedResponse = responseText.replace(/\n/g, ''); // 줄바꿈 문자 제거
          console.log(cleanedResponse);
          tmp = tmp + cleanedResponse;
        }
        const tmp2 = tmp.split(/(?=[^a-zA-Z0-9가-힣\s])/).filter(word => word.length > 0);
        const keywords = tmp2.map(word => `${word.replace(/^[^a-zA-Z0-9가-힣]+/, '').trim()}`);
        console.log(keywords);

        resolve(keywords);
      }

      await createStreamChat();
    } catch (error) {
      reject(error);
    }
  });
}

const exampleText = "나는 사과를 바바나와 맛있게 먹었다";
keywords(exampleText)
  .then(result => {
    console.log("Extracted Keywords:", result);
  })
  .catch(error => {
    console.error("Error:", error);
  });

module.exports = keywords;

//response문제
//동기, 비동기 처리 -> 동기처리 async, await처리해야됨
// C:\Users\USER\OneDrive\Documents\GitHub\keyloud_assemble\backend>node keywords.js
//console.log() 결과보려면 return문 없애고 콘솔 다 찍어보기

// const exampleText = "나는 사과를 바바나와 맛있게 먹었다";
// keywords(exampleText)
//   .then(result => {
//     console.log("Extracted Keywords:", result);
//   })
//   .catch(error => {
//     console.error("Error:", error);
//   });

// module.exports = keywords;