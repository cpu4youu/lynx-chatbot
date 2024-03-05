// yarn add @langchain/openai @langchain/community
const {ChatOpenAI} = require('@langchain/openai');

const {APIChain} = require('langchain/chains');
const {miningApiText} = require('./statictexts.js');

const {z} = require('zod');
const {DynamicStructuredTool} = require('langchain/tools');

const config = require('config');

/**
 * Fetches the answer response to the user's miningAPI-related question
 * @param {String} question - The string quesiton to ask the  LLM.
 * @return {String} The string response to the user question.
 */
async function useMiningApi(question) {
  const llm = new ChatOpenAI({
    openAIApiKey: config.get('OPENAI_API_KEY'),
  });
  console.log(miningApiText());
  const apiChain = APIChain.fromLLMAndAPIDocs(llm, miningApiText());

  const apiTool = new DynamicStructuredTool({
    name: 'externalApiTool',
    description: 'Fetch information from exernal API.',
    schema: z.object({
      question: z.string(),
    }),
    func: async ({question}) => {
      const res = await apiChain.invoke({
        question: `${question}`,
      });
      return res;
    },
  });

  const res = await apiTool.invoke({
    question: `${question}`,
  });

  console.log(res);

  return res.output;
}

exports.useMiningApi = useMiningApi;
