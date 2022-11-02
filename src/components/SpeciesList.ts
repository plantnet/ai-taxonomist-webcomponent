import { html, css, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { Species } from '../utils/types.js'
import './ai-loader.js'
import { getSpeciesList } from '../utils/getSpeciesList.js'

export class SpeciesList extends LitElement {
    static styles = css`
        ai-loader {
            display: flex;
            justify-content: center;
        }

        input {
            border: none;
            background-color: var(--ai-taxonomist-separator-border-color);
            padding: 10px 12px;
            margin: 12px 0;
            color: var(--ai-taxonomist-text-color);
            width: 100%;
            box-sizing: border-box;
            border-radius: 4px;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        a {
            margin-top: 12px;
            color: var(--ai-taxonomist-accent-color);
            margin: 12px 0;
            display: block;
            border-left: 0 solid transparent;
            text-decoration: none;
            transition: all 0.3s;
            border-radius: 4px;
        }

        a:hover {
            filter: brightness(80%);
            padding-left: 0.5rem;
            border-left: 5px solid var(--ai-taxonomist-accent-color);
            border-color: var(--ai-taxonomist-accent-color);
            z-index: 10;
        }

        .result .bottom {
            margin: 0;
            display: flex;
            align-items: center;
            color: var(--ai-taxonomist-text-color);
        }
        .speciesName {
            margin: 0;
            font-style: italic;
        }
        .speciesName span {
            font-style: normal;
        }
        .family {
            text-align: left;
            font-style: italic;
            background-color: var(--ai-taxonomist-separator-border-color);
            color: var(--ai-taxonomist-text-color);
            border-radius: 4px;
            margin-right: 12px;
            padding: 0.2rem 0.35rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: block;
        }
    `

    @property({ type: String }) apiUrl: string | null = null

    @property({ attribute: false }) species: Species[] = []

    @property({ attribute: false }) displayedSpecies: Species[] = []

    @property({ attribute: false }) filter: string | null = null

    @property({ attribute: false }) error: String | null = null

    connectedCallback() {
        super.connectedCallback()
        ;(async () => {
            if (this.apiUrl) {
                const { species, error } = await getSpeciesList(this.apiUrl)
                this.displayedSpecies = species
                this.species = species
                this.error = error
            }
        })()
    }

    __onSearch(event: any) {
        const filterFields = ['name', 'family', 'authorship', 'genus', 'vernacularName']
        this.filter = (event?.currentTarget?.value || '').trim()

        if (this.filter?.length) {
            const filterValue = this.filter.toLowerCase()
            this.displayedSpecies = this.species.filter((el: Species) => {
                for (const field of filterFields) {
                    // @ts-ignore
                    if (el[field].trim().toLowerCase().includes(filterValue)) {
                        return true
                    }
                }
                return false
            })
        }
    }

    render() {
        if (this.error) {
            return html`<p><b>${this.error || 'Unknown error'}</b></p>`
        }
        if (!this.displayedSpecies.length && !this.filter) {
            return html` <ai-loader></ai-loader>`
        }
        return html` <p>
                <b>${this.species.length}</b> species${this.species.length !== this.displayedSpecies.length
                    ? html` (${this.displayedSpecies.length} displayed)`
                    : html`.`}
            </p>
            <input
                type="text"
                id="search"
                placeholder="Search (species | family | genus | author | name)"
                @change=${this.__onSearch}
                @keyup=${this.__onSearch}
            />
            <ul>
                ${this.displayedSpecies.map(
                    species => html`
                        <li class="result">
                            <a
                                href="https://www.gbif.org/species/${species.species_id}"
                                title="Open on GBIF.org"
                                target="_blank"
                            >
                                ${species.name
                                    ? html`<p class="speciesName">
                                          ${species.name}<span> ${species.authorship}</span>
                                      </p>`
                                    : ''}
                                <p class="bottom">
                                    <span class="family" title="family"> ${species.family}</span>
                                    ${species.vernacularName}
                                </p>
                            </a>
                        </li>
                    `
                )}
            </ul>`
    }
}
