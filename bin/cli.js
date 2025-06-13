#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getTsConfigPaths() {
    try {
        const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');

        if (!fs.existsSync(tsconfigPath)) {
            return null;
        }

        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        return tsconfig.compilerOptions?.paths || null;
    } catch (error) {
        console.warn('tsconfig.json error:', error.message);
        return null;
    }
}

function resolveAlias(aliasPath) {
    const tsconfigPaths = getTsConfigPaths();

    if (aliasPath.startsWith('@/')) {
        let basePath = 'src';


        if (tsconfigPaths && tsconfigPaths['@/*']) {
            const aliasMapping = tsconfigPaths['@/*'][0];
            basePath = aliasMapping.replace('/*', '');
        }

        const relativePath = aliasPath.substring(2); // убираем @/
        return path.join(process.cwd(), basePath, relativePath);
    }

    if (!path.isAbsolute(aliasPath)) {
        return path.join(process.cwd(), aliasPath);
    }

    return aliasPath;
}

function getUiPathFromConfig() {
    try {
        const configPath = path.join(process.cwd(), 'components.json');

        if (!fs.existsSync(configPath)) {
            throw new Error('components.json not found');
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        const uiAlias = config.aliases?.ui;

        if (!uiAlias) {
            throw new Error('alias ui not found in components.json');
        }

        const uiPath = resolveAlias(uiAlias);

        console.log(`Resolve alias "${uiAlias}" -> "${path.relative(process.cwd(), uiPath)}"`);

        return uiPath;
    } catch (error) {
        console.error('config error:', error.message);
        console.log('use default: src/components/ui');
        return path.join(process.cwd(), 'src', 'components', 'ui');
    }
}

async function restructureComponent(componentName, uiPath) {
    console.log(uiPath)
    try {
        const componentFile = path.join(uiPath, `${componentName}.tsx`);
        const componentDir = path.join(uiPath, componentName);
        const indexFile = path.join(componentDir, 'index.tsx');

        if (!fs.existsSync(componentFile)) {
            console.log(`${componentName}: file not found`);
            return false;
        }

        const content = fs.readFileSync(componentFile, 'utf8');
        fs.mkdirSync(componentDir, { recursive: true });
        fs.writeFileSync(indexFile, content);
        fs.unlinkSync(componentFile);

        console.log(`${componentName}: restructed`);
        console.log(`${path.relative(process.cwd(), indexFile)}`);
        return true;
    } catch (error) {
        console.error(`${componentName}: error - ${error.message}`);
        return false;
    }
}

async function main() {
    const args = process.argv.slice(2);
    const [command, component] = args;

    if (command !== 'add') {
        console.error('supporting only add command');
        process.exit(1);
    }

    if (!component) {
        console.error('no component arg');
        process.exit(1);
    }

    try {
        console.log(`installing ${component}...`);
        const uiPath = getUiPathFromConfig();
        execSync(`npx shadcn@latest add ${component}`, { stdio: 'inherit' });
        await restructureComponent(component, uiPath);
        console.log(`\n done!`);
    } catch (error) {
        console.error(`Installing error ${component}:`, error.message);
         process.exit(1);
    }
}

main().catch(console.error); 