import React, { useState } from 'react';
import './styles/TrashScreen.css'; // CSS 파일 임포트

const initialItems = [
  { id: 1, name: 'Document1.txt' },
  { id: 2, name: 'Document2.txt' },
  // 추가 파일 또는 폴더
];

function TrashScreen() {
  const [items, setItems] = useState(initialItems);

  const emptyTrash = () => {
    // 사용자에게 삭제 확인 요청
    const isConfirmed = window.confirm('휴지통의 모든 항목을 영구적으로 삭제하시겠습니까?');
    if (isConfirmed) {
      // 확인 받았을 때만 삭제 처리
      setItems([]);

      // 선택된 파일들의 ID 배열
      const selectedFileIds = [/* 여기에 선택된 파일들의 ID를 넣어주세요 */];

      // 삭제 요청을 보낼 API 엔드포인트
      const deleteEndpoint = 'http://localhost:5000/delete_files';

      // AJAX나 fetch를 사용하여 백엔드에 삭제 요청을 보냅니다.
      fetch(deleteEndpoint, {
        method: 'DELETE', // 삭제 요청을 보내므로 HTTP 메서드는 DELETE를 사용합니다.
        headers: {
          'Content-Type': 'application/json',
          // 만약 백엔드가 인증을 요구하는 경우, 토큰을 헤더에 추가하세요.
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN',
        },
        body: JSON.stringify({ fileIds: selectedFileIds }), // 선택된 파일들의 ID를 JSON 형식으로 전송합니다.
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('삭제 요청 실패');
          }
          return response.json();
        })
        .then(data => {
          // 삭제 요청이 성공하면 여기에서 추가적인 처리를 수행할 수 있습니다.
          console.log('삭제 요청 성공', data);
        })
        .catch(error => {
          // 오류가 발생한 경우 여기에서 처리합니다.
          console.error('삭제 요청 실패', error);
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