import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress
} from 'reactstrap';
import React, { Component } from 'react';

class LoadingModal extends Component {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} centered>
        <ModalHeader>Loading</ModalHeader>
        <ModalBody>
          <p>Please wait...</p>
          <Progress animated color="info" value={100} />
        </ModalBody>
      </Modal>
    );
  }
}

export default LoadingModal;
