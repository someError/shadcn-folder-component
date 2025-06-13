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
    console.warn('Не удалось прочитать tsconfig.json:', error.message);
    return null;
  }
}

function resolveAlias(aliasPath) {
  // Получаем пути из tsconfig.json
  const tsconfigPaths = getTsConfigPaths();
  
  if (aliasPath.startsWith('@/')) {
    let basePath = 'src'; // дефолтное значение
    
    // Если есть tsconfig с алиасами, используем их
    if (tsconfigPaths && tsconfigPaths['@/*']) {
      const aliasMapping = tsconfigPaths['@/*'][0]; // берем первый путь
      basePath = aliasMapping.replace('/*', ''); // убираем /*
    }
    
    // Заменяем @/ на реальный путь
    const relativePath = aliasPath.substring(2); // убираем @/
    return path.join(process.cwd(), basePath, relativePath);
  }
  
  // Если путь не начинается с @, считаем его относительным
  if (!path.isAbsolute(aliasPath)) {
    return path.join(process.cwd(), aliasPath);
  }
  
  return aliasPath;
}

function getUiPathFromConfig() {
  try {
    // Читаем components.json
    const configPath = path.join(process.cwd(), 'components.json');
    
    if (!fs.existsSync(configPath)) {
      throw new Error('components.json не найден');
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Получаем алиас для ui компонентов
    const uiAlias = config.aliases?.ui;
    
    if (!uiAlias) {
      throw new Error('Алиас ui не найден в components.json');
    }

    // Преобразуем алиас в реальный путь с учетом tsconfig
    const uiPath = resolveAlias(uiAlias);
    
    console.log(`🔍 Разрешен алиас "${uiAlias}" -> "${path.relative(process.cwd(), uiPath)}"`);
    
    return uiPath;
  } catch (error) {
    console.error('Ошибка чтения конфигурации:', error.message);
    console.log('Используем путь по умолчанию: src/components/ui');
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
      console.log(`⚠️ ${componentName}: файл не найден, пропускаем`);
      return false;
    }

    const content = fs.readFileSync(componentFile, 'utf8');
    fs.mkdirSync(componentDir, { recursive: true });
    fs.writeFileSync(indexFile, content);
    fs.unlinkSync(componentFile);

    console.log(`✅ ${componentName}: реструктурирован`);
    console.log(`   📁 ${path.relative(process.cwd(), indexFile)}`);
    return true;
  } catch (error) {
    console.error(`❌ ${componentName}: ошибка - ${error.message}`);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);

  const noInstall = args.includes('--no-install');
  const components = args.filter(arg => !arg.startsWith('--'));
  
  if (components.length === 0) {
    console.error('❌ Укажите хотя бы один компонент');
    process.exit(1);
  }

  try {
    const uiPath = getUiPathFromConfig();
    console.log(uiPath)
    console.log(`📁 UI путь: ${path.relative(process.cwd(), uiPath)}`);

    // Проверяем наличие components.json
    if (!fs.existsSync(path.join(process.cwd(), 'components.json'))) {
      console.log('⚠️ components.json не найден. Убедитесь, что вы находитесь в корне проекта с настроенным shadcn/ui');
    }

    // Устанавливаем компоненты (если не отключено)
    if (!noInstall) {
      for (const component of components) {
        try {
          console.log(`📦 Устанавливаем ${component}...`);
          execSync(`npx shadcn@latest add ${component}`, { stdio: 'inherit' });
        } catch (error) {
          console.error(`❌ Ошибка установки ${component}:`, error.message);
        }
      }
    }

    // Реструктурируем компоненты
    console.log('\n🔄 Начинаем реструктурирование...');
    let successCount = 0;
    
    for (const component of components) {
      const success = await restructureComponent(component, uiPath);
      if (success) successCount++;
    }

    console.log(`\n🎉 Готово! Обработано компонентов: ${successCount}/${components.length}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

main().catch(console.error); 