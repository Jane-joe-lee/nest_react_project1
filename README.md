# nest_react_project1
* nest.js, react로 만든 연습용 프로젝트

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
#### user
* 로그인 : JWT -> cookie
* 로그아웃
* 마이페이지(프로필 이미지 업로드/수정, 비밀번호 변경)
* 게시판 기능(예정)

#### boards
* 게시판, 게시물
* 첨부파일 업로드, 다운로드, 미리보기(이미지)
* 검색(제목, 작성자)
* 댓글 기능은 추가하지 않음

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

---
### 변경될 경우 수정해야 할 파일
1) 게시판 유형 추가시 : boards.type ( notice, free )
   1) src/boards/pipes/board-type-validation.pipe.ts
   2) src/boards/boards.default_type.ts
   3) client1/src/common/vars/vars.js : BoardsTypeOptions, BoardsTypeDefault
2) 게시판 검색 조건 추가시 ( title, username )
   1) src/boards/board.repository.ts
   2) client1/src/common/vars/vars.js : BoardsSearchType, BoardsSearchDefault
3) 게시판 공개여부
   1) client1/src/common/vars/vars.js : BoardsStatus, BoardsStatusDefault
   2) src/boards/boards.default_type.ts
   3) src/boards/pipes/board-status-validation.pipe.ts

---
### 할것들
- _actions : async-await에서 then 불필요
- redux, dispatch check
  ( redux를 통해 (api, axios) 로그인하면 그 떄의 정보가 redux에 남아있어 useSelect 통해 재사용 가능 )
```
 import { useSelector } from 'react-redux';
 ...
 const user = useSelector(state => state.user);
```
- 댓글 기능
- JWT 만료시 처리, 만료시간 체크