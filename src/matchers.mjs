// some info on this matcher:
// expect(...)   --- uses [^\{\}]+ as a very simple mechanism of matching parens,
//                   which works in combination with the rest of the expression.
// (?:not\.)?    --- so that .not.toX and toX are both grouped as toX
// (to[^\(]*)\(  --- the capturing group, ending with a open bracket.
const matcherMatcher = new RegExp(/expect\([^\{\}]+\)\.(?:not\.)?(to[^\(]*)\(/g);

export const extractMatchers = fileText =>
  Array.from(fileText.matchAll(matcherMatcher))
    .map(match => match[1]);


