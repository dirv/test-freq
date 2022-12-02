import { argv } from 'node:process';
import { List } from "immutable";
import { discoverTestFiles, readFileAsSingleLineString } from "./files.mjs";
import { extractTestCaseDescriptions } from "./testCaseDescriptions.mjs";
import { extractMatchers } from "./matchers.mjs";

const extractors = {
  "descriptions": extractTestCaseDescriptions,
  "matchers": extractMatchers
};

const usageInstructions = [
  "Use of the following:",
  "",
  ...Object.keys(extractors).map(extractorKey => `npx test-freq ${extractorKey}`)
].join("\n");

const toOrderedCounts = descriptions =>
  List(descriptions)
    .groupBy(d => d)
    .mapEntries(([d, ds]) => ([d, ds.count()]))
    .sortBy(d => d)
    .reverse();

export const doIt = async () => {
  const extractorArg = argv[2];
  if (!extractors[extractorArg]) {
    console.log(usageInstructions);
    return;
  }

  const files = await discoverTestFiles();

  const extractor = extractors[extractorArg];

  const extractedValues = files
    .map(readFileAsSingleLineString)
    .flatMap(extractor);

  const counts = toOrderedCounts(extractedValues);

  counts.forEach((count, description) => {
    console.log(`${description},${count}`);
  })
};
