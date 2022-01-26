import {html, css, LitElement} from 'lit'
import {property} from 'lit/decorators.js'
import './image-picker.js'
import "file-drop-element"
import {ImagePickEvent} from './ImagePicker'

enum LoadingState {
    Idle,
    Loading,
    Loaded,
    Error,
}

export class AiTaxonomist extends LitElement {
    static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--ai-taxonomist-text-color, #EEE);
    }
  `

    @property({type: Array}) imageFiles: File[] = []

    @property({type: String}) serverUrl = 'http://localhost:3000'

    @property({attribute: false})
    identify = {
        loading: LoadingState.Idle,
        text: 'Some witty text.',
    }


    __onImagePick(e: ImagePickEvent) {
        console.log("image pick")
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

    render() {
        console.log(this.identify)
        switch(this.identify.loading) {
            default:
            case LoadingState.Idle:
                return html`
                    <image-picker @imagepick=${this.__onImagePick}></image-picker>
                `
            case LoadingState.Loading:
                return html`
                    <div>Loading...</div>
                `
            case LoadingState.Loaded:
                return html`
                    <div>${this.identify.text}</div>
                `
            case LoadingState.Error:
                return html`
                    <div>Error</div>
                `
        }

    }
}
