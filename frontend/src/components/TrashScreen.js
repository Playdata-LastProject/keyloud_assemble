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