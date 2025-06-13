# shadcn-folder-component
Add shadcn component as folder

## Installation

No installation needed. Just use with `npx`:

```bash
npx shadcnf@latest add <component-name>
```

```bash
npx shadcnf@latest add button
```

Reads your config - Automatically detects paths from components.json and tsconfig.json

# shadcnf

> Transform shadcn/ui components into folder-based structure automatically

##  What it does

Installs shadcn/ui components and restructures them from flat files to organized folders:

```
components/ui/card.tsx    →    components/ui/card/index.tsx
components/ui/button.tsx  →    components/ui/button/index.tsx
```