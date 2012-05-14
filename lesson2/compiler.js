var compile = function (musexpr, time) {
  time = time || 0;

  if ( musexpr.tag === 'note' ) {
    return [{
      tag: 'note',
      pitch: convertPitch( musexpr.pitch ),
      dur: musexpr.dur,
      start: time
    }];
  } else if ( musexpr.tag === 'rest' ) {
    return [{
      tag: 'rest',
      dur: musexpr.dur,
      start: time
    }];
  } else if ( musexpr.tag === 'repeat' ) {
    return repeatSection( musexpr, time );
  } else if ( musexpr.tag === 'seq' ) {
    return compile( musexpr.left, time ).concat( compile(musexpr.right, endTime(time, musexpr.left)) );
  } else if ( musexpr.tag === 'par' ) {
    return compile( musexpr.left, time ).concat( compile(musexpr.right, time) );
  }
};

var repeatSection = function (musexpr, time) {
  var repeatedArray = [];
  for ( var i = 0; i < musexpr.count; i++ ) {
    repeatedArray = repeatedArray.concat( compile(musexpr.section, time) );
    time += musexpr.section.dur;
  }
  return repeatedArray;
};

var convertPitch = function (note) {
  var noteToPitch = { 'a':9, 'b':11, 'c':0, 'd':2, 'e':4, 'f':5, 'g':7 };
  return 12 + noteToPitch[note.charAt(0).toLowerCase()] + note[1] * 12;
};

var endTime = function (time, musexpr) {
  if ( musexpr.tag === 'note' || musexpr.tag === 'rest' ) {
    return time + musexpr.dur;
  } else if ( musexpr.tag === 'repeat' ) {
    return time + musexpr.dur * musexpr.count;
  } else if ( musexpr.tag === 'seq' ) {
    return endTime( endTime(time, musexpr.left), musexpr.right );
  } else if ( musexpr.tag === 'par' ) {
    return Math.max( endTime( time, musexpr.left ) , endTime(time, musexpr.right) );
  }
};


var melody_mus = {
  tag: 'seq',
  left: {
    tag: 'par',
    left: { tag: 'note', pitch: 'c3', dur: 250 },
    right: { tag: 'note', pitch: 'g4', dur: 500 }
  },
  right: {
    tag: 'par',
    left: { tag: 'note', pitch: 'd3', dur: 500 },
    right: { tag: 'note', pitch: 'f4', dur: 250 }
  }
};
var melody_note = [
  { tag: 'note', pitch: 'c3', start: 0, dur: 250 },
  { tag: 'note', pitch: 'g4', start: 0, dur: 500 },
  { tag: 'note', pitch: 'd3', start: 500, dur: 500 },
  { tag: 'note', pitch: 'f4', start: 500, dur: 250 }
];


var notes = compile( melody_mus );
console.log( notes );
