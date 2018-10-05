import React, { Component } from 'react';
import VoicePing from 'vp-websocket';
import { auth } from './authentication';
import sharedPreferences from './sharedPreferences';
//const uuidv4 = require('uuid/v4');

let _voicePing;
let _ping;

class App extends Component {

  componentDidMount = () => {

    window.addEventListener("onUpdateConnectionStatus", function(evt) {
      console.log("status updated "+evt.detail);
  }, false);

    var token = sharedPreferences.shared.getAuthUser();
    if(token){
      console.log("Already Logged in");
      const loggedUser = JSON.parse(token);
      this.onLoginSuccessful(loggedUser);
    }else{
      console.log("Not login yet");
    }
  }

  onHandlePingEveryHalfMin = () => {
    _ping =  setInterval(()=>{
      _voicePing.pingWebsocket();
    },30000);
  }

  onLogin = () => {
    auth.autherise(this.onLoginCallback, 'user2@sumanta.com', '1234');
  }

  onLogout = () => {
    sharedPreferences.shared.removeAuthUser();
    console.log("Logout Successfull");
    _voicePing.disConnectWebsocket();
    clearInterval(_ping);
    console.log("disconnect websocket Successfull");
  }

  onLoginCallback = (response) => {
    if (response.status === 200 && response.data) {
      sharedPreferences.shared.setAuthUser(response.data);
      this.onLoginSuccessful(response.data);
      console.log('logged in');
    }else{
      console.log("Some problem occured");
    }
  }

  onLoginSuccessful = (data) => {
    console.log("Login Successfull");
    console.log("Starting connect to Websocket");
    _voicePing = new VoicePing(data,data.socket_url);
    _voicePing.connectToWebsocket();
    this.onHandlePingEveryHalfMin();
  }

doConnectionCheck = () => {
  _voicePing.pingWebsocket();
  console.log('Successfully Ping to Websocket');
}

  render() {
    return (
      <div className="App">
       <h1>Testing Purpose</h1>
       <button onClick={this.onLogin}>Login</button>
       <button onClick={this.onLogout}>Logout</button>
       <button onClick={this.doConnectionCheck}>DoConnectionCheck</button>
      </div>
    );
  }
}

export default App;
