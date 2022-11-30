import { discoverTestFiles, readFileAsSingleLineString } from "./files.mjs";
import { extractTestCaseDescriptions } from "./testCaseDescriptions.mjs";
import { List } from "immutable";

const toOrderedCounts = descriptions =>
  List(descriptions)
    .groupBy(d => d)
    .mapEntries(([d, ds]) => ([d, ds.count()]))
    .sortBy(d => d)
    .reverse();

export const doIt = async () => {
  const files = await discoverTestFiles();

  const testDescriptions = files
    .map(readFileAsSingleLineString)
    .flatMap(extractTestCaseDescriptions);

  const counts = toOrderedCounts(testDescriptions);

  counts.forEach((count, description) => {
    console.log(`${description},${count}`);
  })
};
