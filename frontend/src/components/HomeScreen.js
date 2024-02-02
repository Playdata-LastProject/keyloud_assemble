import React, { useState, useEffect } from 'react';
import './styles/HomeScreen.css';
import { useContext } from 'react';
import { AppContext } from '../AppContext.js';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const { folders, uploadedFiles, addFolder, addFileToFolder, setUploadedFiles, } = useContext(AppContext);
  const [isUploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [addedFolders, setAddedFolders] = useState([
    { name: '최근 업로드 폴더', id: 1 },
  ]);
  const [userKeyword, setUserKeyword] = useState(''); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRenamePopupOpen, setRenamePopupOpen] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 uploadedFiles 값을 가져옴
    const storedUploadedFiles = localStorage.getItem('uploadedFiles');
    if (storedUploadedFiles) {
      setUploadedFiles(JSON.parse(storedUploadedFiles));
    }

    // 여기서 기본 폴더 정보를 추가합니다.
    setAddedFolders([{ name: '최근 업로드 폴더', id: 1 }]);
  }, [setUploadedFiles]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [uploadedFiles]);  

  const [isCreateFolderPopupOpen, setCreateFolderPopupOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [isFileUploadPopupOpen, setFileUploadPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [customFileName, setCustomFileName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [uploadedFilesState, setUploadedFilesState] = useState({});
   
  
  
  
  const handleUploadButtonClick = () => {
    setUploadMenuOpen(!isUploadMenuOpen);
  };

  // 파일 업로드 팝업 열기
  const handleFileUploadButtonClick = () => {
    setFileUploadPopupOpen(true);
  };

  // 파일 선택
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // 업로드 버튼 클릭 시
  const handleUpload = () => {
    // 여기에 파일 업로드 로직 추가 (서버에 업로드 등)
    console.log('File Uploaded:', selectedFile);
    console.log('Custom File Name:', customFileName);
    console.log('Selected Folder:', selectedFolder);
  
    const updatedFiles = { ...uploadedFiles };
    const updatedFileList = updatedFiles[selectedFolder] ? [...updatedFiles[selectedFolder]] : [];
    updatedFileList.push({ name: customFileName, icon: '/images/file-icon.png' });
    updatedFiles[selectedFolder] = updatedFileList;
  
    setUploadedFiles(updatedFiles);

  
    // 상태 초기화
    setFileUploadPopupOpen(false);
    setSelectedFile(null);
    setCustomFileName('');
    setSelectedFolder('');

  };

  const handleNavigateToKeywordResult = () => {
    navigate(`/keyword-result?keyword=${userKeyword}`);
  };

  const handleFolderIconClick = (folderName) => {
    setUploadMenuOpen(false);
    // 여기서 폴더 아이콘 클릭 시의 로직을 추가하세요
  };

  const handleCreateFolderButtonClick = () => {
    setCreateFolderPopupOpen(true);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() !== '') {
      const newFolder = { name: newFolderName, id: Date.now() };
      setAddedFolders((prevFolders) => [...prevFolders, newFolder]);
      addFolder(newFolder);
      setNewFolderName('');
    }
    setCreateFolderPopupOpen(false);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setNewName(item.name);
  };

  
  const handleRename = () => {
    if (newName.trim() !== '') {
      const updatedFolders = addedFolders.map((folder) =>
        folder.id === selectedItem.id ? { ...folder, name: newName } : folder
      );
      setAddedFolders(updatedFolders);

      // 파일 수정 로직은 uploadedFiles 상태를 업데이트해야 합니다.
      // 추가: handleRename 함수 내용을 여기에 추가

      setRenamePopupOpen(false);
      setSelectedItem(null);
    }
  };

  // 수정: handleMoveToTrash 함수 정의
  const handleMoveToTrash = () => {
    if (newName.trim() !== '') {
      // handleRename 함수 내용을 여기에 직접 구현
      const updatedFolders = addedFolders.map((folder) =>
        folder.id === selectedItem.id ? { ...folder, name: newName } : folder
      );
      setAddedFolders(updatedFolders);

      // 파일 수정 로직은 uploadedFiles 상태를 업데이트해야 합니다.
      // 추가: handleMoveToTrash 함수 내용을 여기에 추가

      setRenamePopupOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <div>
      {/* 폴더 아이콘과 폴더명 세트 */}
      {addedFolders.map((folder) => (
       <div key={folder.id}>
        <div className="folder-content" onClick={() => handleFolderIconClick(folder.name)}>
         <div className="folder-icon img">
         <img src="/images/folder-icon.png" alt="폴더 아이콘" style={{ width: '20px', height: '20px' }} />
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

      {/* 업로드 버튼 */}
      <button className="upload-button" onClick={handleUploadButtonClick}>
        <img src="/images/upload.png" alt="업로드 아이콘" style={{ width: '40px', height: '35px' }} />
      </button>

      {/* 업로드 메뉴 */}
      {isUploadMenuOpen && (
        <div className="upload-menu">
          <button className="upload-menu-button" onClick={handleCreateFolderButtonClick}>
            폴더 생성
          </button>
          <button className="upload-menu-button" onClick={handleFileUploadButtonClick}>파일 업로드</button>
        </div>
      )}

      {/* 폴더 생성 팝업 */}
      {isCreateFolderPopupOpen && (
        <div className="create-folder-popup">
          <input
           className="create-folder-input" // 추가: 클래스 이름 추가
           type="text"
           placeholder="폴더명을 입력하세요"
           value={newFolderName}
           onChange={(e) => setNewFolderName(e.target.value)}
          />
         <button className="create-folder-button" onClick={handleCreateFolder}>폴더 생성</button>
       </div>
      )}
      
      {/* 파일 업로드 팝업 */}
      {isFileUploadPopupOpen && (
        <div className="file-upload-popup">
          {/* 파일 선택을 위한 파일 입력란 */}
          <input className="file-upload-input" type="file" onChange={handleFileSelect} />

          {/* 사용자 정의 파일명 입력을 위한 입력란 */}
          <input
            className="file-upload-custom-input"
            type="text"
            placeholder="파일명을 입력하세요"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
          />

          {/* 폴더 선택을 위한 드롭다운 또는 UI */}
          {/* 폴더를 선택하고 selectedFolder 상태를 업데이트하는 논리 또는 UI를 추가하세요 */}
          <select
            className="file-upload-select"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
          >
            <option value="" disabled>Select a folder</option>
            {addedFolders.map((folder) => (
              <option key={folder.id} value={folder.name}>{folder.name}</option>
              ))}
              </select>
    
              {/* 업로드 버튼 */}
              <button 
              className="file-upload-button"
              onClick={handleUpload}>업로드</button>
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