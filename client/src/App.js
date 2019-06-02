import React, { Component } from 'react'
import L from 'leaflet';
import Joi from 'joi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardTitle, CardText, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import './App.css';

//sets initial icon

var myIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41]
});

// sets validation schema

const schema = Joi.object().keys({
  name: Joi.string().regex(/^[-'a-zA-ZÀ-ÖØ-öø-ÿ]{1,100}$/).required(),
  message: Joi.string().min(1).max(500).required()
});

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/messages' : 'prodURLHere';

// sets initial map on page load before users give location

class App extends Component {
  state = {
    location: {
    lat: 51.505,
    lng: -0.09,
    },
    haveUsersLocation: false,
    zoom: 2,
    userMessage: {
      name: '',
      message: ''
    }
  }
componentDidMount() {
  // gets user's location
  navigator.geolocation.getCurrentPosition((position) => {
    this.setState({
      location: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      haveUsersLocation: true,
      zoom: 13
    });
  }, () => {
    // if users deny browser access location, still want to approximate the location.
    // this does so via IP Address API
    fetch('https://ipapi.co/json')
    .then(res => res.json())
    .then(location => {
      console.log(location);
      this.setState({
        location: {
          lat: location.latitude,
          lng: location.longitude
        },
          haveUsersLocation: true,
          zoom: 13,
          userMessage: {
            name: '',
            message: ''
          }
      });
   });
  });
}

formValid = () => {
  const userMessage = {
    name: this.state.userMessage.name,
    message: this.state.userMessage.message
  };
  const result = Joi.validate(userMessage, schema);

  return !result.error && this.state.haveUsersLocation ? true : false;
}

formSubmitted = (event) => {
  event.preventDefault();
  console.log(this.state.userMessage);

  if (this.formValid()) {
    fetch('API_URL', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.userMessage.name,
        message: this.state.userMessage.message,
        latitude: this.state.location.lat,
        longitude: this.state.location.lng,
      })
      .then(res => res.json())
      .then(message => {
        console.log(message);
      })
    })
  }
}

valueChanged = (event) => {
  const { name, value } = event.target;
  this.setState((prevState) => ({
    userMessage: {
      ...prevState.userMessage,
      [name]: value
    }
  })
)}

  render() {
  const position = [this.state.location.lat, this.state.location.lng]
    return (
    <div className="map"> 
      <Map className="map" center={position} zoom={this.state.zoom}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
      this.state.haveUsersLocation ?
      <Marker 
        position={position}
        icon={myIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> : ''
      }
    </Map>
    <Card body className="message-form">
      <CardTitle>Welcome to GuestMap!</CardTitle>
      <CardText>Leave a message from your location!</CardText>
      <CardText>Thanks for visiting!</CardText>
      <Form onSubmit={this.formSubmitted}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            onChange={this.valueChanged} 
            type="text" 
            name="name" 
            id="name" 
            placeholder="Enter your name:" />
        </FormGroup>
        <FormGroup>
          <Label for="message">Message</Label>
          <Input 
            onChange={this.valueChanged}
            type="textarea" 
            name="message" 
            id="message" 
            placeholder="Enter your message:" />
        </FormGroup>
        <Button color="success" type="submit" className="submitButton" disabled={!this.formValid()}>Submit</Button>{' '}
      </Form>
    </Card>
  </div>
  );
 }
}

export default App;