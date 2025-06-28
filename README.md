# 멘토-멘티 매칭 앱 실행 방법

이 프로젝트는 **백엔드(Express/Sequelize)**와 **프론트엔드(React)**가 분리된 풀스택 구조입니다.

---

## 1. 백엔드(Express) 실행 방법

```bash
cd backend
npm install           # 의존성 설치

# .env 파일(옵션, JWT_SECRET 등) 필요시 생성
# 예시: JWT_SECRET=your_secret_key

# 백그라운드 실행 예시 (macOS/Linux)
npm start &           # 또는 개발 모드: npm run dev &
```

- Swagger(OpenAPI) 문서: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- DB: SQLite(`database.sqlite`)

---

## 2. 프론트엔드(React) 실행 방법

```bash
cd frontend
npm install           # 의존성 설치
npm start &           # 개발 서버를 백그라운드로 실행 (기본: http://localhost:3000)
```

- API 서버 주소는 `src/components/*`에서 `http://localhost:8080/api`로 설정되어 있습니다.
- 필요시 환경변수(`.env`)로 API 주소를 변경할 수 있습니다.

---

## 3. 기타

- 회원가입/로그인 후 JWT 토큰이 localStorage에 저장되어 API 인증에 사용됩니다.
- Swagger UI에서 API 테스트 가능
- 테스트 실행: `cd backend && npm test`

---

## 4. 요구사항/기능

- 회원가입/로그인, 프로필, 멘토/멘티 매칭, JWT 인증, Swagger 문서화, 보안, 테스트 등
- 상세 요구사항은 `rules/mentor-mentee-app-requirements.md` 참고

---

문의/기여 환영합니다!
# copilotProject
