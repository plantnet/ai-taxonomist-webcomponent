import { html, css, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import './image-picker.js'
import './image-selected.js'
import './taxon-results.js'
import './components/ai-reset-button.js'
import './components/ai-footer.js'
import { ImagePickEvent } from './ImagePicker.js'
import { getGBIFDoi, identifyRequest } from './utils/identifyRequest.js'
import { BackendFormat, Results } from './utils/types.js'

enum IdentifyState {
    Idle,
    Loading,
    Loaded,
    Error,
}

const INIT_IDENTIFY_STATE: {
    state: IdentifyState
    error: string | null
    results: Results
} = {
    state: IdentifyState.Idle,
    error: null,
    results: {
        results: [],
    },
}

const lightColors = {
    text: '#535559',
    border: '#ccc',
    outline: '#92b0b3',
    background: '#eee',
    backgroundHover: '#ddd',
}
const darkColors = {
    text: '#ccc',
    border: '#666',
    outline: '#888',
    background: '#666',
    backgroundHover: '#999',
}

export class AiTaxonomist extends LitElement {
    static styles = css`
        :host {
            display: block;
            --ai-taxonomist-text-color: ${unsafeCSS(lightColors.text)};
            --ai-taxonomist-separator-border-color: ${unsafeCSS(lightColors.border)};
            --ai-taxonomist-accent-color: #8eb533;
            --ai-taxonomist-outline: ${unsafeCSS(lightColors.outline)};
            --ai-taxonomist-background: ${unsafeCSS(lightColors.background)};
            --ai-taxonomist-background-hover: ${unsafeCSS(lightColors.backgroundHover)};
            color: var(--ai-taxonomist-text-color);
            font-size: 1.1rem;
        }
        :host(.prefer-dark) {
            --ai-taxonomist-text-color: ${unsafeCSS(darkColors.text)};
            --ai-taxonomist-separator-border-color: ${unsafeCSS(darkColors.border)};
            --ai-taxonomist-outline: ${unsafeCSS(darkColors.outline)};
            --ai-taxonomist-background: ${unsafeCSS(darkColors.background)};
            --ai-taxonomist-background-hover: ${unsafeCSS(darkColors.backgroundHover)};
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

        @media (prefers-color-scheme: dark) {
            :host(:not(.prefer-light)) {
                --ai-taxonomist-text-color: ${unsafeCSS(darkColors.text)};
                --ai-taxonomist-separator-border-color: ${unsafeCSS(darkColors.border)};
                --ai-taxonomist-outline: ${unsafeCSS(darkColors.outline)};
                --ai-taxonomist-background: ${unsafeCSS(darkColors.background)};
                --ai-taxonomist-background-hover: ${unsafeCSS(darkColors.backgroundHover)};
            }
        }

        @media only screen and (max-width: 48em) {
            button {
                margin-left: 0;
            }
        }
    `

    @property({ type: Array }) imageFiles: File[] = []

    @property({ type: String }) apiUrl = 'https://my-api.plantnet.org/v2/identify/all'

    @property({ type: String }) apiKey: string | null = null

    @property({ type: Number }) maxImages: number = 5

    @property({ type: Boolean }) removePlantNetBranding: boolean = false

    @property({ type: Boolean }) isPlantNetBranded: boolean = false

    @property({ type: String }) backendFormat: BackendFormat = BackendFormat.PLANTNET

    @property({ attribute: false }) identify = { ...INIT_IDENTIFY_STATE }

    @property({ attribute: false }) doiUrl: string | null = null

    connectedCallback() {
        super.connectedCallback()
        if (
            !this.removePlantNetBranding &&
            (this.apiUrl.includes('https://my-api.plantnet.org') || this.apiUrl.includes('https://c4c.inria.fr'))
        ) {
            this.isPlantNetBranded = true
        }
        ;(async () => {
            this.doiUrl = await getGBIFDoi(this.apiUrl, this.backendFormat)
        })()
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

        this.dispatchEvent(
            new CustomEvent('aiTaxonomistNewIdentification', {
                bubbles: true,
                composed: true,
                cancelable: true,
            })
        )

        const response = await identifyRequest(this.imageFiles, this.apiUrl, this.apiKey, this.backendFormat)

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
                return html`
                    <image-picker
                        @imagepick=${this.__addImages}
                        ?plantnetBrand=${this.isPlantNetBranded}
                    ></image-picker>
                    <ai-footer .doiUrl=${this.doiUrl} .apiUrl=${this.apiUrl}></ai-footer>
                `
            case IdentifyState.Loading:
            case IdentifyState.Error:
            case IdentifyState.Loaded:
                return html`
                    <image-selected
                        .images=${this.imageFiles}
                        .canAddImages=${this.imageFiles.length < this.maxImages}
                        @addimage=${this.__addImages}
                        @removeimage=${this.__removeImage}
                    ></image-selected>
                    <taxon-results
                        .results=${this.identify.results}
                        .error=${this.identify.error}
                        ?loading=${this.identify.state === IdentifyState.Loading}
                        ?plantnetBrand=${this.isPlantNetBranded}
                    ></taxon-results>
                    <ai-button-reset @press=${this.reset}>New identification</ai-button-reset>
                    <ai-footer .doiUrl=${this.doiUrl}></ai-footer>
                `
        }
    }

    reset() {
        this.identify = { ...INIT_IDENTIFY_STATE }
        this.imageFiles = []
        this.requestUpdate()
    }
}
