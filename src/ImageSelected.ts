import {html, css, LitElement} from 'lit'
import {property} from 'lit/decorators.js'
import {ImagePickEvent} from './ImagePicker'


export class ImageSelected extends LitElement {
    static styles = css`
    :host {
    }

    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    p {
        padding: 12px;
    }

    .imgContainer {
        width: 150px;
        height: 150px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 12px;
    }
    .imgContainer img{
        object-position: center;
        object-fit: cover;
        height: 150px;
        width: 150px;
    }
    .imgRemove {
        background: transparent;
        position: absolute;
        top: 0;
        right: 0;
        border: none;
        -webkit-appearance: none;
        padding: 0;
        cursor:pointer;
    }
    .imgRemove svg {
        filter: drop-shadow( 2px 2px 3px rgba(83,85,89, .7));
        transition: all .15s ease-in-out;
    }
    .imgRemove:hover svg{
        filter: drop-shadow( 2px 2px 3px rgba(83,85,89, .7)) brightness(80%);
    }

    @media (prefers-color-scheme: dark) {

    }

    `

    @property({attribute: false}) images: File[] = []
    @property({type: Boolean}) canAddImages: boolean = true

    __onImagePick(event: ImagePickEvent) {
        const files = event.detail.files
        const detail = {
            files
        }
        const newEvent = new CustomEvent('addimage', {detail, bubbles: true, composed: true, cancelable: true})
        this.dispatchEvent(newEvent)
    }

    __onImageRemove(image: File) {
        return () => {
            const index = this.images.findIndex(img => img.name === image.name)

            const detail = {
                index
            }

            const newEvent = new CustomEvent('removeimage', {detail, bubbles: true, composed: true, cancelable: true})
            this.dispatchEvent(newEvent)
        }
    }

    render() {
        const addImageButton = this.canAddImages ? html`
            <image-picker @imagepick=${this.__onImagePick} ?inlineMode=${true}></image-picker>` : null

        return html`
            <div class="container">
                <p>Original image(s)</p>
                ${this.images.map(image => html`
                    <div class="imgContainer">
                        <img width="400" src="${URL.createObjectURL(image)}" alt="">
                        <button class="imgRemove" @click="${this.__onImageRemove(image)}">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 version="1.1" width="24" height="24" viewBox="0 0 24 24" fill="#FFF">
                                <path
                                    d="M17,13H7V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                            </svg>
                        </button>
                    </div>
                `)}
                ${addImageButton}
            </div>
        `
    }
}
