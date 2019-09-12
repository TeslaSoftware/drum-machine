import React from 'react';
//import logo from './logo.svg';
import './App.css';

//limit text to 12 chars
const DRUMKIT_BANKS_DATA = {
  'Alesis_HR16': ['bell', 'clap', 'congo', 'crash', 'hihat', 'kick', 'pop', 'shake', 'snare'],
  'Korg_KR-55': ['claw', 'cowbell', 'cymbal', 'hihat', 'hihat_open', 'kick', 'rim', 'snare', 'tom'],
  'Roland_CR-8000': ['clap', 'claw', 'congo', 'cymbal', 'hihat', 'hihat_open', 'kick', 'rim', 'snare'],
  'Roland_TR-66': ['hihat', 'hihat_open', 'kick', 'percussion', 'percussion_2', 'percussion_3', 'rim', 'snare', 'snare_2'],
  'Yamaha_DX100': ['LFO_noise_C2', 'LFO_noise_C3', 'LFO_noise_C4', 'pink_noise', 'shogakko', 'synth_perc', 'timpani_C4', 'tom', 'tom-tom_2' ]
}

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

//Class to handle storing different drumkit banks and their properties
/*
  name - proper name of drumkit bank
  prefix - directory name where drumkit bank is located
  sound - map of key value pairs -> map<soundProperName, soundFileName>.SoundFileName should not contain file extension At this moment only mp3 files are supported. 
*/

/*
class DrumKitBankClass {  
  constructor(name, dirName, sounds){
    this.name = name;
    this.directoryName = dirName;
    this.sounds = new Map();
  }

  getURL(indexOfDrumkitBank, nameOfSound){
    return this.directoryName + "/" + this.sounds.get(nameOfSound);
  }
}
*/



class App extends React.Component{

  constructor(props){
    super(props);
    this.state ={
      currentDrumkit: "",
      currentDrumkitName: "",
      volume: 70, //default
      displayText: "Welcome!",
      displayIsBeingUpdated: false
    }
    //assign first drumkit available
    for (var prop in DRUMKIT_BANKS_DATA) {
      this.state.currentDrumkitName = prop;
      this.state.currentDrumkit = DRUMKIT_BANKS_DATA[prop];
      break;
    } 
    this.onVolumeChange = this.onVolumeChange.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
  }

  onVolumeChange(newVolume){
    console.log("Changing volume to: " + newVolume);
    this.setState({
      volume: newVolume
    });
    var newMessage = "Volume: " + this.state.volume;
    this.updateDisplay(newMessage, 3000);
  }

  //updates display with new message and clears it after designated delay in ms
  updateDisplay(message, delayInMs){    
    this.setState({
      displayText: message
    });
    if(delayInMs){
      setTimeout(
        function(){
          if(this.state.displayText === message){
            this.setState({
              displayText: ""
            });
          }
        }.bind(this), delayInMs
      );
    }    
  }

  render(){    
    return(
        <div id="drum-machine" className="app-container" >
          <div id="title">Ultimate Drum Machine</div>
          <div className="drum-machine-model">
            DRM-KT 19
          </div>
          <VolumeSlider volume={this.state.volume} onVolumeChange={this.onVolumeChange} />
          <div id="display">{this.state.displayText}</div>
          <DrumPads />
          <DrumkitBanks banks={DRUMKIT_BANKS_DATA}/>
          
        </div>
    );
  }
}

class VolumeSlider extends React.Component{
  constructor(props) {
    super(props);
    //this.state = {volume: 100};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    //this.setState({volume: event.target.value});
    this.props.onVolumeChange(event.target.value);
  }
  
  render(){
    return(
      <div id="volume-slider">
        <label htmlFor="volume-input">VOL</label>
        <input id="volume-input" type="range" value={this.props.volume} onChange={this.handleChange} name="volume" min="1" max="100" step="1"/>
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

  constructor(props){
    super(props);
    this.state={
      banks : props.banks
    }
  }

  render(){
    var drumkitBanksToUse =[];
    
    for(var property in this.state.banks){
      var name = property.replace('_',' ');
      drumkitBanksToUse.push( <DrumkitBank bankName={name} key={property} />)
    }
    
    return <fieldset id="drumkit-banks-container">
      <legend>BANKS</legend>
      <div id="drumkit-banks-radio-container">
        {drumkitBanksToUse}
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
      <label htmlFor="drumkit-bank-1">{this.props.bankName}</label>
    </div>
  }
}

export default App;
