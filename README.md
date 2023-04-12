
<h1 align="center">
    <strong><code> < ai-taxonomist > </code></strong>
</h1>

<h3 align="center">
  <a href="https://plantnet.org/ai-taxonomist-demo/">Demo</a>
  <span> · </span>
  <a href="https://github.com/plantnet/ai-taxonomist">AI Taxonomist Server</a>
  <span> · </span>
  <a href="https://my.plantnet.org/">Pl@ntNet API</a>
  <span> · </span>
  <a href="https://cos4cloud-eosc.eu/services/ai-taxonomist/">Cos4Cloud</a>
</h3>

---
    
# \<ai-taxonomist>

A WebComponent within AI-Taxonomist project to identify plants|frog|anything in any web pages. 

This WebComponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Demo

<b>DEMO: <a href="https://plantnet.org/ai-taxonomist-demo/" target="_blank">plantnet.org/ai-taxonomist-demo/</a></b>
<p align="center">
  <img src="/demo.gif" alt="Demo of the Web Component" />
</p>

## Recommended usage

1. Get an API Key for [Pl@ntNet here](https://my.plantnet.org/).
2. Allow the domains on your Pl@ntNet account, for `http://localhost:8000` for local development or  `https://example.com` for production website [here](https://my.plantnet.org/account/settings).
3. There are several ways to use the web components: 
    1. Within a **web page in HTML** (example: a WordPress or a static website)
    ```html
    <script src="https://unpkg.com/ai-taxonomist/dist/src/index.js?module" type="module"></script>
    <ai-taxonomist apiKey="YOUR_API_KEY"></ai-taxonomist>
    ```
   2. Within a **JavaScript project (React, Vue, Svelte, Angular, etc)**: 
       - a. Install the package: `npm i ai-taxonomist`
       - b. Import the package: `import 'ai-taxonomist';`
       - c. Add the component: `<ai-taxonomist apiKey="YOUR_API_KEY"></ai-taxonomist>`

### Advanced usage

You can also use your own server, for this you can specify the server endpoint like so: 
```
    <ai-taxonomist apiUrl="https://api.example.com/v2/identify" apiKey="XXXXXXXXX"></ai-taxonomist>    
```

    
### Options

- **`apiUrl`**: (default: `https://my-api.plantnet.org/v2/identify/all`) the server url to call, either local or remote  
    Example with a Local url (the server will need to add the API key):  
    ```
    <ai-taxonomist apiUrl="http://localhost:3000"></ai-taxonomist>
    ```
- **`apiKey`**: the API key to use, if not added by the server. On Pl@ntNet API you currently cannot use the apiKey directly due to CORS being checked (so you need to add a proxy at least, cf `server` nginx config).   
    Example for Pl@ntNet:  
    ```
    <ai-taxonomist apiUrl="https://my-api.plantnet.org/v2/identify/all" apiKey="XXXXXXXXX"></ai-taxonomist>
    ```
- **`backendFormat`**: (default: `pn`) backend format of the API: `pn` (PlantNet), `c4c` (Cos4Cloud) or `carp`  (CARPESO)
- **`maxImages`**: The number of images the user can upload for a single identification, default to 5. 
- **`removePlantNetBranding`**: (default: false) if true, the component will not display the PlantNet logo and the link to the PlantNet website. 
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
        alert('Attachments clicked: ' + e.detail.taxonName)
    })
    ```
    The detail will contain the properties listed [on `ResultType`](https://github.com/plantnet/ai-taxonomist/blob/main/src/utils/types.ts#L47). 

### Styling

- Dark Mode: you can override dark mode by specifying either `prefer-dark` or `prefer-light` in the `<ai-taxonomist>` class element. Doing so will either force the dark/light mode to stay in dark/light mode no matter what the user preference is.


## Development / contributions

### Start the development server

```bash
npm start
```

This should open http://localhost:8000 in your browser.

### Linting and formatting

To scan the project for linting and formatting errors, run `npm run lint`

To automatically fix linting and formatting errors, run `npm run format`

### Release
    
Update the version: 
```
npm version major|minor|patch
```

Publish the version pn NPM:
```
npm publish
```
