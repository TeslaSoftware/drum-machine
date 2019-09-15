import React from 'react';
//import logo from './logo.svg';
import './App.css';

//limit text of each sound to 12 chars
const DRUMKIT_BANKS_DATA = [
  {
    'nameRaw':'Alesis_HR16',
    'name':'Alesis HR16',
    'sounds': ['bell', 'clap', 'congo', 'crash', 'hihat', 'kick', 'pop', 'shake', 'snare'],
  },
  {
    'nameRaw':'Korg_KR-55' ,
    'name':'Korg KR-55',
    'sounds': ['claw', 'cowbell', 'cymbal', 'hihat', 'hihat_open', 'kick', 'rim', 'snare', 'tom'],
  },
  {
    'nameRaw': 'Roland_CR-8000',
    'name': 'Roland CR-8000',
    'sounds':  ['clap', 'claw', 'congo', 'cymbal', 'hihat', 'hihat_open', 'kick', 'rim', 'snare'],
  },
  {
    'nameRaw':'Roland_TR-66',
    'name': 'Roland TR-66',
    'sounds': ['hihat', 'hihat_open', 'kick', 'percussion', 'percussion_2', 'percussion_3', 'rim', 'snare', 'snare_2'],
  },
  {
    'nameRaw': 'Yamaha_DX100',
    'name': 'Yamaha DX100',
    'sounds': ['LFO_noise_C2', 'LFO_noise_C3', 'LFO_noise_C4', 'pink_noise', 'shogakko', 'synth_perc', 'timpani_C4', 'tom', 'tom-tom_2' ]
  }
]

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
      currentDrumkitBankObj: DRUMKIT_BANKS_DATA[0], //assign first drumkit available
      volume: 70, //default
      displayText: "Welcome!",
      displayIsBeingUpdated: false
    }
    this.onVolumeChange = this.onVolumeChange.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.onChangeDrumkitBank = this.onChangeDrumkitBank.bind(this);
    console.debug("Initialized App component." );
  }

  onVolumeChange(newVolume){
    this.setState({
      volume: newVolume
    });
    var newMessage = "Volume: " + this.state.volume;
    this.updateDisplay(newMessage, 3000);
  }

  onChangeDrumkitBank(newDrumkitBankNameRaw){
    console.debug("Chaning drumkit bank to: " + newDrumkitBankNameRaw);
    //find obj reference to new drumkit by raw name and update state
    var newBankObj;
    for(var idx = 0; idx< DRUMKIT_BANKS_DATA.length; idx++ ){
      if(DRUMKIT_BANKS_DATA[idx]['nameRaw'] === newDrumkitBankNameRaw){
        newBankObj= DRUMKIT_BANKS_DATA[idx];
        this.setState({
          currentDrumkitBankObj: newBankObj
        });
        break;
      }
    }   

    this.updateDisplay(newBankObj['name'], 3000);
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
          <DrumPads selectedDrumkitBank={this.state.currentDrumkitBankObj} />
          <DrumkitBanks banks={DRUMKIT_BANKS_DATA} onChangeDrumkitBank={this.onChangeDrumkitBank}/>
          
        </div>
    );
  }
}



class VolumeSlider extends React.Component{
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
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
  //var sounds = props.currentDrumkitBankObj
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
    
    this.props.banks.forEach((bank, index) => {
      drumkitBanksToUse.push( <DrumkitBank bankName={bank['name']} key={"bank_"+index} bankNameRawValue={bank['nameRaw']} onChangeDrumkitBank={this.props.onChangeDrumkitBank} />)
    });
    return <fieldset id="drumkit-banks-container">
      <legend>BANKS</legend>
      <div id="drumkit-banks-radio-container">
        {drumkitBanksToUse}
      </div>
    </fieldset>
  }
}

class DrumkitBank extends React.Component{

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onChangeDrumkitBank(this.props.bankNameRawValue);
  }

  render(){

    return <div>
      <input type="checkbox" name={this.props.bankNameRawValue} id={this.props.bankNameRawValue} value={this.props.bankName} check={this.props.isChecked} onChange={this.handleChange} />
      <label htmlFor={this.props.bankNameRawValue}>{this.props.bankName}</label>
    </div>
  }
}

export default App;
