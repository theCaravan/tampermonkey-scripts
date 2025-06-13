// ==UserScript==
// @name         Clean Up LinkedIn Feed
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes various items from LinkedIn Feed
// @author       theCaravan (GitHub)
// @match        https://www.linkedin.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // List of selectors to remove from the page
    const selectorsToRemove = [
        '.feed-shared-social-action-bar',                 // Like / Comment / Share / Send
        '.comments-quick-comments__container',            // Quick reply suggestions
        '.share-box-feed-entry__closed-share-box',         // "Start a post" share box
    ];

    function removeElements() {
        selectorsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    }

    // Initial cleanup
    removeElements();

    // Continuously check every 500ms for new elements to remove
    setInterval(removeElements, 500);
})();
