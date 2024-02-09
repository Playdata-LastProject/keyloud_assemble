import React, { useState, useEffect } from "react";
import "./styles/HomeScreen.css";
import { useContext } from "react";
import { AppContext } from "../AppContext.js";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const {
    folders,
    uploadedFiles,
    addFolder,
    addFileToFolder,
    setUploadedFiles,
  } = useContext(AppContext);
  const [isUploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [addedFolders, setAddedFolders] = useState([
    { name: "최근 업로드 폴더", id: 1 },
  ]);
  const [userKeyword, setUserKeyword] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRenamePopupOpen, setRenamePopupOpen] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 uploadedFiles 값을 가져옴
    const storedUploadedFiles = localStorage.getItem("uploadedFiles");
    if (storedUploadedFiles) {
      setUploadedFiles(JSON.parse(storedUploadedFiles));
    }

    // 로컬 스토리지에서 폴더 정보를 가져옴
    const storedFolders = localStorage.getItem("addedFolders");
    if (storedFolders) {
      setAddedFolders(JSON.parse(storedFolders));
    } else {
      // 초기 폴더 정보 설정
      setAddedFolders([{ name: "최근 업로드 폴더", id: 1 }]);
      localStorage.setItem("addedFolders", JSON.stringify(addedFolders));
    }
  }, [setUploadedFiles, addedFolders]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
      localStorage.setItem("addedFolders", JSON.stringify(addedFolders));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [uploadedFiles, addedFolders]);

  const [isCreateFolderPopupOpen, setCreateFolderPopupOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [isFileUploadPopupOpen, setFileUploadPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [customFileName, setCustomFileName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [uploadedFilesState, setUploadedFilesState] = useState({});

  const handleUploadButtonClick = () => {
    setUploadMenuOpen(!isUploadMenuOpen);
  };

  const handleFileUploadButtonClick = () => {
    setFileUploadPopupOpen(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile || !selectedFolder) {
        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("files", selectedFile);
      formData.append("customFileName", customFileName);
      formData.append("selectedFolder", selectedFolder);

      formData.append("uploadDate", new Date().toISOString());
      formData.append("folderName", selectedFolder);

      const response = await fetch("http://localhost:5000/upload_files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleNavigateToKeywordResult = () => {
    navigate(`/keyword-result?keyword=${userKeyword}`);
  };

  const handleFolderIconClick = (folderName) => {
    setUploadMenuOpen(false);
  };

  const handleCreateFolderButtonClick = () => {
    setCreateFolderPopupOpen(true);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() !== "") {
      const newFolder = { name: newFolderName, id: Date.now() };
      setAddedFolders((prevFolders) => [...prevFolders, newFolder]);
      localStorage.setItem("addedFolders", JSON.stringify([...addedFolders, newFolder]));
      addFolder(newFolder);
      setNewFolderName("");
    }
    setCreateFolderPopupOpen(false);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setNewName(item.name);
  };

  const handleRename = () => {
    if (newName.trim() !== "") {
      const updatedFolders = addedFolders.map((folder) =>
        folder.id === selectedItem.id ? { ...folder, name: newName } : folder
      );
      setAddedFolders(updatedFolders);
      setRenamePopupOpen(false);
      setSelectedItem(null);
    }
  };

  const handleMoveToTrash = () => {
    if (newName.trim() !== "") {
      const updatedFolders = addedFolders.map((folder) =>
        folder.id === selectedItem.id ? { ...folder, name: newName } : folder
      );
      setAddedFolders(updatedFolders);
      setRenamePopupOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <div>
      {addedFolders.map((folder) => (
        <div key={folder.id}>
          <div
            className="folder-content"
            onClick={() => handleFolderIconClick(folder.name)}
          >
            <div className="folder-icon img">
              <img
                src="/images/folder-icon.png"
                alt="폴더 아이콘"
                style={{ width: "20px", height: "20px" }}
              />
            </div>
            <div className="folder-name">{folder.name}</div>
          </div>
          <div className="uploaded-files-container">
            {uploadedFiles[folder.name]?.map((file, index) => (
              <div key={index} className="uploaded-file">
                <img src={file.icon} alt="File Icon" className="file-icon" />
                <div className="file-name">{file.name}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="upload-button" onClick={handleUploadButtonClick}>
        <img
          src="/images/upload.png"
          alt="업로드 아이콘"
          style={{ width: "40px", height: "35px" }}
        />
      </button>

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

      {isCreateFolderPopupOpen && (
        <div className="create-folder-popup">
          <input
            className="create-folder-input"
            type="text"
            placeholder="폴더명을 입력하세요"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <button className="create-folder-button" onClick={handleCreateFolder}>
            폴더 생성
          </button>
        </div>
      )}

      {isFileUploadPopupOpen && (
        <div className="file-upload-popup">
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
            {addedFolders.map((folder) => (
              <option key={folder.id} value={folder.name}>
                {folder.name}
              </option>
            ))}
          </select>
          <button className="file-upload-button" onClick={handleUpload}>
            업로드
          </button>
        </div>
      )}

      {isRenamePopupOpen && (
        <div className="rename-popup">
          <input
            type="text"
            placeholder="새로운 이름을 입력하세요"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleRename}>이름 변경</button>
          <button onClick={handleMoveToTrash}>휴지통으로 이동</button>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
