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

// Module
import RandomFood from './Random/RandomFood';
import FindFood from './Find/FindFood';

class Food extends Component {
  state = {
    randomFood: ''
  };

  RandomFoodPage = props => {
    return <RandomFood getFoodMethod={this.getRandomFood} {...props} />;
  };

  FindFoodPage = props => {
    return <FindFood selectedFood={this.state.randomFood} {...props} />;
  };

  getRandomFood = foodShortName => {
    this.setState({
      randomFood: foodShortName
    });
  };

  render() {
    const { match } = this.props;

    return (
      <div className="Food">
        <Switch>
          <Route path={`${match.url}/random`} component={this.RandomFoodPage} />
          <Route path={`${match.url}/find`} component={this.FindFoodPage} />
          <Redirect to="/404" />
        </Switch>
      </div>
    );
  }
}

export default Food;
