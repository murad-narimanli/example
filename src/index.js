import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './assets/css/animate.css'
import './assets/css/custom/custom.css';
import 'antd/dist/antd.css';
import './assets/css/override.css';
import './assets/css/global/global.css';
import './assets/css/main/main.css'
import "./i18n";
import history from './const/history';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.render(<Provider store={store}><Router history={history}><App /></Router></Provider>, document.querySelector("#root"));
