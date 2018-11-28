import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  Container,
  Nav,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Button
} from 'reactstrap';

class Admin extends Component {
  render() {
    const { match } = this.props;

    return (
      <div className="Admin">
        {/* TODO: Manage food type, attributes and foods */}
      </div>
    );
  }
}

export default Admin;
