// ==UserScript==
// @name         Instagram Date Formatter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Formats Instagram post dates in "Month Day, Year" format
// @match        *://www.instagram.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function updatePostDate() {
        const timeElements = document.querySelectorAll('time[datetime]');
        timeElements.forEach((timeElement) => {
            const dateString = timeElement.getAttribute('datetime');
            const formattedDate = formatDate(dateString);
            timeElement.textContent = formattedDate;
            timeElement.title = formattedDate;
        });
    }

    const observer = new MutationObserver(updatePostDate);
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(updatePostDate, 2000); // Backup update in case observer misses changes
})();
