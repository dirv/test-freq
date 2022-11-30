const fs = require('fs')
const path = require('path')
const { List, Map } = require('immutable')

const testCallMatcher = new RegExp(/\sit\("([^"]+)"/g);

const directoriesToIgnore = [ "node_modules" ];
const extensions = [ ".js", ".jsx", ".ts", ".tsx" ];

const getTestFilesInDirectory = async (dirname) => {
  const dir = await fs.promises.opendir(dirname);
  let testFilePaths = List();
  for await (const dirent of dir) {
    const fullPath = path.resolve(dir.path, dirent.name);
    if (dirent.isDirectory() && !directoriesToIgnore.find(directory => dirent.name === directory)) {
      testFilePaths = testFilePaths.concat(await getTestFilesInDirectory(fullPath));
    } else if (extensions.find(extension => dirent.name.endsWith(extension))) {
      testFilePaths = testFilePaths.push(fullPath);
    }
  }
  return testFilePaths.toArray();
};

const discoverTestFiles = () =>
  getTestFilesInDirectory(path.resolve(process.cwd()));

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


const readFileAsSingleLineString = fileName =>
  fs.readFileSync(fileName)
    .toString()
    .replace(/\n/g, '')
    .replace(/\r/g, '');

const readTestDescriptions = fileText =>
  Array.from(fileText.matchAll(testCallMatcher))
    .map(match => toRelevantTerm(match[1]));

const toOrderedCounts = descriptions =>
  List(descriptions)
    .groupBy(d => d)
    .mapEntries(([d, ds]) => ([d, ds.count()]))
    .sortBy(d => d)
    .reverse();

const doIt = async () => {
  const files = await discoverTestFiles();

  const testDescriptions = files
    .map(readFileAsSingleLineString)
    .flatMap(readTestDescriptions);

  const counts = toOrderedCounts(testDescriptions);

  counts.forEach((count, description) => {
    console.log(`${description},${count}`);
  })
};

doIt();

