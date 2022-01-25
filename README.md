# \<ai-taxonomist>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i ai-taxonomist
```

## Usage

1. Setup server: 
    This part is necessary to use the webcomponent on PlantNet API but you usage may vary if you host your own API.    
    - Build the nginx docker image: `docker build -t nginx-ai-taxo -f Dockerfile --build-arg APIKEY=XXXX .`  Don't forget to get your API key on [PlantNet API](https://my.plantnet.org/).
    - Run the nginx docker image: `docker run -it -d -p 3000:80 nginx-ai-taxo`
2. Import and use the Web Components
```html
<script type="module">
  import 'ai-taxonomist/ai-taxonomist.js';
</script>

<ai-taxonomist serverUrl="http://localhost:3000"></ai-taxonomist>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
