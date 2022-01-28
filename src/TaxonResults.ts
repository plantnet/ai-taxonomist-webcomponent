import {html, css, LitElement} from 'lit'
import {property} from 'lit/decorators.js'
import {round} from './utils/round'
import './components/ai-loader.js'

export type ResultType = {
    score: number,
    speciesName: string,
    author: string,
    family: string,
    commonNames: string[],
    images: ImageType[]
}

export type ImageType = {
    url: string,
    alt: string
}

export class TaxonResults extends LitElement {
    static styles = css`
    :host {
    }

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
    }

    .title  > span {
        position: relative;
        display: inline-block;
        margin-left: calc(16.6667% + 0.2rem);
    }

    .title > span:before,
    .title > span:after {
        content: "";
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

    .result:nth-child(1) { animation-delay: .05s }
    .result:nth-child(2) { animation-delay: .1s }
    .result:nth-child(3) { animation-delay: .15s }
    .result:nth-child(4) { animation-delay: .2s }
    .result:nth-child(5) { animation-delay: .25s }
    .result:nth-child(6) { animation-delay: .3s }
    .result:nth-child(7) { animation-delay: .35s }
    .result:nth-child(8) { animation-delay: .4s }
    .result:nth-child(9) { animation-delay: .45s }

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
    }

    .score div {
        border-radius: 20px;
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
    .speciesName span{
        font-style: normal;
    }

    .family {
        flex-basis: 16.66666667%;
        max-width: 16.66666667%;
        padding-right: 0.5rem;
        padding-left: 0.5rem;
    }

    .family span{
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

    .imgContainer {
        flex-basis: 41.66666667%;
        max-width: 41.66666667%;
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        display: inline-flex;
        justify-content: flex-end;
        gap: 6px;
        margin-bottom: 6px;
    }

    .imgContainer img{
        object-position: center;
        object-fit: cover;
        height: 100px;
        width: 100px;
        marginLeft: 12px;
        border-radius: 4px;
    }

    @media only screen and (max-width: 48em) {
        .col-text {
            padding-top: 0;
        }

        .score {
            flex-basis: 10%;
            max-width: 10%;
        }

        .species {
            flex-basis: 60%;
            max-width: 60%;
        }

        .family {
            flex-basis: 30%;
            max-width: 30%;
            text-align: end;
        }
        .family span{
            display: inline-block;
        }

        .imgContainer {
            flex-basis: 100%;
            max-width: 100%;
            justify-content: flex-start;
            margin-top: 12px;
            margin-bottom: 24px;
        }
    }

    @keyframes fadeIn {
        from { opacity:0; }
        to { opacity:1; }
    }

    @keyframes animateIn {
        from {
            opacity:0;
            transform: translateY(-20px);
        }
        to {
            opacity:1;
            transform: translateY(0);
        }
    }
    `

    @property({attribute: false}) results: ResultType[] = []
    @property({type: Boolean}) error: string | null = null
    @property({type: Boolean}) loading: boolean = false

    render() {
        const loading = this.loading ? html`<ai-loader/>` : null
        const error = this.error ? html`<p>${this.error}</p>` : null
        const maxResults = 8
        const hasExtraResults = this.results.length > maxResults ? html`<p>${this.results.length - maxResults} more results not displayed</p>` : null

        return html`
            <div class="container">
                <p class="title"><span>Results</span></p>
                ${loading}
                ${error}
                <ul>
                    ${this.results.slice(0, maxResults).map(result => html`
                        <li class="result">
                            <div class="col col-text score">
                                <div>${round(result.score * 100)}%</div>
                            </div>
                            <div class="col col-text species">
                                <p class="speciesName">${result.speciesName} <span>${result.author}</span></p>
                                <p>${result.commonNames[0]}</p>
                            </div>
                            <div class="col col-text family">
                                <span>${result.family}</span>
                            </div>
                            <div class="col imgContainer">
                                ${result.images.map(image => html`
                                    <img src="${image.url}" alt="${image.alt}" title="${image.alt}">
                                `)}
                            </div>
                        </li>
                    `)}
                </ul>
                ${hasExtraResults}
            </div>
        `
    }
}
