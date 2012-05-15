start =
    countrycode

letter =
  [a-z]
    
countrycode =
    one:letter two:letter
      { return one+two; }
