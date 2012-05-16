start =
    word
    
word =
    lowercase
  / uppercase

lowercase =
    first:[a-z] rest:[a-z]*
        { return first + rest.join(""); }

uppercase =
    first:[A-Z] rest:[A-Z]*
        { return first + rest.join(""); }
