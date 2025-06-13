// ==UserScript==
// @name        TikTok Timestamp Display
// @namespace   Violentmonkey Scripts
// @match       https://www.tiktok.com/*
// @grant       none
// @version     3.1
// @description Replace video views with timestamps extracted from the video URL
// @author      theCaravan (GitHub)
// ==/UserScript==

(function() {
    'use strict';

    function extractTimestamp(videoId) {
        let id = BigInt(videoId);
        let timestamp = Number(id >> 32n);
        let date = new Date(timestamp * 1000);
        let options = { timeZone: 'America/Chicago', month: '2-digit', day: '2-digit', year: 'numeric' };
        let centralTimeDate = date.toLocaleString('en-US', options);
        let [month, day, year] = centralTimeDate.split('/');
        year = year.slice(-2);
        return `${month}-${day}-${year}`;
    }

    let updateTimeout;

    function updateTimestamps() {
        let videoLinks = document.querySelectorAll('a[href*="/video/"]');

        videoLinks.forEach(link => {
            let videoUrl = link.href;
            let videoIdMatch = videoUrl.match(/\/video\/(\d+)/);

            if (videoIdMatch) {
                let videoId = videoIdMatch[1];
                let timestamp = extractTimestamp(videoId);

                let viewsElement = link.querySelector('strong.video-count');

                if (viewsElement && viewsElement.textContent !== timestamp) {
                    viewsElement.textContent = timestamp;
                }
            }
        });
    }

    function init() {
        updateTimestamps();

        const observer = new MutationObserver(() => {
            // Debounce calls to prevent running too often
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                // Temporarily disconnect observer to prevent recursive calls
                observer.disconnect();
                updateTimestamps();
                observer.observe(document.body, { childList: true, subtree: true });
            }, 200);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', init);
})();
