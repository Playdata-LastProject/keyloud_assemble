const fetch = require('isomorphic-fetch');
//const { TextDecoderStream } = require('text-encoding');
const { VertexAI } = require("@google-cloud/vertexai");


async function keywords(content) {
  try {
    function createStreamChat(
      projectId = "keyloud",
      location = "us-central1",
      model = "gemini-pro"
    ) {
      return new Promise(async (resolve, reject) => {
        try {
          // Cloud 프로젝트와 위치를 사용하여 Vertex를 초기화합니다.
          const vertexAI = new VertexAI({ project: projectId, location: location });

          // 모델을 인스턴스화합니다.
          const generativeModel = vertexAI.preview.getGenerativeModel({
            model: model,
          });

          const chat = generativeModel.startChat({});
          const chatInput1 = `다음 텍스트에서 5개의 키워드 또는 구문을 추출하세요: ${content}
            추출한 키워드로 대답해주세요. 추출한 키워드는 한국어 형식과 일치하도록 하며 앞에 대시(-)를 붙입니다.
            예를 들어 '나는 apple을 바바나와 맛있게 먹었다'와 같은 문장에서 키워드를 추출할 때 'apple'과 '바나나'와 같이 입력 텍스트의 언어 형식과 일치하는 키워드로 응답합니다.`;

          console.log(`사용자: ${chatInput1}`);

          const result1 = await chat.sendMessageStream(chatInput1);
          let tmp = "";
          for await (const item of result1.stream) {
            const responseText = item.candidates[0].content.parts[0].text;
            const cleanedResponse = responseText.replace(/\n/g, ""); // 개행 문자 제거
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
        } catch (error) {
          reject(error);
        }
      });
    }

    // 비동기 작업이 완료될 때까지 기다립니다.
    return await createStreamChat();
  } catch (error) {
    throw error;
  }
}

module.exports = keywords;
