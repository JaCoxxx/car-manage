import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducer/reducer'
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';



import 'antd/dist/antd.less';
import './style/lib/animate.css';
import './style/antd/index.less';
import './style/index.less';

import * as serviceWorker from './serviceWorker';


moment.locale('zh-cn');


const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
        <Provider store={store}>
            <App />
        </Provider>
    </LocaleProvider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
