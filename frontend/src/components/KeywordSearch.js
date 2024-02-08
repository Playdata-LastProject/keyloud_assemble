import React, { useState } from "react";
import axios from "axios";
//import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const KeywordSearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템의 키 값을 저장하는 상태
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/keyword_search?keyword=${encodeURIComponent(
          searchKeyword
        )}`
      );
      setSearchResults(response.data); // JSON 파싱 없이 데이터 할당
    } catch (error) {
      setError("검색 중 오류가 발생했습니다.");
    }

    setLoading(false);
  };

  // 클릭 이벤트 핸들러 추가
  const handleItemClick = (index) => {
    setSelectedItem(index); // 선택된 아이템의 키 값을 저장
    navigate(`/details/${searchResults[index]._id}`, {
      state: { data: searchResults[index] },
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        검색
      </button>

      {loading && <p>검색 중...</p>}
      {error && <p>{error}</p>}

      {searchResults.length > 0 && (
        <div>
          <h2>검색 결과</h2>
          <ul>
            {searchResults.map((result, index) => (
              <li key={result._id} onClick={() => handleItemClick(index)}>
                <p>파일명: {result.filename}</p>
                <ul>
                  {result.sentence.map((sentence, index) => (
                    <li key={index}>{sentence}</li>
                  ))}
                </ul>
                <p>키워드: {result.sentence[0]}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedItem && <p>선택된 아이템의 키 값: {selectedItem}</p>}
    </div>
  );
};

export default KeywordSearchPage;
