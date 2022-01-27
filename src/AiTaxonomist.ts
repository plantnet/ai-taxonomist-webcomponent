import {html, css, LitElement} from 'lit'
import {property} from 'lit/decorators.js'
import './image-picker.js'
import './image-selected.js'
import './taxon-results.js'
import "file-drop-element"
import {ImagePickEvent} from './ImagePicker'
import {ResultType} from './TaxonResults'
import {identifyRequest} from './utils/identifyRequest'

enum LoadingState {
    Idle,
    Loading,
    Loaded,
    Error,
}

const INIT_IDENTIFY_STATE: {
    loading: LoadingState,
    error: string | null,
    results: ResultType[],
} = {
    loading: LoadingState.Idle,
    error: null,
    results: []
}

export class AiTaxonomist extends LitElement {
    static styles = css`
    :host {
        display: block;
        padding: 25px;
        color: var(--ai-taxonomist-text-color, #535559);
        --ai-taxonomist-separator-border-color: #CCC;
        --ai-taxonomist-accent-color: #8EB533;
        font-size: 1.1rem;

    }

    .innerContainer {
        max-width: 850px;
        margin: auto;
    }

    button {
        display: flex;
        align-items: center;
        appearance: none;
        border: none;
        border-radius: 4px;
        background-color: var(--ai-taxonomist-separator-border-color);
        padding: 0.5rem 0.7rem;
        font-size: 1.1rem;
        cursor: pointer;
        color: inherit;
        transition: all .15s ease-in-out;
        margin-top: 2rem;
        margin-left: calc(16.6667% + 0.2rem);
    }

    button:hover {
        filter: brightness(80%);
    }

    button svg {
        fill: #535559;
        margin-right: 0.2rem;
    }

    @media (prefers-color-scheme: dark) {
        :host {
            --ai-taxonomist-separator-border-color: #666;
            color: var(--ai-taxonomist-text-color, #CCC);
        }
        button svg {
            fill: #CCC;
        }
    }

    @media only screen and (max-width: 48em) {
        button {
            margin-left: 0;
        }
    }
  `

    @property({type: Array}) imageFiles: File[] = []

    @property({type: String}) serverUrl = 'http://localhost:3000'
    @property({type: Number}) maxImages = 5

    @property({attribute: false})
    identify = {...INIT_IDENTIFY_STATE}


    __onImagePick(e: ImagePickEvent) {
        this.imageFiles = e.detail.files

        this.runIdentify()
    }

    __addImages(e: ImagePickEvent) {
        const files = e.detail.files
        if(files) {
            this.imageFiles = [...this.imageFiles, ...Array.from(files)].slice(0, this.maxImages)
            this.runIdentify()
        }
    }

    __removeImage(e: CustomEvent) {
        const index = e.detail.index
        if(index >= 0 && index < this.imageFiles.length) {
            this.imageFiles.splice(index, 1)
            this.imageFiles = [...this.imageFiles]
            if(this.imageFiles.length === 0) {
                this.reset()
            } else {
                this.runIdentify()
            }
        }
    }

    render() {
        console.log(this.identify)
        return html`
            <div class="innerContainer">
                ${this.getInnerContent()}
                </div>
        `
    }

    async runIdentify() {
        if(this.identify.loading === LoadingState.Loading) {
            console.warn('Already loading')
            return
        }

        this.identify.loading = LoadingState.Loading

        const response = await identifyRequest(this.imageFiles, this.serverUrl)

        console.log(response)
        if(typeof response === "string") {
            this.identify.loading = LoadingState.Error
        } else {
            this.identify.loading = LoadingState.Loaded
            this.identify.results = response
        }
        this.requestUpdate()
    }

    getInnerContent () {
        switch(this.identify.loading) {
            default:
            case LoadingState.Idle:
                return html`
                    <image-picker @imagepick=${this.__onImagePick} ></image-picker>
                `
            case LoadingState.Loading:
            case LoadingState.Error:
            case LoadingState.Loaded:
                const body = this.identify.error ? html`<p>Error: ${this.identify.error}</p>` : html`<taxon-results .results=${this.identify.results} ?loading=${this.identify.loading === LoadingState.Loading}/>`

                return html`
                    <image-selected .images=${this.imageFiles}
                                    .canAddImages=${this.imageFiles.length < this.maxImages}
                                    @addimage=${this.__addImages}
                                    @removeimage=${this.__removeImage}>
                    ></image-selected>
                    ${body}
                    <button @click=${this.reset}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#535559"><path d="M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z" /></svg>New identification</button>
                `
        }
    }

    reset() {
        this.identify = {...INIT_IDENTIFY_STATE}
        this.imageFiles = []
        this.requestUpdate()
    }
}
