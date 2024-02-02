// KeywordResult.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/KeywordResult.css'

const KeywordResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword');
  const [userKeyword, setUserKeyword] = useState(keyword);


  // 가상의 검색 결과 데이터
  const searchResults = [
    {
      id: 1,
      keyword: 'example',
      sentence: 'This is an example sentence.',
      fileName: 'example_audio.mp3',
      time: '0:30', // 가상의 시간 정보
    },
    // ... 다른 검색 결과 데이터
  ];

  const handleFileClick = (fileName) => {
    // 파일명을 클릭하면 새로운 화면으로 이동
    navigate(`/file-details/${fileName}`);
  };

  return (
    <div>
      {/* 키워드 검색창과 버튼 */}
      <div className="keyword-search-container">
        <input type="text" value={keyword} readOnly />
        {/* 추가적인 버튼 또는 UI를 여기에 구현할 수 있습니다. */}
      </div>

      {/* 검색 결과 표시 */}
      <div className="search-results-container">
        {searchResults.map((result) => (
          <div key={result.id} className="search-result-item">
            <div className="result-text">
              {result.sentence.split(result.keyword).map((part, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="highlight">{result.keyword}</span>}
                  {part}
                </React.Fragment>
              ))}
            </div>
            <div className="result-info">
              <div className="file-name" onClick={() => handleFileClick(result.fileName)}>
                {result.fileName}
              </div>
              <div className="time-info">{`시간: ${result.time}`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordResult;