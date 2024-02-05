const { VertexAI } = require("@google-cloud/vertexai");

async function keywords(content) {
  try {
    async function createStreamChat(
      projectId = "keyloud",
      location = "us-central1",
      model = "gemini-pro"
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
      let tmp = "";
      for await (const item of result1.stream) {
        const responseText = item.candidates[0].content.parts[0].text;
        const cleanedResponse = responseText.replace(/\n/g, ""); // 줄바꿈 문자 제거
        console.log(cleanedResponse);
        tmp = tmp + cleanedResponse;
      }
      const tmp2 = tmp
        .split(/(?=[^a-zA-Z0-9가-힣\s])/)
        .filter((word) => word.length > 0);
      const keywords = tmp2.map(
        (word) => `${word.replace(/^[^a-zA-Z0-9가-힣]+/, "").trim()}`
      );
      console.log(keywords);

      resolve(keywords);
    }

    return await createStreamChat();
  } catch (error) {
    throw error;
  }
}

module.exports = keywords;
