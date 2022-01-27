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

const INIT_IDENTIFY_STATE = {
    loading: LoadingState.Idle,
    text: 'Some witty text.',
}

export class AiTaxonomist extends LitElement {
    static styles = css`
    :host {
        display: block;
        padding: 25px;
        color: var(--ai-taxonomist-text-color, #535559);
        --ai-taxonomist-separator-border-color: #CCC;
        font-size: 1.1rem;

    }

    .innerContainer {
        max-width: 850px;
        margin: auto;
    }

    @media (prefers-color-scheme: dark) {
        :host {
            --ai-taxonomist-separator-border-color: #666;
            color: var(--ai-taxonomist-text-color, #CCC);
        }
    }
  `

    @property({type: Array}) imageFiles: File[] = []

    @property({type: String}) serverUrl = 'http://localhost:3000'
    @property({type: Number}) maxImages = 5

    @property({attribute: false})
    identify = {...INIT_IDENTIFY_STATE}


    async __onImagePick(e: ImagePickEvent) {
        if(this.identify.loading === LoadingState.Loading) {
            console.warn('Already loading')
            return
        }

        this.imageFiles = e.detail.files
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

    __addImages(e: ImagePickEvent) {
        const files = e.detail.files
        if(files) {
            this.imageFiles = [...this.imageFiles, ...Array.from(files)].slice(0, this.maxImages)
        }
    }

    __removeImage(e: CustomEvent) {
        console.log("Remove image", e.detail)
        const index = e.detail.index
        if(index >= 0 && index < this.imageFiles.length) {
            this.imageFiles.splice(index, 1)
            this.imageFiles = [...this.imageFiles]
            if(this.imageFiles.length === 0) {
                this.reset()
            }
        }
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
                const body = this.identify.error ? html`<p>Error: ${this.identify.error}</p>` : html`<taxon-results .results=${this.identify.results} />`

                return html`
                    <image-selected .images=${this.imageFiles}
                                    .canAddImages=${this.imageFiles.length < this.maxImages}
                                    @addimage=${this.__addImages}
                                    @removeimage=${this.__removeImage}>
                    ></image-selected>
                    ${body}
                    <button @press="${this.reset()}">Reset</button>
                `
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

    reset() {
        this.identify = {...INIT_IDENTIFY_STATE}
        this.imageFiles = []
        this.requestUpdate()
    }
}
