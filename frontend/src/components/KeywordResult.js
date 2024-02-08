import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./styles/KeywordResult.css";

const KeywordResult = () => {
  const location = useLocation();
  const { searchKeyword } = location.state || {};
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:5000/keyword_search?keyword=${encodeURIComponent(searchKeyword)}`
        );
        const data = response.data;

        setSearchResults(data);
      } catch (error) {
        setError("검색 결과를 가져오는 중 에러 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchKeyword]);

  // Function to highlight the search keyword in a given sentence
  const highlightKeyword = (sentence) => {
    if (!searchKeyword.trim()) {
      return sentence; // Return unchanged if the search keyword is empty
    }
    const regex = new RegExp(`(${searchKeyword})`, "gi");
    return sentence.replace(regex, (match, p1) => `<span class="highlight">${p1}</span>`);
  };

  return (
    <div>
      <h2>검색 결과</h2>
      {loading && <p>검색 중...</p>}
      {error && <p>{error}</p>}

      <ul>
        {searchResults && searchResults.length > 0 ? (
          searchResults.map((result) => (
            <li key={result._id} className="search-result-item">
              <p className="file-name">{result.filename}</p>
              <p
                className="result-text"
                dangerouslySetInnerHTML={{ __html: `키워드: ${highlightKeyword(result.sentence[0])}` }}
              ></p>
            </li>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default KeywordResult;
