import React, { Component } from 'react';
import {
  Button,
  Container,
  Row,
  Col,
  Input,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import axios from 'axios';
import config from '../../config';
import LoadingModal from '../../Modules/Modal';

import { Link } from 'react-router-dom';

const url = config.server.url;

class FindResults extends Component {
  state = {
    loading: false,
    viewMode: false,
    selectedFood: '',
    locationList: [],
    selectedLocation: {}
  };

  setLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  setViewMode = isViewing => {
    this.setState({
      viewMode: isViewing
    });
  };

  async componentDidMount() {
    this.setLoading(true);
    const locationDoc = await this.getFoodLocations();
    console.log(locationDoc.message);
    const locations = locationDoc.places;

    this.setState({
      selectedFood: locationDoc.food,
      locationList: locations
    });
    this.setLoading(false);
  }

  getFoodLocations = async () => {
    try {
      const { foodName, location } = this.props.prevFormData;
      const response = await axios.get(url('/place/getplaces'), {
        params: {
          food: foodName,
          location: location
        }
      });
      if (response.status !== 200) throw response.data;

      return response.data;
    } catch (err) {
      err.catch(error => console.log(error));
      return { err: err.message };
    }
  };

  handleItemClick = e => {
    const locationId = e.target.name;
    console.log(e.target);
    const location = this.state.locationList.find(
      location => location.place_id === locationId
    );

    this.setState({
      selectedLocation: location
    });
    this.setViewMode(true);

    return false;
  };

  renderLocations = () => {
    const locations = this.state.locationList;
    if (!locations || locations.length <= 0) return <p>No locations found</p>;
    // TODO: Put onclick on this
    return (
      <ListGroup className="Food-locations">
        {locations.map((location, index) => {
          return (
            <LocationItem
              onClick={this.handleItemClick}
              key={`location-item-${index + 1}`}
              {...location}
            />
          );
        })}
      </ListGroup>
    );
  };

  render() {
    const selectedLocation = this.state.selectedLocation;

    return (
      <>
        <Container>
          <Row>
            <Col>
              <p className="lead">
                Locations where you can eat {this.state.selectedFood}:
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              {/* Container for list of food locations  */}
              {this.renderLocations()}
            </Col>
          </Row>
        </Container>
        <LoadingModal isOpen={this.state.loading} />
        <LocationModal
          toggle={this.setViewMode}
          isOpen={this.state.viewMode}
          {...selectedLocation}
        />
      </>
    );
  }
}

class LocationItem extends Component {
  render() {
    const {
      name,
      place_id,
      formatted_address,
      geometry,
      rating,
      photos
    } = this.props;

    return (
      <ListGroupItem
        name={place_id}
        onClick={this.props.onClick}
        tag="a"
        action
      >
        <ListGroupItemHeading>{name}</ListGroupItemHeading>
        <ListGroupItemText>{formatted_address}</ListGroupItemText>
        <ListGroupItemText>Rating: {rating || 'N/A'}</ListGroupItemText>
      </ListGroupItem>
    );
  }
}

class LocationModal extends Component {
  openNewTab = e => {
    const address = this.props.formatted_address;
    const extUrl = `https://maps.google.com.my/?q=${address}`;

    window.open(extUrl);
  };

  render() {
    const { name, formatted_address, geometry, rating, photos } = this.props;
    const toggle = this.props.toggle;

    return (
      <Modal isOpen={this.props.isOpen} centered>
        <ModalHeader toggle={() => toggle(false)}>Location Details</ModalHeader>
        <ModalBody>
          <h5>{name}</h5>
          <p className="lead">{formatted_address}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.openNewTab}>
            Open in Maps
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default FindResults;
