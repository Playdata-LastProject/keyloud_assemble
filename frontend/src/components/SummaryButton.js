import React from 'react';

const SummaryButton = ({ fileName }) => {
  const handleSummaryDownload = () => {
    // TODO: 요약 스크립트 다운로드 로직 구현
  };

  return (
    <button onClick={handleSummaryDownload}>요약하기</button>
  );
};

export default SummaryButton;