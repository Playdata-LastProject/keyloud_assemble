// Header.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './styles/Header.css';
import '../App.css';

const Header = ({ onSearch }) => {
  const [userKeyword, setUserKeyword] = useState('');

  const handleSearchButtonClick = () => {
    // 검색 버튼이 클릭되었을 때 검색어를 HomeScreen으로 전달
    onSearch(userKeyword);
  };

  return (
    <div className="header-container">
      {/* 로고 */}
      <Link to="/">
        <img src="/images/logo.png" alt="Your Logo" className="logo-image" />
      </Link>

      {/* 검색창과 검색 버튼 */}
      <div className="search-container">
        <input
          type="text"
          placeholder="전체검색창(빠른검색)"
          className="search-input"
          value={userKeyword}
          onChange={(e) => setUserKeyword(e.target.value)}
        />
        <button onClick={handleSearchButtonClick}>검색</button>
      </div>

      {/* 로그인 버튼, 달력 버튼, 설정 버튼 */}
      <div className="button-container">
        <button className="icon-button">
          <FontAwesomeIcon icon={faCalendarAlt} />
        </button>
        <button className="icon-button">
          <FontAwesomeIcon icon={faCog} />
        </button>
        <button className="login-button">로그인</button>
      </div>
    </div>
  );
};

export default Header;
