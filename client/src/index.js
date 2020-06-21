import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import StudentsPortal from './components/students-portal';
import * as serviceWorker from './serviceWorker';
import StaffPortal from './components/staff-portal';
import ManagementPortal from './components/management-portal';
import HODPortal from './components/hod-portal';
const routing = (
    <Router>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/students-portal" component={StudentsPortal} />
            <Route path="/staff-portal" component={StaffPortal} />
            <Route path="/management-portal" component={ManagementPortal} />
            <Route path="/hod-portal" component={HODPortal} />
            {/* <Route path="/students-portal/class-notes" component={ClassNotes} /> */}
        </div>
    </Router>
)
ReactDOM.render(routing, document.getElementById('root'))


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
