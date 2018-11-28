import React, { Component } from 'react';
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';
import axios from 'axios';
import config from '../../config';
import LoadingModal from '../../Modules/Modal';

const url = config.server.url;

class FoodsInput extends Component {
  state = {
    loading: true,
    limit: 1,
    foodTypes: [],
    foodAttrs: [],
    foodTypeSelected: [],
    foodAttrSelected: []
  };

  async componentDidMount() {
    const foodTypes = await this.getFoodTypes();
    const foodAttrs = await this.getFoodAttrs();

    // Calls setState after food loaded
    this.setState({
      loading: false,
      foodTypes: foodTypes,
      foodAttrs: foodAttrs
    });
  }

  // foodKey is either foodType or foodAttr
  onCheckboxSelect = (foodKey, name) => {
    const index = this.state[foodKey].indexOf(name);
    if (index < 0) {
      this.state[foodKey].push(name);
    } else {
      this.state[foodKey].splice(index, 1);
    }
    this.setState({ [foodKey]: [...this.state[foodKey]] });
  };

  foodTypesCheckboxGroup = () => {
    const foodTypes = this.state.foodTypes;
    if (foodTypes.err) return <p>Error: {foodTypes.err}</p>;

    return foodTypes.map(type => {
      const foodKey = 'foodTypeSelected';
      const tagName = type.shortId;
      const isSelected = this.state.foodTypeSelected.includes(tagName);
      return (
        <Button
          color="primary"
          key={tagName}
          className="Food-btn-checkbox"
          outline={!isSelected}
          onClick={() => this.onCheckboxSelect(foodKey, tagName)}
        >
          {type.name}
        </Button>
      );
    });
  };

  foodAttrsCheckboxGroup = () => {
    const foodAttrs = this.state.foodAttrs;
    if (foodAttrs.err) return <p>Error: {foodAttrs.err}</p>;

    return foodAttrs.map(attr => {
      const foodKey = 'foodAttrSelected';
      const tagName = attr.shortId;
      const isSelected = this.state.foodAttrSelected.includes(tagName);
      return (
        <Button
          color="primary"
          key={attr.shortId}
          className="Food-btn-checkbox"
          outline={!isSelected}
          onClick={() => this.onCheckboxSelect(foodKey, tagName)}
        >
          {attr.name}
        </Button>
      );
    });
  };

  getFoodTypes = async () => {
    try {
      const response = await axios.get(url('/food/getfoodtypes'));

      if (response.status !== 200) throw response.data;

      return response.data;
    } catch (err) {
      // console.log(JSON.stringify(err, Object.getOwnPropertyNames));
      return { err: err.message };
    }
  };

  getFoodAttrs = async () => {
    try {
      const response = await axios.get(url('/food/getfoodattributes'));

      if (response.status !== 200) throw response.data;

      return response.data;
    } catch (err) {
      // console.log(JSON.stringify(err, Object.getOwnPropertyNames));
      return { err: err.message };
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const nextPage = this.props.pageIndex + 1;
    const foodTypes = this.state.foodTypeSelected;
    const foodAttrs = this.state.foodAttrSelected;

    const formData = {
      foodTypes: foodTypes,
      foodAttrs: foodAttrs,
      limit: this.state.limit
    };

    this.props.updateMethod(nextPage, formData);
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const isValidated =
      this.state.foodTypeSelected.length > 0 &&
      this.state.foodAttrSelected.length > 0 &&
      this.state.limit > 0;

    return (
      <>
        <Container>
          <Row>
            <Col>
              <h3>Food Types</h3>
              <p className="lead">
                Select the type or cuisines of food you'd like to eat
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              {this.foodTypesCheckboxGroup()}
              <hr />
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Food Attributes</h3>
              <p className="lead">
                Select the attributes of foods you prefer to have
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              {this.foodAttrsCheckboxGroup()}
              <hr />
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="lead">
                Select the limit of the foods you want to generate
              </p>
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 2, offset: 5 }}>
              <Form>
                <FormGroup row>
                  <Col>
                    <Input
                      type="number"
                      name="limit"
                      id="foodsLimit"
                      placeholder="Food Limit"
                      onChange={this.handleChange}
                      value={this.state.limit}
                    />
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="clearfix">
                <Button
                  disabled={!isValidated}
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

export default FoodsInput;
