import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Link,
  NavLink as RouteNavLink,
  Redirect,
  Switch
} from 'react-router-dom';
import {
  Container,
  Nav,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Button
} from 'reactstrap';
import './App.css';

// Other components
import Home from './Home';
import Login from './Login';
import Auth from './Modules/Auth';
import Food from './Food/Food';

class Footer extends Component {
  render() {
    return <div className="App-footer">{this.props.children}</div>;
  }
}

// Must be placed inside Navbar
class LoginNav extends Component {
  accountNavItems = () => {
    const authenticated = this.props.authentication.authenticated;
    const user = this.props.authentication.user;

    return authenticated ? (
      <>
        <NavItem>
          <NavLink>
            <span className="App-navlink">
              Welcome! {(user && user.username) || 'User'}
            </span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            to={{
              pathname: '/logout',
              state: { prevPath: window.location.pathname }
            }}
            tag={RouteNavLink}
          >
            <span className="App-navlink">Log Out</span>
          </NavLink>
        </NavItem>
      </>
    ) : (
      <>
        <NavItem>
          <NavLink to="/login" tag={RouteNavLink}>
            <span className="App-navlink">Log In</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <Button to="/register" color="primary" tag={Link}>
            <span className="App-navlink">Sign Up</span>
          </Button>
        </NavItem>
      </>
    );
  };

  render() {
    return (
      <Nav className="ml-auto App-navbar" navbar>
        <NavItem>
          <NavLink to="/" tag={RouteNavLink}>
            <span className="App-navlink">Home</span>
          </NavLink>
        </NavItem>
        {this.accountNavItems()}
      </Nav>
    );
  }
}

class App extends Component {
  state = {
    returnUrl: '/',
    user: null,
    isLoggedIn: false
  };

  /**
   * @param {Boolean} authenticated
   */
  updateAuthentication = (authenticated, user = null) => {
    this.setState({ isLoggedIn: authenticated, user: user });
  };

  LogOut = ({ location }) => {
    this.updateAuthentication(false);
    Auth.deauthenticateUser();

    return <Redirect to={(location.state && location.state.prevPath) || '/'} />;
  };

  NotFound = () => {
    return <h1 className="display-1">404 NOT FOUND</h1>;
  };

  HomePage = props => {
    return <Home {...props} />;
  };

  LoginPage = props => {
    return this.state.isLoggedIn ? (
      <Redirect to="/" />
    ) : (
      <Login authUpdater={this.updateAuthentication} {...props} />
    );
  };

  FoodPage = props => {
    return <Food {...props} />;
  };

  render() {
    const authentication = {
      authenticated: this.state.isLoggedIn,
      user: this.state.user
    };

    return (
      <BrowserRouter>
        <div className="App">
          <div className="header">
            <Navbar color="dark" dark expand="md">
              <NavbarBrand to="/" tag={Link}>
                SimplyEat
              </NavbarBrand>
              <LoginNav authentication={authentication} />
            </Navbar>
          </div>
          <Container fluid className="App-content">
            <Switch>
              <Route exact path="/" component={this.HomePage} />
              <Route path="/food" component={this.FoodPage} />
              <Route path="/login" component={this.LoginPage} />
              <Route path="/logout" component={this.LogOut} />
              <Route path="/404" component={this.NotFound} />
              <Redirect to="/404" />
            </Switch>
          </Container>
          <Footer className="App-footer">
            <div>
              <span>
                &copy;2018 SimplyEat. All rights reserved&nbsp;|&nbsp;
              </span>
              <a href="https://github.com/jensonzx/simplyeat-server">GitHub</a>
            </div>
          </Footer>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
