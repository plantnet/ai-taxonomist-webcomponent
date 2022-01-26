import {html, css, LitElement} from 'lit'
import {property} from 'lit/decorators.js'
import './image-picker.js'
import './image-selected.js'
import "file-drop-element"
import {ImagePickEvent} from './ImagePicker'

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
    }

    @media (prefers-color-scheme: dark) {
        :host {
            color: var(--ai-taxonomist-text-color, #CCC);
        }
    }
  `

    @property({type: Array}) imageFiles: File[] = []

    @property({type: String}) serverUrl = 'http://localhost:3000'
    @property({type: Number}) maxImages = 5

    @property({attribute: false})
    identify = {...INIT_IDENTIFY_STATE}


    __onImagePick(e: ImagePickEvent) {
        if(this.identify.loading === LoadingState.Loading) {
            console.warn('Already loading')
            return
        }

        this.imageFiles = e.detail.files
        this.identify.loading = LoadingState.Loading

        const form = new FormData();

        for(let i = 0; i < this.imageFiles.length; i++) {
            form.append('organs', 'auto');
            form.append('images', this.imageFiles[i])
        }

        const url = new URL(this.serverUrl)
        url.pathname = '/v2/identify/all'

        fetch(url.toString(), {
            method: 'POST',
            body: form,
        })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                this.identify.text = json.text
                this.identify.loading = LoadingState.Loaded
                this.requestUpdate()
            })
            .catch(error => {
                console.error(error)
                this.identify.loading = LoadingState.Error
                this.requestUpdate()
            })
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

    render() {
        console.log(this.identify)
        switch(this.identify.loading) {
            default:
            case LoadingState.Idle:
                return html`
                    <image-picker @imagepick=${this.__onImagePick} ></image-picker>
                `
            case LoadingState.Loading:
                return html`
                    <div>Loading...</div>
                `
            case LoadingState.Loaded:
                return html`
                    <image-selected .images=${this.imageFiles}
                                    .canAddImages=${this.imageFiles.length < this.maxImages}
                                    @addimage=${this.__addImages}
                                    @removeimage=${this.__removeImage}>
                    ></image-selected>
                    <div>${this.identify.text}</div>
                `
            case LoadingState.Error:
                return html`
                    <div>Error</div>
                `
        }

    }

    reset() {
        this.identify = {...INIT_IDENTIFY_STATE}
        this.imageFiles = []
        this.requestUpdate()
    }
}
