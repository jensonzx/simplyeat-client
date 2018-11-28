import React, { Component } from 'react';
import {
  Button,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import axios from 'axios';
import config from '../../config';
import LoadingModal from '../../Modules/Modal';
import Auth from '../../Modules/Auth';
import qs from 'querystring';

const url = config.server.url;

class FoodResult extends Component {
  state = {
    loading: true,
    viewFood: false,
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

  setViewFood = viewing => {
    this.setState({
      viewFood: viewing
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
      const token = Auth.getToken();
      const foodsJson = JSON.stringify(selectedFoods);
      console.log(token);

      let response =
        token &&
        (await axios.post(
          url('/food/addfoodhistory'),
          qs.stringify({ list: foodsJson }),
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        ));
      response =
        response ||
        (await axios.get(url('/food/getrandomfood'), {
          params: {
            list: foodsJson
          }
        }));
      if (response.status !== 200) throw response.data;

      const data = token ? response.data.selectedFood : response.data;

      return data;
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

  viewFood = e => {
    this.setViewFood(true);
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
              <Button
                color="primary"
                className="Food-btn-v"
                onClick={this.viewFood}
              >
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
        <FoodModal
          isOpen={this.state.viewFood}
          toggle={this.setViewFood}
          {...this.state.food}
        />
      </>
    );
  }
}

class FoodModal extends Component {
  state = {
    saved: false,
    saving: false
  };

  setSaving = isSaving => {
    this.setState({
      saving: isSaving
    });
  };

  setSaved = isSaved => {
    this.setState({
      saved: isSaved
    });
  };

  saveFood = async shortId => {
    try {
      const token = Auth.getToken();
      const response = await axios.post(
        url('/food/savefood'),
        qs.stringify({ foodid: shortId }),
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status !== 200) throw response.data;

      return response.data;
    } catch (error) {
      console.log(error.catch && error.catch(err => console.log(err)));
      return { err: error.message };
    }
  };

  saveToFavourites = async () => {
    this.setSaving(true);
    // Save to database

    const data = await this.saveFood(this.props.shortId);
    this.setSaving(false);
    if (data.err) alert('Failed to save to favourites');

    this.setSaved(true);
  };

  render() {
    const { name, types, attributes, description, shortId } = this.props;
    const toggle = this.props.toggle;

    return (
      <Modal size="lg" isOpen={this.props.isOpen} centered>
        <ModalHeader toggle={() => toggle(false)}>Food Details</ModalHeader>
        <ModalBody>
          <h3>{name}</h3>
          <p className="lead">{description}</p>
          {/* TODO: Add clickable buttons */}
          <h5>Types</h5>
          <p>{types && types.map(type => type.name).join(', ')}</p>
          <h5>Attributes</h5>
          <p>{attributes && attributes.map(attr => attr.name).join(', ')}</p>
        </ModalBody>
        <ModalFooter>
          <div className="clearfix" style={{ width: '100%' }}>
            {this.state.saved && (
              <p className="float-left">
                Successfully saved to favourite foods
              </p>
            )}
            <Button
              color="success"
              className="float-right"
              onClick={this.saveToFavourites}
              disabled={this.state.saving === this.state.saved}
            >
              {this.state.saved
                ? 'Saved'
                : this.state.saving
                ? 'Saving'
                : 'Save to Favourites'}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default FoodResult;
