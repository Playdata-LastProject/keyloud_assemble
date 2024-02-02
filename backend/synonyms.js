const { VertexAI } = require('@google-cloud/vertexai');

async function synonyms(content) {
  return new Promise(async (resolve, reject) => {
    try {
      async function createSynonyms(
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
        const chatInput1 = `Please find 2 each synonyms from the following keywords: ${content}
        Please respond korean with the prefixed with a dash (-).`;

        console.log(`User: ${chatInput1}`);

        const result1 = await chat.sendMessageStream(chatInput1);
        let tmp = '';
        for await (const item of result1.stream) {
          const responseText = item.candidates[0].content.parts[0].text;
          const cleanedResponse = responseText.replace(/\n/g, ''); // 줄바꿈 문자 제거
          tmp = tmp + cleanedResponse;
        }
        const tmp2 = tmp.split(/(?=[^a-zA-Z0-9가-힣\s])/).filter(word => word.length > 0);
        const keywords = tmp2.map(word => `${word.replace(/^[^a-zA-Z0-9가-힣]+/, '').trim()}`);
        //const contentArray = content.split(',').map(word => word.trim());
        filteredKeywords = keywords.filter(keyword => !content.includes(keyword));  //server.js형식에 맞게 수정 test시엔 문자열로 봤으나 여기선 이미 입력부터 array
        filteredKeywords = filteredKeywords.filter(keyword => keyword !== '');
        console.log(filteredKeywords);

        resolve(filteredKeywords);
      }

      await createSynonyms();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = synonyms;
