import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import AudioPlayer from "react-audio-player";
import "./styles/ScriptDisplay.css";
import AudioPlayer from "react-audio-player";

const ScriptDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(0);
  const [receivedData, setReceivedData] = useState({});
  const [Content, setContents] = useState({});
  const [error, setError] = useState(null);
  const [splitedScript, spliting] = useState([]);
  const [audioData, setAudioData] = useState("");
  const [audioStream, setAudioStream] = useState("");
  const [bufferString, setBufferString] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (location.state) {
        setReceivedData(location.state.data);
        setType(location.state.type);
        setLoading(false);
        await getContents(location.state.data.filename);
        const response = await axios.get(
          `http://52.78.157.198/get_audio?filename=${encodeURIComponent(
            location.state.data.filename
          )}`
        );
        setAudioData(response.data);
      }
    };

    fetchData();
  }, [location.state]);

  const handlePlay = () => {
    if (audioData && Content) {
      const bytesPerSample = Content.bytesPerSample; // 16비트 = 2바이트
      const sampleRate = Content.sampleRate; // 샘플 레이트 설정

      const audioContext = new AudioContext();
      const audioBuffer = audioContext.createBuffer(
        1,
        audioData.length / bytesPerSample / Content.channels,
        sampleRate
      );
      const audioSource = audioContext.createBufferSource();
      audioSource.buffer = audioBuffer;
      const channelData = audioBuffer.getChannelData(0);

      for (
        let i = 0;
        i < audioData.length;
        i += bytesPerSample * Content.channels
      ) {
        // 16비트 정수 값을 -1과 1 사이의 부동소수점 값으로 변환
        const int16Value = (audioData[i + 1] << 8) | (audioData[i] & 0xff);
        channelData[i / bytesPerSample / Content.channels] =
          int16Value / 32768.0; // 정규화
      }

      audioSource.connect(audioContext.destination);
      audioSource.start();
    }
  };

  const getContents = async (fileID) => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.get(
        `http://52.78.157.198/contents?fileName=${encodeURIComponent(
          fileID
        )}`
      );
      setContents((prevContent) => ({ ...prevContent, ...response.data })); // JSON 파싱 없이 데이터 할당
      const splitScripts = response.data.scripts.split(" ");
      spliting(splitScripts);
    } catch (error) {
      setError("검색 중 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleEdit = (fileName) => {
    // TODO: 파일 수정 로직 추가
    console.log(`Edit file: ${fileName}`);

    const editEndpoint = "http://52.78.157.198/update_scripts";

    // Sample request using fetch
    fetch(editEndpoint, {
      method: "PUT", // Use 'PUT' method for editing
      headers: {
        "Content-Type": "application/json",
        // Add any other headers if needed
      },
      body: JSON.stringify({ fileName }), // Send the file name or other necessary data
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Editing file failed");
        }
        return response.json();
      })
      .then((data) => {
        // Handle success response if needed
        console.log("File edit success", data);
      })
      .catch((error) => {
        // Handle error if needed
        console.error("File edit failed", error);
      });
  };

  // 파일 삭제 이벤트 핸들러
  const handleDelete = (filename) => {
    const isConfirmed = window.confirm("파일을 휴지통으로 옮기시겠습니까?");
    if (isConfirmed) {
      // TODO: 파일 삭제 로직 추가
      console.log(`Delete file: ${filename}`);

      const deleteEndpoint = "http://52.78.157.198/move_to_trash";

      // Sample request using fetch
      axios
        .delete(deleteEndpoint, {
          data: { fileName: filename }, // data 속성으로 데이터 전달
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          // Handle success response if needed
          console.log("File deletion success", response.data);

          // 알림 추가
          window.alert("파일이 성공적으로 삭제되었습니다."); // 삭제 성공 시 알림

          // 파일 삭제 성공 시 뒤로 가기
          navigate(-1);
        })
        .catch((error) => {
          // Handle error if needed
          console.error("File deletion failed", error);
        });
    }
  };

  // 데이터가 존재하는 경우에 대한 처리
  return (
    <div>
      <h2>Received Data</h2>
      <p>file name: {receivedData.filename}</p>
      <p>MIME TYPE: {Content.mimeType}</p>
      <p>content: {bufferString}</p>
      {!receivedData.filename ? ( //audioData ? (
        // 오디오 데이터가 존재하지 않는 경우의 처리
        <div>No audio data available</div>
      ) : (
        <button onClick={handlePlay}>Play Audio</button>
      )}
      <p>script: {Content.scripts}</p>
      <div className="file-actions">
        <button
          onClick={() => handleEdit(Content.scripts)}
          className="edit-button"
        >
          수정
        </button>
        <button
          onClick={() => handleDelete(Content.filename)}
          className="delete-button"
        >
          삭제
        </button>
      </div>
      {type === 0 && (
        <div>
          {splitedScript.map((index) => (
            <div>
              {index}
              <p
                style={{
                  backgroundColor: receivedData.index.includes(index)
                    ? "lavender"
                    : "transparent",
                }}
              >
                {splitedScript[index]}
              </p>
            </div>
          ))}

          <ul>
            {receivedData.index.map((index) => (
              <li key={index}>{Content.timestamp[index]}</li>
            ))}
          </ul>
        </div>
      )}
      {type === 1 && (
        <ul>
          {receivedData.index.map((index) => (
            <li key={index}>{Content.keywords[index]}</li>
          ))}
        </ul>
      )}
      {type === 2 && (
        <ul>
          {receivedData.index.map((index) => (
            <li key={index}>{Content.synonyms[index]}</li>
          ))}
        </ul>
      )}
      {type === 4 && (
        <ul>
          {receivedData.index.map((index) => (
            <li key={index}>{Content.keywords[index]}</li>
          ))}
          {receivedData.index.map((index) => (
            <li key={index}>{Content.synonyms[index]}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ScriptDisplay;
