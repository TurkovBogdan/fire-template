module.exports = {
    getMainEntry: function (params) {
        let fs = require('fs');
        let path = require('path');

        let returnScripts = {};

        let mainScriptsFiles = fs.readdirSync(path.resolve(__dirname, params.scriptDirectory), {
            withFileTypes: true
        });

        mainScriptsFiles.map(file => {
            if (!file.isDirectory()) {
                if (params.buildAllScriptsInScriptsRootDirectory) {
                    let name = path.parse(file.name).name;
                    returnScripts[name] = params.scriptDirectory + name;
                } else {
                    if (file.name === params.scriptBuildMainFileName) {
                        let name = path.parse(file.name).name;
                        returnScripts[name] = params.scriptDirectory + name;
                    }
                }
            }
        });

        if (Object.keys(returnScripts).length > 0)
            return returnScripts;
        else
            return false;
    },

    getPagesEntry: function (params) {
        let fs = require('fs');
        let path = require('path');

        if (!fs.existsSync(params.pagesDirectory)) {
            return false
        }

        const templateFiles = fs.readdirSync(path.resolve(__dirname, params.pagesDirectory));
        var pages = {};

        templateFiles.map(item => {
            if (fs.existsSync(params.pagesDirectory + item + '/' + params.pagesEntryFileName))
                pages['../pages/' + item + '/' + item] = [params.pagesDirectory + item + '/' + params.pagesEntryFileName];
        });

        return pages;
    },


    generateHtmlPlugins: function (params) {
        let fs = require('fs');
        let path = require('path');
        let HtmlWebpackPlugin = require('html-webpack-plugin');

        const templateFiles = fs.readdirSync(path.resolve(__dirname, params.pagesDirectory));

        let pagesFiles = [];

        templateFiles.map(item => {
            if (fs.existsSync(params.pagesDirectory + item + '/' + params.pagesTemplateFileName)) {
                pagesFiles.push(new HtmlWebpackPlugin({
                    filename: 'pages/' + item + '/index.html',
                    template: params.pagesDirectory + item + '/' + params.pagesTemplateFileName,
                    title: 'Custom template',
                    chunks: ['../pages/' + item + '/' + item],
                }));
            }
        });

        return pagesFiles;
    },

    generateStandaloneEntry: function (dir) {
        let fs = require('fs');
        let path = require('path');

        if (fs.existsSync(dir)) {
            const templateFiles = fs.readdirSync(path.resolve(__dirname, dir));
            var pages = {};

            templateFiles.map(item => {
                if (fs.existsSync(dir + item + '/main.js'))
                    pages[item] = [dir + item + '/main.js'];
            });

            return pages;
        } else
            return false
    },
};