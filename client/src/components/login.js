import React, { Component } from 'react'
import logo from '../images/xakal-logo.png'
import '../styles/login.css'
import '../styles/utils.css'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      idClassName: '',
      passwordClassName: '',
      errorID: '',
      errorPassword: '',
      loginID: '',
      password: '',
      studentRedirect: false,
      staffRedirect: false,
      managementRedirect: false,
      hodRedirect: false,
      nonTeaching: false,
      xakalAdmin: false,
    }
  }

  componentDidMount() {
    if (this.state.loginID) {
      this.setState({ idClassName: 'has-val' })
    }
    if (this.state.password) {
      this.setState({ passwordClassName: 'has-val' })
    }
  }

  /**
   * Triggers when username is given
   * Adds has-val className if the value is given
   * @param event contains the change event object
   */
  handleIDChange(event) {
    if (event.target.value) {
      this.setState({ idClassName: 'has-val', loginID: event.target.value })
    } else {
      this.setState({
        idClassName: '',
        errorID: 'has-error',
        loginID: event.target.value,
      })
    }
  }

  /**
   * Triggers when password is given
   * Adds has-val className if the value is given
   * @param event contains the change event object
   */
  handlePasswordChange(event) {
    if (event.target.value) {
      this.setState({
        passwordClassName: 'has-val',
        password: event.target.value,
      })
    } else {
      this.setState({
        passwordClassName: '',
        errorPassword: 'has-error',
        password: event.target.value,
      })
    }
  }

  resetLogin() {
    this.setState({
      studentRedirect: false,
      managementRedirect: false,
      staffRedirect: false,
      hodRedirect: false,
    })
  }

  /**
   * Triggers when the form is submitted
   * Checks whether the values are entered properly
   */
  formSubmit = (event) => {
    event.preventDefault()
    if (this.state.loginID !== '' && this.state.password !== '') {
      axios
        .get(`/xakal/user/${this.state.loginID}`)
        .then((response) => {
          if (response && response.data) {
            this.setState({
              userRole: response.data.userRole,
              userDetails: response.data,
            })
            this.resetLogin()
            if (this.state.password === response.data.password) {
              if (response.data.userRole === 'student') {
                this.setState({
                  studentRedirect: true,
                  loginID: response.data.userID,
                })
              } else if (response.data.userRole === 'staff') {
                this.setState({ staffRedirect: true })
              } else if (response.data.userRole === 'management') {
                this.setState({ managementRedirect: true })
              } else if (response.data.userRole === 'hod') {
                this.setState({ hodRedirect: true })
              } else if (response.data.userRole === 'non-teaching') {
                this.setState({ nonTeaching: true })
              } else if (response.data.userRole === 'xakal-admin') {
                this.setState({ xakalAdmin: true })
              } else {
                alert('Invalid user')
              }
            } else {
              alert('Incorrect password')
            }
          } else {
            alert('Invalid user')
          }
        })
        .catch((err) => {
          alert('Invalid user')
        })
    } else {
      alert('Please fill in the fields')
    }
  }

  render() {
    if (this.state.studentRedirect) {
      return (
        <Redirect
          to={{
            pathname: 'students-portal/whiteboard',
            state: {
              userID: this.state.loginID,
              userRole: this.state.userRole,
              userDetails: this.state.userDetails,
            },
          }}
        />
      )
    } else if (this.state.staffRedirect) {
      return (
        <Redirect
          to={{
            pathname: 'staff-portal/whiteboard',
            state: {
              userID: this.state.loginID,
              userRole: this.state.userRole,
              userDetails: this.state.userDetails,
            },
          }}
        />
      )
    } else if (this.state.managementRedirect) {
      return (
        <Redirect
          to={{
            pathname: 'management-portal/dashboard',
            state: {
              userID: this.state.loginID,
              userDetails: this.state.userDetails,
            },
          }}
        />
      )
    } else if (this.state.hodRedirect) {
      return (
        <Redirect
          to={{
            pathname: 'hod-portal/dashboard',
            state: {
              userID: this.state.loginID,
              userRole: this.state.userRole,
              userDetails: this.state.userDetails,
            },
          }}
        />
      )
    } else if (this.state.nonTeaching) {
      return (
        <Redirect
          to={{
            pathname: 'non-teaching-portal/dashboard',
            state: {
              userID: this.state.loginID,
              userRole: this.state.userRole,
              userDetails: this.state.userDetails,
            },
          }}
        />
      )
    } else if (this.state.xakalAdmin) {
      return (
        <Redirect
          to={{
            pathname: 'xakal-admin',
            state: {
              userID: this.state.loginID,
              userRole: this.state.userRole,
              userDetails: this.state.userDetails,
            },
          }}
        />
      )
    } else {
      return (
        <div className='container-login100'>
          <div className='wrap-login100 p-b-20'>
            <form
              className='login100-form'
              onSubmit={this.formSubmit.bind(this)}
            >
              <span className='login100-form-title p-b-40'>XAKAL</span>
              <span className='login100-form-avatar'>
                <img src={logo} className='logo' alt='XAKAL' />
              </span>

              <div className={'wrap-input100 m-t-50 ' + this.state.errorID}>
                <input
                  autoComplete='off'
                  value={this.state.loginID}
                  className={'input100 ' + this.state.idClassName}
                  type='text'
                  onChange={this.handleIDChange.bind(this)}
                  name='loginID'
                />
                <span className={'focus-input100'} data-placeholder='ID'></span>
              </div>

              <div
                className={
                  'wrap-input100 m-t-35 m-b-50 ' + this.state.errorPassword
                }
              >
                <input
                  autoComplete='off'
                  value={this.state.password}
                  className={'input100 ' + this.state.passwordClassName}
                  onChange={this.handlePasswordChange.bind(this)}
                  type='password'
                  name='pass'
                />
                <span
                  className='focus-input100'
                  data-placeholder='Password'
                ></span>
              </div>
              <div className='container-login100-form-btn'>
                <button type='submit' className='login100-form-btn'>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }
  }
}

export default Login
