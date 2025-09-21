# emoji

## Description

Emoji elements represent emoji characters within ADF documents. They can reference emojis by shortName, unicode representation, or custom emoji IDs. Emojis enhance communication by adding visual expression and emotional context to text content.

## .md markdown syntax

### Standard Emoji Shortnames
```markdown
:smile: :heart: :thumbsup: :fire: :rocket:
```

### Custom Emoji References
```markdown
{emoji:custom-emoji-id}
{emoji:company-logo}
```

### Emoji with Fallback Text
```markdown
<!-- adf:emoji fallback="smile" -->
:smile:
```

### Unicode Emoji
```markdown
😀 😍 👍 🔥 🚀 ✨ 💡 🎉
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "emoji"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "shortName": {
          "type": "string",
          "description": "Emoji shortname (e.g., :smile:)"
        },
        "id": {
          "type": "string",
          "description": "Custom emoji ID"
        },
        "text": {
          "type": "string",
          "description": "Fallback text representation"
        }
      },
      "additionalProperties": true
    }
  },
  "required": ["type", "attrs"]
}
```

## Examples

### Emotional Expressions
```markdown
Great job on the project! :thumbsup: :clap:

I'm really excited about this! :heart_eyes: :fire:

Thanks for the help :pray: :smile:
```

### Status Updates
```markdown
## Project Status

:white_check_mark: Authentication module - Complete
:construction: Dashboard redesign - In Progress  
:clock1: API documentation - Scheduled
:x: Mobile app - Blocked
```

### Reactions and Feedback
```markdown
This feature looks amazing! :star_struck: :rocket:

Could use some improvements :thinking: :wrench:

Perfect implementation! :100: :tada:
```

### Team Communication
```markdown
Morning team! :wave: Hope everyone has a great day :sunny:

Coffee break time! :coffee: Anyone joining? :raised_hand:

End of sprint celebration! :party: :beers:
```

### Documentation
```markdown
## Important Notes

:warning: This feature is experimental
:information_source: Check the FAQ for common issues  
:bulb: Pro tip: Use keyboard shortcuts for faster navigation
:lock: Requires admin privileges
```

### Code Reviews
```markdown
## Pull Request Comments

:+1: LGTM! Great work on the optimization
:eyes: Just spotted a small typo in line 42
:question: Could you explain this logic change?
:rocket: This will definitely improve performance!
```

### Meeting Notes
```markdown
## Stand-up Meeting :calendar:

**Yesterday's Progress:**
- Fixed authentication bug :bug: :arrow_right: :white_check_mark:
- Deployed new features :rocket:

**Today's Plan:**  
- Code review session :eyes:
- Team lunch :fork_and_knife:
```

### Celebration Messages
```markdown
## Milestone Achieved! :tada:

We've successfully reached 10,000 users! :chart_with_upwards_trend:

Special thanks to the entire team :clap: :heart:

Time to celebrate! :champagne: :party:
```

### Weather and Time
```markdown
Perfect weather for our outdoor team building! :sunny: :palm_tree:

Working late tonight to meet the deadline :crescent_moon: :computer:

Early morning deployment scheduled :sunrise: :gear:
```

### Food and Social
```markdown
Lunch suggestions for the team meeting:

:pizza: Italian restaurant downtown
:sushi: New sushi place on Main Street  
:hamburger: The burger joint everyone loves
:coffee: Just coffee and pastries
```

### Custom Company Emojis
```markdown
Welcome to {emoji:company-logo} onboarding! 

Using our {emoji:product-icon} app for the first time?

Don't forget to join the {emoji:slack-channel} channel!
```

### Workflow Status
```markdown
## Development Pipeline

:seedling: Planning Phase
:construction_worker: Development  
:mag: Code Review
:test_tube: Testing
:rocket: Deployment
:white_check_mark: Production
```

### Educational Content
```markdown
## Learning Path :books:

:one: Basic concepts :baby_chick:
:two: Intermediate topics :muscle:  
:three: Advanced patterns :brain:
:four: Expert level :trophy:
```