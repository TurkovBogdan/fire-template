import "../styles/main.scss";
import Polyfills from "../modules/Polyfills/module";

var obSiteController = {
    Polyfills: Polyfills(),         // Модуль загрузки полифилов

    /** Старт работы скриптов */
    start: function () {
        // Модуль полифилов. Загружает полифил для Promise, проверяет необходимость установки других полифилов,
        // динамически их догружает
        this.Polyfills.load(this.onScriptReady.bind(this));
    },

    /** Скрипты готовы к работе. Первичный запуск */
    onScriptReady: function () {
        let self = this;

        // Ждём события готовности страницы
        this.ready(() => {
            document.getElementsByTagName("body")[0].classList.remove('is-loading');
            self.onDocumentReady();
        });
    },


    /**  Документ загружен и готов к работе */
    onDocumentReady: function () {
        var ob = this;
        this.SmoothScroll.init(function () {
            ob.Modals.close();
        });
        this.Modals.init(this.IntObserver);
        this.AfterLoad.init();
        this.TabSwitch.init();
        this.initSlider();
        this.initMap();

        [].forEach.call(document.querySelectorAll('[data-lazy-picture]'), function (lpc) {
            ob.IntObserver.addObserve(lpc, function (elem) {
                [].forEach.call(elem.querySelectorAll('[data-lazy-srcset]'), function (dlse) {
                    let dlsrc = dlse.getAttribute('data-lazy-srcset');
                    dlse.setAttribute('srcset', dlsrc);
                });

                lpc.classList.remove('loading');
                lpc.setAttribute('style', '');
            });
        });

        [].forEach.call(document.querySelectorAll('[data-lazy-src]'), function (lsrc) {
            ob.IntObserver.addObserve(lsrc, function (elem) {
                let src = elem.getAttribute('data-lazy-src');
                elem.setAttribute('src', src);
                elem.classList.remove('loading');
                elem.setAttribute('style', '');
            });
        });

        [].forEach.call(document.querySelectorAll('[data-lazy-background]'), function (lsrc) {
            ob.IntObserver.addObserve(lsrc, function (elem) {
                elem.classList.add('load');
            });
        });
    },

    ready: function (callback) {
        if (document.readyState != "loading") callback();
        else document.addEventListener("DOMContentLoaded", callback);
    },
};

obSiteController.start();