import { html, css, LitElement } from 'lit'

export class AILoader extends LitElement {
    static styles = css`
        :host {
        }
        .loader {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
            animation: fadeIn 2s;
        }
        .loader div {
            position: absolute;
            top: 33px;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background: var(--ai-taxonomist-accent-color);
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
        }
        .loader div:nth-child(1) {
            left: 8px;
            animation: loader1 0.6s infinite;
        }
        .loader div:nth-child(2) {
            left: 8px;
            animation: loader2 0.6s infinite;
        }
        .loader div:nth-child(3) {
            left: 32px;
            animation: loader2 0.6s infinite;
        }
        .loader div:nth-child(4) {
            left: 56px;
            animation: loader3 0.6s infinite;
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        @keyframes loader1 {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        @keyframes loader3 {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(0);
                opacity: 0;
            }
        }
        @keyframes loader2 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(24px, 0);
            }
        }
    `

    render() {
        return html`<div class="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>`
    }
}
