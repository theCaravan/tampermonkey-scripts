// ==UserScript==
// @name         Instagram Reel Hands-Free Auto-Advance with Auto-Unmute
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Auto-advance to the next Instagram reel when the current one ends and unmute audio automatically
// @author       theCaravan
// @match        *://www.instagram.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to check if the page is a reel page
    function isReelPage() {
        return window.location.href.includes("/reel/");
    }

    // Function to find the video element
    function findVideoElement() {
        return document.querySelector('video[playsinline]');
    }

    // Function to find the "Next" button
    function findNextButton() {
        return document.querySelector('div._aaqg._aaqh button._abl-');
    }

    // Function to unmute the video directly
    function unmuteVideo() {
        const video = findVideoElement();
        if (video) {
            video.controls = true;
            video.muted = false;
            video.play();
            // Remove all elements under any div with a data-instancekey starting with "id-vpuid-"
            const blockingDivs = document.querySelectorAll('div[data-instancekey^="id-vpuid-"]');
            if (blockingDivs.length > 0) {
                blockingDivs.forEach((blockingDiv) => {
                    console.log(`Blocking div found. Removing its children...`);
                    while (blockingDiv.firstChild) {
                        blockingDiv.firstChild.remove();
                    }
                    console.log('All child elements removed from the blocking div.');
                });
            } else {
                console.log('No blocking divs found.');
            }
        } else {
            console.log("Video element not found.");
        }
    }

    // Function to handle video end event
    function handleVideoEnd() {
        console.log("Video 'ended' event caught.");
        const nextButton = findNextButton();
        if (nextButton) {
            console.log("Next button found, clicking to go to the next reel.");
            nextButton.click();
        }
    }

    // Function to set up video listeners
    function setupVideoListeners(video) {
        if (!video) return;

        // Remove any existing event listeners to avoid duplication
        video.removeEventListener('ended', handleVideoEnd);

        // Add the "ended" event listener
        video.addEventListener('ended', handleVideoEnd);

        // Ensure audio is unmuted when a new video loads
        unmuteVideo();

        console.log("Video listeners set up.");
    }

    // Function to observe changes in the DOM
    function observeReels() {
        const observer = new MutationObserver(() => {
            if (isReelPage()) {
                console.log("Reel page detected.");
                const video = findVideoElement();
                if (video) {
                    console.log("Video element found.");
                    setupVideoListeners(video);
                    video.controls = true;
                    video.muted = false;
                    video.play();
                }
            }

            // Update the date when the page content changes
            updatePostDate();

        });

        // Observe the entire body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to format the date in the desired format
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options); // Adjust the locale as needed
    }

    // Function to update the post date
    function updatePostDate() {
        const timeElements = document.querySelectorAll('time[datetime]');
        timeElements.forEach((timeElement) => {
            const dateString = timeElement.getAttribute('datetime');
            const formattedDate = formatDate(dateString);
            timeElement.textContent = formattedDate;
            timeElement.title = formattedDate; // Update the title too
        });
    }

    // Periodic check to unmute the video if it is muted
    function ensureUnmute() {
        const video = findVideoElement();
        if (video && video.muted) {
            console.log("Video is muted. Unmuting...");
            unmuteVideo();
        }
    }

    // Start observing reels and check unmute every second
    observeReels();
    setInterval(ensureUnmute, 500); // Check every second to ensure the video remains unmuted

})();
