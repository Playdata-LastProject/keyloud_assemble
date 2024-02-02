const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);

const speech = require("@google-cloud/speech");
const fs = require("fs");

//const wav = require("wav");
const wav = require("node-wav");

const client = new speech.SpeechClient();

async function convertToLinear16(audioPath) {
  return new Promise((resolve, reject) => {
    const linear16FilePath = audioPath.replace(/\.[^/.]+$/, "_linear16.wav");

    ffmpeg()
      .input(audioPath)
      .audioCodec("pcm_s16le")
      .toFormat("wav")
      .on("end", () => resolve(linear16FilePath))
      .on("error", (err) => reject(err))
      .save(linear16FilePath);
  });
}

// Function to split audio into 60-second chunks
function splitAudio(audioBuffer, chunkSize, sampleRate) {
  const chunks = [];
  const totalDuration = audioBuffer.length / sampleRate; // Assuming 44.1 kHz sample rate

  for (let startTime = 0; startTime < totalDuration; startTime += chunkSize) {
    const endTime = Math.min(startTime + chunkSize, totalDuration);
    const startByte = Math.floor(startTime * sampleRate * 2); // 16-bit audio, 2 bytes per sample
    const endByte = Math.floor(endTime * sampleRate * 2);
    const chunk = audioBuffer.slice(startByte, endByte);
    chunks.push(chunk);
  }

  return chunks;
}

async function timeStamps(chunks, config) {
  const Timestamps = [];
  let nth_bundle = 0;

  for (const chunk of chunks) {
    const audioBytes = chunk.toString("base64");

    const audio = {
      content: audioBytes,
    };

    const request = {
      audio: audio,
      config: config,
    };

    try {
      const [response] = await client.recognize(request);
      for (const result of response.results) {
        console.log(`----${nth_bundle}-----`);
        for (const wordInfo of result.alternatives[0].words) {
          const startTime =
            wordInfo.startTime.seconds + wordInfo.startTime.nanos / 1e9;
          console.log(wordInfo.word);

          /*if ( startTime / 10 > ) {
            
            }*/
          Timestamps.push(nth_bundle * 60 + Math.floor(startTime / 10));
        }
      }
    } catch (error) {
      console.error("에러:", error);
    }
    ++nth_bundle;
  }

  return Timestamps;
}

async function transcribeAndConcatenate(chunks, config) {
  const transcriptions = [];

  for (const chunk of chunks) {
    const audioBytes = chunk.toString("base64");

    const audio = {
      content: audioBytes,
    };

    const request = {
      audio: audio,
      config: config,
    };

    try {
      const [response] = await client.recognize(request);
      const transcript = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");
      transcriptions.push(transcript);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return transcriptions.join(" ");
}

async function speech2text(audioPath, targetWord) {
  const linear16FilePath = await convertToLinear16(audioPath);

  // Read the linear16 audio file
  const audioFile = fs.readFileSync(linear16FilePath);
  const sampleRate = wav.decode(audioFile).sampleRate;
  console.log("sample rate : ", sampleRate);

  // Split audio into 60-second chunks
  const audioChunks = splitAudio(audioFile, 60, sampleRate);

  const config = {
    enableWordTimeOffsets: true,
    encoding: "LINEAR16",
    sampleRateHertz: sampleRate,
    languageCode: "ko-KR",
  };

  // 각 청크를 전사하고 결과를 연결
  const wordsWithTimestamps = await timeStamps(audioChunks, config);

  // 특정 단어의 타임스탬프 찾아서 출력
  //const targetWordTimestamps = wordsWithTimestamps.filter(
  //  (word) => word.word.toLowerCase() === targetWord.toLowerCase()
  //);

  /*
  if (targetWordTimestamps.length > 0) {
    console.log(`"${targetWord}"의 타임스탬프:`);
    for (const timestamp of targetWordTimestamps) {
      console.log(
        `시작 시간: ${timestamp.startTime}` //, 종료 시간: ${timestamp.endTime}`
      );
    }
  } else {
    console.log(`오디오에서 "${targetWord}"을(를) 찾을 수 없습니다.`);
  }*/

  // Transcribe each chunk and concatenate results
  console.log(wordsWithTimestamps);
  return [
    await transcribeAndConcatenate(audioChunks, config),
    wordsWithTimestamps,
  ];
  //console.log("Transcription:", result);
}

module.exports = speech2text;
