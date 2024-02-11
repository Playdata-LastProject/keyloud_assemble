import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ScriptDisplay = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(0);
  const [receivedData, setReceivedData] = useState({});
  const [Content, setContents] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (location.state) {
        setReceivedData(location.state.data);
        setType(location.state.type);
        setLoading(false);
        await getContents(location.state.data.filename);
      }
    };

    fetchData();
  }, [location.state]);

  const getContents = async (fileID) => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.get(
        `http://localhost:5000/contents?fileName=${encodeURIComponent(fileID)}`
      );
      setContents((prevContent) => ({ ...prevContent, ...response.data })); // JSON 파싱 없이 데이터 할당
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
  };

  // 파일 삭제 이벤트 핸들러
  const handleDelete = (fileName) => {
    // TODO: 파일 삭제 로직 추가
    console.log(`Delete file: ${fileName}`);
  };

  // 데이터가 존재하는 경우에 대한 처리
  return (
    <div>
      <h2>Received Data</h2>
      <p>file name: {receivedData.filename}</p>
      <p>script: {Content.scripts}</p>
      <ul>
        {Content.timestamp.map((sentence, index) => (
          <li key={index}>{sentence}</li>
        ))}
      </ul>
      <div className="file-actions">
            <button onClick={handleEdit} className="edit-button">
              수정
            </button>
            <button onClick={handleDelete} className="delete-button">
              삭제
            </button>
          </div>
      {type === 0 && (
        <ul>
          {receivedData.index.map((index) => (
            <li key={index}>{Content.timestamp[index]}</li>
          ))}
        </ul>
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
    </div>
  );
};
export default ScriptDisplay;
