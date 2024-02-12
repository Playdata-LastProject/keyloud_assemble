import React, { useState, useEffect } from 'react';
import './styles/TrashScreen.css';

function TrashScreen() {
  const [items, setItems] = useState([]);

  // 페이지 로딩 시 휴지통 데이터 가져오기
  useEffect(() => {
    const fetchTrashData = async () => {
      try {
        const response = await fetch('http://52.78.157.198:5000/trash_files'); // 백엔드 API 엔드포인트로 수정
        if (!response.ok) {
          throw new Error('휴지통 데이터를 가져오지 못했습니다.');
        }
        const data = await response.json();
        setItems(data); // 백엔드에서 받은 데이터로 상태 업데이트
      } catch (error) {
        console.error('휴지통 데이터를 가져오는 중 오류 발생', error);
      }
    };

    fetchTrashData();
  }, []); // 빈 배열을 넣어 한 번만 실행되도록 설정

  const emptyTrash = () => {
    const isConfirmed = window.confirm('휴지통의 모든 항목을 영구적으로 삭제하시겠습니까?');
    if (isConfirmed) {
      setItems([]); // 화면에서만 휴지통 비우기

      const deleteEndpoint = 'http://52.78.157.198:5000/delete_all_files'; // 수정된 엔드포인트

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
      <h1>휴지통</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      {items.length > 0 && (
        <button onClick={emptyTrash} className="empty-button">
          휴지통 비우기
        </button>
      )}
    </div>
  );
}

export default TrashScreen;
