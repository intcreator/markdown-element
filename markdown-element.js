import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { unsafeHTML } from 'lit-html/lib/unsafe-html.js';
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
            ${ this.renderMarkdown(markdown, src) }
            <!-- <slot name="markdown-html">
                <div id="content">No Markdown specified or failed to load</div>
            </slot> -->
        `
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

    _didRender(props) {
        // if(Object.keys(props).length === 0 && props.constructor === Object) return;
        console.log(props, this.shadowRoot.querySelector('p'))
        // this.shadowRoot.querySelector('code').style = 'background-color: red;';
        // Prism.highlightAllUnder(this.shadowRoot.querySelector('code'), false);
    }

    // fetch the markdown and set it locally
    async fetchMarkdown(src) {
        let text;
        await fetch(src)
            .then(async response => {
                text = await response.text()
            })
            .catch(e => {
                return 'Failed to read Markdown source.'
            })
        return text;
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
