// AppContext.js

import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [folders, setFolders] = useState([]);

  const addFileToFolder = (folderName, file) => {
    const updatedFiles = { ...uploadedFiles };
    const updatedFileList = updatedFiles[folderName] ? [...updatedFiles[folderName]] : [];
    updatedFileList.push(file);
    updatedFiles[folderName] = updatedFileList;
    setUploadedFiles(updatedFiles);
  };

  const addFolder = (folder) => {
    setFolders((prevFolders) => [...prevFolders, folder]);
  };

  const contextValue = {
    uploadedFiles,
    setUploadedFiles,
    addFileToFolder,
    addFolder,
    folders,
  };

  useEffect(() => {
    // Save folders to local storage
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    // Load folders from local storage on initial render
    const storedFolders = localStorage.getItem('folders');
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    }
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};