import React, { Component } from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import config from '../../config';
import LoadingModal from '../../Modules/Modal';

const url = config.server.url;

class SelectFoods extends Component {
  state = {
    loading: true,
    formData: {},
    randomFoods: [],
    selectedFoods: []
  };

  async componentDidMount() {
    await this.rollRandomFoods();
  }

  setLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  onFoodSelect = name => {
    const index = this.state.selectedFoods.indexOf(name);
    if (index < 0) {
      this.state.selectedFoods.push(name);
    } else {
      this.state.selectedFoods.splice(index, 1);
    }
    this.setState({ selectedFoods: [...this.state.selectedFoods] });
  };

  rollRandomFoods = async () => {
    try {
      this.setLoading(true);

      const { foodTypes, foodAttrs, limit } = this.props.prevFormData;
      const randomFoods = await this.getRandomFoods(
        foodTypes,
        foodAttrs,
        limit
      );
      const allSelect =
        (randomFoods && randomFoods.map(food => food.shortId)) || [];
      console.log(allSelect);

      this.setState({
        selectedFoods: allSelect,
        randomFoods: randomFoods
      });
      this.setLoading(false);

      return false;
    } catch (err) {
      console.log(err);
    }
  };

  getRandomFoods = async (types, attributes, limit) => {
    try {
      const typesJson = JSON.stringify(types);
      const attrsJson = JSON.stringify(attributes);

      const response = await axios.get(url('/food/getrandomfoods'), {
        params: {
          types: typesJson,
          attributes: attrsJson,
          limit: limit
        }
      });
      if (response.status !== 200) throw response.data;

      return response.data;
    } catch (err) {
      // console.log(JSON.stringify(err, Object.getOwnPropertyNames));
      return { err: err.message };
    }
  };

  showRandomFoods = () => {
    const randomFoods = this.state.randomFoods;

    if (randomFoods.err) return <p>{randomFoods.err}</p>;

    return randomFoods.map((food, index) => {
      const tagName = food.shortId;
      const isSelected = this.state.selectedFoods.includes(tagName);

      return (
        <Row key={`random-food-btn-row-${index + 1}`}>
          <Col key={`random-food-btn-col-${index + 1}`}>
            <Button
              className="Food-btn-checkbox"
              block
              color="primary"
              key={food.shortId}
              outline={!isSelected}
              onClick={() => this.onFoodSelect(tagName)}
            >
              {food.name}
            </Button>
          </Col>
        </Row>
      );
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const nextPage = this.props.pageIndex + 1;
    const formData = {
      selectedFoods: this.state.selectedFoods
    };

    this.props.updateMethod(nextPage, formData);
  };

  render() {
    const validated = this.state.selectedFoods.length > 0;

    return (
      <>
        <Container>
          <Row>
            <Col>
              <h3>Select Foods</h3>
              <p className="lead">
                Below are the {this.props.prevFormData.limit} randomly selected
                food based on your selection.
              </p>
              <p>You may deselect the foods that you do not prefer.</p>
              <p>
                If you are not satisfied with the result,{' '}
                <a href="#" onClick={this.rollRandomFoods}>
                  click here to re-roll
                </a>
              </p>
              <p className="lead">
                Actual count: {this.state.randomFoods.length}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Container>{this.showRandomFoods()}</Container>
            </Col>
          </Row>
          <Row>
            <Col>
              <hr />
              {/* TODO: Add previous button, requires formdata to be transferred back */}
              {/* TODO: Re-roll button will re-call the /getrandomfoods */}
              <div className="clearfix">
                <Button
                  disabled={!validated}
                  size="lg"
                  color="primary"
                  className="float-right"
                  onClick={this.handleSubmit}
                >
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
        <LoadingModal isOpen={this.state.loading} />
      </>
    );
  }
}

export default SelectFoods;
