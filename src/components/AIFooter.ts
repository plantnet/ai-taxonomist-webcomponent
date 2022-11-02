import { html, css, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import './species-list.js'

export class AIFooter extends LitElement {
    static styles = css`
        a {
            margin-top: 12px;
            transition: all 0.15s ease-in-out;
            color: var(--ai-taxonomist-accent-color);
            font-size: 0.9rem;
            margin: 12px 0;
            display: block;
            text-decoration: none;
        }

        a:hover {
            filter: brightness(80%);
        }
    `

    @property({ type: String }) doiUrl: string | null = null

    @property({ type: String }) apiUrl: string | null = null

    @property({ type: Boolean }) displaySpecies: boolean = false

    __displaySpeciesList() {
        this.displaySpecies = true
    }

    render() {
        if (!this.doiUrl) {
            return null
        }

        if (this.displaySpecies) {
            return html`<species-list .apiUrl="${this.apiUrl}"></species-list>`
        }

        return html`<a href="#" title="Open species list" @click="${this.__displaySpeciesList}">Species list</a
            ><a href="${this.doiUrl}" target="_blank" title="Open GBIF DOI"
                >This identification engine has been trained on the GBIF Occurrence Download: ${this.doiUrl}</a
            >`
    }
}
