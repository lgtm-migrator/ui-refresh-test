# Use Storybook

*2021-10-19*

Storybook is a tool for UI development. It makes development faster and easier
by isolating components. It will serve as a common repository of UI elements
and their documentation.


## Authors

- [Dakota Blair][dakota]
- [David Lyon][dauglyon]

[dakota]: https://github.com/dakotablair
[dauglyon]: https://github.com/dauglyon

## Status

Accepted

## Alternatives Considered

- [Storybook][storybook]
- [Figma][figma]
- No custom component library management

## Decision Outcome

Storybook will be used for component design and definition.

## Consequences

There will be overhead to create each component, but much of this would be
required in any case. The advantage of using story book is that each component
will be written once and used many times. It will also serve as an central
place to identify which components are currently available. This will benefit
mockups since they can be composed of existing examples of components.

## Pros and Cons

### Storybook

- `+` Stored in existing version control
- `+` Explicit definition of common UI components
- `+` Makes it easier to share common UI components
- `+` Helps mockups look more consistent by using existing components.
- `-` Learning curve for new developers

### Figma

- `+` Easy setup
- `-` Requires subscription
- `-` Separate version control

### No custom component library management

- `+` Will not take any time away from feature development
- `-` No shared visual style
- `-` Worse developer experience
- `-` Worse designer experience

## References

- [Figma][figma]
- [Storybook][storybook]

[figma]: https://www.figma.com/
[storybook]: https://github.com/storybookjs/storybook
