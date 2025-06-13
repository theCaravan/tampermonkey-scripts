// ==UserScript==
// @name         Instagram Date Formatter
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Formats Instagram post dates in "Month Day, Year" format
// @match        *://www.instagram.com/*
// @grant        none
// @author       theCaravan (GitHub)
// ==/UserScript==

(function () {
    'use strict';

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    let updateTimeout;

    function updatePostDate() {
        const timeElements = document.querySelectorAll('time[datetime]');
        timeElements.forEach((timeElement) => {
            const dateString = timeElement.getAttribute('datetime');
            if (!dateString) return;

            const formattedDate = formatDate(dateString);

            // Only update if different to reduce DOM writes and reflows
            if (timeElement.textContent !== formattedDate) {
                timeElement.textContent = formattedDate;
                timeElement.title = formattedDate;
            }
        });
    }

    function debouncedUpdate() {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            observer.disconnect();   // Prevent recursive mutation triggers
            updatePostDate();
            observer.observe(document.body, { childList: true, subtree: true });
        }, 200);
    }

    const observer = new MutationObserver(debouncedUpdate);
    observer.observe(document.body, { childList: true, subtree: true });

    // Optional: Debounced interval backup for cases observer misses
    setInterval(() => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(updatePostDate, 200);
    }, 5000);
})();
