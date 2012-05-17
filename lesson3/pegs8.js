var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files
var _ = require('underscore');

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');
// Create my parser
var wrapExceptions = function(f) {
    return function(x) {
        try { return f(x); }
        catch(err) { return undefined; }
    };
};
var parse = wrapExceptions(PEG.buildParser(data).parse);

var array_out = function(a) {
   var result = "";
   if (a === undefined) {
      result = "undefined";
   } else if (a instanceof Array) {
      result = "[";
      comma = false;
      for (var i = 0; i < a.length; i++) {
         if (comma) { result += ","; } else { comma = true; }
         result += array_out(a[i]);
      }
      result += "]";
   } else {
      result = "\"" + a + "\"";
   }
   return result;
}
var assert_eq = function(a, b, msg) {
    var type = _.isEqual(a, b) ? "PASSED" : "FAILED";
    console.log(type + ": " + msg);
    console.log("  " + array_out(a));
}


assert_eq(parse(""), undefined,
    "don't parse empty string");
assert_eq(parse("atom"), "atom",
    "parse atom");
assert_eq(parse("+"), "+",
    "parse +");
assert_eq(parse("(+ x 3)"),
    ["+","x","3"],
    "parse (+ x 3)");
assert_eq(parse("(+ 1 (f x 3 y))"), 
    ["+","1",["f","x","3","y"]],
    "parse (+ (1 (f x 3 y))");
assert_eq(parse("(define factorial\n" +
"    (lambda (n)\n" +
"        (if (= n 0) 1\n" +
"            (* n (factorial (- n 1))))))"), 
     ["define","factorial",["lambda",["n"],["if",["=","n","0"],"1",["*","n",["factorial",["-","n","1"]]]]]],
    "multiple line/space factorial");
assert_eq(parse("'x"), 
    ["quote","x"],
    "parse 'x");
assert_eq(parse("'(1 2 '3) ;; testing comments"), 
    ["quote",["1","2",["quote","3"]]],
    "parse '(1 2 '3) ;; testing comments");
assert_eq(parse(";;mixed comments\nx;;here too"),
    "x",
    "parse mixed comments");
