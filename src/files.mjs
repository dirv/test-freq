import fs from "fs";
import path from "path";
import { List } from "immutable";

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

export const discoverTestFiles = () =>
  getTestFilesInDirectory(path.resolve(process.cwd()));

export const readFileAsSingleLineString = fileName =>
  fs.readFileSync(fileName)
    .toString()
    .replace(/\n/g, '')
    .replace(/\r/g, '');

