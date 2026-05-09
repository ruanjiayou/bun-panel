import { configure } from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DrawerMenu from './components/DrawerMenu'
// import reportWebVitals from './reportWebVitals';
configure({
  enforceActions: 'never',
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DrawerMenu isMain={true}/>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
