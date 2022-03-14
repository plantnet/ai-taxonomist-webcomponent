import { html, css, LitElement } from 'lit'
// prettier-ignore
// eslint-disable-next-line
import "file-drop-element"
// eslint-disable-next-line
import { FileDropEvent } from 'file-drop-element'
import { property } from 'lit/decorators.js'
import './components/plantnet-brand.js'

export type ImagePickEvent = Event & {
    type: 'imagepick'
    detail: {
        files: File[]
    }
}

const SUPPORTED_IMAGE_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

export class ImagePicker extends LitElement {
    static styles = css`
        file-drop label {
            display: block;
            padding: 25px;
            border-radius: 4px;
            outline: 2px dashed var(--ai-taxonomist-outline);
            outline-offset: -2px;
            transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--ai-taxonomist-background);
        }

        file-drop span {
            margin-left: 4px;
        }
        file-drop.inline label {
            width: 70px;
            height: 70px;
        }

        file-drop.drop-valid label,
        label:hover {
            outline-offset: -15px;
            background-color: var(--ai-taxonomist-background-hover);
        }

        file-drop.drop-invalid label {
            background-color: red;
        }

        plantnet-brand {
            margin-top: 6px;
            display: flex;
            justify-content: flex-end;
        }
    `

    @property({ type: Boolean }) inlineMode: boolean = false

    @property({ type: Boolean }) plantnetBrand: boolean = false

    __onFileDrop(e: FileDropEvent) {
        if (e.files.length) {
            this._dispatchFiles(e.files)
        }
    }

    __onFileUpload(e: Event) {
        if (e.target instanceof HTMLInputElement && e.target.files) {
            const acceptedFiles = Array.from(e.target.files).filter(file =>
                SUPPORTED_IMAGE_FILE_TYPES.includes(file.type)
            )
            if (acceptedFiles.length) {
                this._dispatchFiles(acceptedFiles)
            }
        }
    }

    _dispatchFiles(files: File[]) {
        const detail = {
            files,
        }
        const event = new CustomEvent('imagepick', { detail, bubbles: true, composed: true, cancelable: true })
        this.dispatchEvent(event)
    }

    render() {
        const accept = `${SUPPORTED_IMAGE_FILE_TYPES.join(', ')}, .png, .jpg, .jpeg, .JPG, .JPEG`
        const fileDropClass = this.inlineMode ? 'inline' : ''

        const labelContent = this.inlineMode
            ? html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#535559">
                  <path
                      d="M5,3A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H14.09C14.03,20.67 14,20.34 14,20C14,19.32 14.12,18.64 14.35,18H5L8.5,13.5L11,16.5L14.5,12L16.73,14.97C17.7,14.34 18.84,14 20,14C20.34,14 20.67,14.03 21,14.09V5C21,3.89 20.1,3 19,3H5M19,16V19H16V21H19V24H21V21H24V19H21V16H19Z"
                  />
              </svg>`
            : html`<strong>Choose an image</strong><span> or drag it here</span>.`

        return html`
            <file-drop
                id="dropPhotos"
                multiple=""
                accept="image/*"
                @filedrop="${this.__onFileDrop}"
                class="${fileDropClass}"
            >
                <label for="fileUpload">${labelContent}</label>
                <input
                    hidden
                    id="fileUpload"
                    type="file"
                    placeholder="or click here"
                    multiple
                    accept=${accept}
                    @change="${this.__onFileUpload}"
                />
            </file-drop>
            ${this.plantnetBrand ? html`<plantnet-brand></plantnet-brand>` : ''}
        `
    }
}
