var syllableInput = [1,5,1,1]; //number of syllables in each word, example input
var syllableOutput = getRhythm(syllableInput);

//gives when each note starts
function getRhythmStarts(syllableArray){//expecting an array of syllable numbers per word from 1 to 8 syllables

  var wordNumber = syllableArray.length; //number of words
  var totalSyllables = syllableArray.reduce(add, 0); //total number of syllables

  if (totalSyllables > 8 || totalSyllables < 1){
    return "not the right number of syllables";
  } else {
    var noteValues = [];//what we're trying to figure out

    for (var i = 0; i < wordNumber; i++){
        noteValues[i] = 1/8; //start each word as an eigth note
    }

  while (noteValues.reduce(add, 0) < 1){ //as long as our measure isn't full yet,
    for (var i = 0; i < wordNumber; i++){ //for each word,
      if (noteValues.reduce(add, 0) < 1 && noteValues[i] < syllableArray[i]/totalSyllables){ //make it longer if it's comparatively short
          noteValues[i] += 1/8;
      }
    }
  }

  noteValues[wordNumber-1] = 1 - noteValues[wordNumber-1];//last note starts at 1-last note time
  for (var i = (wordNumber-2); i >= 0; i--){
    noteValues[i] = noteValues[i+1] - noteValues[i];
  }

    return noteValues;
  }

  function add(a, b) {
      return a + b;
  }

}//end function

//gives how long each note is
function getRhythm(syllableArray){//expecting an array of syllable numbers per word from 1 to 8 syllables

  var wordNumber = syllableArray.length; //number of words
  var totalSyllables = syllableArray.reduce(add, 0); //total number of syllables

  if (totalSyllables > 8 || totalSyllables < 1){
    return "not the right number of syllables";
  } else {
    var noteValues = [];//what we're trying to figure out

    for (var i = 0; i < wordNumber; i++){
        noteValues[i] = 1/8; //start each word as an eigth note
    }

  while (noteValues.reduce(add, 0) < 1){ //as long as our measure isn't full yet,
    for (var i = 0; i < wordNumber; i++){ //for each word,
      if (noteValues.reduce(add, 0) < 1 && noteValues[i] < syllableArray[i]/totalSyllables){ //make it longer if it's comparatively short
          noteValues[i] += 1/8;
      }
    }
  }

    return noteValues;
  }

  function add(a, b) {
      return a + b;
  }

}//end function
//now the rhythm section

//defined manually, probabilities of hits at each of 16 beats:
var kickProbs = [
  1, 0, 1/8, 0,
  1/4, 0, 1/8, 0,
  1/2, 0, 1/8, 0,
  1/4, 0, 1/8, 0
  ];

var snareProbs = [
  1/4, 0, 1/8, 0,
  1/8, 0, 1/2, 0,
  3/4, 0, 1/8, 0,
  1/8, 0, 1/4, 0
  ];

var hatProbs = [
  0.75, 0.08, 0.75, 0.05,
  0.75, 0.08, 0.75, 0.05,
  0.75, 0.08, 0.75, 0.05,
  0.75, 0.08, 0.75, 0.05
  ];

var kickTimes = makeBeat(kickProbs); //example; call makeBeat with the probability pattern you want

//each will be an array of when to trigger the sound in a length-1 measure
function makeBeat(probs){
  var beatArray = []; //thing to be returned
  var currentNote = -1; //variable per note, not per beat
  for (var i = 0; i < 16; i++){//for each of 16 possible beat slots
    var roll = Math.random(); //roll a random number between 0 and 1
    if (roll < probs[i]){ //if we beat the probability for this note,
      currentNote += 1; //a new note!
      beatArray[currentNote] = i/16; //start playing new note at this beat's time
    }
  }
  return beatArray;
}

