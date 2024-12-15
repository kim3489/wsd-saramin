# wsd-saramin
express.js와 사람인 api를 활용한 백엔드 서버입니다.

## 설치
1.  npm,express 설치
    ```bash
    
     npm install
     npm install express 
     ```
2.  mongoDB 설치
     ```bash
      npm install mongodb mongoose
     ```
3. 환경변수 설정
 다음 내용을 포함하는 env 파일을 생성
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017
   JWT_SECRET=your_jwt_secret
   ```
4. 서버 실행
   ```bash
   node app.js
   ```
   
### 엔드 포인트 설명
- 회원가입 (POST, auth/register)

- 로그인 (POST, auth/login)

- 회원 정보 조회 (GET, auth/profile)

- 회원 정보 수정 (POST, auth/profile)
 
- 회원 탈퇴 (DELETE, auth/profile)

- 토큰 갱신 (POST, auth/refresh)
-------------------------------------------------------------
- 채용 공고 목록 조회 (GET,/jobs)

- 채용 공고 등록 (POST, /jobs)

- 채용 공고 수정 (PUT, jobs/{id})

- 채용 공고 삭제 (DELETE, jobs/{id})
-------------------------------------------------------------

#### 프로젝트  구조 설명
```
wsd-saramin
├── src/
│   ├── controllers/
│   │   ├── authController.js         # 계정 관리
│   │   └── jobController.js          # 채용 공고 관리
│   ├── middlewares/
│   │   ├── authMiddleware.js         # 권한 인증
│   │   ├── errorMiddleware.js        # 글로벌 에러 핸들링
│   ├── models/
│   │   ├── Company.js                # 회사 스키마
│   │   ├── Jobs.js                   # 채용 스키마
│   │   └── User.js                   # 계정 스키마  
│   ├── crawling/
│   │   ├── Company.py               # 회사 크롤링
│   │   ├── Jobs.py                  # 채용 크롤링
│   │   ├── Company.csv              
│   │   ├── Jobs.csv                  
│   │   ├── JobEdit.csv
│   │   └── edit.py                  # 중복 방지
│   ├── routes/  
│   │   ├── authRoutes.js             # 계정 라우트
│   │   └── jobRoutes.js              # 채용 라우트
│   ├── config/  
│   │   ├── mongodb.js                # mongodb 세팅
│   │   └── swagger.js                # swagger 세팅
├── .env                              # 환경 변수
├── .gitignore
├── app.js                            # 앱 설정                    
├── package.json
├── package-lock.json
└── README.md
```

##### 크롤링 방법
1.  라이브러리 설치
    ```bash
    pip install requests beautifulsoup4 pandas
     ```
2. 디렉토리로 이동 
    ```bash
   cd /wsd-saramin/src/crawling
     ```
2. 파일 실행
    ```bash
   python job.py
   python company.py
   python edit.py
     ```