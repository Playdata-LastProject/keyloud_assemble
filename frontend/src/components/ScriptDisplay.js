import React, { useState, useEffect } from 'react';

const ScriptDisplay = ({ fileName }) => {
  const [script, setScript] = useState("");

  useEffect(() => {
    // TODO: 파일명을 바탕으로 스크립트 데이터 불러오기
    // setScript(로드된 스크립트 데이터);
  }, [fileName]);

  return (
    <div className="script-display">
      {script}
      {/* 스크롤 가능한 스크립트 표시 영역 */}
    </div>
  );
};

export default ScriptDisplay;