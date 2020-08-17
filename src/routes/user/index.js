
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Profile from "./profile/index";
import Edit from "./edit/index";
import Timeline from "./timeline/index";
import Shelves from "./shelves/index";

const Desktop = ({ match }) => (
    <div c>
        <Switch>
            <Route path={`${match.url}/profile/:id`} component={Profile} />
            <Route path={`${match.url}/edit/`} component={Edit} />
            <Route path={`${match.url}/timeline/`} component={Timeline} />
            <Route path={`${match.url}/shelves/:id`} component={Shelves} />
        </Switch>
    </div>
);

export default Desktop;
