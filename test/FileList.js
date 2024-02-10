// FileList.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const FileList = ({ folderName }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/files_in_folder?folderName=${encodeURIComponent(folderName)}`);
        setFiles(response.data);
      } catch (error) {
        console.error("파일 목록을 불러오는 중 오류 발생:", error);
      }
    };

    fetchFiles();
  }, [folderName]);

  return (
    <div>
      <h3>파일 목록</h3>
      <ul>
        {files.map((file) => (
          <li key={file.filename}>
            파일 이름: {file.filename}, 업로드 날짜: {new Date(file.uploadDate).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
