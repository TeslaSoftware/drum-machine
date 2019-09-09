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
        <label htmlFor="volume-input">Vol</label>
        <input id="volume-input" type="range" value={this.state.volume} onChange={this.handleChange} name="volume" min="1" max="100" step="1"/>
      </div>
    ); 
  }
}

function DrumPads(props){
  var drumPadKeys = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
  var drumPadsToGenerate= [];
  /*
  for(var i=0; i<3; i++){
    var drumPadsRow = [];
    for(var j=0; j<3; j++){
      var element = drumPadKeys[i*3 + j];
      drumPadsRow.push(<DrumPad id={element} drumKey={element} key={element} />);
    }
    drumPadsToGenerate.push(<div className="drum-pads-row" key={"row #" + i}>{drumPadsRow}</div>)
  }
  */
  drumPadKeys.forEach((element,index) => {
    drumPadsToGenerate.push(<DrumPad id={element} drumKey={element} key={element} />)
  });
  return <div id="drum-pads-constianer">{drumPadsToGenerate}</div>
}

function DrumPad(props){
  return <button className="drum-pad">{props.drumKey}</button>
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

class DrumkitBank extends React.Component{
  render(){
    return <div>
      <input type="radio" name="drumkit-bank" id="drumkit-bank-1" value="drumkit-bank-1" />
      <label htmlFor="drumkit-bank-1">drumkit-bank-1</label>
    </div>
  }
}

export default App;
