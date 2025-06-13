# shadcn-folder-component
Automatically transforms `shadcn/ui` components into a folder-based structure.

## Requirements

> This tool **only works** in projects that meet the following conditions:

- Built with **Next.js**
- Uses **TypeScript**
- Has **path aliases** set up in `tsconfig.json`
- Includes a valid **`components.json`** file

---

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