import React, { Component } from 'react';
import { Button, Container, Row, Col, Input, FormFeedback } from 'reactstrap';
import axios from 'axios';
import config from '../../config';
import LoadingModal from '../../Modules/Modal';

import { Link } from 'react-router-dom';

const url = config.server.url;

class FindInput extends Component {
  state = {
    loading: false,
    selectedFood: '',
    foodList: [],
    foodResults: [],
    foodInput: '',
    isFoodInputEmpty: false,

    locationInput: '',
    isLocationInputEmpty: false
  };

  setLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  fromSelectedFood = () => {
    const foods = this.state.foodList;
    const selectedFood = this.props.selectedFood;
    console.log(selectedFood);
    if (!selectedFood) return;

    const foodName = foods.find(food => food.shortId === selectedFood).name;
    if (!foodName) {
      console.log('Food not found. An error has occured, please try again');
      return;
    }

    this.setFoodInput(foodName);
    this.setState({
      selectedFood: selectedFood,
      foodInput: foodName
    });
  };

  async componentDidMount() {
    this.setLoading(true);
    const foods = await this.getFoodResults();
    this.setState({
      foodList: foods
    });

    this.fromSelectedFood();
    this.setLoading(false);
  }

  selectFood = tagName => {
    this.setState({
      selectedFood: tagName
    });
  };

  setFoodInput = foodName => {
    const name = foodName && foodName.trim();
    const empty = name.length <= 0;
    const foodList = this.state.foodList;

    this.setState({
      selectedFood: '',
      foodInput: name,
      isFoodInputEmpty: empty
    });
    if (empty) return;

    const foodResults = foodList.filter(food =>
      food.name.toLowerCase().includes(name && name.toLowerCase())
    );
    this.setState({
      foodResults: foodResults
    });
  };

  handleFoodInputChange = e => {
    this.setFoodInput(e.target.value);
  };

  handleLocationInputChange = e => {
    const locationInput = e.target.value && e.target.value.trim();
    this.setState({
      isLocationInputEmpty: locationInput.length <= 0,
      locationInput: locationInput
    });
  };

  getFoodResults = async () => {
    try {
      const response = await axios.get(url('/food/getfoods'));
      if (response.status !== 200) throw response.data;

      return response.data;
    } catch (err) {
      console.log(err.res);
      return { err: err.message };
    }
  };

  showFoodResults = () => {
    const foodResults = this.state.foodResults;

    if (!foodResults) return;
    if (foodResults.err) return <p>{foodResults.err}</p>;

    return foodResults.map((food, index) => {
      const tagName = food.shortId;
      const isSelected = this.state.selectedFood === tagName;

      return (
        <Col
          className="Food-find-btn-result"
          sm={4}
          key={`food-column-${index + 1}`}
        >
          <Button
            color="primary"
            block
            key={`btn-food-results-${index + 1}`}
            outline={!isSelected}
            onClick={() => this.selectFood(tagName)}
          >
            {food.name}
          </Button>
        </Col>
      );
    });
  };

  submitForm = formData => {
    const nextPage = this.props.pageIndex + 1;
    this.props.updateMethod(nextPage, formData);
  };

  handleSubmit = e => {
    e.preventDefault();
    const selectedFood = this.state.selectedFood;
    const foods = this.state.foodList;
    const location = this.state.locationInput;

    const foodName = foods.find(food => food.shortId === selectedFood).name;
    // Submit data
    const formData = {
      foodName: foodName,
      location: location
    };

    this.submitForm(formData);
  };

  render() {
    const toRandom = '/food/random';
    const emptyFoodInput = this.state.isFoodInputEmpty;
    const foodSelected = this.state.selectedFood.length > 0;
    const emptyLocationInput = this.state.isLocationInputEmpty;

    return (
      <>
        <Container>
          <Row>
            <Col>
              <p className="lead">
                Enter the name of food that you would like to pick. Or{' '}
                <Link to={toRandom}>select a food randomly</Link>.
              </p>
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 8, offset: 2 }}>
              <Input
                name="foodInput"
                type="text"
                placeholder="Enter food name here..."
                id="findFoodInput"
                onChange={this.handleFoodInputChange}
                invalid={emptyFoodInput}
                value={this.state.foodInput}
              />
              {emptyFoodInput && (
                <FormFeedback>Input must not be empty</FormFeedback>
              )}
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 8, offset: 2 }}>
              <Container>
                <Row style={{ padding: '1rem 0' }}>
                  {!this.state.isFoodInputEmpty && this.showFoodResults()}
                </Row>
              </Container>
            </Col>
          </Row>
          {foodSelected && (
            <>
              <Row>
                <Col>
                  <p className="lead">
                    Enter the location you would like to find
                  </p>
                </Col>
              </Row>
              <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                  <Input
                    name="locationInput"
                    type="text"
                    placeholder="Enter location here..."
                    id="findLocationInput"
                    onChange={this.handleLocationInputChange}
                    invalid={emptyLocationInput}
                  />
                  {emptyLocationInput && (
                    <FormFeedback>Input must not be empty</FormFeedback>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm={{ size: 4, offset: 4 }}>
                  <Button
                    block
                    color="primary"
                    className="Food-btn-v"
                    onClick={this.handleSubmit}
                    disabled={this.state.locationInput.length <= 0}
                  >
                    Find Food
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Container>
        <LoadingModal isOpen={this.state.loading} />
      </>
    );
  }
}

export default FindInput;
