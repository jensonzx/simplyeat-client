import axios from 'axios';
import React, { Component } from 'react';
import config from '../../config';
import { Container, Row, Col, Button } from 'reactstrap';
import LoadingModal from '../../Modules/Modal';

// Pages
import FindInput from './FindInput';
import FindResults from './FindResults';

const url = config.server.url;

class FindFood extends Component {
  state = {
    currentFormData: {},
    pageIndex: 0
  };

  updateForm = (nextPageIndex, formData) => {
    this.setState({
      pageIndex: nextPageIndex,
      currentFormData: formData
    });
  };

  getPages = () => {
    const selectedFood = this.props.selectedFood;
    const formData = this.state.currentFormData;
    const index = this.state.pageIndex;
    switch (index) {
      case 0:
        return (
          <FindInput
            pageIndex={0}
            selectedFood={selectedFood}
            updateMethod={this.updateForm}
          />
        );
      case 1:
        return (
          <FindResults
            pageIndex={1}
            prevFormData={formData}
            updateMethod={this.updateForm}
          />
        );
    }
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1 className="display-3">Find Food</h1>
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 10, offset: 1 }}>{this.getPages()}</Col>
        </Row>
      </Container>
    );
  }
}

export default FindFood;
