import './lib/promise.polyfill';
import Modernizr from 'modernizr';

export default (afterLoadFunc) => {
    return {
        onLoad: false,
        loadCount: 1,
        end: false,

        onPolyfillLoad: function(){
          this.loadCount -= 1;
          if(this.loadCount === 0 && this.end === true){
            this.onLoad();
          }
        },

        load: function(callback){
            this.onLoad = callback;
            var ob = this;

            // IntersectionObserver не поддерживается
            if (!('IntersectionObserver' in window) || !('IntersectionObserverEntry' in window) || !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
                console.log('Необходим полифил для IntersectionObserver');
                this.loadCount += 1;
                import(/* webpackChunkName:"intersection-observer" */'./lib/intersection-observer').then(() => {
                    console.log('IntersectionObserver загружен');
                    ob.onPolyfillLoad();
                }).catch(error => '');
            }

            // проверяем поддержку matches
            if (!Element.prototype.matches) {
                // определяем свойство
                Element.prototype.matches = Element.prototype.matchesSelector ||
                    Element.prototype.webkitMatchesSelector ||
                    Element.prototype.mozMatchesSelector ||
                    Element.prototype.msMatchesSelector;
            }

            // проверяем поддержку closest
            if (!Element.prototype.closest) {
                // реализуем
                Element.prototype.closest = function(css) {
                    var node = this;
                    while (node) {
                        if (node.matches(css)) return node;
                        else node = node.parentElement;
                    }
                    return null;
                };
            }

            // node.forEach не поддерживается
            if (window.NodeList && !NodeList.prototype.forEach) {
                NodeList.prototype.forEach = Array.prototype.forEach;
            }

            // webp не поддерживается
            this.loadCount += 1;
            Modernizr.on('webp', function( result ) {
                if (!result) {
                    document.body.classList.add("no-webp");
                    // Подмена изображений на jpg формат
                    let srcNoWEBP = document.querySelectorAll('[data-src-nowebp]');
                    srcNoWEBP.forEach(function (elem) {
                        var nowebSRC = elem.getAttribute('data-src-nowebp');
                        elem.setAttribute('data-src',nowebSRC);
                    });
                }
                ob.onPolyfillLoad();
            });

            this.end = true;
            this.onPolyfillLoad();
        },
    }
};