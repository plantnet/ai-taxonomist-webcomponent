import { html, css, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { round } from './utils/round.js'
import './components/ai-loader.js'

export type ImageType = {
    url: string
    alt: string
}

export type ResultType = {
    score: number
    speciesName: string
    author: string
    family: string
    commonNames: string[]
    images: ImageType[]
    gbifUrl: string | null
}

export class TaxonResults extends LitElement {
    static styles = css`
        .container {
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.5s ease-in-out;
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
            padding-left: 0.5rem;
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

        .family span {
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

        .gbif {
            display: flex;
            width: 50px;
            border-radius: 4px;
            padding: 0 0.35rem;
            margin-top: 4px;
            background-color: var(--ai-taxonomist-separator-border-color);
            gap: 2px;
            transition: all 0.15s ease-in-out;
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

        .imgContainer img {
            object-position: center;
            object-fit: cover;
            aspect-ratio: 1;
            height: 100px;
            width: 100px;
            marginleft: 12px;
            border-radius: 4px;
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

    @property({ attribute: false }) results: ResultType[] = []

    @property({ type: Boolean }) error: string | null = null

    @property({ type: Boolean }) loading: boolean = false

    render() {
        const loading = this.loading ? html`<ai-loader></ai-loader>` : null
        const error = this.error ? html`<p>${this.error}</p>` : null
        const maxResults = 8
        const hasExtraResults =
            this.results.length > maxResults
                ? html`<p>${this.results.length - maxResults} more results not displayed</p>`
                : null

        return html`
            <div class="container">
                <p class="title"><span>Results</span></p>
                ${loading} ${error}
                <ul>
                    ${this.results.slice(0, maxResults).map(
                        result => html`
                            <li class="result">
                                <div class="col col-text score">
                                    <div>${round(result.score * 100)}%</div>
                                </div>
                                <div class="col col-text species">
                                    <p class="speciesName">${result.speciesName} <span>${result.author}</span></p>
                                    <p>${result.commonNames[0]}</p>
                                </div>
                                <div class="col col-text family">
                                    <span title="${result.family}">${result.family}</span>
                                    ${result.gbifUrl
                                        ? html`<a href="${result.gbifUrl}" target="_blank" class="gbif"
                                              ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 433.24 174.64">
                                                  <defs>
                                                      <style>
                                                          .cls-1 {
                                                              fill: #4c9c2e;
                                                          }
                                                          .cls-2 {
                                                              fill: #231f20;
                                                          }
                                                      </style>
                                                  </defs>
                                                  <g id="mark">
                                                      <path
                                                          class="cls-1"
                                                          d="M142.45,184.51c0-34.08,16.63-63.57,66.12-63.57,0,34.15-22.46,63.57-66.12,63.57"
                                                          transform="translate(-65.55 -99.35)"
                                                      />
                                                      <path
                                                          class="cls-1"
                                                          d="M221.74,274a65.16,65.16,0,0,0,23.71-4c0-27-16.09-46.24-44.51-60.13C179.2,198.94,152.43,193.3,128,193.3c10.72-32.15,2.91-72.05-7.47-94-11.5,22.94-18.68,62.28-7.64,94.28-21.68,1.58-38.88,11-46.16,23.48-.55.95-1.65,3-1,3.32s1.36-.57,1.88-1A41.63,41.63,0,0,1,95.8,208.6c23,0,39.27,19.1,50.76,30.58,24.68,24.68,48.8,34.86,75.18,34.81"
                                                          transform="translate(-65.55 -99.35)"
                                                      />
                                                  </g>
                                                  <g id="outlined_logotype" data-name="outlined logotype">
                                                      <path
                                                          class="cls-2"
                                                          d="M316.84,147.33l-12,6.15a4.62,4.62,0,0,1-1.8.75c-.45,0-.9-.3-1.2-1-2.7-6.45-6.6-8.85-10.65-8.85h-9.9a11,11,0,0,0-10.8,10.8v44.4a11,11,0,0,0,10.8,10.8h7.35a10.63,10.63,0,0,0,10.65-10.8v-7.05c0-1-.45-1.5-1.5-1.5h-14.1c-1.05,0-1.5-.45-1.5-1.5V176.73c0-1,.45-1.5,1.5-1.5H315c1,0,1.5.45,1.5,1.5v22.8c0,15.6-11,26.55-27.9,26.55h-7.35c-17.1,0-27.9-11-27.9-26.55v-44.4c0-15.6,10.8-26.55,27.9-26.55h9.9c12.45,0,19.2,5.1,23.7,12.15,1.35,2.25,2.85,4.65,2.85,5.55C317.74,146.73,317.44,147,316.84,147.33Z"
                                                          transform="translate(-65.55 -99.35)"
                                                      />
                                                      <path
                                                          class="cls-2"
                                                          d="M364.54,224.58H330.79c-1.05,0-1.5-.45-1.5-1.5v-91.5c0-1.05.45-1.5,1.5-1.5h33.75c17.1,0,27.9,10.95,27.9,27.9v1.5c0,5.55-3.6,12-7.95,16.2a1.22,1.22,0,0,0,0,2.1c4.35,4.2,7.95,11.4,7.95,16.95V197C392.44,213.93,381.64,224.58,364.54,224.58Zm10.8-68a11,11,0,0,0-10.8-10.8H348c-1.05,0-1.5.45-1.5,1.5v19.95c0,1.05.45,1.5,1.5,1.5h16.5a11,11,0,0,0,10.8-10.8Zm0,38.55a10.63,10.63,0,0,0-10.8-10.65H348c-1.05,0-1.5.45-1.5,1.5v21.3c0,1,.45,1.5,1.5,1.5h16.5a10.75,10.75,0,0,0,10.8-10.8Z"
                                                          transform="translate(-65.55 -99.35)"
                                                      />
                                                      <path
                                                          class="cls-2"
                                                          d="M422.44,224.58H408.19c-1.05,0-1.5-.45-1.5-1.5v-91.5c0-1.05.45-1.5,1.5-1.5h14.25c1.05,0,1.5.45,1.5,1.5v91.5C423.94,224.13,423.49,224.58,422.44,224.58Z"
                                                          transform="translate(-65.55 -99.35)"
                                                      />
                                                      <path
                                                          class="cls-2"
                                                          d="M497.28,145.83H461.59c-1,0-1.5.45-1.5,1.5v19.95c0,1.05.45,1.5,1.5,1.5h29.24c1.05,0,1.5.45,1.5,1.5V183c0,1.05-.45,1.5-1.5,1.5H461.59c-1,0-1.5.45-1.5,1.5v37.05c0,1-.45,1.5-1.5,1.5H444.34c-1,0-1.5-.45-1.5-1.5v-91.5c0-1.05.45-1.5,1.5-1.5h52.94c1.05,0,1.5.45,1.5,1.5v12.75C498.78,145.38,498.33,145.83,497.28,145.83Z"
                                                          transform="translate(-65.55 -99.35)"
                                                      />
                                                  </g></svg
                                              ><svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="24"
                                                  height="24"
                                                  viewBox="0 0 24 24"
                                              >
                                                  <path
                                                      d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
                                                  /></svg
                                          ></a>`
                                        : null}
                                </div>
                                <div class="col imgContainer">
                                    ${result.images.map(
                                        image => html`
                                            <img src="${image.url}" alt="${image.alt}" title="${image.alt}" />
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
