import { discoverTestFiles, readFileAsSingleLineString } from "./files.mjs";
import { extractTestCaseDescriptions } from "./testCaseDescriptions.mjs";
import { extractMatchers } from "./matchers.mjs";
import { List } from "immutable";

const toOrderedCounts = descriptions =>
  List(descriptions)
    .groupBy(d => d)
    .mapEntries(([d, ds]) => ([d, ds.count()]))
    .sortBy(d => d)
    .reverse();

export const doIt = async () => {
  const files = await discoverTestFiles();

  const extractor = extractMatchers; // TODO: choose

  const extractedValues = files
    .map(readFileAsSingleLineString)
    .flatMap(extractor);

  const counts = toOrderedCounts(extractedValues);

  counts.forEach((count, description) => {
    console.log(`${description},${count}`);
  })
};
