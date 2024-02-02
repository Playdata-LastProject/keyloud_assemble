import React from 'react';
import MediaPlayer from './MediaPlayer';
import ScriptDisplay from './ScriptDisplay';
import SummaryButton from './SummaryButton';
import KeywordResult from './KeywordResult'; // 이전 화면
import './styles/FileDetails.css'; // 스타일링은 별도로 설정

const FileDetails = ({ fileName }) => {
  return (
    <div className="file-details-container">
      <div className="left-panel">
        <MediaPlayer fileName={fileName} />
        <ScriptDisplay fileName={fileName} />
        <SummaryButton fileName={fileName} />
      </div>
      <div className="right-panel">
        <KeywordResult />
      </div>
    </div>
  );
};

export default FileDetails;