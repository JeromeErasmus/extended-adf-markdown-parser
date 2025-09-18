## Rich Content Examples

This document demonstrates **rich content** formatting capabilities with various *ADF-specific* features.

~~~panel type=info
This is an **information panel** with mixed formatting including [links](https://developer.atlassian.com "Atlassian Developer") and `inline code`.
~~~

```javascript
import { Parser } from '@extended-adf/parser';

const parser = new Parser();
const markdown = parser.adfToMarkdown(adfDocument);
```

> This is a blockquote with *emphasized text* and ~~strikethrough~~ formatting.