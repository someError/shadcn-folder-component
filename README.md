# shadcn-folder-component
Automatically transforms `shadcn/ui` components into a folder-based structure.

##  What it does

Installs shadcn/ui components and restructures them from flat files to organized folders:

```
components/ui/card.tsx    →    components/ui/card/index.tsx
components/ui/button.tsx  →    components/ui/button/index.tsx
```
## Usage

No installation needed. Just use with `npx`:

```bash
npx shadcnf@latest add <component-name>
```

```bash
npx shadcnf@latest add button
```

Reads your config - Automatically detects paths from components.json and tsconfig.json

## Configuration

> Make sure you have shadcn properly set up for your environment and verify that component creation is working correctly. [Installation](https://ui.shadcn.com/docs/installation)

> If you're using Next.js with TypeScript aliases — it works out of the box.

> If you encounter an error, then...

```bash
npx shadcnf@latest init
```
This creates a **shadcnf.json** file in your project root.
Сomponents will be added to this path as configured in shadcnf.json
```bash
{
  "uiPath": "/absolute/path/to/components/ui"
}
```
---

# shadcnf

> Transform shadcn/ui components into folder-based structure automatically



📦 npm: [shadcnf](https://www.npmjs.com/package/shadcnf)