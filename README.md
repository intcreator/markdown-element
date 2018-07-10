# &lt;markdown-element&gt;

A Markdown renderer that uses the Commonmark spec.  This is a replacement for the Polymer sponsored `<marked-element>`.  `<marked-element>` uses the somewhat outdated Marked parser, while `<markdown-element>` uses the up to date and better maintained [Commonmark parser](https://github.com/commonmark/commonmark.js).

## Set up

Install and save to package.json:

```
npm i --save @intcreator/markdown-element
```

Import where needed:

```javascript
import '@intcreator/markdown-element';
```

## Usage

### `markdown` attribute

The markdown source is taken directly from the `markdown` attribute supplied to the element.  The markdown supplied can be dynamically updated to change the rendered markdown.

```html
<markdown-element markdown="This **demo** uses the `markdown` _attribute_, not `src`">
    <div slot="markdown-html"></div>
</markdown-element>
```

### `src` attribute

The `src` attribute can be used to load a markdown file through AJAX.  It overrides the `markdown` attribute.  The source can be dynamically updated to change the markdown file displayed.

```html
<markdown-element src="./demo.md">
    <div slot="markdown-html"></div>
</markdown-element>
```

### `<script>` tag

A `<script>` tag can be inserted inside of the `<markdown-element>` to provide the markdown source.  It overrides the `markdown` and `src` attributes.  Support for changing this markdown source dynamically is not yet implemented.

```html
<markdown-element>
    <div slot="markdown-html"></div>
    <script type="text/markdown">
        This demo uses a `<script>` tag.
    </script>
</markdown-element>
```

## Roadmap to 1.0

Here are a few issues that need to be resolved before the 1.0 release:

- Is it possible to get rid of the `<div slot="markdown-html"></div>` and still allow users to easily style the contents of `<markdown-element>` with custom styles?
- Dynamically update markdown when changed in the script tag (if possible) or find another way to dynamically update multiline-markdown
- Address security issues—Commonmark.js does not sanitize Markdown input by default, so this should at least be an option the user can select on `<markdown-element>`

## Contributing

Let's make this element even better!  Want to help?  Found a problem?  Open an issue or contact me on the Polymer Slack, Twitter, etc. @intcreator.