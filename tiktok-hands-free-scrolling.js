// ==UserScript==
// @name         TikTok Auto Next on Video End with Delay
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Automatically scroll to the next video on TikTok when the current video ends, with a delay to ensure video length loads
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    function handleContent() {
        if (isCarousel()) {
            console.log("Carousel detected. Advancing after 10 seconds.");
            setTimeout(goToNextVideo, 10000); // 10 seconds delay for carousels
        } else {
            console.log("Regular video detected. Monitoring for video end.");
            const video = document.querySelector('video');
            if (video) {
                video.addEventListener('ended', () => {
                    console.log("Video ended, advancing to next.");
                    goToNextVideo();
                }, { once: true });
            }
        }
    }

    function observeNewMedia() {
        const observer = new MutationObserver(() => {
            clearInterval(intervalId); // Clear previous interval when detecting new media
            handleContent();
        });

        // Observe changes on the entire body
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("Observation started on the entire body.");
    }

    function isCarousel() {
        // Check if carousel pagination dots are present
        return document.querySelector('.css-1qe8vby-DivPaginationWrapper') !== null;
    }

    function goToNextVideo() {
        const nextButton = document.querySelector('[data-e2e="arrow-right"]');
        if (nextButton) {
            console.log("Next button identified, advancing to next video.");
            nextButton.click();
        } else {
            console.log("Next button not found.");
        }
    }

    // Attempt to observe changes in the body
    observeNewMedia(); // Start observing changes on the entire body

})();
