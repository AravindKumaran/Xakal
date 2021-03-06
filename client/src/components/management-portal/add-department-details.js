import React, { Component } from 'react';
import axios from 'axios';
class AddDepartmentDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userID: '',
            studentName: '',
            departmentName: '',
            staffDetails: []
        };
        this.baseState = this.state;

    }

    componentDidMount() {
        if (this.props && this.props.location && this.props.location.userID) {
            this.setState({ routerLink: this.props.location.pathname, userID: this.props.location.userID.userID })
        }
        this.fetchStaffDetails();
    }

    /**
     * Fetches all staff
     */
    fetchStaffDetails() {
        axios.get(`/xakal/staffdetail`)
            .then((response) => {
                this.setState({ staffDetails: response.data });
            });
    }


    onDropDownFocus(event) {
        if (event.target) {
            event.target.parentNode.classList.add('is-focused');
            event.target.nextSibling.classList.add('is-shown');
        }
    }

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
    handleFormChange(event) {
        if (event.target.value) {
            this.setState({ [event.target.name]: event.target.value })
        }
    }

    /**
     * Triggers when the form is submitted
     * Checks whether the values are entered properly
     */
    formSubmit() {
        let isUpdated = false;
        if (this.state.name && this.state.startingYear &&
            this.state.email && this.state.studentCapacity && this.state.contact && this.state.hodName
            && this.state.qualification && this.state.designation && this.state.hodEmail && this.state.hodContact && this.state.hodEmergencyContact
            && this.state.joiningDate) {
            const params = {
                name: this.state.name,
                headOfDepartment: this.state.hodName,
                updatedBy: this.state.userID.toUpperCase(),
                updatedDate: new Date(Date.now()).toLocaleString(),
                email: this.state.email,
                contact: this.state.contact,
                startingYear: this.state.startingYear,
                studentCapacity: this.state.studentCapacity,
            }
            axios.post(`/xakal/departmentdetail`, params)
                .then(() => {
                    if (!isUpdated) {
                        alert('Updated Successfully');
                    }
                    isUpdated = true;
                })
                .catch((err) => console.log(err));
            this.insertHODDetails();
        } else {
            alert('Please give all the details')
        }
    }

    /**
     * Inserts hod staff detailss
     */
    insertHODDetails() {
        const params = {
            name: this.state.hodName,
            qualification: this.state.qualification,
            uploadedBy: this.state.userID.toUpperCase(),
            uploadedDate: new Date(Date.now()).toLocaleString(),
            designation: this.state.designation,
            email: this.state.hodEmail,
            bloodGroup: 'NA',
            contact: this.state.hodContact,
            emergencyContact: this.state.hodEmergencyContact,
            parentSpouse: 'NA',
            joiningDate: this.state.joiningDate,
            departmentName: this.state.name,
        }
        axios.post(`/xakal/staffdetail`, params)
            .then(() => {
                console.log('inserted')
            })
            .catch((err) => console.log(err));
    }

    render() {
        return (
            <div>
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800 m-t-20 m-l-20">Add Department</h1>
                </div>
                <div className="row">
                    <h3 className="h3 mb-0 text-gray-800 m-l-30">Department details</h3>
                    <div className="col-sm-12">
                        <div className="card-box">
                            <div className="card-body row">
                                <div className="col-lg-4 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="text" id="name"
                                            onChange={this.handleFormChange.bind(this)} name="name" />
                                        <label className={"mdl-textfield__label "}>Name</label>
                                    </div>
                                </div>
                                <div className="col-lg-4 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="text" id="contact"
                                            onChange={this.handleFormChange.bind(this)} name="contact" />
                                        <label className={"mdl-textfield__label "}>Mobile</label>
                                    </div>
                                </div>
                                <div className="col-lg-4 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="text" id="email"
                                            onChange={this.handleFormChange.bind(this)} name="email" />
                                        <label className={"mdl-textfield__label "}>Email</label>
                                    </div>
                                </div>
                                <div className="col-lg-4 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="number" id="startingYear"
                                            onChange={this.handleFormChange.bind(this)} name="startingYear" />
                                        <label className={"mdl-textfield__label "}>Starting Year</label>
                                    </div>
                                </div>
                                <div className="col-lg-4 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="number" id="studentCapacity"
                                            onChange={this.handleFormChange.bind(this)} name="studentCapacity" />
                                        <label className={"mdl-textfield__label "}>Student Capacity</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <h3 className="h3 mb-0 text-gray-800 m-l-30">Add HOD details</h3>
                    <div className="col-sm-12">
                        <div className="card-box">
                            <div className="card-body row">
                                <div className="col-lg-2 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="text" id="name"
                                            onChange={this.handleFormChange.bind(this)} name="hodName" />
                                        <label className={"mdl-textfield__label "}>Name</label>
                                    </div>
                                </div>
                                <div className="col-lg-2 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border"
                                            type="text" id="designation"
                                            onChange={this.handleFormChange.bind(this)} name="designation" />
                                        <label className={"mdl-textfield__label "}>Designation</label>
                                    </div>
                                </div>

                                <div className="col-lg-1 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="text" id="qualification"
                                            onChange={this.handleFormChange.bind(this)} name="qualification" />
                                        <label className={"mdl-textfield__label "}>Qualification</label>
                                    </div>

                                </div>
                                <div className="col-lg-1 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="number" id="contact"
                                            onChange={this.handleFormChange.bind(this)} name="hodContact" />
                                        <label className={"mdl-textfield__label "}>Mobile</label>
                                    </div>
                                </div>
                                <div className="col-lg-1 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="email" id="email"
                                            onChange={this.handleFormChange.bind(this)} name="hodEmail" />
                                        <label className={"mdl-textfield__label "}>Email</label>
                                    </div>
                                </div>
                                <div className="col-lg-2 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width "}>
                                        <input autoComplete="off" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="text" id="emergencyContact"
                                            onChange={this.handleFormChange.bind(this)} name="hodEmergencyContact" />
                                        <label className={"mdl-textfield__label "}>Emergency contact</label>
                                    </div>
                                </div>
                                <div className="col-lg-2 p-t-20">
                                    <div
                                        className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width is-focused"}>
                                        <input autoComplete="off" placeholder="" onBlur={this.onFocusOut.bind(this)} onFocus={this.onDropDownFocus.bind(this)} className="mdl-textfield__input display-border" type="date" id="joiningDate"
                                            onChange={this.handleFormChange.bind(this)} name="joiningDate" />
                                        <label htmlFor="joiningDate" className={"mdl-textfield__label "}>Joining date</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-8 p-t-20">
                                <button type="button" onClick={this.formSubmit.bind(this)} className="btn btn-primary m-t-15 m-l-30">Save</button>
                                <button type="button" className="btn btn-primary m-t-15 m-l-30">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default AddDepartmentDetails;