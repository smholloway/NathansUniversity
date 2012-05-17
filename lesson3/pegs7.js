var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('peg.js', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// Do a test
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );

assert_eq(parse(""), undefined,
    "don't parse empty string");
assert_eq(parse("atom"), "atom",
    "parse atom");
assert_eq(parse("+"), "+",
    "parse +");
assert_eq(parse("(+ x 3)"), ["+", "x", "3"],
    "parse (+ x 3)");
assert_eq(parse("(+ 1 (f x 3 y))"), 
    ["+", "1", ["f", "x", "3", "y"]],
    "parse (+ 1 (f x 3 y))");
