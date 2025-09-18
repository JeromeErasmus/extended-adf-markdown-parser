# Comprehensive Media and Expand Testing

## Media Single Elements

![Media](https://example.com/media/abc123 "contentId-123456789")

Image above demonstrates basic media single with center layout.

![Media](https://example.com/media/def456 "contentId-987654321")

This media is aligned to the start with 50% width. Text wraps around it naturally when the content is long enough to demonstrate the text wrapping behavior.

![Media](https://example.com/media/ghi789 "contentId-555666777")

Right-aligned media with 30% width creates interesting layout possibilities.

## Media Group

![Media](https://example.com/gallery/group1 "gallery-001") ![Media](https://example.com/gallery/group2 "gallery-001") ![Media](https://example.com/gallery/group3 "gallery-001")

Media groups allow multiple images to be displayed together in a gallery format.

## Basic Expand Element

~~~expand title="Click to expand this section"
This content is hidden by default and revealed when the expand element is clicked. It can contain **rich formatting** and [links](https://example.com).
~~~

<details>
<summary>Click to expand this section</summary>

This content is hidden by default and revealed when the expand element is clicked. It can contain **rich formatting** and [links](https://example.com).

</details>

## Expand with Complex Content

<details>
<summary>Technical Implementation Details</summary>

This expand section contains more complex content including:

- Bullet lists with multiple items
- Code examples
- Tables and other structured content

```typescript
interface ExpandProps {
  title: string;
  isOpen?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}
```

| Property | Type | Required |
|----------|------|----------|
| title | string | Yes |
| isOpen | boolean | No |

</details>

## Nested Expand Elements

<details>
<summary>Parent Expand Section</summary>

This expand contains another expand section nested within it.

<details>
<summary>Nested Expand</summary>

This is content within a nested expand element. It demonstrates that expand elements can contain other expand elements for deeply hierarchical content organization.

> Even blockquotes work within nested expands!

</details>

Content after the nested expand continues in the parent expand.

</details>

## Media with Custom Attributes

![Custom image with alt text](https://example.com/special/custom789 "special-collection")

Full-width media with custom attributes and alt text for accessibility.

## Expand with Custom Attributes

<details>
<summary>Advanced Configuration</summary>

This expand element has custom attributes that may be used for specific styling or behavior customization.

</details>