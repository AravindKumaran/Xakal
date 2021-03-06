import React, { Component } from 'react';
import '../../styles/table.css';
import '../../styles/dropdown.css';
import '../../styles/course-dropdown.css';
import axios from 'axios';
import moment from 'moment';

class ClassNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            column1: '',
            column2: '',
            column3: '',
            column4: '',
            selectedSemester: '',
            selectedCourse: '',
            description: '',
            searchAllowed: false,
            uploadAllowed: false,
            courseList: [],
            notesList: [],
            background: '',
            backgroundCourse: '',
            backgroundDesc: '',
            isFocussed: '',
            isCourseFocussed: '',
            onFocus: false,
            onCourseFocus: false,
            file: null,
            isStudentPortal: false,
            isStaffPortal: false,
            userID: ''
        };
        this.courseChange = this.onCourseChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
        this.baseState = this.state;
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        this.getTitle();
    }

    componentDidMount() {
        this.getPortal();
        this.getTitle();
        debugger;
        if (this.props && this.props.location && this.props.location.userID) {
            const userID = this.props.location.userID;
            this.setState({ userID: userID.userID });
        }
        this.unlisten = this.props.history.listen((location, action) => {
            this.setState(this.baseState);
            if (this.props && this.props.location && this.props.location.userID) {
                const userID = this.props.location.userID;
                this.setState({ userID: userID.userID });
            }
            this.getPortal();
        });
    }

    getPortal() {
        const pathArray = this.props.location.pathname.split('/');
        if (pathArray.includes('students-portal')) {
            this.setState({ isStudentPortal: true, isStaffPortal: false })
        } else {
            this.setState({ isStaffPortal: true, isStudentPortal: false })
        }
    }

    getTitle() {
        if (this.props.location) {
            const pathArray = this.props.location.pathname.split('/');
            if (pathArray.includes('question-papers')) {
                this.setState({ questionPaper: true, notes: false, xakalNotes: false });
            } else if (pathArray.includes('class-notes')) {
                this.setState({ questionPaper: false, notes: true, xakalNotes: false });
            } else if (pathArray.includes('xakal-notes')) {
                this.setState({ questionPaper: false, notes: false, xakalNotes: true });
            }
        }
    }

    componentWillUnmount() {
        this.unlisten();
    }

    /**
     * Adds the hover class when description is hovered
     */
    descriptionHover(event) {
        var element = event.target.className;
        if (element === 'column100 column2 ') {
            this.setState({ column1: 'hov-column-head-ver5' })
        }
    }

    /**
     * Adds the hover class when download is hovered
     */
    downloadHover(event) {
        var element = event.target.className;
        if (element === 'column100 column3 ') {
            this.setState({ column2: 'hov-column-head-ver5' })
        }
    }

    /**
     * Adds the hover class when update date is hovered
     */
    uploadDateHover(event) {
        var element = event.target.className;
        if (element === 'column100 column4 ') {
            this.setState({ column3: 'hov-column-head-ver5' })
        }
    }

    /**
     * Adds the hover class when upload by is hovered
     */
    uploadByHover(event) {
        var element = event.target.className;
        if (element === 'column100 column5 ') {
            this.setState({ column4: 'hov-column-head-ver5' })
        }
    }

    /**
     * Resets the state variables when hover is removed
     */
    hoverOff() {
        this.setState({
            column1: '',
            column2: '',
            column3: '',
            column4: ''
        })
    }

    /**
     * Triggers the API call for course, based on the semester selected
     */
    onDropDownSelect(event) {
        this.setState({ selectedSemester: event.target.id, selectedCourse: '', onFocus: false, background: 'is-hidden' });
        var semester = event.target.id;
        axios.get(`/xakal/class-notes/course/${semester}`)
            .then((response) => {
                this.setState({ courseList: response.data });
            });
        if (this.state.searchAllowed) {
            this.setState({ searchAllowed: false })
        } else if (this.state.uploadAllowed) {
            this.setState({ uploadAllowed: false })
        }
    }

    onDropDownFocus() {
        this.setState({ isFocussed: 'is-focused', onFocus: true, onCourseFocus: false, background: 'is-shown', backgroundCourse: 'is-hidden', backgroundDesc: 'is-hidden' });
        if (this.state.selectedCourse === '') {
            this.setState({ isCourseFocussed: '' })
        }
    }

    onCourseDropDownFocus() {
        this.setState({ isCourseFocussed: 'is-focused', isFocussed: 'is-focused', onCourseFocus: true, onFocus: false, background: 'is-hidden', backgroundCourse: 'is-shown', backgroundDesc: 'is-hidden' });
    }

    onDescriptionFocus() {
        this.setState({ isCourseFocussed: 'is-focused', isFocussed: 'is-focused', isDescriptionFocussed: 'is-focused', onCourseFocus: false, onFocus: false, background: 'is-hidden', backgroundCourse: 'is-hidden', backgroundDesc: 'is-shown' });
    }

    /**
     * Updates the selected course name
     */
    onCourseChange(event) {
        this.setState({ selectedCourse: event.target.id, onCourseFocus: false, backgroundCourse: 'is-hidden', background: 'is-hidden', });
        if (this.state.searchAllowed) {
            this.setState({ searchAllowed: false })
        } else if (this.state.uploadAllowed) {
            this.setState({ uploadAllowed: false })
        }
    }

    onDescriptionChanged(event) {
        this.setState({ description: event.target.value, backgroundCourse: 'is-hidden', background: 'is-hidden' });
        if (this.state.searchAllowed) {
            this.setState({ searchAllowed: false })
        } else if (this.state.uploadAllowed) {
            this.setState({ uploadAllowed: false })
        }
    }

    /**
     * Allows the grid to display the values based on routing
     */
    getNotes() {
        if (this.state.selectedSemester !== '' && this.state.selectedCourse !== '') {
            if (this.props.location) {
                switch (this.props.location.pathname) {
                    case '/students-portal/question-papers':
                        this.fetchQuestionPapers();
                        break;
                    case '/students-portal/class-notes':
                        this.fetchClassNotes();
                        break;
                    case '/students-portal/xakal-notes':
                        this.fetchXakalNotes();
                        break;
                    default: break
                }
            }
        } else {
            alert('Please select the values');
            this.setState({ searchAllowed: false, uploadAllowed: false })
        }

    }

    /**
     * Fetches the class notes based on semester and course selected
     */
    fetchClassNotes() {
        this.setState({ searchAllowed: true });
        var semester = this.state.selectedSemester;
        var course = this.state.selectedCourse;
        axios.get(`/xakal/class-notes/classnote/${semester}/${course}`)
            .then((response) => {
                this.setState({ notesList: response.data });
            });
    }

    /**
     * Fetches the question papers based on semester and course selected
     */
    fetchQuestionPapers() {
        this.setState({ searchAllowed: true });
        var semester = this.state.selectedSemester;
        var course = this.state.selectedCourse;
        axios.get(`/xakal/class-notes/questionpaper/${semester}/${course}`)
            .then((response) => {
                this.setState({ notesList: response.data });
            });
    }

    /**
     * Fetches the xakal notes based on semester and course selected
     */
    fetchXakalNotes() {
        this.setState({ searchAllowed: true });
        var semester = this.state.selectedSemester;
        var course = this.state.selectedCourse;
        axios.get(`/xakal/class-notes/xakalnote/${semester}/${course}`)
            .then((response) => {
                this.setState({ notesList: response.data });
            });
    }

    onFileUpload(e) {
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file);
    }

    /**
     * Triggers when file is selected
     */
    onChange(e) {
        this.setState({ file: e.target.files[0], background: 'is-hidden', backgroundCourse: 'is-hidden', backgroundDesc: 'is-hidden' })
    }

    /**
     * Uploads the file to online URL
     */
    fileUpload(files) {
        const formData = new FormData();
        formData.append('semester', this.state.selectedSemester);
        formData.append('course', this.state.selectedCourse);
        formData.append('description', this.state.description);
        formData.append('uploadedBy', this.state.userID.toUpperCase());
        formData.append('uploadedFile', files);
        formData.append('uploadedDate', new Date());
        axios.post('/xakal/class-notes/upload', formData).then(() => { })
        this.currentSite(formData);
    }

    /**
     * Uploads document based on the router location
     */
    currentSite(formData) {
        if (this.props.location) {
            switch (this.props.location.pathname) {
                case '/staff-portal/question-papers':
                case '/hod-portal/question-papers':
                    this.uploadQuestionPapers(formData);
                    break;
                case '/staff-portal/class-notes':
                case '/hod-portal/class-notes':
                    this.uploadClassNotes(formData);
                    break;
                default: break
            }
        }
    }

    /**
     * Uploads the file URL to DB
     */
    uploadQuestionPapers(formData) {
        formData.append('type', 'questionPaper');
        axios.post('/xakal/class-notes/questionpaper', formData)
            .then(() => {
                alert('File uploaded successfully');
                this.setState(this.baseState);
            });
    }

    /**
     * Uploads the class file URL to DB
     */
    uploadClassNotes(formData) {
        formData.append('type', 'classNote');
        axios.post('/xakal/class-notes/classnote', formData)
            .then(() => {
                alert('File uploaded successfully');
                this.setState(this.baseState);
            });
    }

    /**
     * Displays the list of notes based on the API response
     */
    displayTable() {
        const type = this.props.location.pathname === "/students-portal/question-papers" ? "questionPaper" : "classNote";
        return this.state.notesList.map((singleData, index) => {
            var hrefValue = '/' + type + '/' + singleData.semester + '/' + singleData.course + '/' + singleData.uploadedFile;
            return (
                <tr className="row100">
                    <td className="column100 column1" data-column="column1">{++index}</td>
                    <td className={"column100 column2 "} onMouseEnter={this.descriptionHover.bind(this)} onMouseLeave={this.hoverOff.bind(this)}>{singleData.description}</td>
                    <td className={"column100 column3 "} onMouseEnter={this.uploadDateHover.bind(this)} onMouseLeave={this.hoverOff.bind(this)}>{moment(new Date(singleData.uploadedDate)).format('DD/MM/YYYY')}</td>
                    <td className={"column100 column4 "} onMouseEnter={this.uploadByHover.bind(this)} onMouseLeave={this.hoverOff.bind(this)}>{singleData.uploadedBy}</td>
                    <td className={"column100 column5 "} onMouseEnter={this.downloadHover.bind(this)} onMouseLeave={this.hoverOff.bind(this)}><a target="_blank" rel="noopener noreferrer" href={hrefValue}>Download File</a></td>
                </tr>
            )
        })
    }

    /**
     * Displays the list of courses based on the API response
     */
    displayCourse() {
        if (this.state && this.state.courseList && this.state.courseList.length) {
            return this.state.courseList.map((singleCourse, index) => {
                return (<li className="mdl-menu__item animation" key={index}><button id={singleCourse.course} onClick={this.courseChange}>{singleCourse.course}</button></li>)
            });
        }
    }

    render() {
        return (
            <div>
                {this.state.notes ?
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800 m-t-20 m-l-20">Notes</h1>
                    </div> : <></>}
                {this.state.questionPaper ?
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800 m-t-20 m-l-20">Question Paper</h1>
                    </div> : <></>}
                {this.state.xakalNotes ?
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800 m-t-20 m-l-20">Xakal Notes</h1>
                    </div> : <></>}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card-box">
                            <div className="card-body row">
                                <div className="col-lg-2 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width " + this.state.isFocussed}>
                                        <input onKeyPress={(e) => e.preventDefault()} autoComplete="off" onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="text" id="Semester"
                                            value={this.state.selectedSemester} />
                                        <label className={"mdl-textfield__label " + this.state.background}>Semester</label>
                                        {this.state.onFocus ? <div className="mdl-menu__container is-upgraded dropdown-list is-visible">
                                            <div className="mdl-menu__outline mdl-menu--bottom-left dropdown-div">
                                                <ul className="scrollable-menu mdl-menu mdl-menu--bottom-left mdl-js-menu ul-list">
                                                    <li className="mdl-menu__item animation" id="Semester 1" onClick={this.onDropDownSelect.bind(this)} >Semester 1</li>
                                                    <li className="mdl-menu__item animation1" id="Semester 2" onClick={this.onDropDownSelect.bind(this)} >Semester 2</li>
                                                    <li className="mdl-menu__item animation2" id="Semester 3" onClick={this.onDropDownSelect.bind(this)} >Semester 3</li>
                                                    <li className="mdl-menu__item animation" id="Semester 4" onClick={this.onDropDownSelect.bind(this)} >Semester 4</li>
                                                    <li className="mdl-menu__item animation1" id="Semester 5" onClick={this.onDropDownSelect.bind(this)} >Semester 5</li>
                                                    <li className="mdl-menu__item animation2" id="Semester 6" onClick={this.onDropDownSelect.bind(this)} >Semester 6</li>
                                                    <li className="mdl-menu__item animation" id="Semester 7" onClick={this.onDropDownSelect.bind(this)} >Semester 7</li>
                                                    <li className="mdl-menu__item animation1" id="Semester 8" onClick={this.onDropDownSelect.bind(this)} >Semester 8</li>
                                                </ul>
                                            </div>
                                        </div> : <p></p>}
                                    </div>
                                </div>
                                <div className="col-lg-2 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width " + this.state.isCourseFocussed}>
                                        <input onKeyPress={(e) => e.preventDefault()} autoComplete="off" onFocus={this.onCourseDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="text" id="sample2"
                                            value={this.state.selectedCourse} />
                                        <label className={"mdl-textfield__label " + this.state.backgroundCourse}>Course</label>
                                        {this.state.onCourseFocus ? <div className="mdl-menu__container is-upgraded dropdown-list is-visible">
                                            <div className="mdl-menu__outline mdl-menu--bottom-left dropdown-div">
                                                <ul className="scrollable-menu mdl-menu mdl-menu--bottom-left mdl-js-menu ul-list">
                                                    {this.displayCourse()}
                                                </ul>
                                            </div>
                                        </div> : <p></p>}
                                    </div>
                                </div>
                                {this.state.isStudentPortal ? <div className="col-sm-4 p-t-20">
                                    <button type="button" onClick={this.getNotes.bind(this)} className="btn btn-primary m-t-15 m-l-30">Get Results!</button>
                                </div> :
                                    <div className="col-sm-8 p-t-20">
                                        <div className="row">
                                            <div
                                                className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + this.state.isDescriptionFocussed}>
                                                <input autoComplete="off" onFocus={this.onDescriptionFocus.bind(this)} value={this.state.description} className="mdl-textfield__input display-border" type="text" id="description" onChange={this.onDescriptionChanged.bind(this)}
                                                />
                                                <label className={"mdl-textfield__label " + this.state.backgroundDesc}>Description</label>
                                            </div>
                                            <input type="file" className="col-sm-4 m-t-15 m-l-30" onChange={this.onChange} />
                                            <button type="button" onClick={this.onFileUpload} className=" col-sm-2 btn btn-primary m-t-15 m-l-30">Upload</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.searchAllowed ? <div className="limiter">
                    <div className="container-table100">
                        <div className="wrap-table100">
                            <div className="table100 ver5 m-b-110 table table-responsive">
                                <table>
                                    <thead>
                                        <tr className="row100 head">
                                            <th className="column100 column1" data-column="column1"></th>
                                            <th className={"column100 column2 " + this.state.column1} onMouseEnter={this.descriptionHover.bind(this)} onMouseLeave={this.hoverOff.bind(this)}>Description</th>
                                            <th className={"column100 column3 " + this.state.column2} onMouseEnter={this.uploadDateHover.bind(this)} onMouseLeave={this.hoverOff.bind(this)}>Uploaded Date</th>
                                            <th className={"column100 column4 " + this.state.column3} onMouseEnter={this.uploadByHover.bind(this)} onMouseLeave={this.hoverOff.bind(this)}>Uploaded By</th>
                                            <th className={"column100 column5 " + this.state.column4} onMouseEnter={this.downloadHover.bind(this)} onMouseLeave={this.hoverOff.bind(this)}>Download</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.displayTable()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div> : <span></span>}
            </div>
        )
    }
}

export default ClassNotes;