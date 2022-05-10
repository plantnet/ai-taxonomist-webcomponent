import { html, css, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { ImagePickEvent } from './ImagePicker.js'

export class ImageSelected extends LitElement {
    static styles = css`
        .container {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
        }

        .col {
            flex: 1 0 0;
            max-width: 100%;
            box-sizing: border-box;
            flex-basis: 0;
            padding-right: 0.5rem;
            padding-left: 0.5rem;
        }

        .blankSpaceLeft {
            flex-basis: 16.66666667%;
            max-width: 16.66666667%;
        }

        p {
            padding: 0.2rem 1rem 0.2rem 0.2rem;
        }

        .images {
            display: flex;
            flex-wrap: wrap;
            flex: 1;
        }

        .imgContainer {
            width: 120px;
            height: 120px;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            margin-right: 6px;
            margin-bottom: 6px;
            z-index: 10;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            transform-origin: top right;
        }
        .imgContainer:hover {
            cursor: pointer;
            transform: scale(3);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            z-index: 11;
        }
        .imgContainer img {
            object-position: center;
            object-fit: cover;
            height: 120px;
            width: 120px;
        }
        .imgRemove {
            background: transparent;
            position: absolute;
            top: 0;
            right: 0;
            border: none;
            -webkit-appearance: none;
            padding: 0;
            cursor: pointer;
        }
        .imgRemove svg {
            filter: drop-shadow(2px 2px 3px rgba(83, 85, 89, 0.7));
            transition: all 0.15s ease-in-out;
        }
        .imgRemove:hover svg {
            filter: drop-shadow(2px 2px 3px rgba(83, 85, 89, 0.7)) brightness(80%);
        }

        @media only screen and (max-width: 48em) {
            p {
                flex-basis: 100%;
                max-width: 100%;
            }

            .blankSpaceLeft {
                flex-basis: 0;
                max-width: 0;
            }
        }
    `

    @property({ attribute: false }) images: File[] = []

    @property({ type: Boolean }) canAddImages: boolean = true

    __onImagePick(event: ImagePickEvent) {
        const { files } = event.detail
        const detail = {
            files,
        }
        const newEvent = new CustomEvent('addimage', { detail, bubbles: true, composed: true, cancelable: true })
        this.dispatchEvent(newEvent)
    }

    __onImageRemove(image: File) {
        return () => {
            const index = this.images.findIndex(img => img.name === image.name)

            const detail = {
                index,
            }

            const newEvent = new CustomEvent('removeimage', { detail, bubbles: true, composed: true, cancelable: true })
            this.dispatchEvent(newEvent)
        }
    }

    render() {
        const addImageButton = this.canAddImages
            ? html` <image-picker @imagepick=${this.__onImagePick} ?inlineMode=${true}></image-picker>`
            : null

        return html`
            <div class="container">
                <div class="col blankSpaceLeft"></div>
                <p>Original image(s)</p>
                <div class="images">
                    ${this.images.map(
                        image => html`
                            <div class="imgContainer">
                                <a href="${URL.createObjectURL(image)}" target="_blank">
                                    <img width="400" src="${URL.createObjectURL(image)}" alt="" />
                                </a>
                                <button class="imgRemove" @click="${this.__onImageRemove(image)}">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="#FFF"
                                    >
                                        <path
                                            d="M17,13H7V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        `
                    )}
                    ${addImageButton}
                </div>
            </div>
        `
    }
}
