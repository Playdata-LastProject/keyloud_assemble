import React from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트 추가
import "../App.css";

const LeftMenu = ({ onTrashPage }) => {
  return (
    <div className="left-menu">
      <Link to="/keyword">키워드 검색</Link>
      <div style={{ marginTop: "20px" }}>
        <Link to="/trash">휴지통</Link>
      </div>
    </div>
  );
};

export default LeftMenu;
