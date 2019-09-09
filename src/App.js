import React from 'react';
//import logo from './logo.svg';
import './App.css';


/*
function OriginalApp() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

class App extends React.Component{

  state ={

  }

  render(){
    
    return(
        <div id="drum-machine" className="app-container">
          <div id="title">Drum Machine</div>
          <div className="drum-machine-model">
            DRM-KT 19
          </div>
          <VolumeSlider/>
          <div id="display">Display Test! </div>
          <DrumPads />
          <DrumkitBanks />
          
        </div>
    );
  }
}

class VolumeSlider extends React.Component{
  constructor(props) {
    super(props);
    this.state = {volume: 100};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({volume: event.target.value});
  }
  
  render(){
    return(
      <div id="volume-slider">
        <label htmlFor="volume-input">VOL</label>
        <input id="volume-input" type="range" value={this.state.volume} onChange={this.handleChange} name="volume" min="1" max="100" step="1"/>
      </div>
    ); 
  }
}

function DrumPads(props){
  var drumPadKeys = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
  var sounds = ['clap', 'claw', 'congo', 'cymbal', 'hihat', 'hihat_open', 'kick', 'rim', 'snare'];
  var drumPadsToGenerate= [];
  drumPadKeys.forEach((element,index) => {
    drumPadsToGenerate.push(
      <DrumPad drumKey={element} key={element} soundBank="Roland_CR-8000" soundType={sounds[index]} />
    )
  });
  return <div id="drum-pads-constianer">{drumPadsToGenerate}</div>
}

class DrumPad extends React.Component{
  constructor(props){
    super(props);
    const DRUMKITS_PATH = './drumkit-banks/';
    this.state =
    {
      soundUrl: require(DRUMKITS_PATH + props.soundBank + "/" + props.soundType + ".mp3"),
      drumKey: props.drumKey
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i){
    console.log("Inside handle click of key: " + this.state.drumKey);
    var audio =  document.getElementById("drumpad-audio-key-" + this.state.drumKey);
    audio.play();
  }

  render(){
    return <button className="drum-pad" id={"drumpad-key" + this.state.drumKey} onClick={this.handleClick}>
      {this.state.drumKey}
      <audio id={"drumpad-audio-key-"+this.state.drumKey}>
        <source src={this.state.soundUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </button>
  }  
}

class DrumkitBanks extends React.Component{

  render(){
    return <fieldset id="drumkit-banks-container">
      <legend>BANKS</legend>
      <div id="drumkit-banks-radio-container">
        <DrumkitBank />
      </div>
    </fieldset>
  }
}

//TO-DO:CSS radio button is native element and cannot be styled. To bypass that need to create custom element. 
//Can reuse checkbox and have DrumkitBanks manage the state which one is selected, to make sure only one is selected.
class DrumkitBank extends React.Component{
  render(){
    return <div>
      <input type="radio" name="drumkit-bank" id="drumkit-bank-1" value="drumkit-bank-1" />
      <label htmlFor="drumkit-bank-1">Roland CR-8000</label>
    </div>
  }
}

export default App;
