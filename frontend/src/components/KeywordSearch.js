// KeywordSearch.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/KeywordSearch.css';

const KeywordSearch = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    // ... 검색 로직 수행
    navigate(`/keyword-result?keyword=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <div className="keyword-search-container">
      <input
        type="text"
        placeholder="검색할 키워드를 입력하세요"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="keyword-input"
      />
      <button onClick={handleSearch} className="search-button">
        검색
      </button>
    </div>
  );
};

export default KeywordSearch;