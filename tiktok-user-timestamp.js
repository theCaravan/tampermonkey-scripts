// ==UserScript==
// @name        TikTok Timestamp Display
// @namespace   Violentmonkey Scripts
// @match       https://www.tiktok.com/*
// @grant       none
// @version     2.0
// @description Replace video views with timestamps extracted from the video URL
// @author      theCaravan
// ==/UserScript==

(function() {
    'use strict';

    function extractTimestamp(videoId) {
        // Convert the video ID to a BigInt
        let id = BigInt(videoId);

        // Shift right by 32 bits to get the timestamp
        let timestamp = Number(id >> 32n);

        // Convert the timestamp to a date in UTC
        let date = new Date(timestamp * 1000);

// Convert the UTC date to Central Time (CT)
let options = { timeZone: 'America/Chicago', month: '2-digit', day: '2-digit', year: 'numeric' };
let centralTimeDate = new Date(date).toLocaleString('en-US', options);

// Reformat to MM/dd/yy
let [month, day, year] = centralTimeDate.split('/');
year = year.slice(-2); // Get last two digits of the year

let formattedDate = `${month}-${day}-${year}`;

return formattedDate; // Returns the date in MM/dd/yy format in CT
    }

    function updateTimestamps() {
        // Select all elements that contain the video URLs
        let videoLinks = document.querySelectorAll('a[href*="/video/"]');

        videoLinks.forEach(link => {
            let videoUrl = link.href;

            let videoIdMatch = videoUrl.match(/\/video\/(\d+)/);

            if (videoIdMatch) {
                let videoId = videoIdMatch[1];
                let timestamp = extractTimestamp(videoId);

                // Find the views count element within the same container
                let viewsElement = link.querySelector('strong.video-count');

                if (viewsElement) {
                    // Replace the views count with the timestamp
                    viewsElement.textContent = timestamp;
                }
            }
        });
    }

    // Function to initialize the script
    function init() {
        // Run the updateTimestamps function initially
        updateTimestamps();

        // Optionally, rerun when the user scrolls or the page updates
        const observer = new MutationObserver(() => {
            updateTimestamps();
        });

        // Observe changes in the document body
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Delay execution to ensure DOM is loaded
    window.addEventListener('load', init);
})();
