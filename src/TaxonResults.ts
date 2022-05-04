import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { round } from './utils/round.js'
import './components/ai-loader.js'
import { GBIF_LOGO } from './utils/icons.js'
import { Results, ResultType } from './utils/types.js'

const getDomainName = (url: string) => {
    const domain = url.split('/')[2]
    return domain.replace('www.', '')
}

export class TaxonResults extends LitElement {
    static styles = css`
        .container {
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.5s ease-in-out;
        }

        .separatorContainer {
            display: flex;
            align-items: center;
        }

        plantnet-brand {
            margin-top: -4px;
        }

        .title {
            flex: 1;
            font-weight: normal;
            display: block;
            overflow: hidden;
            white-space: nowrap;
            margin-top: 12px;
        }

        .title > span {
            position: relative;
            display: inline-block;
            margin-left: calc(16.6667% + 0.2rem);
        }

        .title > span:before,
        .title > span:after {
            content: '';
            position: absolute;
            top: 50%;
            width: 9999px;
            height: 1.5px;
            background: var(--ai-taxonomist-separator-border-color);
        }

        .title > span:before {
            right: 100%;
            margin-right: 10px;
        }

        .title > span:after {
            left: 100%;
            margin-left: 10px;
        }

        ai-loader {
            margin-left: calc(16.6667%);
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .result {
            box-sizing: border-box;
            display: flex;
            flex: 1 1 auto;
            flex-direction: row;
            flex-wrap: wrap;
            margin-right: -0.5rem;
            margin-left: -0.5rem;
            opacity: 0;
            transform: translateY(-20px);
            animation: animateIn 0.3s forwards;
            animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
            transition: border-color 0.3s;
            border-radius: 4px;
            border-left: 5px solid transparent;
        }

        .result:hover {
            border-color: var(--ai-taxonomist-accent-color);
            z-index: 10;
        }

        .result:nth-child(1) {
            animation-delay: 0.05s;
        }
        .result:nth-child(2) {
            animation-delay: 0.1s;
        }
        .result:nth-child(3) {
            animation-delay: 0.15s;
        }
        .result:nth-child(4) {
            animation-delay: 0.2s;
        }
        .result:nth-child(5) {
            animation-delay: 0.25s;
        }
        .result:nth-child(6) {
            animation-delay: 0.3s;
        }
        .result:nth-child(7) {
            animation-delay: 0.35s;
        }
        .result:nth-child(8) {
            animation-delay: 0.4s;
        }
        .result:nth-child(9) {
            animation-delay: 0.45s;
        }

        .col {
            flex: 1 0 0;
            max-width: 100%;
            box-sizing: border-box;
            flex-basis: 0;
        }

        .col-text {
            padding-top: 1.6rem;
        }

        .score {
            padding-right: 0.5rem;
            padding-left: 0.2rem;
            flex-basis: 16.66666667%;
            max-width: 16.66666667%;
            margin-top: 5px;
        }

        .score div {
            border-radius: 30px;
            border: 1.5px solid var(--ai-taxonomist-separator-border-color);
            padding: 0.5rem;
            text-align: center;
            max-width: 4rem;
        }

        .species {
            flex-basis: 25%;
            max-width: 25%;
            padding-right: 0.5rem;
            padding-left: 0.5rem;
        }
        .species p {
            margin: 0;
        }

        .speciesName {
            color: var(--ai-taxonomist-accent-color);
            font-style: italic;
        }
        .speciesName span {
            font-style: normal;
        }

        .family {
            flex-basis: 16.66666667%;
            max-width: 16.66666667%;
            padding-right: 0.5rem;
            padding-left: 0.5rem;
        }

        .family span.familyName {
            text-align: left;
            font-style: italic;
            background-color: var(--ai-taxonomist-separator-border-color);
            border-radius: 4px;
            padding: 0.2rem 0.35rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: block;
        }

        .gbif,
        .url {
            display: flex;
            align-items: center;
            width: 50px;
            border-radius: 4px;
            padding: 0 0.35rem;
            margin-top: 4px;
            background-color: var(--ai-taxonomist-separator-border-color);
            gap: 2px;
            transition: all 0.15s ease-in-out;
            text-decoration: none;
        }

        .url {
            width: 100%;
        }

        .url span {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            color: var(--ai-taxonomist-accent-color);
        }

        .gbif:hover,
        .url:hover {
            filter: brightness(80%);
        }

        .gbif:hover {
            filter: brightness(80%);
        }

        .imgContainer {
            flex-basis: 41.66666667%;
            max-width: 41.66666667%;
            padding-left: 1.2rem;
            display: inline-flex;
            justify-content: flex-start;
            gap: 6px;
            margin-bottom: 6px;
        }

        .imgLink {
            display: flex;
            z-index: 9;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            transform-origin: center;
            border-radius: 4px;
            overflow: hidden;
            height: 100px;
            width: 100px;
        }
        .imgLink:hover {
            cursor: pointer;
            transform: scale(3);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            z-index: 10;
        }

        .imgContainer img {
            object-position: center;
            object-fit: cover;
            aspect-ratio: 1;
            background: var(--ai-taxonomist-background);
            color: transparent;
        }

        @media only screen and (max-width: 48em) {
            .col-text {
                padding-top: 0;
            }

            .score {
                flex-basis: 18%;
                max-width: 18%;
            }

            .species {
                flex-basis: 52%;
                max-width: 52%;
            }

            .family {
                flex-basis: 30%;
                max-width: 30%;
                text-align: end;
            }
            .family span {
                display: inline-block;
            }
            .family .gbif {
                margin-left: auto;
            }

            .imgContainer {
                flex-basis: 100%;
                max-width: 100%;
                justify-content: flex-start;
                margin-top: 12px;
                margin-bottom: 24px;
            }
        }

        @media only screen and (max-width: 38em) {
            .score {
                flex-basis: 25%;
                max-width: 25%;
            }

            .species {
                flex-basis: 75%;
                max-width: 75%;
            }
            .family {
                flex-basis: 100%;
                max-width: 100%;
                text-align: start;
                margin-left: 25%;
                margin-top: 12px;
            }
            .family .gbif {
                margin-left: 0;
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes animateIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `

    @property({ attribute: false }) results: Results = {
        results: [],
    }

    @property({ type: Boolean }) error: string | null = null

    @property({ type: Boolean }) loading: boolean = false

    @property({ type: Boolean }) plantnetBrand: boolean = false

    onAttachmentClick(result: ResultType) {
        return (e: Event) => {
            e.preventDefault()
            const detail = result
            this.dispatchEvent(
                new CustomEvent('aiTaxonomistAttachmentsClick', {
                    detail,
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                })
            )
        }
    }

    render() {
        const template: HTMLTemplateElement | null = <HTMLTemplateElement>(
            document.getElementById('aitaxonomist-attachments-template')
        )
        const loading = this.loading ? html` <ai-loader></ai-loader>` : null
        const error = this.error ? html`<p>${this.error}</p>` : null
        const maxResults = 8
        const hasExtraResults =
            this.results.results.length > maxResults
                ? html`<p>${this.results.results.length - maxResults} more results not displayed</p>`
                : null

        return html`
            <div class="container">
                <div class="separatorContainer">
                    <p class="title"><span>Results</span></p>
                    ${this.plantnetBrand ? html` <plantnet-brand></plantnet-brand>` : ''}
                </div>
                ${loading} ${error} ${this.results.overallScore ? html`<p><b>${this.results.overallScore}</b></p>` : ''}
                <ul>
                    ${this.results.results.slice(0, maxResults).map(
                        result => html`
                            <li class="result">
                                <div class="col col-text score">
                                    <div>${round(result.score * 100)}%</div>
                                </div>
                                <div class="col col-text species">
                                    ${result.taxonName
                                        ? html`<p class="speciesName">
                                              ${!result.formatTaxonName
                                                  ? html` <span>${result.taxonName}</span>`
                                                  : result.taxonName}<span> ${result.author}</span>
                                          </p>`
                                        : ''}
                                    <p>${result.commonNames[0]}</p>
                                    ${result.additionalText ? html`<p>${result.additionalText}</p>` : ''}
                                    ${template
                                        ? html` <div
                                              @click=${this.onAttachmentClick(result)}
                                              @keyDown=${this.onAttachmentClick(result)}
                                          >
                                              ${template.content.cloneNode(true)}
                                          </div>`
                                        : ''}
                                </div>
                                <div class="col col-text family">
                                    ${result.family
                                        ? html`<span title="${result.family}" class="familyName"
                                              >${result.family}</span
                                          >`
                                        : ''}
                                    ${result.gbifUrl
                                        ? html`<a href="${result.gbifUrl}" target="_blank" class="gbif"
                                              >${GBIF_LOGO}
                                              <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="24"
                                                  height="24"
                                                  viewBox="0 0 24 24"
                                              >
                                                  <path
                                                      d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
                                                  />
                                              </svg>
                                          </a>`
                                        : null}
                                    ${result.url
                                        ? html`<a href="${result.url}" target="_blank" class="url"
                                              ><span>${getDomainName(result.url)}</span
                                              ><svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="24"
                                                  height="24"
                                                  viewBox="0 0 24 24"
                                              >
                                                  <path
                                                      d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
                                                  />
                                              </svg>
                                          </a>`
                                        : null}
                                </div>
                                <div class="col imgContainer">
                                    ${result.images.map(
                                        image => html`
                                            <a href="${image.url}" title="${image.alt}" target="_blank" class="imgLink">
                                                <img src="${image.url}" alt="${image.alt}"
                                            /></a>
                                        `
                                    )}
                                </div>
                            </li>
                        `
                    )}
                </ul>
                ${hasExtraResults}
            </div>
        `
    }
}
