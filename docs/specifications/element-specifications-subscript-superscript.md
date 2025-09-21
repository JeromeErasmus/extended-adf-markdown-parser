# subscript-superscript

## Description

Subscript and superscript formatting positions text below or above the normal baseline using the subsup mark in ADF. Commonly used for mathematical expressions, chemical formulas, footnotes, and ordinal numbers.

## .md markdown syntax

### Subscript Syntax
```markdown
H<sub>2</sub>O
CO<sub>2</sub>
```

### Superscript Syntax
```markdown
E=mc<sup>2</sup>
10<sup>th</sup> anniversary
```

### Combined with Metadata Comments
```markdown
<!-- adf:text subsup="sub" -->
Chemical formula: H<sub>2</sub>SO<sub>4</sub>
<!-- adf:text subsup="sup" -->
Mathematical equation: x<sup>2</sup> + y<sup>2</sup>
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "text"
    },
    "text": {
      "type": "string",
      "description": "Text content"
    },
    "marks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "const": "subsup"
          },
          "attrs": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": ["sub", "sup"],
                "description": "Subscript (sub) or superscript (sup)"
              }
            },
            "required": ["type"],
            "additionalProperties": true
          }
        },
        "required": ["type", "attrs"]
      },
      "minItems": 1
    }
  },
  "required": ["type", "text", "marks"]
}
```

## Examples

### Chemical Formulas
```markdown
Water: H<sub>2</sub>O
Carbon Dioxide: CO<sub>2</sub>
Sulfuric Acid: H<sub>2</sub>SO<sub>4</sub>
Methane: CH<sub>4</sub>
```

### Mathematical Expressions
```markdown
Pythagorean theorem: a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>
Einstein's equation: E = mc<sup>2</sup>
Area of circle: A = πr<sup>2</sup>
```

### Footnote References
```markdown
This is important information<sup>1</sup>.
Research shows significant results<sup>2</sup>.
According to the study<sup>3</sup>.
```

### Ordinal Numbers
```markdown
1<sup>st</sup> place winner
21<sup>st</sup> century technology
3<sup>rd</sup> quarter results
```

### Mathematical Powers
```markdown
2<sup>3</sup> = 8
10<sup>6</sup> = 1,000,000
x<sup>n</sup> + y<sup>n</sup> = z<sup>n</sup>
```

### Chemical Reactions
```markdown
2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O
C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> → 6CO<sub>2</sub> + 6H<sub>2</sub>O
```

### Units and Measurements
```markdown
Area: 100 m<sup>2</sup>
Volume: 50 cm<sup>3</sup>
Speed: 3×10<sup>8</sup> m/s
```

### Trademark and Copyright
```markdown
Microsoft<sup>®</sup> Windows<sup>™</sup>
Copyright<sup>©</sup> 2023
All rights reserved<sup>®</sup>
```

### Date Formats
```markdown
January 1<sup>st</sup>, 2023
December 31<sup>st</sup>, 2022
March 3<sup>rd</sup>, 2024
```

### Mathematical Subscripts
```markdown
x<sub>1</sub>, x<sub>2</sub>, x<sub>3</sub>
a<sub>n</sub> = a<sub>1</sub> + (n-1)d
V<sub>max</sub> = 120 km/h
```

### Scientific Notation
```markdown
Avogadro's number: 6.022 × 10<sup>23</sup>
Planck constant: 6.626 × 10<sup>-34</sup>
Speed of light: 2.998 × 10<sup>8</sup> m/s
```

### Isotopes
```markdown
Carbon-14: <sup>14</sup>C
Uranium-235: <sup>235</sup>U
Hydrogen-2: <sup>2</sup>H (Deuterium)
```