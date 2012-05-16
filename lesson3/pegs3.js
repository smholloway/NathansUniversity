start =
    wordlist

space =
  [ ]

letter =
  [a-z]

wordlist =
    first:word rest:(space word)*
      { return [first].concat(rest.map(function(item){ return item[1]; })); }
        
word =
  first:letter rest:letter*
      { return first + rest.join(""); }
