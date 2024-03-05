const {RecursiveCharacterTextSplitter} = require('langchain/text_splitter');

// yarn add @langchain/openai @langchain/community
const {OpenAIEmbeddings, ChatOpenAI} = require('@langchain/openai');

// yarn add faiss-node
const {FaissStore} = require('@langchain/community/vectorstores/faiss');

const {createRetrievalChain} = require('langchain/chains/retrieval');

const {
  createStuffDocumentsChain,
} = require('langchain/chains/combine_documents');
const {ChatPromptTemplate} = require('@langchain/core/prompts');

const config = require('config');

/**
 * Fetches the answer response to the user's daoAPI-related question
 * @param {String} question - The string quesiton to ask the  LLM.
 * @param {String} docs - The documents for the LLM to interpret.
 * @return {String} The string response to the user question.
 */
async function useDocs(question, docs) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 300,
  });

  const docOutput = await splitter.splitDocuments(docs);
  const vectorStore = await FaissStore.fromDocuments(
      docOutput,
      new OpenAIEmbeddings({
        openAIApiKey: config.get('DOCS_API_KEY'),
        configuration: {
          baseURL: config.get('DOCS_API_URL'),
        },
      }),
  );

  const retriever = vectorStore.asRetriever();

  const llm = new ChatOpenAI({
    openAIApiKey: config.get('DOCS_API_KEY'),
    configuration: {
      baseURL: config.get('DOCS_API_URL'),
    },
  });

  const prompt =
    ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

  <context>
  {context}
  </context>

  Question: {input}`);

  const documentChain = await createStuffDocumentsChain({
    llm: llm,
    prompt,
  });

  const retrievalChain = await createRetrievalChain({
    retriever,
    combineDocsChain: documentChain,
  });

  const result = await retrievalChain.invoke({
    input: `${question}`,
  });

  console.log(result);

  return result;
}

exports.useDocs = useDocs;
