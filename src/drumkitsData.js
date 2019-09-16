const DRUMKITS_PATH = './drumkit-banks/';
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

export {DRUMKIT_BANKS_DATA, DRUMKITS_PATH};