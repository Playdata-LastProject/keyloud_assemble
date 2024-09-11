// AppContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AppContext = createContext();
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [isLoadingPopupOpen, setLoadingPopupOpen] = useState(false);
  const [user, setUser] = useState(null);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
  };
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
    setUploadedFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      const updatedFileList = updatedFiles[folderName] ? [...updatedFiles[folderName]] : [];
      updatedFileList.push(file);
      updatedFiles[folderName] = updatedFileList;
      return updatedFiles;
    });
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
    updateLoadingPopupOpen,
    user,
    loginUser,
    logoutUser
  };

  useEffect(() => {
    // Save user to local storage
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    // Load user from local storage on initial render
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
