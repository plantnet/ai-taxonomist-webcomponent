
<h1 align="center">
    <strong><code> < ai-taxonomist > </code></strong>
</h1>

<h3 align="center">
  <a href="https://cos4cloud-eosc.eu/services/ai-taxonomist/">Cos4Cloud</a>
  <span> · </span>
  <a href="https://my.plantnet.org/">API</a>
</h3>

---

# \<ai-taxonomist>

A WebComponent within AI-Taxonomist project to identify plants|frog|anything in any web pages. 

This WebComponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Demo

<p align="center">
    <a href="https://plantnet.org/ai-taxonomist-demo/" target="_blank">plantnet.org/ai-taxonomist-demo/</a>
  <img src="/demo.gif" alt="Demo of the Web Component" />
</p>

## Usage

1. Setup server: 
    This part is necessary to use the [WebComponent](https://developer.mozilla.org/docs/Web/Web_Components) on PlantNet API but your usage may vary if you host your own API.    
    - Build the nginx docker image: `docker build -t nginx-ai-taxo -f Dockerfile --build-arg APIKEY=XXXX .`  Don't forget to get your API key on [PlantNet API](https://my.plantnet.org/).
    - Run the nginx docker image: `docker run -it -d -p 3000:80 nginx-ai-taxo`

2. There is several ways to use the web components: 
    1. Within a **web page in html** (example: a WordPress or a static website)
    ```html
    <script src="https://unpkg.com/ai-taxonomist/dist/src/index.js?module" type="module"></script>
    <ai-taxonomist serverUrl="http://localhost:3000"></ai-taxonomist>
    ```
   2. Within a **JavaScript project (React, Vue, Svelte, Angular, etc)**: 
       - a. Install the package: `npm i ai-taxonomist`
       - b. Import the package: `import 'ai-taxonomist';`
       - c. Add the component: `<ai-taxonomist></ai-taxonomist>`

### Options


- **`apiUrl`**: (default: `https://my-api.plantnet.org/v2/identify/all`) the server url to call, either local or remote  
    Example with a Local url (the server will need to add the API key):  
    ```
    <ai-taxonomist apiUrl="http://localhost:3000"></ai-taxonomist>
    ```
- **`apiKey`**: the API key to use, if not added by the server. On Pl@ntNet API you currently cannot use the apiKey directly due to CORS being checked (so you need to add a proxy at least, cf `server` nginx config).   
    Example for Pl@ntNet:  
    ```
    <ai-taxonomist apiUrl="https://my-api.plantnet.org" apiKey="XXXXXXXXX"></ai-taxonomist>
    ```
- **`maxImages`**: The number of images the user can upload for a single identification, default to 5. 
- **`allowPlantNetBranding`**: (default: true) if true, the component will display the PlantNet logo and the link to the PlantNet website. 
- **Attachments**: You can attach HTML elements to each result, for example if you want to let the user select the correct taxon. This can be achieve using an HTML `<template>` as follows: 
    ```html
     <template id="aitaxonomist-attachments-template">
         <style>
             button {
                border: 1px solid #8888FF;
                background: transparent;
             }
             button:hover {
                filter: brightness(1.2);
             }
         </style>
         <button>SELECT SPECIES</button>
     </template>
    <ai-taxonomist> </ai-taxonomist>
    ```
    You should NOT attach a click listener on your side. The AiTaxonomist component will listen for the click and fire a new event named `aiTaxonomistAttachmentsClick` which contain the selected taxon details in `event.detail`: 
    ```js
    document.addEventListener('aiTaxonomistAttachmentsClick', (e) => {
        alert('Attachments clicked: ' + e.detail.speciesName)
    })
    ```
    The detail will contain the properties listed [here](). 
  
  

## Development / contributions

### Start the development server

```bash
npm start
```

This should open http://localhost:8000 in your browser.

### Linting and formatting

To scan the project for linting and formatting errors, run `npm run lint`

To automatically fix linting and formatting errors, run `npm run format`

### Demoing with Storybook

To run a local instance of Storybook; run `npm run storybook`
To build a production version of Storybook, run `npm run storybook:build`

