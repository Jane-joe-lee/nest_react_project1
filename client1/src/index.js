import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// redux
import { Provider } from 'react-redux'; // App과 redux 연결
import { applyMiddleware, createStore } from "redux";
import PromiseMiddleware from 'redux-promise'; // promise
import ReduxThunk from 'redux-thunk'; // thunk
import Reducer from './_reducers';

const createStoreWithMiddleware = applyMiddleware(PromiseMiddleware, ReduxThunk)(createStore);

const root = ReactDOM.createRoot(document.getElementById('root'));
// window.__REDUX_DEVTOOLS_EXTENSION : 크롬 브라우저 redux devtools 사용 위해
// React.StrictMode 사용하면 개발모드에서 두번씩 렌더링된다고 함 => useEffect console.log 두번 찍히는 것도 이 때문에...
/*
root.render(
    <React.StrictMode>
        <Provider store={createStoreWithMiddleware(Reducer,
            window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
            )}>
            <App />
        </Provider>
    </React.StrictMode>
);
*/

root.render(
    <Provider store={createStoreWithMiddleware(Reducer)}>
        <App />
    </Provider>
);

/*
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
