import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Input
} from 'reactstrap';

// Authentication module
import Auth from './Modules/Auth';
import LoadingModal from './Modules/Modal';

class Login extends Component {
  state = {
    username: '',
    password: '',
    submitted: false,
    loading: false,
    error: '',
    success: ''
  };

  /**
   * @param {boolean} isLoggedIn
   */
  updateAuth = (isLoggedIn, user) => {
    this.props.authUpdater(isLoggedIn, user);
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password } = this.state;

    if (!(username && password)) return;

    this.setState({ loading: true });
    const result = await Auth.authenticateUser(username, password);
    this.setState({ loading: false });
    if (result.error) {
      this.setState({ error: result.error });
      return;
    }

    this.updateAuth(true, result.user);
    // Auth.deauthenticateUser(); // TODO: remove this
  };

  render() {
    const { username, password, submitted, loading, error } = this.state;
    const isUsernameEmpty = !username && submitted;
    const isPasswordEmpty = !password && submitted;

    return (
      <div className="Login">
        <Container>
          <Row>
            <Col sm={{ size: 8, offset: 2 }} className="Login-header">
              <h1 className="display-3 Login-title">LOGIN PAGE</h1>
              <div>
                <p className="lead">
                  Login now to access features like save favourite food and
                  locations to your own account!
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 6, offset: 3 }} className="Login-form-wrapper">
              <div className="Login-form-top">
                <h3>Log In</h3>
                <p style={error ? { color: 'red' } : {}}>
                  {error ||
                    'Please enter your username or password to continue.'}
                </p>
              </div>
              <div className="Login-form-bottom">
                <Form className="Login-form" onSubmit={this.handleSubmit}>
                  <FormGroup row>
                    <Input
                      invalid={isUsernameEmpty}
                      bsSize="lg"
                      type="text"
                      name="username"
                      id="loginUsername"
                      placeholder="Username"
                      onChange={this.handleChange}
                    />
                    {isUsernameEmpty && (
                      <FormFeedback>Username is required</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup row>
                    <Input
                      invalid={isPasswordEmpty}
                      bsSize="lg"
                      type="password"
                      name="password"
                      id="loginPassword"
                      placeholder="Password"
                      onChange={this.handleChange}
                    />
                    {isPasswordEmpty && (
                      <FormFeedback>Password is required</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup row>
                    <Button color="primary" size="lg" block>
                      Log In
                    </Button>
                  </FormGroup>
                </Form>
                <p>
                  Don't have an account?&nbsp;
                  <Link to="/register">Register now.</Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
        <LoadingModal isOpen={loading} />
      </div>
    );
  }
}

export default Login;
