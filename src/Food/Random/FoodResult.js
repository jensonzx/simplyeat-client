import React, { Component } from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import config from '../../config';
import LoadingModal from '../../Modules/Modal';

const url = config.server.url;

class FoodResult extends Component {
  state = {
    loading: true,
    food: {}
  };

  async componentDidMount() {
    await this.rollRandomFood();
  }

  setLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  rollRandomFood = async () => {
    try {
      this.setLoading(true);

      const { selectedFoods } = this.props.prevFormData;
      const food = await this.getRandomFood(selectedFoods);

      this.setState({ food: food });
      this.setLoading(false);
      return false;
    } catch (err) {
      console.log(err);
    }
  };

  getRandomFood = async selectedFoods => {
    try {
      const foodsJson = JSON.stringify(selectedFoods);

      const response = await axios.get(url('/food/getrandomfood'), {
        params: {
          list: foodsJson
        }
      });
      if (response.status !== 200) throw response.data;

      return response.data;
    } catch (err) {
      return { err: err.message };
    }
  };

  findFood = e => {
    e.preventDefault();

    const foodShortName = this.state.food.shortId;
    const nextPage = this.props.pageIndex + 1;
    const formData = {
      foodShortName: foodShortName
    };
    this.props.updateMethod(nextPage, formData);
  };

  render() {
    const foodName = this.state.food.name;
    const foodDesc = this.state.food.description;

    return (
      <>
        <Container>
          <Row>
            <Col>
              <h3>Result</h3>
              <p className="lead">You should eat...</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2 className="display-4">{foodName}</h2>
              <p>{foodDesc}</p>
              {/* TODO: View food details */}
              <Button color="primary" className="Food-btn-v">
                View Food
              </Button>
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 6, offset: 3 }}>
              <Button
                block
                color="success"
                onClick={this.findFood}
                className="Food-btn-v"
              >
                Search for Food
              </Button>
            </Col>
          </Row>
        </Container>
        <LoadingModal isOpen={this.state.loading} />
      </>
    );
  }
}

export default FoodResult;
