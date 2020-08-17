import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import LoginComponent from '../routes/session/Login';
import RegisterComponent from '../routes/session/Register';
import Axios from './Api';
import routerService from "./routerService";

class App extends Component {

   constructor(props) {
      super(props);
      this.token = localStorage.getItem('token');

      if (!window.location.pathname.toLowerCase().includes("session/")) {
         localStorage.setItem("lastPath", window.location.pathname);
      }
   }

   checkLogin() {
      return (!(this.token === undefined || this.token === null));
   }

   render() {
      const { location } = this.props;

      if (location.pathname === '/') {
         return (<Redirect to={'/home'} />);
      }

      if (this.checkLogin()) {
         Axios.defaults.headers = { 'Authorization': 'Bearer ' + this.token };
      }

      if (location.pathname.toLowerCase().includes('session')) {
         return (
             <div>
                <Route path="/session/login" component={LoginComponent} />
                <Route path="/session/register" component={RegisterComponent} />
             </div>
         );
      }

      return (
          <>
             {!location.pathname.includes("session/") &&
             <div>
                {routerService && routerService.map((route, key) =>
                    <Route key={key} path={`/${route.path}`} component={route.component} />
                )}
             </div>
             }
          </>
      )
   }
}

export default App;