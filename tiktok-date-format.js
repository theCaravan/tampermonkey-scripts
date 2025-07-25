// ==UserScript==
// @name         TikTok Date Format Changer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Change "Xd ago" format to "M-d" or "M-d HH:mm" on TikTok
// @author       theCaravan
// @match        https://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function convertRelativeToAbsolute() {
        const containers = document.querySelectorAll('span[class*="SpanOtherInfos"]');

        containers.forEach(container => {
            const spans = container.querySelectorAll('span');
            const el = spans[spans.length - 1]; // The date-like span (e.g., "6d ago")

            const text = el.textContent.trim();
            const match = text.match(/^(\d+)([a-z]) ago$/i); // e.g., "6d ago"

            if (match) {
                const [, valueStr, unit] = match;
                const value = parseInt(valueStr, 10);
                const now = new Date();
                let date = new Date(now); // clone

                switch (unit) {
                    case 'd': date.setDate(now.getDate() - value); break;
                    case 'w': date.setDate(now.getDate() - value * 7); break;
                    case 'h': date.setHours(now.getHours() - value); break;
                    case 'm': date.setMinutes(now.getMinutes() - value); break;
                    default: return;
                }

                const M = date.getMonth() + 1;
                const D = date.getDate();
                const formattedDate = `${M}-${D}`;
                const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                const finalText = (unit === 'h' || unit === 'm') ? `${formattedDate} ${formattedTime}` : formattedDate;
                el.textContent = finalText;
            }
        });
    }

    // Mutation observer to track DOM updates
    const observer = new MutationObserver(convertRelativeToAbsolute);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    convertRelativeToAbsolute();
})();
