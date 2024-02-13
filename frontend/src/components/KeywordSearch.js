import React, { useState, useEffect } from "react";
import axios from "axios";
//import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import _ from "lodash";
import "./styles/KeywordResult.css";
import AnimatedCircle from "./AnimatedCircle";  // 추가된 부분

const KeywordSearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템의 키 값을 저장하는 상태
  const [targetSynonyms, setTargetSynonyms] = useState([]);
  const [onlySearchResults, setOnlySearchResults] = useState([]);
  const [isFirst, setFirst] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 2초 후에 페이드 인 스타일 적용
    const timer = setTimeout(() => {
      const searchContainer = document.querySelector('.search-sector');
      if (searchContainer) {
        searchContainer.classList.add('fade-in');
      }
    }, 2000);

    return () => clearTimeout(timer); // 컴포넌트가 언마운트되면 타이머 제거
  }, []);

  const handleSearch = async () => {
    const currentPath = location.pathname;
    const updatedPath = `${currentPath}?keyword=${encodeURIComponent(
      searchKeyword
    )}`;
    navigate(updatedPath);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://52.78.157.198:5000/keyword_search?keyword=${encodeURIComponent(
          searchKeyword
        )}`
      );
      setSearchResults(response.data); // JSON 파싱 없이 데이터 할당
      setTargetSynonyms(response.data.slice(0, 2));
      setOnlySearchResults(response.data.slice(2));
    } catch (error) {
      setError("검색 중 오류가 발생했습니다.");
    }

    setLoading(false);
    setFirst(false);
  };

  // 클릭 이벤트 핸들러 추가
  const handleItemClick = (upperIndex, index) => {
    const filename = onlySearchResults[upperIndex][index].filename;
    navigate(`/details/${filename}`, {
      state: {
        data: onlySearchResults[upperIndex][index],
        type: upperIndex,
      },
    });
  };

  return (
    <div>
      <div className={`search-sector ${isFirst ? 'first-style' : 'second-style'}`}>
        <input
          className="keyword-search"
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch} disabled={loading}>
          검색
        </button>

        {loading && <p>검색 중...</p>}
        {error && <p>{error}</p>}
      </div>
      

      {/* first 상태가 true일 때만 AnimatedCircle 렌더링 */}
      {isFirst && (
        <div className="circle-container">
          <AnimatedCircle />
        </div>
      )}

      
      {searchResults.length > 0 && (
        <div>
          <h2>검색 결과</h2>
          <h3>
          <div className="recommend">
            <img
              src="/images/search.ico"
              alt="키워드 아이콘"
              className="search-icon"
            /> 추천 검색어: {targetSynonyms[0]}, {targetSynonyms[1]}
          </div>
          </h3>
          {onlySearchResults.map((results, upperIndex) => (
            <div>
              <h3>
                {upperIndex === 0 && "< In Script >"}
                {upperIndex === 1 && "< In Keywords >"}
                {upperIndex === 2 && "< In Synonyms >"}
              </h3>
              {_.isEmpty(results) && <p>Nothing</p>}
              <ul className="sector">
                {results.map((result, index) => (
                  <li className="result-list"
                    key={result.filename}
                    onClick={() => handleItemClick(upperIndex, index)}
                  >
                    <p className="file-name">파일명: {result.filename}</p>
                    <ul>
                      {result.sentence.map((sentence, index) => (
                        <li key={index}>{sentence}</li>
                      ))}
                    </ul>
                    <p>키워드: {result.keywords}</p>
                    <p>유의어: {result.synonyms}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordSearchPage;
