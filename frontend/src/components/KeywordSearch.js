// KeywordSearch 컴포넌트의 이름을 KeywordSearchPage로 변경하고 import 문을 수정합니다.
import React, { useState } from "react";
import axios from "axios";

const KeywordSearchPage = () => {
  // 이름을 KeywordSearchPage로 변경
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
            {searchResults.map((result) => (
              <li key={result._id}>
                <p>파일명: {result.filename}</p>

                <p>키워드: {result.sentence[0]}</p>
                
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default KeywordSearchPage; // export 문 변경
