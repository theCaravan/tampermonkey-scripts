// ==UserScript==
// @name         TikTok Video Hands-Free
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Enhances TikTok by converting relative dates to absolute format and auto-advancing videos
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to convert relative "Xd ago" to "M-d" or "M-d HH:mm" format
    function convertRelativeToAbsolute() {
        const elements = document.querySelectorAll('div.css-1mnwhn0-DivAuthorContainer a');

        elements.forEach(el => {
            // Skip elements that have already been processed
            if (el.hasAttribute('data-processed')) {
                return;
            }

            const text = el.textContent.trim();
            const match = text.match(/(\d+)([a-z]) ago$/);

            if (match) {
                const [, valueString, unit] = match;
                const value = parseInt(valueString, 10);
                const now = new Date();
                let date;

                switch (unit) {
                    case 'd': // Days
                        date = new Date(now);
                        date.setDate(date.getDate() - value);
                        break;
                    case 'w': // Weeks
                        date = new Date(now);
                        date.setDate(date.getDate() - value * 7);
                        break;
                    case 'm': // Minutes
                        date = new Date(now);
                        date.setMinutes(date.getMinutes() - value);
                        break;
                    case 'h': // Hours
                        date = new Date(now);
                        date.setHours(date.getHours() - value);
                        break;
                    default:
                        return; // Skip if the unit doesn't match known cases
                }

                // Format the date as M-d or M-d HH:mm for recent posts
                const formattedDate = `${date.getMonth() + 1}-${date.getDate()}`;
                const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                // Set the content based on the unit
                el.textContent = (unit === 'h' || unit === 'm') ? `${formattedDate} ${formattedTime}` : formattedDate;

                // Tag the element as processed
                el.setAttribute('data-processed', 'true');
            }
        });
    }

    // Function to handle video end event
    function handleVideoEnd() {
        console.log("Video 'ended' event caught.");
        const navigationContainer = document.querySelector('.css-1o2f1ti-DivFeedNavigationContainer');
        const nextButton = navigationContainer ? navigationContainer.querySelectorAll('button')[1] : null;
        if (nextButton) {
            console.log('Next button found, clicking to go to the next video.');
            nextButton.click();
        } else {
            console.log('Next button not found on video end.');
        }
    }

    // Function to set up the video end listener
    function setupVideoEndListener(video) {
        if (!video) return;

        // Remove any existing event listeners to avoid duplicates
        video.removeEventListener('ended', handleVideoEnd);

        // Add an event listener to detect when the video ends
        video.addEventListener('ended', handleVideoEnd);
    }

    // Function to observe new videos and update dates dynamically
    function observePageChanges() {
        const observer = new MutationObserver(() => {
            // Convert relative dates to absolute
            convertRelativeToAbsolute();

            // Set up video end listener if on a video page
            const video = document.querySelector('video');
            if (video) {
                setupVideoEndListener(video);
            }
        });

        // Observe changes to the body for both features
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial setup
    convertRelativeToAbsolute(); // Convert dates on page load
    observePageChanges(); // Start observing for dynamic content
})();

