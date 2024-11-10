// ==/UserScript==
// @name         TikTok Video Reminder Removal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove video reminder section if found on TikTok
// @author       You
// @match        https://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the tux-portal-container div if it exists
    function removeTuxPortalContainer() {
        const tuxPortalContainer = document.querySelector('.tux-portal-container');
        if (tuxPortalContainer) {
            console.log('tux-portal-container found, removing...');
            tuxPortalContainer.remove(); // Removes the element and its children
        }
    }

    // Check if the current page is a TikTok page
    function isTikTokPage() {
        return window.location.hostname === 'www.tiktok.com';
    }

    // Function to observe new elements and detect changes in the DOM
    function observeNewVideos() {
        if (isTikTokPage()) {
            const observer = new MutationObserver(() => {
                // Call the function to remove tux-portal-container if it appears
                removeTuxPortalContainer();

                // Additional logic for video and carousel detection can go here
            });

            // Observe changes in the body to detect new elements or changes
            observer.observe(document.body, { childList: true, subtree: true });

            console.log("Observing TikTok page for video reminder popup...");
        }
    }

    // Initial setup
    if (isTikTokPage()) {
        observeNewVideos();
    }

})();
