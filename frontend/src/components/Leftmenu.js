import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'

const LeftMenu = ({ onTrashPage }) => {
  return (
    <div className="left-menu">
      {/* 메뉴 및 링크 */}
      <Link to="/keyword">키워드 검색</Link>
      <div style={{ marginTop: '20px' }}>
        <Link to="/trash">휴지통</Link>
      </div>
    </div>
  );
};

export default LeftMenu;