import React, { Component } from 'react';
import axios from 'axios';
class AddPaperDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userID: '',
            departmentDetails: [],
            courseDetails: [],
            hasDepartmentValue: false,
            courseCode: [],
            values: [{ paperName: '', courseCode: '', courseCredits: '', selectedDepartment: '', selectedSemester: '', isElective: false }]
        };
        this.baseState = this.state;

    }

    componentDidMount() {
        if (this.props && this.props.location && this.props.location.userID) {
            this.setState({ routerLink: this.props.location.pathname, userID: this.props.location.userID.userID })
        }
        this.fetchDepartmentDetails();
        this.fetchCourseDetails();
    }

    /**
     * Fetches course detials to check on course code
     */
    fetchCourseDetails() {
        const courseCode = [];
        axios.get(`/xakal/coursedetail`)
            .then((response) => {
                if (response.data) {
                    response.data.forEach(element => {
                        courseCode.push(element.courseCode.toUpperCase());
                    });
                }
                this.setState({ courseCode: courseCode });
            });
    }

    /**
     * Fetches all department
     */
    fetchDepartmentDetails() {
        axios.get(`/xakal/departmentdetail`)
            .then((response) => {
                this.setState({ departmentDetails: response.data });
            });
    }

    /**
     * Displays the list of department based on the API response
     */
    displayDepartment(i) {
        if (this.state && this.state.departmentDetails && this.state.departmentDetails.length) {
            return this.state.departmentDetails.map((singleDepartment, index) => {
                return (<li className="mdl-menu__item animation" key={index}><button id={singleDepartment.name} name={singleDepartment.name} onClick={this.handleDepartmentChange.bind(this, i)}>{singleDepartment.name}</button></li>)
            });
        }
    }

    /**
     * Triggers when department dropdown is focused
     */
    onDeptDropDownFocus(i) {
        this.setState({ isDepartmentFocussed: 'is-focused', selectedDepartmentIndex: i, onDepartmentFocus: true, backgroundDepartment: 'is-shown' });
        this.handleSemesterFocus()
    }

    /**
     * Triggers when semester dropdown is focused
     */
    onSemesterDropDownFocus(i) {
        this.setState({ isFocussed: 'is-focused', selectedIndex: i, onFocus: true, background: 'is-shown' });
        this.handleDepartmentFocus()

    }

    /**
     * Resets the department focus based on the value selected
     */
    handleDepartmentFocus() {
        if (this.state.hasDepartmentValue === true) {
            this.setState({ isDepartmentFocussed: 'is-focused', onDepartmentFocus: false, backgroundDepartment: 'is-hidden' });
        } else {
            this.setState({ onDepartmentFocus: false, backgroundDepartment: 'is-hidden' });
        }
    }

    /**
     * Resets the semester focus based on the value selected
     */
    handleSemesterFocus() {
        if (this.state.hasValue === true) {
            this.setState({ isFocussed: 'is-focused', onFocus: false, background: 'is-hidden' });
        } else {
            this.setState({ onFocus: false, background: 'is-hidden' });
        }
    }

    /**
     * Triggers when name dropdown is focused
     */
    onDropDownFocus(event) {
        if (event.target) {
            event.target.parentNode.classList.add('is-focused');
            event.target.nextSibling.classList.add('is-shown');
        }
        this.handleSemesterFocus();
        this.handleDepartmentFocus();
    }

    /**
     * Triggers when dropdown is focused out
     */
    onFocusOut(event) {
        if (event.target) {
            if (event.target.value === '') {
                event.target.parentNode.classList.remove('is-focused');
            }
            event.target.nextSibling.classList.remove('is-shown');
        }
    }

    /**
     * Triggers when the form is changed and stores the values in state
     * @param event form values 
     */
    handleFormChange(i, event) {
        if (event && event.target) {
            let values = [...this.state.values];
            const { name, value } = event.target;
            if (event.target.value !== '') {
                if (name === 'courseCode') {
                    if (this.state.courseCode.includes(value.toUpperCase())) {
                        event.target.value = '';
                        values[i][name] = '';
                        this.setState({ values });
                        alert('Course code already exists')
                    } else {
                        values[i][name] = value;
                        this.setState({ values });
                    }
                } else {
                    console.log(value)
                    values[i][name] = value;
                    this.setState({ values });
                }

            } else {
                let values = [...this.state.values];
                const { name } = event.target;
                values[i][name] = '';
                this.setState({ values });
            }
        }
    }

    /**
     * Adds the empty form element
     */
    addClick() {
        this.setState(prevState => ({ values: [...prevState.values, { paperName: '', courseCode: '', courseCredits: '', selectedDepartment: '', selectedSemester: '', isElective: false }] }))
    }

    /**
     * Removes the selected row
     * @param i selected row index
     */
    removeClick(i) {
        let values = [...this.state.values];
        values.splice(i, 1);
        this.setState({ values });
    }

    /**
     * Triggers when the department is changed and stores the values in state
     * @param event form values 
     */
    handleDepartmentChange(i, event) {
        this.setState({ selectedDepartment: event.target.id, onDepartmentFocus: false, backgroundDepartment: 'is-hidden', background: 'is-hidden', hasDepartmentValue: true });
        let values = [...this.state.values];
        values[i]['selectedDepartment'] = event.target.name;
        this.setState({ values });
    }

    /**
     * Triggers when the semester is changed and stores the values in state
     * @param event form values 
     */
    handleSemesterChange(i, event) {
        this.setState({ selectedSemester: event.target.id, onFocus: false, background: 'is-hidden', hasValue: true });
        let values = [...this.state.values];
        values[i]['selectedSemester'] = event.target.id;
        this.setState({ values });
    }

    /**
     * Triggers when the form is submitted
     * Checks whether the values are entered properly
     */
    formSubmit() {
        let isUpdated = false;
        if (this.state.values && this.state.values.length > 0) {
            this.state.values.forEach(element => {
                if (element.paperName && element.courseCode && element.courseCredits && element.selectedDepartment && element.selectedSemester) {
                    const params = {
                        course: element.paperName,
                        semester: element.selectedSemester.toLowerCase(),
                        updatedBy: this.state.userID.toUpperCase(),
                        updatedDate: new Date(Date.now()).toLocaleString(),
                        department: element.selectedDepartment,
                        courseCode: element.courseCode,
                        courseCredits: element.courseCredits,
                        isElective: element.isElective
                    }
                    axios.post(`/xakal/coursedetail`, params)
                        .then(() => {
                            if (!isUpdated) {
                                alert('Updated Successfully');
                            }
                            isUpdated = true;
                        })
                        .catch((err) => console.log(err));
                } else {
                    alert('Please give all the details')
                }
            });
            this.resetForm()

        } else {
            alert('Please give atleast one record to proceed')
        }
    }

    /**
     * Sets isElectivce based on check
     * @param {} i contains the index of changed element
     * @param {*} event contains the event reference
     */
    handleCheckClick = (i, event) => {
        let values = [...this.state.values];
        values[i]['isElective'] = event.target.checked;
        this.setState({ values });
    }

    /**
     * Resets to base state
     */
    resetForm() {
        this.setState({ values: [{ paperName: '', courseCode: '', courseCredits: '', selectedDepartment: '', selectedSemester: '', isElective: false }] })
    }

    render() {
        return (
            <div>
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800 m-t-20 m-l-20">Add Paper</h1>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card-box">
                            {this.state.values.map((el, i) =>
                                <div className="card-body row" key={i}>
                                    <div className="col-lg-2 p-t-20">
                                        <div
                                            className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                            <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="text" id={`name${i}`}
                                                value={el.paperName || ''} onChange={this.handleFormChange.bind(this, i)} name="paperName" />
                                            <label className={"mdl-textfield__label "}>Name</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 p-t-20">
                                        <div
                                            className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                            <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="text" id={`courseCode${i}`}
                                                value={el.courseCode || ''} onChange={this.handleFormChange.bind(this, i)} name="courseCode" />
                                            <label className={"mdl-textfield__label "}>Code</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 p-t-20">
                                        <div
                                            className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                            <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="number" id={`courseCredits${i}`}
                                                value={el.courseCredits || ''} onChange={this.handleFormChange.bind(this, i)} name="courseCredits" />
                                            <label className={"mdl-textfield__label "}>Credits</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 p-t-20">
                                        <div
                                            className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width " + this.state.isDepartmentFocussed}>
                                            <input name="selectedDepartment" onKeyPress={(e) => e.preventDefault()} autoComplete="off" onFocus={this.onDeptDropDownFocus.bind(this, i)} className="mdl-textfield__input display-border" type="text" id={`department${i}`}
                                                value={el.selectedDepartment || ''} onChange={this.handleFormChange.bind(this, i)} />
                                            <label className={"mdl-textfield__label " + this.state.backgroundDepartment}>Department</label>
                                            {this.state.onDepartmentFocus && this.state.selectedDepartmentIndex === i ? <div className="mdl-menu__container is-upgraded dropdown-list is-visible">
                                                <div className="mdl-menu__outline mdl-menu--bottom-left dropdown-div">
                                                    <ul className="scrollable-menu mdl-menu mdl-menu--bottom-left mdl-js-menu ul-list">
                                                        {this.displayDepartment(i)}
                                                    </ul>
                                                </div>
                                            </div> : <p></p>}
                                        </div>
                                    </div>
                                    <div className="col-lg-2 p-t-20">
                                        <div
                                            className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width " + this.state.isFocussed}>
                                            <input name="selectedSemester" onKeyPress={(e) => e.preventDefault()} autoComplete="off" value={el.selectedSemester || ''} onChange={this.handleFormChange.bind(this, i)} onFocus={this.onSemesterDropDownFocus.bind(this, i)} className="mdl-textfield__input display-border" type="text" id={`sample2"${i}`}
                                            />
                                            <label className={"mdl-textfield__label " + this.state.background}>Semester</label>
                                            {this.state.onFocus && this.state.selectedIndex === i ? <div className="mdl-menu__container is-upgraded dropdown-list is-visible">
                                                <div className="mdl-menu__outline mdl-menu--bottom-left dropdown-div">
                                                    <ul key={i} className="scrollable-menu mdl-menu mdl-menu--bottom-left mdl-js-menu ul-list">
                                                        <li className="mdl-menu__item animation" id="Semester 1" onClick={this.handleSemesterChange.bind(this, i)} >Semester 1</li>
                                                        <li className="mdl-menu__item animation1" id="Semester 2" onClick={this.handleSemesterChange.bind(this, i)} >Semester 2</li>
                                                        <li className="mdl-menu__item animation2" id="Semester 3" onClick={this.handleSemesterChange.bind(this, i)} >Semester 3</li>
                                                        <li className="mdl-menu__item animation" id="Semester 4" onClick={this.handleSemesterChange.bind(this, i)} >Semester 4</li>
                                                        <li className="mdl-menu__item animation1" id="Semester 5" onClick={this.handleSemesterChange.bind(this, i)} >Semester 5</li>
                                                        <li className="mdl-menu__item animation2" id="Semester 6" onClick={this.handleSemesterChange.bind(this, i)} >Semester 6</li>
                                                        <li className="mdl-menu__item animation" id="Semester 7" onClick={this.handleSemesterChange.bind(this, i)} >Semester 7</li>
                                                        <li className="mdl-menu__item animation1" id="Semester 8" onClick={this.handleSemesterChange.bind(this, i)} >Semester 8</li>
                                                    </ul>
                                                </div>
                                            </div> : <p></p>}
                                        </div>
                                    </div>
                                    <div className="col-sm-1 p-t-30">
                                        <div className="row p-t-20">
                                            <div className="col-sm-6">
                                                <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect"
                                                    htmlFor="elective">Elective</label>
                                            </div>
                                            <div className="col-sm-6 p-l-5">
                                                <input type="checkbox" checked={el.isElective || false} onChange={this.handleCheckClick.bind(this, i)} id="elective" className="mdl-switch__input p-t-30" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-1 p-t-20">
                                        <button type="button" onClick={this.removeClick.bind(this, i)} className="btn btn-primary m-t-15 m-l-30">X</button>
                                    </div>

                                </div >)}
                            <div className="col-sm-8 p-t-20">
                                <button type="button" onClick={this.addClick.bind(this)} className="btn btn-primary m-t-15 m-l-30">Add</button>
                                <button type="button" onClick={this.formSubmit.bind(this)} className="btn btn-primary m-t-15 m-l-30">Save</button>
                                <button type="button" onClick={this.resetForm.bind(this)} className="btn btn-primary m-t-15 m-l-30">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default AddPaperDetails;