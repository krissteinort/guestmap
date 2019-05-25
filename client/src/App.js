import React, { Component } from 'react'
import L from 'leaflet';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

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
  });
}

  render() {
  const position = [this.state.location.lat, this.state.location.lng]
  return (
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
  );
}

}

export default App;