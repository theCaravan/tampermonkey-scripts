// ==UserScript==
// @name         TikTok Video Go Back
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically move to the previous video on TikTok when the current video ends
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function isVideoPage() {
        return window.location.href.includes("/video/");
    }

    function handleVideoEnd() {
        console.log("Video 'ended' event caught.");
        const prevButton = document.querySelector('button[data-e2e="arrow-left"]');
        if (prevButton) {
            console.log('Previous button found, clicking to go to the previous video.');
            prevButton.click();
        } else {
            console.log('Previous button not found on video end.');
        }
    }

    function setupVideoEndListener(video) {
        if (!video) return;
        video.removeEventListener('ended', handleVideoEnd);
        video.addEventListener('ended', handleVideoEnd);
    }

    function observeNewVideos() {
        const observer = new MutationObserver(() => {
            if (isVideoPage()) {
                const video = document.querySelector('video');
                if (video) {
                    setupVideoEndListener(video);
                } else {
                    console.log('No video element found on page.');
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeNewVideos();
})();
