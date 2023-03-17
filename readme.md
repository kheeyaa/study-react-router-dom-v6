## React Router Dom V6

[튜토리얼](https://reactrouter.com/en/main/start/tutorial)

### 어떻게 사용할까

- `loader`, `action` 등 페이지별 api 요청을 관리할 수 있는 기능들이 있지만, `TanStack Query` 를 사용하면 굳이? 라는 생각이 든다.
- `React.Suspense` 라는 좋은 로딩전 UI를 사용하는게 좋겠다.
- 동적 URL이나 네비게이션 등의 기능은 최대한 사용하면 좋을듯.
- 검색 기능은 그래도 확실히 좋은거같다. 복잡한 UX 기능들이 자동으로 해결된다. [Root 내부의 검색 input](src/routes/root.tsx)
- loader나 action을 사용하지 않으면 아래 처럼 에러 페이지로 리다이렉트를 직접 해줘야함, 그러면 네비게이션바가 없는 에러 페이지로 이동하니까 에러 핸들링을 상세하게 할 수 없음
  - 만약 에러 핸들링을 세세하게 해줘야한다면 리액트 라우터를 사용하는게 좋을듯하다.

> 리액트 라우터랑 탠스택 쿼리를 같이 사용하는 예제: https://tkdodo.eu/blog/react-query-meets-react-router
> 리액트 라우터는 캐싱 없이 너무 많이 fetching을 하기때문에 퍼포먼스가 좋지 않다.
