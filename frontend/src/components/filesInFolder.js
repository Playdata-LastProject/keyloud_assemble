import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../AppContext.js";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/HomeScreen.css";

const FilesInFolder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const {
    folders,
    uploadedFiles,
    addFolder,
    addFileToFolder,
    setUploadedFiles,
  } = useContext(AppContext);
  const [isUploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [userKeyword, setUserKeyword] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRenamePopupOpen, setRenamePopupOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreateFolderPopupOpen, setCreateFolderPopupOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isFileUploadPopupOpen, setFileUploadPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [customFileName, setCustomFileName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [uploadedFilesState, setUploadedFilesState] = useState({});
  const [errorInFolder, setErrorInFolder] = useState("");
  const [Folders, setFoldersList] = useState([]);
  const [targetFolder, setTargetFolder] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (location.state) {
        setTargetFolder(location.state.data);
        await getContents(location.state.data);
      }
    };

    fetchData();
  }, [location.state]);

  const getContents = async (folderName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/listUpFiles?folderName=${encodeURIComponent(
          folderName
        )}`
      );
      setFoldersList(response.data); // JSON 파싱 없이 데이터 할당
    } catch (error) {
      //setError("검색 중 오류가 발생했습니다.");
    }
  };

  const handleUploadButtonClick = () => {
    setUploadMenuOpen(!isUploadMenuOpen);
  };

  // 파일 업로드 팝업 열기
  const handleFileUploadButtonClick = async () => {
    try {
      setFileUploadPopupOpen(true);
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
    setLoading(true);
    try {
      if (!selectedFile) {
        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("files", selectedFile);
      formData.append("customFileName", customFileName);
      formData.append("selectedFolder", selectedFolder);

      const response = await fetch("http://localhos:5000/upload_files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data.message); // 서버로부터 받은 응답 메시지 출력
      setLoading(false);
      setFileUploadPopupOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleNavigateToKeywordResult = () => {
    navigate(`/keyword-result?keyword=${userKeyword}`);
  };

  const handleFolderIconClick = (folderName) => {
    setUploadMenuOpen(false);
    navigate(`/details/${folderName}`, {
      state: {
        data: {
          index: [],
          filename: folderName,
        },
        type: 4,
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
      }
      const response = await axios.post(
        "http://localhost:5000/create_folders",
        { folderName: newFolderName },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data === "same name") {
        setErrorInFolder("This Name already exist.");
      }

      //const data = await response.json();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setCreateFolderPopupOpen(false);
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
            <div className="folder-icon img">
              <img
                src="/images/mic.ico"
                alt="폴더 아이콘"
                style={{ width: "40px", height: "40px" }}
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
          {loading && <p>업로드 중 ...</p>}
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

export default FilesInFolder;
