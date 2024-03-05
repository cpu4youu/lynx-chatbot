# Lynx Chatbot

A Discord bot for Alien Worlds data and lore that brings communities together. 

|![Image1](https://github.com/cpu4youu/lynx-chatbot/screenshots/awdocs.png) | ![Image2](https://github.com/cpu4youu/lynx-chatbot/screenshots/lore.png) |
|:---:|:---:|
|![Image1](https://github.com/cpu4youu/lynx-chatbot/screenshots/examples.png) | ![Image2](https://github.com/cpu4youu/lynx-chatbot/screenshots/stats.png) |


## Features

* 7 bot commands: awlore, awdocs, daoapi, miningapi, stats, examples, help
* Multiple model backends: [ChatGPT](https://chat.openai.com/), [text-generation-webui](https://github.com/oobabooga/text-generation-webui)
* Ability to easily add more commands and limit to specific servers
* Separation of local document data for server specific Q&A from models


## Usage

This repo provides a template `Dockerfile` and a structured `default.json` config file to store the application data. The project officially targets Linux as the deployment platform, however the images will also work on Docker Desktop for Windows.


### Pre-Requisites
- docker
- CUDA docker runtime *(optional, for Nvidia GPU-powered inferencing running locally)*

*Ask your favourite LLM how to install and configure `docker`, and the Nvidia CUDA docker runtime for your platform for running a llm locally!*

### Config Arguments

#### Required

- token: Discord bot auth token, used to login to discord services.
- application-id: Discord bot id, used to invite bot to servers. 
- dbConfig: Local database used to store user questions and stats.
- docsInfo: Directory information needed to build local vector database for llm document lookup.
- docsInfo: access: Used to limit which document data can be retrieved from different discord channels.
- OPENAI_API_KEY: Open AI key used to request replies from Chat GPT
- prefixes: Discord message listening command prefix, used to identify user commands from normal messages.
- MINING_API_URL: Endpoint for accessing the Alien Worlds mining api.
- DAO_API_URL: Endpoint for accessing the Alien Worlds dao api.
- LORE_API_URL: Endpoint for accessing the Alien Worlds lore api.

#### Optional

- channels: Discord server channel id, used to limit bot replies to specific server channels.
- DOCS_API_KEY: If using a local LLM, used as a dummy key. Otherwise, set to the same as OPENAI_API_KEY.
- DOCS_API_URL: If using a local LLM, used as the endpoint url. Otherwise, set to an empty string.
- MINING_API_KEY: If using a local LLM, used as a dummy key. Otherwise, set to the same as OPENAI_API_KEY.
- DAO_API_KEY: If using a local LLM, used as a dummy key. Otherwise, set to the same as OPENAI_API_KEY.


### Build
Build the docker container:

`docker build . -t lynx-chatbot:1.0`


### Deploy
Deploy the service(from the project root directory):

`docker run -dt --gpus all --net=host --rm --name lynx lynx-chatbot:1.0`


### Remove
Remove the service:

`docker stop lynx`

## Documentation

Add blog link
Add tutorial link
https://github.com/cpu4youu/lynx-chatbot/wiki


## Contributing

If you would like to contribute to the project, check out the [Contributing guidelines](https://github.com/cpu4youu/lynx-chatbot/wiki/Contributing-guidelines).


## Community

* Alien Worlds Discord: https://discord.gg/alienworlds


## Acknowledgment

In October 2023, [Lisa Chandler](https://www.interplanetaryunconference.com/hackathon) provided a platform to encourage and support our independent work on this project. We used that opportunity to kickstart our project and gather support from the community. 

In November 2023 [Ghubs](https://alienworlds.io/galactic-hubs/) provided us with a generous grant to continue our work based on the Hackathon and to build out a system that all communities could use. We are very grateful to them for this support!

In March 2023 [Ghubs](https://alienworlds.io/galactic-hubs/) awarded us with a Galactic Hubs grant for our work on this chatbot. By building the Alien Worlds lore into our system and bringing the community together we have created an amazing start to bringing llms to Alien Worlds communities


## Document sources 

- https://alienworlds.io/alien-worlds-blockchain-technical-blueprint/
- https://alienworlds.io/blogs/tokenized-lore-series-1-trilium-and-triactor-technology/ Published: 02.07.24
- https://alienworlds.io/blogs/tokenized-lore-series-two-the-altans/ Published: 02.08.24
- https://alienworlds.io/blogs/tokenized-lores-series-3-elgem/ Published: 02.09.24
- https://alienworlds.io/blogs/tokenized-lore-series-4-khaureds/ Published: 02.13.24

Possible document additions:
- https://docs.google.com/spreadsheets/d/1BjpZQfG5JWnL5Vv_YMAi3LYytHJSBwhnLDp0Sc2zHCg/edit#gid=0
- https://alienworlds.io/blog/
- https://explorersstation.alienworlds.io/hc/en-us/categories/1500002100341-Welcome-Center

## Current communities supported

[Alien Worlds](https://discord.gg/alienworlds) 
