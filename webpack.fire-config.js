module.exports = {
    distDir: './dist',

    // Основные скрипты
    scriptDirectory: './src/scripts/',                          // Директория хранения скриптов
    scriptBuildMainFileName: 'main.js',                         // Имя основной точки входа скриптов
    buildAllScriptsInScriptsRootDirectory: true,                // Собирать все файлы в корне скриптов как отдельные

    // Страницы
    buildPages: true,                                           // Включить сборку страниц
    pagesDirectory: './src/pages/',                             // Директория страниц
    pagesEntryFileName: 'main.js',                              // Имя файла точки входа для страниц
    pagesTemplateFileName: 'template.twig',                     // Имя файла с шаблоном для страниц

    // Изображения
    imageSaveDirectory: '/img/',                                // Директория сохранения изображений относительно distDir
    imageSrcDir: '/src/img/'
};