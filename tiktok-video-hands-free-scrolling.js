// ==UserScript==
// @name         TikTok Video Hands Free Scrolling
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  Automatically scroll to the next video on TikTok when the current video ends, with a delay to ensure video length loads
// @author       theCaravan
// @match        https://www.tiktok.com/@*/video/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // Function to handle video end and trigger the next video button click
    function setupVideoEndListener(video) {
        if (!video) return;
        // Remove any existing event listeners to avoid duplicates
        video.removeEventListener('ended', handleVideoEnd);
        // Add an event listener to detect when the video ends, with a delay to ensure the video length has loaded
        setTimeout(() => {
            video.addEventListener('ended', handleVideoEnd);
        }, 3000); // 3 second delay to ensure video is fully loaded
    }

    // Function to handle the end of a video
    function handleVideoEnd() {
        try {
            const video = document.querySelector('video');
            const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
            if (video) {
                console.log('Video ended: ', video.currentTime, 'of', video.duration, 'seconds');
            }
            if (nextButton) {
                console.log('Next button pressed');
                nextButton.click();
            } else {
                console.log('Next button not found');
            }
        } catch (error) {
            console.error('Error occurred during video end handling:', error);
        }
    }

    // Observe new videos on the page
    function observeNewVideos() {
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (video) {
                console.log('Video detected, preparing script to run...');
                setupVideoEndListener(video);
            }
        });

        // Start observing for changes in the document body
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial setup
    observeNewVideos();
})();
