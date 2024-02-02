const { VertexAI } = require('@google-cloud/vertexai');

async function summary(content) {
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
        chatInput1 = `I'm a college student. 
        I need you to summary from the following text: ${content}`;

        console.log(`User: ${chatInput1}`);

        const result1 = await chat.sendMessageStream(chatInput1);
        tmp = '';
        for await (const item of result1.stream) {
          const responseText = item.candidates[0].content.parts[0].text;
          const cleanedResponse = responseText.replace(/\n/g, ''); // 줄바꿈 문자 제거
          tmp = tmp + cleanedResponse;
        }
        const tmp2 = tmp.split(/(?=[^a-zA-Z0-9가-힣\s])/).filter(word => word.length > 0);
        const summary = tmp2.map(word => word.replace(/^[^a-zA-Z0-9가-힣]+/, '').trim()).filter(word => word.length > 0);
        console.log(summary);

        resolve(summary);
      }

      await createStreamChat();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = summary;
