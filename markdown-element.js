import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'commonmark/dist/commonmark.js';
import 'prismjs/prism.js';

class MarkdownElement extends PolymerElement {
    
    static get template() {
        return html`
            <style>

                :host {
                    display: block;
                }

            </style>

            <slot name="markdown-html">
                <div id="content">No Markdown specified or failed to load</div>
            </slot>
        `
    }

    static get properties() {
        return {
            markdown: {
                type: String,
                observer(newValue, oldValue) {
                    // parse and render Markdown
                    const reader = new commonmark.Parser();
                    const writer = new commonmark.HtmlRenderer();
                    const html = writer.render(reader.parse(newValue));
                    // set HTML of slot (if given) or div
                    const target = this.querySelector('[slot="markdown-html"]') || this.shadowRoot.querySelector('#content')
                    target.innerHTML = html;
                    // highlight all code blocks under the target
                    const things = Prism.highlightAllUnder(target, false);
                }
            },
            src: {
                type: String,
                observer(newValue, oldValue) {
                    this.fetchMarkdown(newValue);
                }
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        // return if markdown or a reference was passed in through a data binding
        if(this.markdown || this.src) return;
        // otherwise look for a script tag
        const markdownScript = this.querySelector('script[type="text/markdown"]')
        // set the markdown from the script tag, trimming the whitespace
        this.markdown = markdownScript.text.trim();
        // if there's no script tag, return
        if(!markdownScript) return;
    }

    // fetch the markdown and set it locally
    async fetchMarkdown(src) {
        await fetch(src)
            .then(async response => {
                this.markdown = await response.text();
            })
            .catch(e => {
                this.markdown = 'Failed to read Markdown source.'
            })
    }

}

customElements.define('markdown-element', MarkdownElement);
