// yarn add @langchain/openai @langchain/community
const {ChatOpenAI} = require('@langchain/openai');

const {APIChain} = require('langchain/chains');
const {daoApiText} = require('./statictexts.js');

const {z} = require('zod');
const {DynamicStructuredTool} = require('langchain/tools');

const config = require('config');

/**
 * Fetches the answer response to the user's daoAPI-related question
 * @param {String} question - The string quesiton to ask the  LLM.
 * @return {String} The string response to the user question.
 */
async function useDaoApi(question) {
  console.log('running useDaoApi script');

  const llm = new ChatOpenAI({
    openAIApiKey: config.get('OPENAI_API_KEY'),
  });

  const apiChain = APIChain.fromLLMAndAPIDocs(llm, daoApiText());

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
  console.log('invoke check');

  const res = await apiTool.invoke({
    question: `${question}`,
  });

  console.log('this is res', res);
  if (res) {
    return res.output;
  } else {
    return null;
  }
}
exports.useDaoApi = useDaoApi;
