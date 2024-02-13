import React from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트 추가
import "../App.css";
import "./styles/LeftMenu.css";

const LeftMenu = ({ onTrashPage }) => {
  return (
    <div className="left-menu">
      <Link
        to={{
          pathname: `/keyword/search`,
        }}
        className="menu-link"
      >
        <div className="menu-item">
          <img
            src="/images/search.ico"
            alt="키워드 아이콘"
            className="search-icon"
          />
          키워드 검색
        </div>
      </Link>
      <div style={{ marginTop: "20px" }}>
        <Link to="/trash"
        className="menu-link"
        >
          <div className="menu-item">
            <img src="/images/trash.ico" alt="휴지통 아이콘" className="trash-icon" />
            휴지통
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LeftMenu;
