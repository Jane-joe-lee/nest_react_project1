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
const createStoreWithMiddleware = applyMiddleware(PromiseMiddleware, ReduxThunk)(createStore);
import Reducer from './_reducers';

const root = ReactDOM.createRoot(document.getElementById('root'));
// window.__REDUX_DEVTOOLS_EXTENSION : 크롬 브라우저 redux devtools 사용 위해
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
