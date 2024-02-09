import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ScriptDisplay = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [receivedData, setReceivedData] = useState({});
  const [Content, setContents] = useState({});
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (location.state) {
      setReceivedData(location.state.data);
      setLoading(false);
      getContents(location.state.data.filename);
    }
  }, [location.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if(error){
    return <div>{error}</div>;
  }

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
    </div>
  );
};
export default ScriptDisplay;
