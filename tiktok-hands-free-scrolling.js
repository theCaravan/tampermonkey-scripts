// ==UserScript==
// @name         TikTok Auto Next on Video End with Delay
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  Automatically scroll to the next video on TikTok when the current video ends, with a delay to ensure video length loads
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    let carouselLogged = false; // Flag to track if the carousel has been logged
    let lastVideoUrl = ''; // Variable to track the last video URL to avoid multiple detections

    // Function to detect if the current URL is a TikTok video URL
    function isVideoPage() {
        const url = window.location.href;
        const regex = /https:\/\/www\.tiktok\.com\/@[^\/]+\/video\/\d+/; // Regex to match TikTok video URL
        return regex.test(url);
    }

    // Function to detect if the current URL is a TikTok photo carousel URL
    function isPhotoCarouselPage() {
        const url = window.location.href;
        const regex = /https:\/\/www\.tiktok\.com\/@[^\/]+\/photo\/\d+/; // Regex to match TikTok photo carousel URL
        return regex.test(url);
    }

    // Function to detect and log video detection
    function logVideoDetection() {
        const video = document.querySelector('video');
        const videoUrl = window.location.href;

        // Only log the video detection once for a new video
        if (video && videoUrl !== lastVideoUrl) {
            //console.log('Video detected:', videoUrl);
            lastVideoUrl = videoUrl; // Update the last video URL
        }
    }

    function setupVideoEndListener(video) {
        if (!video) return;
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
                console.log('Next button pressed');
                nextButton.click();
            } else {
                console.log('Next button not found');
            }
        } catch (error) {
            console.error('Error occurred during video end handling:', error);
        }
    }

    function isCarousel() {
        // Check if carousel pagination dots are present
        const paginationWrapper = document.querySelector('.css-1qe8vby-DivPaginationWrapper');
        if (paginationWrapper) {
            const dots = paginationWrapper.querySelectorAll('.css-1wtwqpy-DivDot');
            const imageCount = dots.length + 1; // Adjusted to add 1 to the count
            if (!carouselLogged) {
                console.log('Carousel detected with', imageCount, 'images');
                carouselLogged = true; // Set the flag so it logs only once
            }
            return dots.length > 0;
        }
        return false;
    }

    function observeNewVideos() {
        const observer = new MutationObserver(() => {
            // Only proceed if the page is a TikTok video page
            if (isVideoPage()) {
                logVideoDetection(); // Log when a video is detected

                const video = document.querySelector('video');
                if (video) {
                    setupVideoEndListener(video);
                }
            }

            console.log("here")

            // Check if the page is a photo carousel
            if (isPhotoCarouselPage()) {
                // Only log and handle the carousel if it's a photo carousel
                if (isCarousel()) {
                    console.log('Carousel detected, setting up carousel auto-advance.');
                    setTimeout(() => {
                        const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
                        if (nextButton) {
                            console.log('Carousel auto-advance, next button pressed.');
                            nextButton.click();
                        } else {
                            console.log('Next button not found for carousel.');
                        }
                    }, 10000); // Delay of 10 seconds before advancing carousel
                }
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial setup
    observeNewVideos();
})();
