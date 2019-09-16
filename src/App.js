import React from 'react';
//import logo from './logo.svg';
import './App.css';
import {DRUMKIT_BANKS_DATA, DRUMKITS_PATH} from './drumkitsData';

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
    this.importSounds();
    
    this.state ={
      currentDrumkitBankObj: DRUMKIT_BANKS_DATA[0], //assign first drumkit available
      volume: 70, //default
      displayText: "Welcome!",
      displayIsBeingUpdated: false,
      drumkitData : DRUMKIT_BANKS_DATA
    }
    this.onVolumeChange = this.onVolumeChange.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.onChangeDrumkitBank = this.onChangeDrumkitBank.bind(this);
    this.importSounds = this.importSounds.bind(this);
    this.importSounds();
    console.debug("Initialized App component." );
  }

  importSounds(){    
    console.debug("Importing sounds initiated.");
    //prevent double loading to imrove performance
    var alreadyImportedBanks = 0;
    DRUMKIT_BANKS_DATA.forEach((bank, index) => {
      if(bank['soundUrls'] && bank['soundUrls'].length === bank['sounds'].length){
        alreadyImportedBanks++;
      }
    });
    if(alreadyImportedBanks === DRUMKIT_BANKS_DATA.length){
      console.debug("Drumkits were already importerd. Exiting importSounds() to prevent double loading.");
      return;
    }      
    var totalSoundsImported = 0;
    //go through all drumkit banks and then through all sounds available and push on imported module
    for(var bankIndex = 0; bankIndex < DRUMKIT_BANKS_DATA.length; bankIndex++){
      //initialize array of soundUrls containing modules imported by NodeJs require()
      DRUMKIT_BANKS_DATA[bankIndex]['soundUrls'] =[]; 
      for(var soundIndex = 0 ; soundIndex < DRUMKIT_BANKS_DATA[bankIndex]['sounds'].length; soundIndex++ )
      {
        var drumkitBankName =  DRUMKIT_BANKS_DATA[bankIndex]['nameRaw'];
        var soundFileName = DRUMKIT_BANKS_DATA[bankIndex]['sounds'][soundIndex];
        console.debug("Importing sound with URL: " + DRUMKITS_PATH + drumkitBankName + "/" + soundFileName + ".mp3");
        var currentModuleUrl = require(DRUMKITS_PATH + drumkitBankName + "/" + soundFileName + ".mp3");
        DRUMKIT_BANKS_DATA[bankIndex]['soundUrls'][soundIndex] = currentModuleUrl;
        totalSoundsImported++;
      }
    }
    console.debug("Succesfully imported " + totalSoundsImported + " sounds to memory.");
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

class DrumPads extends React.Component{

  render(){
    var drumPadKeys = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
    var sounds = this.props.selectedDrumkitBank['sounds'];
    var drumPadsToGenerate= [];
    console.debug("Generating drum pads");
    drumPadKeys.forEach((element,index) => {
      drumPadsToGenerate.push(
        <DrumPad drumKey={element} key={element} 
          soundBank={this.props.selectedDrumkitBank['nameRaw']} 
          soundType={sounds[index]} 
          soundUrlStatic={this.props.selectedDrumkitBank['soundUrls'][index]} 
        />
      );
    });
    return <div id="drum-pads-constianer">{drumPadsToGenerate}</div>
  }
}

class DrumPad extends React.Component{
  constructor(props){
    super(props);
    console.debug("DrumPad.constructor() Started");
    this.state =
    {
      soundUrlMod: this.props.soundUrlStatic,
      drumKey: props.drumKey,
      currentSoundBank: props.soundBank
    }
    this.handleClick = this.handleClick.bind(this);
    console.debug("DrumPad.constructor() Finished")
  }

  handleClick(i){
    var audio =  document.getElementById("drumpad-audio-key-" + this.state.drumKey);
    audio.play();
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.soundBank !== prevProps.soundBank){
      this.setState({
        soundUrlMod: this.props.soundUrlStatic,
        currentSoundBank: this.props.soundBank
      });
    }
    //reload the audio source
    var audio =  document.getElementById("drumpad-audio-key-" + this.state.drumKey);
    audio.load();
  }


  render(){     
    return (
    <button className="drum-pad" id={"drumpad-key" + this.state.drumKey} onClick={this.handleClick}>
      {this.state.drumKey}
      <audio id={"drumpad-audio-key-"+this.state.drumKey}>
        <source src={this.props.soundUrlStatic} type="audio/mpeg"/>
        Your browser does not support the audio element.
      </audio>
    </button>
    )
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
