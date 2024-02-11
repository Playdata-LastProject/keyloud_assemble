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

  // 데이터가 존재하는 경우에 대한 처리
  return (
    <div>
      <h2>Received Data</h2>
      <p>file name: {receivedData.filename}</p>
      <p>script: {Content.scripts}</p>
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
