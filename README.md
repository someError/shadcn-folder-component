# shadcn-folder-component
Automatically transforms `shadcn/ui` components into a folder-based structure.

## Configuration

> If you're using **Next.js** with **TypeScript aliases** set up — you're all set.
  **No config needed.**

> If not, run the init command:

```bash
npx shadcnf@latest init
```
This creates a **shadcnf.json** file in your project root.
Inside, set the **absolute path** to your ui folder:
```bash
{
  "uiPath": "/absolute/path/to/components/ui"
}
```
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

📦 npm: [shadcnf](https://www.npmjs.com/package/shadcnf)