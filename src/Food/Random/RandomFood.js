import axios from 'axios';
import React, { Component } from 'react';
import config from '../../config';
import { Container, Row, Col, Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';

// RandomFood modules
import FoodsInput from './FoodsInput';
import SelectFoods from './SelectFoods';
import FoodResult from './FoodResult';

const url = config.server.url;

// Random food layout page
class RandomFood extends Component {
  state = {
    pageIndex: 0,
    formData: {}
  };

  updateForm = (newPageIndex, formData) => {
    this.setState({
      pageIndex: newPageIndex,
      formData: formData
    });
  };

  getCurrentPage = () => {
    // Random food comes in the form of multipages to prevent exploit
    switch (this.state.pageIndex) {
      case 0:
        return <FoodsInput pageIndex={0} updateMethod={this.updateForm} />;
      case 1:
        return (
          <SelectFoods
            pageIndex={1}
            prevFormData={this.state.formData}
            updateMethod={this.updateForm}
          />
        );
      case 2:
        return (
          <FoodResult
            pageIndex={2}
            prevFormData={this.state.formData}
            updateMethod={this.updateForm}
          />
        );
      case 3:
        return this.submitToLocation();
    }
  };

  submitToLocation = () => {
    const getRandomFood = this.props.getFoodMethod;
    const foodName = this.state.formData.foodShortName;

    getRandomFood(foodName);

    return <Redirect to="/food/find" />;
  };

  // componentDidMount() {
  //   this.setState({
  //     foodTypes: this.getFoodTypes(),
  //     foodAttrs: this.getFoodAttrs()
  //   });
  // }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1 className="display-3">Random Food</h1>
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 10, offset: 1 }}>
            <div className="Food-box">{this.getCurrentPage()}</div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default RandomFood;
