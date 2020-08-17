
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Show from "./show/index";
import AddBook from "./add_book/index";
import EditBook from "./edit_book/index";

const Desktop = ({ match }) => (
    <div>
        <Switch>
            <Route path={`${match.url}/show/:id`} component={Show} />
            <Route path={`${match.url}/add_book/`} component={AddBook} />
            <Route path={`${match.url}/edit/:id`} component={EditBook} />
        </Switch>
    </div>
);

export default Desktop;
