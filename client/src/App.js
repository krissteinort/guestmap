import React, { Component } from 'react'
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardTitle, CardText, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import './App.css';

var myIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41]
});

class App extends Component {
  state = {
    location: {
    lat: 51.505,
    lng: -0.09,
    },
    haveUsersLocation: false,
    zoom: 2,
  }
componentDidMount() {
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
          zoom: 13
      });
   });
  });
}

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
      <Form>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter your name:" />
        </FormGroup>
        <FormGroup>
          <Label for="message">Message</Label>
          <Input type="text" name="message" id="message" placeholder="Enter your message:" />
        </FormGroup>
      </Form>
    </Card>
  </div>
  );
 }
}

export default App;