// KeywordSearch.js
import React, { useState } from "react";
import axios from "axios";
import "./styles/KeywordSearch.css"; // 스타일시트 추가

const KeywordSearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 추가: 검색 결과에 대한 문장을 강조하는 함수
  const highlightKeyword = (sentence) => {
    if (!searchKeyword.trim()) {
      return sentence; // Return unchanged if the search keyword is empty
    }
    const regex = new RegExp(`(${searchKeyword})`, "gi");
    return sentence.replace(regex, (match, p1) => `<span class="highlight">${p1}</span>`);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/keyword_search?keyword=${encodeURIComponent(
          searchKeyword
        )}`
      );
      const data = response.data;
      setSearchResults(data);
    } catch (error) {
      setError("검색 중 오류가 발생했습니다.");
    }

    setLoading(false);
  };

  // 추가: 파일명 클릭 시 실행되는 함수
  const handleFileNameClick = (fileName) => {
    // 파일명 클릭에 대한 로직 추가
    console.log(`파일명 '${fileName}'이 클릭되었습니다.`);
  };

  return (
    <div className="keyword-search-container"> {/* 클래스 적용 */}
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="keyword-input" 
      />
      <button onClick={handleSearch} disabled={loading} className="search-button"> {/* 클래스 적용 */}
        검색
      </button>

      {loading && <p>검색 중...</p>}
      {error && <p>{error}</p>}

      {searchResults.length > 0 && (
        <div className="search-results-container"> {/* 클래스 적용 */}
          <h2>검색 결과</h2>
          <ul>
            {searchResults.map((result) => (
              <li key={result._id} className="search-result-item"> {/* 클래스 적용 */}
                <p className="result-text"> {/* 클래스 적용 */}
                  파일명: <span className="file-name" onClick={() => handleFileNameClick(result.filename)}>
                    {result.filename}
                  </span>
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: `키워드: ${highlightKeyword(result.sentence[0])}`,
                  }}
                  className="result-info" 
                ></p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default KeywordSearchPage;
