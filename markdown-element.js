import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { unsafeHTML } from 'lit-html/lib/unsafe-html.js';
import { until } from 'lit-html/lib/until.js';
import 'commonmark/dist/commonmark.js';
import 'prismjs/prism.js';

class MarkdownElement extends LitElement {
    
    _render({ renderedMarkdown }) {        
        return html`
            <style>

                ${ fetch('../node_modules/prismjs/themes/prism.css').then(res => res.text()) }

                :host {
                    display: block;
                }

            </style>
            ${ renderedMarkdown }
        `;
    }

    static get properties() {
        return {
            markdown: {
                type: String
            },
            src: {
                type: String
            },
            scriptTag: {
                type: Object
            },
            renderedMarkdown: {
                type: String
            },
            safe: {
                type: Boolean
            }
        };
    }

    // render the markdown using the `markdown` attribute
    // `markdown` is set either by the user or the component
    set markdown(markdown) {
        this
            .renderMarkdown(markdown)
            .then(r => this.renderedMarkdown = r)
    }

    // fetch the markdown using the `src` attribute
    // note: overrides `markdown` attribute
    set src(src) {
        this
            .fetchMarkdown(src)
            .then(r => this.markdown = r);
    }

    // set the markdown from the script tag, trimming the whitespace
    // note: overrides `src` and `markdown` attributes
    set scriptTag(scriptTag) {
        if(scriptTag) this.markdown = scriptTag.text.trim();
    }

    connectedCallback() {
        super.connectedCallback();
        // look for a script tag
        this.scriptTag = this.querySelector('script[type="text/markdown"]');
        
    }

    async _didRender() {
        // after render, highlight text
        Prism.highlightAllUnder(this.shadowRoot, false);
    }

    // fetch the markdown and set it locally
    async fetchMarkdown(src) {
        if(!src.includes('.md')) return '`src` attribute does not specify a Markdown file.';
        return await fetch(src)
            .then(async response => await response.text())
            .catch(e => 'Failed to read Markdown source.')
    }

    async renderMarkdown(markdown) {
        // parse and render Markdown
        const reader = new commonmark.Parser();
        const writer = new commonmark.HtmlRenderer({ safe: this.safe });
        // assuming commmonmark library will properly sanitize code
        return html`${unsafeHTML(writer.render(reader.parse(markdown)))}`;
    }

}

customElements.define('markdown-element', MarkdownElement);
