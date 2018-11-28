import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Jumbotron,
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardSubtitle,
  CardText
} from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <Jumbotron fluid className="Home-jumbotron" id="jumboheader">
          <Container fluid>
            <h1 className="Home-title">WELCOME TO SIMPLYEAT</h1>
            <p className="Home-subtitle">
              Never have to waste your time to think of what to eat again
            </p>
            <hr className="my-2 Home-separator" />
            <p>
              Simply get any food suggestions you want with just a few clicks
              away
            </p>
            <Button color="primary" to="/food/random" tag={Link} size="lg">
              Get Started
            </Button>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <Col>
              <h1 className="fancy-font-1">Wide Variety of Malaysian Food</h1>
              <p className="fancy-font-1">
                This app has a sufficient number of food in its own database
                that can let you choose whatever food you feel like eating!
              </p>
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <Card>
                <CardImg
                  top
                  width="100%"
                  src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                  alt="Card image cap"
                />
                <CardBody>
                  <CardTitle>Card 1</CardTitle>
                  <CardText>Card 1 Text</CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm="4">
              <Card>
                <CardImg
                  top
                  width="100%"
                  src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                  alt="Card image cap"
                />
                <CardBody>
                  <CardTitle>Card 2</CardTitle>
                  <CardText>Card 2 Text</CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm="4">
              <Card>
                <CardImg
                  top
                  width="100%"
                  src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                  alt="Card image cap"
                />
                <CardBody>
                  <CardTitle>Card 3</CardTitle>
                  <CardText>Card 3 Text</CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
