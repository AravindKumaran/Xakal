import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../../src/minified-css/navbar.min.css'
import classNotes from './students-portal/class-notes';
import Dashboard from './students-portal/dashboard';
import '../styles/navbar.css'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import SemesterDetails from './students-portal/assessments/semester-details';
import InternalDetails from './students-portal/assessments/internal-details';
import Attendance from './students-portal/attendance';
import Payment from './students-portal/payment';
import ViewSemesterDetails from './staff-portal/assessments/view-semester-details';
import SalaryDetails from './staff-portal/salary-details';
import StaffAttendance from './staff-portal/attendance';
import StaffDashboard from './staff-portal/dashboard';
import StudentDetailsMaintain from './staff-portal/student-details-maintain';
import Login from './login';
import EditInternalDetails from './staff-portal/assessments/edit-internal-details';
import Forum from './forum';
import ManagementDashboard from './management-portal/dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faLayerGroup, faBookReader, faGraduationCap, faLaptopCode, faHourglassHalf, faGem, faUsers } from '@fortawesome/free-solid-svg-icons'
import logo from '../images/xakal-logo.png';
import NonTeachingDashboard from './non-teaching-portal/dashboard';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showClassNotes: false,
            assessments: false,
            routerLink: ''
        }
        this.baseState = this.state;
    }

    logout() {
        localStorage.clear();
        window.location.href = '/';
    }

    componentDidMount() {
        if (!this.props.userID) {
            alert('Please login again! Session expired!')
            this.logout()
        } else {
            if (this.props && this.props.state && this.props.state.location && this.props.state.location.state) {
                if (this.props.state.location.state.userRole === 'student') {
                    this.setState({ routerLink: '/students-portal' });
                } else if (this.props.state.location.state.userRole === 'staff') {
                    this.setState({ routerLink: '/staff-portal' });
                }
                else if (this.props.state.location.state.userRole === 'non-teaching') {
                    this.setState({ routerLink: '/non-teaching-portal' });
                }
            }
        }
    }

    componentWillUnmount() {
        // this.unlisten();
    }

    /**
     * Handles the sub menu of college notes
     */
    onClassNotesClick() {
        this.setState({ assessments: false })
        if (this.state.showClassNotes) {
            this.setState({ showClassNotes: false })
        } else {
            this.setState({ showClassNotes: true })
        }
    }

    /**
     * Handles the sub menu of assessments
     */
    onAssessmentsClick() {
        this.setState({ showClassNotes: false })
        if (this.state.assessments) {
            this.setState({ assessments: false })
        } else {
            this.setState({ assessments: true })
        }
    }

    render() {
        return (
            <Router>
                <div id="wrapper">
                    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                        <button className="sidebar-brand d-flex align-items-center justify-content-center">
                            <div className="logo-container">
                                <img src={logo} className="logo" alt="XAKAL" />
                            </div>
                            <div className="sidebar-brand-text mx-3 logo-color">Xakal</div>
                        </button>
                        <hr className="sidebar-divider my-0" />
                        <li className="nav-item">
                            <Link to={{ pathname: `${this.state.routerLink}/dashboard`, state: this.props.userID, userID: this.props.userID }} className="nav-link">
                                <FontAwesomeIcon className="fa-sm" icon={faAddressBook} />
                                <i className="fas fa-fw fa-tachometer-alt"></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        {this.state.routerLink === '/students-portal' || this.state.routerLink === '/staff-portal' ? <li className="nav-item">
                            <Link to={{ pathname: `${this.state.routerLink}/whiteboard`, state: this.props.userID }} className="nav-link">
                                <FontAwesomeIcon className="fa-sm" icon={faLayerGroup} />
                                <i className="fas fa-fw fa-tachometer-alt"></i>
                                <span>White Board</span>
                            </Link>
                        </li> : <span></span>}
                        {this.state.routerLink === '/staff-portal' ?
                            <li className="nav-item">
                                <Link to={{ pathname: `${this.state.routerLink}/view-student-details`, userID: this.props.userID }} className="nav-link">
                                    <FontAwesomeIcon className="fa-sm" icon={faUsers} />
                                    <i className="fas fa-fw fa-tachometer-alt"></i>
                                    <span>Student Details</span>
                                </Link>
                            </li> : <span></span>}
                        <hr className="sidebar-divider" />
                        {this.state.routerLink === '/students-portal' || this.state.routerLink === '/staff-portal' ? <>
                            <li className="nav-item">
                                <button className="nav-link" onClick={this.onClassNotesClick.bind(this)}>
                                    <FontAwesomeIcon className="fa-sm" icon={faBookReader} />
                                    <i className="fas fa-fw fa-tachometer-alt"></i>
                                    <span>College Notes</span>
                                    {this.state.showClassNotes ? <i className="fa fa-angle-down fa-lg notes-margin" aria-hidden="true"></i> :
                                        <i className="fa fa-angle-right fa-lg notes-margin " aria-hidden="true"></i>}
                                </button>
                            </li>
                            {this.state.showClassNotes ? <div>
                                <li className="nav-item">
                                    <Link to={{ pathname: `${this.state.routerLink}/class-notes`, userID: this.props.userID }} className="nav-link collapsed">
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <span>Class Notes</span>
                                    </Link>
                                </li>
                                {this.state.routerLink === '/students-portal' ? <li className="nav-item">
                                    <Link to={{ pathname: `${this.state.routerLink}/xakal-notes`, userID: this.props.userID }} className="nav-link collapsed">
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <span>Xakal Notes</span>
                                    </Link>
                                </li> : <p></p>}
                                <li className="nav-item">
                                    <Link to={{ pathname: `${this.state.routerLink}/question-papers`, userID: this.props.userID }} className="nav-link collapsed">
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <span>Question Papers</span>
                                    </Link>
                                </li>
                            </div> : <div></div>}
                            <li className="nav-item">
                                <button className="nav-link collapsed" onClick={this.onAssessmentsClick.bind(this)}>
                                    <FontAwesomeIcon className="fa-sm" icon={faLaptopCode} />
                                    <i className="fas fa-fw fa-tachometer-alt"></i>
                                    <span>Assessments</span>
                                    {this.state.assessments ? <i className="fa fa-angle-down fa-lg assessment-margin" aria-hidden="true"></i> :
                                        <i className="fa fa-angle-right fa-lg assessment-margin" aria-hidden="true"></i>}
                                </button>
                            </li>
                            {this.state.assessments ? <div>
                                <li className="nav-item">
                                    <Link to={{ pathname: `${this.state.routerLink}/internal-details`, userID: this.props.userID }} className="nav-link collapsed">
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <span>Internals</span>
                                    </Link>
                                </li>
                                {this.state.routerLink === '/students-portal' ? <li className="nav-item">
                                    <Link to={{ pathname: `${this.state.routerLink}/semester-details`, userID: this.props.userID }} className="nav-link collapsed">
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <span>Semester</span>
                                    </Link>
                                </li> :
                                    <li className="nav-item">
                                        <Link to={{ pathname: `${this.state.routerLink}/semester-details`, userID: this.props.userID }} className="nav-link collapsed">
                                            <i className="fas fa-fw fa-tachometer-alt"></i>
                                            <i className="fas fa-fw fa-tachometer-alt"></i>
                                            <span>Semester</span>
                                        </Link>
                                    </li>}
                            </div> : <div></div>}
                            <hr className="sidebar-divider d-none d-md-block" />
                            {this.state.routerLink === '/students-portal' ?
                                <li className="nav-item">
                                    <Link to={{ pathname: `${this.state.routerLink}/attendance`, userID: this.props.userID }} className="nav-link">
                                        <FontAwesomeIcon className="fa-sm" icon={faHourglassHalf} />
                                        <i className="fas fa-fw fa-tachometer-alt"></i>
                                        <span>Attendance</span>
                                    </Link>
                                </li> : <></>}</> : <></>}
                        {/* <li className="nav-item">
                            <Link to={{ pathname: `${this.state.routerLink}/attendance-maintain`, userID: this.props.userID }} className="nav-link">
                                <FontAwesomeIcon className="fa-sm" icon={faHourglassHalf} />
                                <i className="fas fa-fw fa-tachometer-alt"></i>
                                <span>Apply Leave</span>
                            </Link>
                        </li> */}
                        {this.state.routerLink === '/students-portal' ? <li className="nav-item">
                            <Link to={{ pathname: `${this.state.routerLink}/payment`, userID: this.props.userID }} className="nav-link">
                                <FontAwesomeIcon className="fa-sm" icon={faGem} />
                                <i className="fas fa-fw fa-tachometer-alt"></i>
                                <span>Payment</span>
                            </Link>
                        </li> : <li className="nav-item">
                                <Link to={{ pathname: `${this.state.routerLink}/salary`, userID: this.props.userID }} className="nav-link">
                                    <FontAwesomeIcon className="fa-sm" icon={faGem} />
                                    <i className="fas fa-fw fa-tachometer-alt"></i>
                                    <span>Salary</span>
                                </Link>
                            </li>}
                        {this.state.routerLink === '/students-portal' ? <li className="nav-item">
                            <Link className="nav-link">
                                <FontAwesomeIcon className="fa-sm" icon={faGraduationCap} />
                                <i className="fas fa-fw fa-tachometer-alt"></i>
                                <span>Placement</span>
                            </Link>
                        </li> : <p></p>}
                    </ul>
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <button className="btn btn-sm btn-primary shadow-sm logout m-t-20 m-r-20" onClick={this.logout.bind(this)}> <i className="fa fa-power-off m-r-15"></i>Logout</button>
                            {this.props && this.props.userID && this.props.userID.userDetails ?
                                <><p className="logout m-t-30 m-r-40">{this.props.userID.userDetails.userRole.charAt(0).toUpperCase() + this.props.userID.userDetails.userRole.slice(1)} Dashboard</p>
                                    <p className="logout m-t-30 m-r-40">{this.props.userID.userDetails.userID}</p>
                                </> : <></>}<Switch>
                                {/* student portal links */}
                                <Route path="/students-portal/class-notes" component={classNotes} />
                                <Route path="/students-portal/xakal-notes" component={classNotes} />
                                <Route path="/students-portal/question-papers" component={classNotes} />
                                <Route path="/students-portal/dashboard" component={Dashboard} />
                                <Route path="/students-portal/semester-details" component={SemesterDetails} />
                                <Route path="/students-portal/internal-details" component={InternalDetails} />
                                <Route path="/students-portal/attendance" component={Attendance} />
                                <Route path="/students-portal/payment" component={Payment} />
                                <Route path="/students-portal/whiteboard" component={Forum} />
                                <Route path="/students-portal/student-profile" component={Dashboard} />
                                <Route path="/students-portal/staff-profile" component={StaffDashboard} />
                                <Route path="/students-portal/manangement-profile" component={ManagementDashboard} />
                                <Route path="/students-portal/hod-profile" component={StaffDashboard} />

                                {/* staff portal links */}
                                <Route path="/staff-portal/class-notes" component={classNotes} />
                                <Route path="/staff-portal/question-papers" component={classNotes} />
                                <Route path="/staff-portal/dashboard" component={StaffDashboard} />
                                <Route path="/staff-portal/semester-details" component={ViewSemesterDetails} />
                                <Route path="/staff-portal/internal-details" component={EditInternalDetails} />
                                <Route path="/staff-portal/attendance" component={StaffAttendance} />
                                <Route path="/staff-portal/salary" component={SalaryDetails} />
                                <Route path="/staff-portal/view-student-details" component={StudentDetailsMaintain} />
                                <Route path="/staff-portal/whiteboard" component={Forum} />
                                <Route path="/staff-portal/student-profile" component={Dashboard} />
                                <Route path="/staff-portal/staff-profile" component={StaffDashboard} />
                                <Route path="/staff-portal/manangement-profile" component={ManagementDashboard} />
                                <Route path="/staff-portal/hod-profile" component={StaffDashboard} />
                                <Route exact path="/" component={Login} />

                                {/* non-teaching staff portal links */}
                                <Route path="/non-teaching-portal/dashboard" component={NonTeachingDashboard} />
                                <Route path="/non-teaching-portal/salary" component={SalaryDetails} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </Router>
        )
    }
}

export default NavBar;