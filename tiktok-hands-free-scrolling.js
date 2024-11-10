// ==UserScript==
// @name         TikTok Auto Next on Video End with Delay
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automatically scroll to the next video on TikTok when the current video ends, with a delay to ensure video length loads
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    function setupVideoEndListener(video) {
        if (!video) return;

        console.log('Preparing script to run for video: ', video.src);
        // Remove any existing event listeners to avoid duplicates
        video.removeEventListener('ended', handleVideoEnd);

        // Add an event listener to detect when the video ends, with a delay to ensure the video length has loaded
        setTimeout(() => {
            video.addEventListener('ended', handleVideoEnd);
            console.log('Event listener for video end added');
        }, 3000); // 3 second delay
    }

    function handleVideoEnd() {
        try {
            const video = document.querySelector('video');
            const nextButton = document.querySelector('button[data-e2e="arrow-right"]');

            if (video) {
                console.log('Video ended: ', video.currentTime, 'of', video.duration, 'seconds');
            }

            if (nextButton) {
                console.log('Next button found, attempting to click.');
                nextButton.click();
                console.log('Next button pressed');
            } else {
                console.log('Next button not found');
            }
        } catch (error) {
            console.error('Error occurred during video end handling:', error);
        }
    }

    function observeNewVideos() {
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (video) {
                console.log('New video detected');
                setupVideoEndListener(video);
            } else {
                console.log('No video detected, waiting for new video');
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial setup
    console.log('Script is running');
    observeNewVideos();
})();
