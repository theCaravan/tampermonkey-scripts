// ==UserScript==
// @name         Clean Up LinkedIn Feed
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes Like/Comment/Share/Send bars and quick reply suggestions from LinkedIn posts
// @author       theCaravan (GitHub)
// @match        https://www.linkedin.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function removeElements() {
        // Remove the social action bar
        document.querySelectorAll('.feed-shared-social-action-bar').forEach(el => el.remove());

        // Remove quick reply buttons under comments
        document.querySelectorAll('.comments-quick-comments__container').forEach(el => el.remove());
    }

    // Initial run
    removeElements();

    // Keep scanning every 500ms for dynamically added elements
    setInterval(removeElements, 500);
})();
