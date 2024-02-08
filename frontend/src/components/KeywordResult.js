import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/HomeScreen.css";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 상태 추가

  const handleSearchKeyword = () => {
    // 검색어가 비어있는지 확인
    if (!searchKeyword.trim()) {
      console.log("검색어를 입력하세요");
      return;
    }
    // 검색어가 입력되었을 때의 로직
    navigate(`/keyword-result`);
  };

  return (
    <div>
      {/* 검색어 입력란과 버튼 */}
      <div className="search-container">
        <input
          type="text"
          placeholder="검색할 키워드를 입력하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearchKeyword} className="search-button">
          검색
        </button>
      </div>
      {/* 기존의 폴더 및 파일 표시 코드 등 */}
    </div>
  );
};

export default HomeScreen;
