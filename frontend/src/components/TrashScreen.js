import React, { useState, useEffect } from 'react';
import './styles/TrashScreen.css';

function TrashScreen() {
  const [items, setItems] = useState([]);

  // 페이지 로딩 시 휴지통 데이터 가져오기
  useEffect(() => {
    fetchTrashData();
  }, []);
  const fetchTrashData = async () => {
    try {
      const response = await fetch('http://52.78.157.198/trash_files'); // 백엔드 API 엔드포인트로 수정
      if (!response.ok) {
        throw new Error('휴지통 데이터를 가져오지 못했습니다.');
      }

      const data = await response.json();
      
      // data가 배열인지 확인 후 filename만 추출하여 상태 업데이트
      if (Array.isArray(data)) {
        setItems(data);
      } else {
      console.error('올바르지 않은 데이터 형식입니다.');
      }
    } catch (error) {
      console.error('휴지통 데이터를 가져오는 중 오류 발생', error);
    }
  };

  const emptyTrash = () => {
    const isConfirmed = window.confirm('휴지통의 모든 항목을 영구적으로 삭제하시겠습니까?');
    if (isConfirmed) {
      setItems([]); // 화면에서만 휴지통 비우기

      const deleteEndpoint = 'http://52.78.157.198/delete_all_files'; // 수정된 엔드포인트

      // 삭제 요청을 보낼 때에는 선택된 파일 ID를 전달하는 부분을 모두 제거합니다.
      fetch(deleteEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('휴지통 비우기 요청 실패');
          }
          return response.json();
        })
        .then(data => {
          console.log('휴지통 비우기 요청 성공', data);
        })
        .catch(error => {
          console.error('휴지통 비우기 요청 실패', error);
        });
    }
  };

  return (
    <div className="trash-screen">
      <h1>Trash Can</h1>
      {items.length > 0 && (
        <button onClick={emptyTrash} className="empty-button">
          휴지통 비우기
        </button>
      )}
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      
    </div>
  );
}

export default TrashScreen;