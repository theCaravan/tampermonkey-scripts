// ==UserScript==
// @name         TikTok Date Format Changer
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Change relative "Xd ago" format to "M-d" format on TikTok, including hours and minutes with time.
// @author       theCaravan
// @match        https://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function convertRelativeToAbsolute() {
        const elements = document.querySelectorAll('div.css-1mnwhn0-DivAuthorContainer a');

        elements.forEach(el => {
            const text = el.textContent.trim();
            const match = text.match(/^(\d+)([a-z]+) ago$/);

            if (match) {
                const [, value, unit] = match;
                const now = new Date();
                let date;

                switch (unit) {
                    case 'd':
                        date = new Date(now.setDate(now.getDate() - value));
                        break;
                    case 'w':
                        date = new Date(now.setDate(now.getDate() - value * 7));
                        break;
                    case 'm':
                        date = new Date(now.setMonth(now.getMonth() - value));
                        break;
                    case 'h':
                        date = new Date(now.setHours(now.getHours() - value));
                        break;
                    case 'm':
                        date = new Date(now.setMinutes(now.getMinutes() - value));
                        break;
                    default:
                        return;
                }

                // Format the date as M-d or M-d HH:mm for recent posts
                const formattedDate = `${date.getMonth() + 1}-${date.getDate()}`;
                const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                // Set the content based on the unit
                el.textContent = (unit === 'h' || unit === 'm') ? `${formattedDate} ${formattedTime}` : formattedDate;
            }
        });
    }

    // Observe changes to dynamically update content
    const observer = new MutationObserver(convertRelativeToAbsolute);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial conversion on page load
    convertRelativeToAbsolute();

})();
