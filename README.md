## Keyloud 소개
![image](https://github.com/user-attachments/assets/118cf771-40ba-4263-9c3a-306a49e16b5b)
- Keyloud는 음성 녹음의 텍스트화 및 정리를 위한 클라우드 형태의 서비스입니다.  
- AI를 활용하여 음성 녹음을 텍스트화 하고 Keyword를 추출하여 녹음을 다시 듣지 않아도 내용을 파악할 수 있도록 도와줍니다.


## Install
git clone
```bash
git clone
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

- 파일 업로드 기능은 현재 Google Cloud credit 이슈로 사용불가

## Development Flow
![image](https://github.com/user-attachments/assets/935eedc1-0271-46aa-9965-99ec48d4a205)

