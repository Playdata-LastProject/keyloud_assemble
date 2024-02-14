import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/HomeScreen.css";
import { useContext } from "react";
import { AppContext } from "../AppContext.js";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { uploadedFiles, addFolder, setUploadedFiles, loading, complete, isLoadingPopupOpen, updateLoadingPopupOpen, updateComplete, updateLoading } = useContext(AppContext);
  //const [loading, setLoading] = useState(false);
  //const [complete, setComplete] = useState(false);
  //const [isLoadingPopupOpen, setLoadingPopupOpen] = useState(false);
  const [isUploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRenamePopupOpen, setRenamePopupOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isCreateFolderPopupOpen, setCreateFolderPopupOpen] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [isFileUploadPopupOpen, setFileUploadPopupOpen] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [customFileName, setCustomFileName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [errorInFolder, setErrorInFolder] = useState("");
  const [messageFromUpload, setMessageFromUpload] = useState("");
  const [Folders, setFoldersList] = useState([]);


  useEffect(() => {
    fetchData(); // fetchData 함수 호출
  }, [Folders]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/listUpFolders", {
        method: "POST",
      });
      const data = await response.json(); // 서버에서 받은 데이터를 JSON으로 파싱

      setFoldersList(data);
    } catch (error) {
      console.error("Error fetching folder list:", error);
    }
  };

  const handleUploadButtonClick = () => {
    setUploadMenuOpen(!isUploadMenuOpen);
  };

  // 파일 업로드 팝업 열기
  const handleFileUploadButtonClick = async () => {
    try {
      setFileUploadPopupOpen(true);
      //setComplete(false);
      updateComplete(false);
      //handleUpload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 파일 선택
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // 업로드 버튼 클릭 시
  const handleUpload = async () => {
    updateLoadingPopupOpen(true);
    updateLoading(true);
    //setLoadingPopupOpen(true);
    //setLoading(true);
    close();
    try {
      if (!selectedFile) {
        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("files", selectedFile);
      formData.append("customFileName", customFileName);
      formData.append("selectedFolder", selectedFolder);

      const response = await fetch("http://localhost:5000/upload_files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessageFromUpload(data.message);
      console.log(data.message); // 서버로부터 받은 응답 메시지 출력
      updateLoading(false);
      updateComplete(true);
      updateLoadingPopupOpen(false);
      //setLoading(false);
      //setComplete(true);
      //setLoadingPopupOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFolderIconClick = (folderName) => {
    setUploadMenuOpen(false);
    navigate(`/files/${folderName}`, {
      state: {
        data: folderName,
      },
    });
  };

  const handleCreateFolderButtonClick = () => {
    setCreateFolderPopupOpen(true);
  };
  const handleCreateFolder = async () => {
    try {
      if (newFolderName.trim() !== "") {
        const newFolder = { name: newFolderName, id: Date.now() };
        addFolder(newFolder);

        const response = await axios.post(
          "http://localhost:5000/create_folders",
          { folderName: newFolderName },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data === "same name") {
          setErrorInFolder("This Name already exist.");
        } else {
          fetchData();
        }
      } else {
        setErrorInFolder("이름은 공백이 될 수 없습니다.");
      }
      //const data = await response.json();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setNewName(item.name);
  };

  const handleRename = () => {
    if (newName.trim() !== "") {
      // 파일 수정 로직은 uploadedFiles 상태를 업데이트해야 합니다.
      // 추가: handleRename 함수 내용을 여기에 추가

      setRenamePopupOpen(false);
      setSelectedItem(null);
    }
  };

  // 수정: handleMoveToTrash 함수 정의
  const handleMoveToTrash = () => {
    if (newName.trim() !== "") {
      // 파일 수정 로직은 uploadedFiles 상태를 업데이트해야 합니다.
      // 추가: handleMoveToTrash 함수 내용을 여기에 추가

      setRenamePopupOpen(false);
      setSelectedItem(null);
    }
  };

  const close = () => {
    setFileUploadPopupOpen(false);
    setCreateFolderPopupOpen(false);
  };

  return (
    <div className="folder-container">
      {/* 폴더 아이콘과 폴더명 세트 */}
      {Folders.map((folder) => (
        <div
          className="folder-content"
          onClick={() => handleFolderIconClick(folder)}
        >
          <div className="folder-icon">
            <img
              src="/images/folder2.ico"
              alt="폴더 아이콘"
              style={{ width: "45px", height: "40px" }}
            />
          </div>
          <div className="folder-name">{folder}</div>
        </div>
      ))}

      {/* 업로드 버튼 */}
      <button className="upload-button" onClick={handleUploadButtonClick}>
        <img
          src="/images/upload2.ico"
          alt="업로드 아이콘"
          style={{ width: "40px", height: "35px" }}
        />
      </button>

      {/* 업로드 메뉴 */}
      {isUploadMenuOpen && (
        <div className="upload-menu">
          <button
            className="upload-menu-button"
            onClick={handleCreateFolderButtonClick}
          >
            폴더 생성
          </button>
          <button
            className="upload-menu-button"
            onClick={handleFileUploadButtonClick}
          >
            파일 업로드
          </button>
        </div>
      )}

      {/* 폴더 생성 팝업 */}
      {isCreateFolderPopupOpen && (
        <div className="create-folder-popup">
          <button class="close-button" onClick={close}>
            {" "}
            X{" "}
          </button>
          <input
            className="create-folder-input" // 추가: 클래스 이름 추가
            type="text"
            placeholder="폴더명을 입력하세요"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <button className="create-folder-button" onClick={handleCreateFolder}>
            폴더 생성
          </button>
          {errorInFolder}
        </div>
      )}

      {/* 파일 업로드 팝업 */}
      {isFileUploadPopupOpen && (
        <div className="file-upload-popup">
          <button class="close-button" onClick={close}>
            {" "}
            X{" "}
          </button>
          <input
            className="file-upload-input"
            type="file"
            onChange={handleFileSelect}
          />

          {/* 사용자 정의 파일명 입력을 위한 입력란 */}
          <input
            className="file-upload-custom-input"
            type="text"
            placeholder="파일명을 입력하세요"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
          />
          <select
            className="file-upload-select"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
          >
            <option value="" disabled>
              Select a folder
            </option>
            {Folders.map((folder) => (
              <option value={folder}>{folder}</option>
            ))}
          </select>

          {/* 업로드 버튼 */}
          <button className="file-upload-button" onClick={handleUpload}>
            업로드
          </button>
          {loading && <p>업로드 중입니다. 잠시만 기다려주세요.</p>}
          {complete && <p>{messageFromUpload}</p>}
        </div>
      )}

      {/* 팝업창 */}
      {isRenamePopupOpen && (
        <div className="rename-popup">
          <input
            type="text"
            placeholder="새로운 이름을 입력하세요"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          {/* 수정: handleRename 함수 호출로 변경 */}
          <button onClick={handleRename}>이름 변경</button>
          {/* 수정: handleMoveToTrash 함수 호출로 변경 */}
          <button onClick={handleMoveToTrash}>휴지통으로 이동</button>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
