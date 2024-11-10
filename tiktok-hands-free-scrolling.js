// ==UserScript==
// @name         TikTok Auto Next on Video End with Delay
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Automatically scroll to the next video on TikTok when the current video ends, with a delay to ensure video length loads
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    let currentVideo = null; // Track the current video

    function setupVideoEndListener(video) {
        if (!video || video === currentVideo) return; // Skip if it's the same video

        currentVideo = video; // Update the current video reference

        // Remove existing event listeners to avoid duplicates
        video.removeEventListener('ended', handleVideoEnd);

        // Add event listener for video end
        setTimeout(() => {
            video.addEventListener('ended', handleVideoEnd);
        }, 3000); // 3 second delay for video length to load
    }

    function handleVideoEnd() {
        try {
            const video = document.querySelector('video');
            const nextButton = document.querySelector('button[data-e2e="arrow-right"]');

            if (video) {
                console.log('Video ended: ', video.currentTime, 'of', video.duration, 'seconds');
            }

            if (nextButton) {
                console.log('Next button found, clicking...');
                nextButton.click();
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

            // Only react if a new video is detected, and ensure we haven't already processed it
            if (video && video !== currentVideo) {
                setupVideoEndListener(video);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial setup
    observeNewVideos();
})();
