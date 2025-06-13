// ==UserScript==
// @name         Remove LinkedIn Social Action Bar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes Like, Comment, Repost, and Send buttons from LinkedIn feed posts
// @author       You
// @match        https://www.linkedin.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function removeSocialBars() {
        const bars = document.querySelectorAll('.feed-shared-social-action-bar');
        bars.forEach(bar => bar.remove());
    }

    // Run initially
    removeSocialBars();

    // Re-run every 500 ms to catch dynamically loaded content
    setInterval(removeSocialBars, 500);
})();
