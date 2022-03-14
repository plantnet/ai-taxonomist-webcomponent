import { html, css, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

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

    render() {
        if (!this.doiUrl) {
            return null
        }

        return html`<a href="${this.doiUrl}" target="_blank" tile="Open GBIF DOI"
            >This identification engine has been trained on the GBIF Occurrence Download: ${this.doiUrl}</a
        >`
    }
}
