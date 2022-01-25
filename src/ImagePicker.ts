import {html, css, LitElement} from 'lit'
import "file-drop-element"
import {FileDropEvent} from 'file-drop-element'

export type ImagePickEvent = Event & {
    type: "imagepick",
    detail: {
        files: File[]
    }
}

export class ImagePicker extends LitElement {
    static styles = css`
    :host {
    }

    file-drop label {
        display: block;
        padding: 25px;
        outline: 2px dashed #92b0b3;
        transition: outline-offset .15s ease-in-out, background-color .15s linear;
        cursor:pointer;
    }

    button {
        border: none;
        margin: 0;
        width: auto;
        overflow: visible;
        background: transparent;
        color: inherit;
        font: inherit;
        line-height: normal;
        -webkit-font-smoothing: inherit;
        -moz-osx-font-smoothing: inherit;
        -webkit-appearance: none;
    }

    file-drop.drop-valid label, label:hover {
        background-color: green;
        outline-offset: -25px;
        background-color: #666;
    }

    file-drop.drop-invalid label {
        background-color: red;
    }
    `

    __onFileDrop(e: FileDropEvent) {
        this._dispatchFiles(e.files)
    }

    __onFileUpload(e: Event) {
        if(e.target instanceof HTMLInputElement && e.target.files) {
            this._dispatchFiles(Array.from(e.target.files))
        }
    }

    _dispatchFiles(files: File[]) {
        const detail = {
            files,
        }
        const event = new CustomEvent('imagepick', {detail, bubbles: true, composed: true, cancelable: true})
        this.dispatchEvent(event)
    }

    render() {
        return html`
            <file-drop id="dropPhotos"
                       multiple=""
                       accept='image/*'
                       @filedrop="${this.__onFileDrop}"
            >
                <label for="fileUpload"><strong>Choose an image</strong><span class="box__dragndrop"> or drag it here</span>.</label>
                <button></button>
                <input
                    hidden
                    id="fileUpload"
                    type="file"
                    placeholder="or click here"
                    multiple
                    accept=".png, .jpg, .jpeg, .JPG, .JPEG, image/jpg, image/jpeg, image/png"
                    @change="${this.__onFileUpload}"
                >
            </file-drop>
        `
    }
}
