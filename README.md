## Keyloud 소개
![image](https://github.com/user-attachments/assets/118cf771-40ba-4263-9c3a-306a49e16b5b)
- Keyloud는 음성 녹음의 텍스트화 및 정리를 위한 클라우드 형태의 서비스입니다.  
- AI를 활용하여 음성 녹음을 텍스트화 하고 Keyword를 추출하여 녹음을 다시 듣지 않아도 내용을 파악할 수 있도록 도와줍니다.


## Install
git clone
```bash
git clone https://github.com/Playdata-LastProject/keyloud_assemble.git
cd keyloud_assemble
```
run mongodb
```bash
docker-compose up -d
```
run server
```bash
cd backend
npm install
node server.js
```
run client
```bash
cd frontend
npm install
npm start
```

## Service Flow
<img src="https://github.com/user-attachments/assets/6b5275f1-9ba3-4160-807f-30d8e913c631"  width="1000" height="400"/>

❌파일 업로드 기능은 현재 Google Cloud credit 이슈로 사용불가  
❌local 환경에서 실행시 Google Cloud 인증 Issue 발생할 수 있음

## Development Flow
![image](https://github.com/user-attachments/assets/935eedc1-0271-46aa-9965-99ec48d4a205)

✔️ 비동기 처리를 통한 빠른 AI API호출 및 빠른 서비스 개발을 위해 Express 채택  
✔️ front와 back의 개발 통일성을 위해 React와 Express 채택

## 📌개발 포인트
- GitHub Flow 전략
  - main: 항상 배포 가능한 상태를 유지하는 브랜치입니다.
  - feature: 새로운 기능이나 버그 수정을 위한 브랜치입니다. main에서 분기하고, 작업 완료 후 main에 Pull Request를 생성하여 병합합니다.
  - 작업 단위를 더 잘게 쪼개어, 더 자주 커밋하고 병합합니다.
  - 선택 이유
    - 브랜치 관리에 드는 시간과 노력이 절약되어, 6주간의 짧은 프로젝트에 적합하다고 판단
    - 기능 단위 PR을 통해 merge충돌을 방지하며 배포 브랜치 유지
  
- Google Cloud VertexAI
  - Keyword 추출을 위한 VertexAI API 연동
  - 음성 data -> text data 변환을 위한 speech2Text API 연동

