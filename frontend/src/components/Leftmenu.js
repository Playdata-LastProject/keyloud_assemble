import React from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트 추가
import "../App.css";
import "./styles/LeftMenu.css";
import { AppContext } from "../AppContext.js";
import { useContext } from "react";

const LeftMenu = ({ onTrashPage }) => {

  const { loading, complete, isLoadingPopupOpen, updateLoadingPopupOpen, updateComplete, updateLoading } = useContext(AppContext);

  const loadingClose = () => {
    updateLoadingPopupOpen(false);
    //setLoadingPopupOpen(false);
  };

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

      {/* 로딩 팝업 */}
      {isLoadingPopupOpen && (
        <div className="loading-popup">
          <button class="close-button" onClick={loadingClose}>
            {" "}
            X{" "}
          </button>
          <div className="loading-container">
            {loading && <p>업로드 중입니다. 잠시만 기다려주세요.</p>}
            {complete && <p>업로드 완료!</p>}
            {complete && <button className="loading-button" onClick={loadingClose}>
              확인
            </button>}
          </div>
        </div>
      )}

      {/* 로딩 완료 팝업 */}
      {complete && (
        <div className="loading-popup">
          <div className="loading-container">
            {loading && <p>업로드 중입니다. 잠시만 기다려주세요.</p>}
            {complete && <p>업로드 완료!</p>}
            {complete && <button className="loading-button" onClick={() => updateComplete(false)}>
              확인
            </button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftMenu;
