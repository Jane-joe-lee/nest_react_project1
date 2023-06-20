# nest_react_project1
* nest.js, react로 만든 연습용 프로젝트

* 게시판 기능 추가 예정

---

### 환경
* nest.js ( port : 5001 )
* react ( port : 3000, directory: client1 )
* Database : PostgreSQL
* API : axios
* image : proxy ( http://localhost:5001/media/.../a.png -> http://localhost:3000/media/.../a.png )
* 기타 : redux

---
### 실행
* $ npm run start:dev
* client1 $ npm run start

---

### 기본 설명
* 로그인 : JWT -> cookie
* 로그아웃
* 마이페이지(프로필 이미지 업로드/수정, 비밀번호 변경)
* 게시판 기능(예정)

---
### 환경설정
* 아래 4개의 파일 생성

1) .env
```

PORT = 5001
CORS_ORIGIN = 'http://localhost:3000'

JWT_SECRET = 'secret key'
JWT_EXPIRES = expires(only number)

SWAGGER_USER = 'swagger id'
SWAGGER_PASSWORD = 'swagger pw'

DB_TYPE = 'postgres';
DB_HOST = 'DB HOST';
DB_PORT = 5432
DB_USERNAME = 'username'
DB_PASSWORD = 'password'
DB_NAME = 'DB name'
DB_SYNCHRONIZE = true
```

2) config/default.yml
```
server:
  port: 5001

db:
  type: 'postgres'
  port: 5432
  database: 'DB name'

jwt:
  expiresIn: expires(only number)
```

3) config/development.yml
```
db:
  host: 'DB HOST'
  username: 'username'
  password: 'password'
  synchronize: true

jwt:
  secret: 'secret key'
```

4) config/production.yml
```
db:
  synchronize: false
```  

  