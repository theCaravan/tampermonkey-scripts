// ==UserScript==
// @name         TikTok Video Hands Free (Normal)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically move to the older video (downward in feed) on TikTok when the current video ends
// @author       theCaravan (GitHub)
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    function isVideoPage() {
        return window.location.href.includes("/video/");
    }
    
    function handleVideoEnd() {
        console.log("Video 'ended' event caught.");
        
        // First try the new navigation button (down arrow in the navigation container)
        const newNavContainer = document.querySelector('.css-1o2f1ti-DivFeedNavigationContainer');
        if (newNavContainer) {
            // Get all buttons and find the down button (second one with down arrow icon)
            const buttons = newNavContainer.querySelectorAll('button');
            const downButton = buttons[1]; // Second button (index 1) should be the down button
            
            if (downButton) {
                // Check if it contains the down arrow icon
                const downIconSVG = downButton.querySelector('svg path[d^="m24 27.76"]');
                if (downIconSVG) {
                    console.log('Down navigation button found, clicking to go to the older video.');
                    downButton.click();
                    return;
                }
            }
        }
        
        // Fall back to the original method if new navigation not found
        const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
        if (nextButton) {
            console.log('Next button found, clicking to go to the older video.');
            nextButton.click();
        } else {
            console.log('Neither down navigation nor next button found on video end.');
        }
    }
    
    function setupVideoEndListener(video) {
        if (!video) return;
        video.removeEventListener('ended', handleVideoEnd);
        video.addEventListener('ended', handleVideoEnd);
    }
    
    function observeNewVideos() {
        const observer = new MutationObserver(() => {
            if (isVideoPage()) {
                const video = document.querySelector('video');
                if (video) {
                    setupVideoEndListener(video);
                } else {
                    console.log('No video element found on page.');
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    observeNewVideos();
})();
