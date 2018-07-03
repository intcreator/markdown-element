import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { unsafeHTML } from 'lit-html/lib/unsafe-html.js';
import { until } from 'lit-html/lib/until.js';
import 'commonmark/dist/commonmark.js';
import 'prismjs/prism.js';

class MarkdownElement extends LitElement {
    
    _render({ markdown, src }) {        
        return html`
            <style>

                ${ fetch('../node_modules/prismjs/themes/prism.css').then(res => res.text()) }

                :host {
                    display: block;
                }

            </style>
            <h1>hey</h1>
            ${ until(this.renderMarkdown(markdown, src), 'Loading...') }
        `;
    }

    static get properties() {
        return {
            markdown: {
                type: String
            },
            src: {
                type: String
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        // return if markdown or a reference was passed in through a data binding
        if(this.markdown || this.src) return;
        // otherwise look for a script tag
        const markdownScript = this.querySelector('script[type="text/markdown"]');
        // set the markdown from the script tag, trimming the whitespace
        this.markdown = markdownScript.text.trim();
    }

    async _didRender() {
        // await a dummy renderMarkdown so shadowRoot is accessible
        await this.renderMarkdown(this.markdown, this.src)
        Prism.highlightAllUnder(this.shadowRoot, false);
    }

    // fetch the markdown and set it locally
    async fetchMarkdown(src) {
        return await fetch(src)
            .then(async response => await response.text())
            .catch(e => 'Failed to read Markdown source.')
    }

    async renderMarkdown(markdown, src) {
        if(src) markdown = await this.fetchMarkdown(src);
        if(!markdown) markdown = 'No Markdown specified or failed to load.';
        // parse and render Markdown
        const reader = new commonmark.Parser();
        const writer = new commonmark.HtmlRenderer();
        return html`${unsafeHTML(writer.render(reader.parse(markdown)))}`;
    }

}

customElements.define('markdown-element', MarkdownElement);
