// AppContext.js

import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [isLoadingPopupOpen, setLoadingPopupOpen] = useState(false);

  const updateLoading = (newState) => {
    setLoading(newState);
  };

  const updateComplete = (newState) => {
    setComplete(newState);
  };

  const updateLoadingPopupOpen = (newState) => {
    setLoadingPopupOpen(newState);
  };

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
    loading,
    updateLoading,
    complete,
    updateComplete,
    isLoadingPopupOpen,
    updateLoadingPopupOpen
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