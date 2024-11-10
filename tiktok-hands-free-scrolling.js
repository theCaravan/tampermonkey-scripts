// ==UserScript==
// @name         TikTok Auto Next on Video End with Delay
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Automatically scroll to the next video on TikTok when the current video ends, with a delay to ensure video length loads
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    let currentVideo = null; // Keep track of the current video

    function setupVideoEndListener(video) {
        if (!video || video === currentVideo) return; // If it's the same video, don't proceed

        currentVideo = video; // Update current video reference

        // Remove any existing event listeners to avoid duplicates
        video.removeEventListener('ended', handleVideoEnd);

        // Add an event listener to detect when the video ends, with a delay to ensure the video length has loaded
        setTimeout(() => {
            video.addEventListener('ended', handleVideoEnd);
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

            // If a new video is detected and it’s not the same as the current one, set it up
            if (video && video !== currentVideo) {
                console.log('New video detected, preparing script to run...');
                setupVideoEndListener(video);
            } else {
                console.log('No new video detected or video already processed.');
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial setup
    observeNewVideos();
})();
