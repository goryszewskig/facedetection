import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo  from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';


import './App.css';

const app = new Clarifai.App({
  apiKey: 'e9a772e2d817453385e2f0e3de45cb7e'
 });


const particlesOptions = {
  particles: {
    number: {
      value: 101,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocations = (data) => {
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      console.log(width,height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
  
      }
    });
  }

  displayFaceBoxes = (boxes) => {
    console.log(boxes);
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBoxes(this.calculateFaceLocations(response)))
      .catch(err => console.log(err));
    
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  
  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state ;
    return (
      <div className="App">
      <Particles className='particles'
        params={particlesOptions} 
      />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home'
          ? <div>
             <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
               <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          : (
              route === 'signin' 
              ? <Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
            )
           }
      </div>
    );
  }
}

export default App;
