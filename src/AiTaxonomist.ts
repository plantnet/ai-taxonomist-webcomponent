import { html, css, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import './image-picker.js'
import './image-selected.js'
import './taxon-results.js'
import './components/ai-reset-button.js'
import { ImagePickEvent } from './ImagePicker.js'
import { ResultType } from './TaxonResults.js'
import { identifyRequest } from './utils/identifyRequest.js'

enum IdentifyState {
    Idle,
    Loading,
    Loaded,
    Error,
}

const INIT_IDENTIFY_STATE: {
    state: IdentifyState
    error: string | null
    results: ResultType[]
} = {
    state: IdentifyState.Idle,
    error: null,
    results: [],
}

export class AiTaxonomist extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 25px;
            color: var(--ai-taxonomist-text-color, #535559);
            --ai-taxonomist-separator-border-color: #ccc;
            --ai-taxonomist-accent-color: #8eb533;
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
            transition: all 0.15s ease-in-out;
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
                color: var(--ai-taxonomist-text-color, #ccc);
            }
            button svg {
                fill: #ccc;
            }
        }

        @media only screen and (max-width: 48em) {
            button {
                margin-left: 0;
            }
        }
    `

    @property({ type: Array }) imageFiles: File[] = []

    @property({ type: String }) serverUrl = 'http://localhost:3000'

    @property({ type: Number }) maxImages = 5

    @property({ attribute: false }) identify = { ...INIT_IDENTIFY_STATE }

    __onImagePick(e: ImagePickEvent) {
        this.imageFiles = e.detail.files

        this.runIdentify()
    }

    __addImages(e: ImagePickEvent) {
        const { files } = e.detail
        if (files) {
            this.imageFiles = [...this.imageFiles, ...Array.from(files)].slice(0, this.maxImages)
            this.runIdentify()
        }
    }

    __removeImage(e: CustomEvent) {
        const { index } = e.detail
        if (index >= 0 && index < this.imageFiles.length) {
            this.imageFiles.splice(index, 1)
            this.imageFiles = [...this.imageFiles]
            if (this.imageFiles.length === 0) {
                this.reset()
            } else {
                this.runIdentify()
            }
        }
    }

    render() {
        return html` <div class="innerContainer">${this.getInnerContent()}</div> `
    }

    async runIdentify() {
        if (this.identify.state === IdentifyState.Loading) {
            return
        }

        this.identify.error = null
        this.identify.state = IdentifyState.Loading

        const response = await identifyRequest(this.imageFiles, this.serverUrl)

        if (typeof response === 'string') {
            this.identify.state = IdentifyState.Error
            this.identify.error = response
        } else {
            this.identify.state = IdentifyState.Loaded
            this.identify.results = response
        }
        this.requestUpdate()
    }

    getInnerContent() {
        switch (this.identify.state) {
            default:
            case IdentifyState.Idle:
                return html` <image-picker @imagepick=${this.__onImagePick}></image-picker> `
            case IdentifyState.Loading:
            case IdentifyState.Error:
            case IdentifyState.Loaded:
                return html`
                    <image-selected
                        .images=${this.imageFiles}
                        .canAddImages=${this.imageFiles.length < this.maxImages}
                        @addimage=${this.__addImages}
                        @removeimage=${this.__removeImage}
                    >
                        ></image-selected
                    >
                    <taxon-results
                        .results=${this.identify.results}
                        .error=${this.identify.error}
                        ?loading=${this.identify.state === IdentifyState.Loading}
                    ></taxon-results>
                    <ai-button-reset @click=${this.reset}>New identification</ai-button-reset>
                `
        }
    }

    reset() {
        this.identify = { ...INIT_IDENTIFY_STATE }
        this.imageFiles = []
        this.requestUpdate()
    }
}
