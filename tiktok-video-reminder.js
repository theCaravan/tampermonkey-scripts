// ==UserScript==
// @name         TikTok Video Reminder Removal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove video reminder section if found on TikTok
// @author       You
// @match        https://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to remove the tux-portal-container div by ID
    function removeTuxPortalContainer() {
        const tuxPortalContainer = document.getElementById('tux-portal-container'); // Use ID selector
        if (tuxPortalContainer) {
            console.log('tux-portal-container found, removing...');
            tuxPortalContainer.remove(); // Removes the element and its children
        }
    }

    // Function to observe new elements and detect changes in the DOM
    function observeNewVideos() {
        const observer = new MutationObserver(() => {
            // Call the function to remove tux-portal-container if it appears
            removeTuxPortalContainer();
        });

        // Observe changes in the body to detect new elements or changes
        observer.observe(document.body, { childList: true, subtree: true });

        console.log("Observing TikTok page for video reminder popup...");
    }

    // Initial setup
    observeNewVideos();
})();
