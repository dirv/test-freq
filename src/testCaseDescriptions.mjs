const testCallMatcher = new RegExp(/\sit\("([^"]+)"/g);

const toRelevantTerm = description => {
  const words = description.split(" ");
  if (words[0].endsWith("n't")) {
    return words.slice(0, 2).join(" ");
  }
  if (words[1] === "not") {
    return words.slice(0, 3).join(" ");
  }
  if (words[0] === "should") {
    return words.slice(0, 1).join(" ");
  }
  return words.slice(0, 1).join(" ");
};

export const extractTestCaseDescriptions = fileText =>
  Array.from(fileText.matchAll(testCallMatcher))
    .map(match => toRelevantTerm(match[1]));


