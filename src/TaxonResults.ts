import {html, css, LitElement} from 'lit'
import {property} from 'lit/decorators.js'
import {round} from './utils/round'

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
    }

    p {
        flex: 1;
        font-weight: normal;
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
    }

    .col {
        flex: 1 0 0;
        max-width: 100%;
        box-sizing: border-box;
        flex-basis: 0;
    }

    .score {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        flex-basis: 16.66666667%;
        max-width: 16.66666667%;
    }

    .score div {
        border-radius: 20px;
        border: 1.5px solid #CCC;
        padding: 0.5rem;
        text-align: center;
    }

    .species {
        flex-basis: 25%;
        max-width: 25%;
    }
    .species p {
        margin: 0;
    }

    .speciesName {
        color: #8EB533;
        font-style: italic;
    }
    .speciesName span{
        font-style: normal;
    }

    .family {
        flex-basis: 16.66666667%;
        max-width: 16.66666667%;
    }

    .family span{
        font-style: italic;
        background-color: #CCC;
        border-radius: 4px;
        padding: 0.2rem 0.35rem;
    }

    .imgContainer {
        flex-basis: 41.66666667%;
        max-width: 41.66666667%;
    }

    .imgContainer img{
        object-position: center;
        object-fit: cover;
        height: 100px;
        width: 100px;
        marginLeft: 12px;
        border-radius: 4px;
    }

    @media (prefers-color-scheme: dark) {
        .score div {
            border-color: #666;
        }

        .family span {
            background-color: #666;
        }
    }
    `

    @property({attribute: false}) results: ResultType[] = []

    render() {
        return html`
            <div class="container">

                <p>Results</p>
                <ul>
                    ${this.results.map(result => html`
                        <li class="result">
                            <div class="col score">
                                <div>${round(result.score * 100)}%</div>
                            </div>
                            <div class="col species">
                                <p class="speciesName">${result.speciesName} <span>${result.author}</span></p>
                                <p>${result.commonNames[0]}</p>
                            </div>
                            <div class="col family">
                                <span>${result.family}</span>
                            </div>
                            <div class="col imgContainer">
                                ${result.images.map(image => html`
                                    <img src="${image.url}" alt="${image.alt}">
                                `)}
                            </div>
                        </li>
                    `)}
                </ul>
            </div>
        `
    }
}
