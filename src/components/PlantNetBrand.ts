import { html, css, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { POWERED_BY_PLANTNET_DARK, POWERED_BY_PLANTNET_LIGHT } from '../utils/icons.js'

export class PlantNetBrand extends LitElement {
    static styles = css`
        a {
            width: 100px;
            height: 27px;
            border-radius: 4px;
            overflow: hidden;
            display: block;
            transition: all 0.15s ease-in-out;
        }

        a:hover {
            filter: brightness(80%);
        }
    `

    @property({ type: Boolean }) darkMode: boolean = false

    connectedCallback() {
        super.connectedCallback()
        this.darkMode =
            (this.getRootNode() as any).host.classList.contains('prefer-dark') ||
            window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    render() {
        return html` <a href="https://plantnet.org" target="_blank" title="Pl@ntNet"
            >${this.darkMode ? POWERED_BY_PLANTNET_DARK : POWERED_BY_PLANTNET_LIGHT}</a
        >`
    }
}
