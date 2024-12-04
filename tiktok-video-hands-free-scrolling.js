// ==UserScript==
// @name         TikTok Video Hands-Free
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically move to the next video on TikTok when the current video ends
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Check if the page is a video page
    function isVideoPage() {
        return window.location.href.includes("/video/");
    }

    // Function to handle the video end event
    function handleVideoEnd() {
        console.log("Video 'ended' event caught.");
        const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
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
        //console.log("Video 'ended' event listener added.");
    }

    // Function to observe new videos on the page
    function observeNewVideos() {
        const observer = new MutationObserver(() => {
            if (isVideoPage()) {
                //console.log("Video page detected, checking for video and next button.");

                const video = document.querySelector('video');
                if (video) {
                    //if (!video.paused) {
                    //    console.log('Video detected and currently playing.');
                    //} else {
                    //    console.log('Video detected but not playing yet.');
                    //}

                    const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
                    if (nextButton) {
                        //console.log("Next button detected on video page.");
                    } else {
                        console.log("Next button not detected on video page.");
                    }

                    setupVideoEndListener(video);
                } else {
                    console.log('No video element found on page.');
                }
            }
        });
        
        // Observe changes to the body for new videos (SPA support)
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start observing for videos
    observeNewVideos();
})();
