// ==UserScript==
// @name         Instagram Reel Auto-Unmute Only
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Only unmutes Instagram Reels and removes blocking divs
// @match        *://www.instagram.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function findVideoElement() {
        return document.querySelector('video[playsinline]');
    }

    function unmuteVideo() {
        const video = findVideoElement();
        if (video) {
            video.controls = true;
            video.muted = false;
            video.play();

            const blockingDivs = document.querySelectorAll('div[data-instancekey^="id-vpuid-"]');
            blockingDivs.forEach((div) => {
                while (div.firstChild) {
                    div.firstChild.remove();
                }
            });
        }
    }

    function ensureUnmute() {
        const video = findVideoElement();
        if (video && video.muted) {
            unmuteVideo();
        }
    }

    setInterval(ensureUnmute, 500);
})();
