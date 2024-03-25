
const config = require('config');

/**
* Return the first part of text for the help command
* @return {String} text for the help command
*/
function helpText1() {
  return '\nPart 1:\n \
$$awdocs \n\tDescription: This command uses AI to read Alien World documents and answer questions about them. For now that only includes info about the Technical Blueprint. The Alien Worlds Technical Blueprint contains detailed information about the fictional universe of Alien Worlds, created by Dacoco in January 2020. It provides background knowledge and descriptions of various alien races, their home planets, physical characteristics, unique abilities, and cultural traits. The document also explains the significance of Trilium, a vital bioreactive substance that plays a crucial role in the survivaland advancement of different species. Additionally, it discusses the formation of the galactic federation, the rise of Megacorps and Syndicates, and the ongoing search for new Trilium sources across the galaxy.\n \
- Example: $$awdocs How do the mining pools fill with tlm?\n\n \
$$daoapi \n\tDescription: This command uses AI to return answers in human readable form related to the Alienworlds DAO API’s. Topics covered include DAC’s, member profiles, custodians by planets, candidates by planet, and voting history from candidates/custodians perspective or from the voter’s perspective. If asking about any of those topics, make sure you pass in any pertinent information needed to make your request.\n \
- Example: $$daoapi Who are the custodians for the dac naron?\n';
}

/**
* Return the second part of text for the help command
* @return {String} text for the help command
*/
function helpText2() {
  return '\nPart 2:\n \
$$miningapi\n\tDescription: This command uses AI to return answers in human readable form related to the Alienworlds Mining API’s. Topics covered include mines, assets, nfts, mineluck, and tlm token. If asking about any of those topics, make sure you pass in any pertinent information needed to make your request.\n \
- Example: $$miningapi How much did i2lam.wam mine last month?\n\n \
$$lore \n\tDescription: This command uses an LLM specifically trained to answer questions about Alienworld’s lore. This includes information about the different alien races, the planets they inhabit, and the technology they use. It can also provide details about the history and culture of each race, as well as their interactions with each other.\n \
- Example: $$lore What are the different Triactor cartridges and their effects?\n\n \
$$stats \n\tDescription: Get information about the queries that have been made to Lynx. This includes 24-hour, 7-day, and 30-day queries for the community and the user.\n \
        \n \
To see more examples of possible queries, use the $$questions command.\n \
        \n \
We love squashing bugs! If you find one, please submit it here:\n https://github.com/cpu4youu/lynx-chatbot/issues';
}

/**
* Return the text for the examples command
* @return {String} text for the examples command
*/
function examplesText() {
  return '\nHere are a few examples of questions I can answer for you: \n\
- Using $$daoapi Who are the custodians on kavian? \n\
- Usins $$daoapi Who are the custodians for the dac naron? \n\
- Using $$daoapi Who were the last 5 people to vote for 42lra.wam on dac naron? \n\
- Using $$daoapi Who are the candidates on dac magor? \n\
- Using $$daoapi Who did t1dbe.wam vote for the last 2 times on dac naron? \n\
- Using $$miningapi How much did t1dbe.wam mine last month? \n\
- Using $$miningapi How much token is circulating? \n\
- Using $$miningapi What is the token supply? \n\
- Using $$awdocs How do the mining pools fill with tlm? \n\
- Using $$awdocs What is alienworlds? \n\
- Using $$awdocs How do I play alienworlds? \n\
- Using $$awdocs What is triactors? \n\
- Using $$awdocs What are Khaureds? \n\
- Using $$awdocs What are Elgem? \n\
- Using $$awdocs What are Altans? \n\
- Using $$lore How does Trilium work? \n\
- Using $$lore What are the different Triactor cartridges and their effects? \n\
- Using $$lore What are the primary races in the Alien Worlds universe? \n\
- Using $$lore What is the history of the Altans? \n';
}

/**
* Return the text for the daoApi documentation
* @return {String} text for the daoApi documentation
*/
function daoApiText() {
  return `USE THIS API URL: ${config.get('DAO_API_URL')}/v2/dao/

The API endpoint /{dacId}/custodians fetches information about a planet's current custodians. The planets' DAC ID's are as follows: naron has dacId naron, eyeke has dacId eyeke, veles has dacId veles, neri has dacId nerix, magor has dacId magor, kavian has dacId kavian

Parameter       Format        Required        Default Description       Example
dacId	        String        Yes       This parameter accepts a string with the dacId to filter the list.       Example: ${config.get('DAO_API_URL')}/v2/dao/nerix/custodians




The API endpoint /dacs fetches information about about DACs, also known as planets. Lists all available DACs along with their respective detailed information e.g. balance, statistics and globals.
dacId	        String        No       Filter the list by dacId       Example: ${config.get('DAO_API_URL')}/v2/dao/dacs?dacId=eyeke
limit	        Integer        No       Maximum items to return. Minimum of 1       Example: ${config.get('DAO_API_URL')}/v2/dao/dacs?limit=2




The API endpoint /{dacId}/profile fetches information about a user's profile on a planet.

Parameter       Format        Required        Default Description       Example
account	        String        Yes       This parameter accepts the string with the account's to fetch. It can accept multiple accounts separated by a comma.      Example: ${config.get('DAO_API_URL')}/v2/dao/nerix/profile?account=suzqu.wam%2Cmgaqy.wam
dacId	        String        Yes       This path parameter accepts the string with the planet's ID.       Example: ${config.get('DAO_API_URL')}/v2/dao/nerix/profile?account=suzqu.wam%2Cmgaqy.wam




The API endpoint /{dacId}/candidates fetches information about candidates on a planet.

Parameter       Format        Required        Default Description       Example
dacId	        String        Yes       This path parameter accepts the string with the planet's ID.       Example: ${config.get('DAO_API_URL')}/v2/dao/nerix/candidates




The API endpoint /candidates_voters_history fetches information about the last accounts or people that voted for a specified account on a specified dacID

Parameter       Format        Required        Default Description       Example

dacId	        String        Yes       This parameter accepts the string with the planet's ID.       Example: ${config.get('DAO_API_URL')}/v2/dao/candidates_voters_history?dacId=nerix&candidateId=t1dbe.wam&skip=0&limit=4
candidate	        String        Yes       This parameter accepts the string with the wallet Id of the candidate or custodian.       Example: ${config.get('DAO_API_URL')}/v2/dao/candidates_voters_history?dacId=nerix&candidateId=t1dbe.wam&skip=0&limit=4
skip	        Integer        No       This parameter accepts an integer to represent the number of items to skip over and not receive.       Example: ${config.get('DAO_API_URL')}/v2/dao/candidates_voters_history?dacId=nerix&candidateId=t1dbe.wam&skip=0
limit	        Integer        No       Maximum items to return. Minimum of 1       Example: ${config.get('DAO_API_URL')}/v2/dao/candidates_voters_history?dacId=nerix&candidateId=t1dbe.wam&skip=0&limit=4




The API endpoint /voting_history gets voting history for 1 account - to see who they voted for in the past

Parameter       Format        Required        Default Description       Example

dacId	        String        Yes       This parameter accepts the string with the planet's ID.       Example: ${config.get('DAO_API_URL')}/v2/dao/voting_history?dacId=nerix&voter=.1uqy.wam&skip=0&limit=100
voter	        String        Yes       This parameter accepts the string with the wallet Id of the voter.       Example: ${config.get('DAO_API_URL')}/v2/dao/voting_history?dacId=nerix&voter=.1uqy.wam&skip=0&limit=100
skip	        Integer        No       This parameter accepts the integer to represent the number of items to skip.       Example: ${config.get('DAO_API_URL')}/v2/dao/voting_history?dacId=nerix&voter=.1uqy.wam&skip=0&limit=100
limit	        Integer        No       Maximum items to return. Minimum of 1       Example: ${config.get('DAO_API_URL')}/v2/dao/voting_history?dacId=nerix&voter=.1uqy.wam&skip=0&limit=100
`;
}


/**
* Return the text for the miningApi documentation
* @return {String} text for the miningApi documentation
*/
function miningApiText() {
  return `USE THIS API URL: ${config.get('MINING_API_URL')}/v1/alienworlds/
  
The API endpoint /token fetches information about the token supply or token circulating. Only respond with the url with appropriate parameters, no other text

Parameter       Format        Required        Default Description       Example
type	        String        Yes       This parameter accepts the string "circulating" or "supply" but not both. Circulating fetches the amount of coin currently in circulation that has been given out and suply fetches the total amount of token available.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/token?type=supply




The API endpoint /mines fetches information about mines such as who mined them, when they were mined, how much was mined, what planet the mine is on, etc. Only respond with the url with appropriate parameters, no other text

Parameter       Format        Required        Default Description       Example
miner	        String        No       This parameter accepts the string with the miner's wallet dacID.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/mines?miner=25c4m.c.wam
owner	        String        No       This parameter accepts the string with the land owner's wallet dacID.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/mines?miner=ixqye.wam
limit	        Integer        No       Maximum items to return. Minimum of 1       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/mines?limit=2
sort	        String        No       This parameter accepts the string "asc" or "desc" but not both representing ascending or descending, repectively.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/mines?sort=asc
from	        String        No       This parameter accepts the string start date in ISO format (inclusive) to filter results.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/mines?to=2023-11-13T21:24:33.000Z
to	        String        No       This parameter accepts the string end date in ISO format (exclusive) to filter results.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/mines?from=2023-11-14T21:24:33.000Z
land_id	        String        No       This parameter accepts the string with the land's ID.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/mines?land_id=1099512958384
planet_name	        String        No       This parameter accepts the string with the planet's name which must end in '.world'.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/mines?planet_name=veles.world




The API endpoint /nfts fetches information about nfts using several criteria. Only respond with the url with appropriate parameters, no other text

Parameter       Format        Required        Default Description       Example
miner	        String        No       This parameter accepts the string with the miner's wallet dacID.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/nfts?miner=25c4m.c.wam
template_id	        String        No       This parameter accepts the Wallet template ID of the NFT mined.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/nfts?template_id=19558
limit	        Integer        No       Maximum items to return. Minimum of 1       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/nfts?limit=2
sort	        String        No       This parameter accepts the string "asc" or "desc" but not both representing ascending or descending, repectively.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/nfts?sort=asc
from	        String        No       This parameter accepts the string start date in ISO format (inclusive) to filter results.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/nfts?to=2023-11-13T21:24:33.000Z
to	        String        No       This parameter accepts the string end date in ISO format (exclusive) to filter results.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/nfts?from=2023-11-14T21:24:33.000Z
land_id	        String        No       This parameter accepts the string with the land's ID.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/nfts?land_id=1099512958384
rarity	        String        No       This parameter accepts the string to filter by NFT rarity (Must be Abundant, Common, Rare, Epic, Legendary or Mythical).       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/nfts?rarity=Rare




The API endpoint /asset fetches information about a tool or asset given its tool id or nft id. Only respond with the url with appropriate parameters, no other text

Parameter       Format        Required        Default Description       Example
id	        String        No       This parameter accepts the string with the asset's ID.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/asset?id=1099519964740
owner	        String        No       This parameter accepts the string with the asset owner's wallet dacID.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/asset?owner=mhora.wam
schema	        String        No       This parameter accepts the string with the name of the tool or asset schema.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/asset?schema=tool.worlds
limit	        Integer        No       Maximum items to return. Minimum of 1       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/asset?limit=2




The API endpoint /mineluck fetches information about mineluck by using the from/to dates in ISO format. Only respond with the url with appropriate parameters, no other text

Parameter       Format        Required        Default Description       Example
from	        String        No       This parameter accepts the string start date in ISO format (inclusive) to filter results.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/mineluck?to=2023-11-13T21:24:33.000Z
to	        String        No       This parameter accepts the string end date in ISO format (exclusive) to filter results.       Example: ${config.get('MINING_API_URL')}/v1/alienworlds/mineluck?from=2023-11-14T21:24:33.000Z
`;
}

module.exports = {
  helpText1,
  helpText2,
  examplesText,
  daoApiText,
  miningApiText,
};
