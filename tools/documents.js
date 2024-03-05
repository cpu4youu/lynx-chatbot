const config = require('config');
const {DirectoryLoader} = require('langchain/document_loaders/fs/directory');
const {PDFLoader} = require('langchain/document_loaders/fs/pdf');
const {
  JSONLoader,
  JSONLinesLoader,
} = require('langchain/document_loaders/fs/json');
const {TextLoader} = require('langchain/document_loaders/fs/text');
const {CSVLoader} = require('langchain/document_loaders/fs/csv');


/**
* Loads the documents as a value to the appropriate key for the documet LLM to read
* @return {Object} docData - object holding key value pairs representing different environments and their corresponding documents
*/
async function loadDocuments() {
  const docData = {};
  const channels = config.get('docsInfo').channels;
  const baseDir = config.get('docsInfo').baseDir;
  for (const channel in channels) {
    const directory = baseDir + channels[channel];
    const loader = new DirectoryLoader(directory, {
      '.json': (path) => new JSONLoader(path, '/texts'),
      '.jsonl': (path) => new JSONLinesLoader(path, '/html'),
      '.txt': (path) => new TextLoader(path),
      '.csv': (path) => new CSVLoader(path, 'text'),
      '.pdf': (path) => new PDFLoader(path),
    });
    const docs = await loader.load();
    docData[channels[channel]] = docs;
  }

  return docData;
}

exports.loadDocuments = loadDocuments;
