import React from "react";
import ReactDOM from "react-dom";
import './assets/scss/App.scss';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 

const rootEl = document.getElementById("root");

let render = () => {
  const MainApp = require('./App').default;

  ReactDOM.render(
    <MainApp />,
    rootEl
  );
};

render();