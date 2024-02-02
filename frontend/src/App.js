import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Routes, Route as RouteV6 } from 'react-router-dom';
import Header from './components/Header.js';
import LeftMenu from './components/Leftmenu.js';
import HomeScreen from './components/HomeScreen.js';
import TrashScreen from './components/TrashScreen.js';
import KeywordSearch from './components/KeywordSearch.js';
import KeywordResult from './components/KeywordResult.js'; // 추가
import FileDetails from './components/FileDetails.js'; // 추가
import './App.css';
import { AppProvider } from './AppContext';


const App = () => {
  return (
    <Router>
      <AppProvider>
       <div className="app-container">
        {/* 헤더는 위쪽에 위치 */}
        <div className = "header-container"><Header /></div>
        

        <div className="main-container">
          {/* 왼쪽 메뉴 */}
          <div className="left-menu"><LeftMenu /></div>
          

          {/* 메인 컨텐츠 영역 */}
          <div className="main-content">
          <Routes>
            <Route path="/" exact element={<HomeScreen />} />
            <Route path="/keyword" element={<KeywordSearch />} />
            <Route path="/keyword-result" element={<KeywordResult />} />
            <Route path="/file-details/:fileName" element={<FileDetails />} />            
            <Route path="/trash" element={<TrashScreen />} />
            {/* 추가적인 라우트들 추가 가능 */}
          </Routes>
          </div>
        </div>
      </div>
    </AppProvider>
    </Router>
  );
};

export default App;