import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from 'reactstrap';
import axios from 'axios';

import Auth from '../Modules/Auth';
import qs from 'querystring';
import config from '../config';

import { Link } from 'react-router-dom';

const url = config.server.url;

class User extends Component {
  state = {
    loading: false,
    foodHistory: [],
    savedFoods: [],
    savedLocations: []
  };

  async componentDidMount() {
    const user = await this.getUser();
    const foodHistory = user.foodHistory;
    const savedFoods = user.savedFoods;
    const savedLocations = user.savedLocations;

    this.setState({
      foodHistory: foodHistory,
      savedFoods: savedFoods,
      savedLocations: savedLocations
    });
  }

  getUser = async () => {
    try {
      const token = Auth.getToken();
      const response = await axios.get(url('/getuser'), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) throw response.data;

      return response.data.user;
    } catch (error) {
      console.log(
        (error.catch && error.catch(err => console.log(err))) || error
      );
    }
  };

  renderSavedFoods = () => {
    const savedFoods = this.state.savedFoods;
    return (
      <ListGroup>
        {savedFoods.map(savedFood => {
          const { _id, timeAdded, food, notes } = savedFood;

          return (
            <ListGroupItem action>
              <ListGroupItemHeading>{food.name}</ListGroupItemHeading>
              <ListGroupItemText>
                {new Date(timeAdded).toString()}
              </ListGroupItemText>
              <ListGroupItemText>{notes}</ListGroupItemText>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  };

  renderSavedLocations = () => {
    const savedLocations = this.state.savedLocations;
    return (
      <ListGroup>
        {savedLocations.map(savedLocation => {
          const { _id, timeAdded, place, food, notes } = savedLocation;

          return (
            <ListGroupItem action>
              <ListGroupItemHeading>{place.address}</ListGroupItemHeading>
              <ListGroupItemText>
                {new Date(timeAdded).toString()}
              </ListGroupItemText>
              <ListGroupItemText>{notes}</ListGroupItemText>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  };

  renderFoodHistory = () => {
    const foodHistory = this.state.foodHistory;
    return (
      <ListGroup>
        {foodHistory.map(historyFood => {
          const { _id, timestamp, food, notes } = historyFood;

          return (
            <ListGroupItem action>
              <ListGroupItemHeading>{food.name}</ListGroupItemHeading>
              <ListGroupItemText>
                {new Date(timestamp).toString()}
              </ListGroupItemText>
              <ListGroupItemText>{notes}</ListGroupItemText>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  };

  render() {
    const { match } = this.props;

    return (
      <div className="User">
        {/* TODO: Food history, favourite foods, favourite locations */}
        <Container>
          <Row>
            <Col>
              <h1 className="display-2">User Page</h1>
            </Col>
          </Row>
          <Row>
            <Col className="User-box">
              <h3>Saved Foods</h3>
              <Col sm={{ size: 8, offset: 2 }}>{this.renderSavedFoods()}</Col>
            </Col>
          </Row>
          <Row>
            <Col className="User-box">
              <h3>Saved Locations</h3>
              <Col sm={{ size: 8, offset: 2 }}>
                {this.renderSavedLocations()}
              </Col>
            </Col>
          </Row>
          <Row>
            <Col className="User-box">
              <h3>Food History</h3>
              <Col sm={{ size: 8, offset: 2 }}>{this.renderFoodHistory()}</Col>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default User;
