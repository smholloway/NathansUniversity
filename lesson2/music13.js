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
  } else if ( musexpr.tag === 'seq' ) {
    return compile( musexpr.left, time ).concat( compile(musexpr.right, endTime(time, musexpr.left)) );
  } else if ( musexpr.tag === 'par' ) {
    return compile( musexpr.left, time ).concat( compile(musexpr.right, time) );
  }
};

var convertPitch = function (note) {
  var letter = note[0],
      octave = note[1];
  if ( letter === 'a' || letter === 'A' ) {
    return 21 + octave * 12;
  } else if ( letter === 'b' || letter === 'B' ) {
    return 23 + octave * 12;
  } else if ( letter === 'c' || letter === 'C' ) {
    return 12 + octave * 12;
  } else if ( letter === 'd' || letter === 'D' ) {
    return 14 + octave * 12;
  } else if ( letter === 'e' || letter === 'E' ) {
    return 16 + octave * 12;
  } else if ( letter === 'f' || letter === 'F' ) {
    return 17 + octave * 12;
  } else if ( letter === 'g' || letter === 'G' ) {
    return 19 + octave * 12;
  }
}

var endTime = function (time, expr) {
  if ( expr.tag === 'note' || expr.tag === 'rest' ) {
    return time + expr.dur;
  } else if ( expr.tag === 'seq' ) {
    return endTime( endTime(time, expr.left), expr.right );
  } else if ( expr.tag === 'par' ) {
    return Math.max( endTime( time, expr.left ) , endTime(time, expr.right) );
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
