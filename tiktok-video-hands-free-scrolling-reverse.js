// ==UserScript==
// @name         TikTok Video Hands Free (Reversed)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically move to the previous video on TikTok when the current video ends, now with support for new navigation elements
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
        
        // First try the new navigation button (up arrow in the navigation container)
        const newNavContainer = document.querySelector('.css-1o2f1ti-DivFeedNavigationContainer');
        if (newNavContainer) {
            const upButton = newNavContainer.querySelector('button:first-child');
            if (upButton) {
                console.log('New up navigation button found, clicking to go to the previous video.');
                upButton.click();
                return;
            }
        }
        
        // Fall back to the original method if new navigation not found
        const prevButton = document.querySelector('button[data-e2e="arrow-left"]');
        if (prevButton) {
            console.log('Previous button found, clicking to go to the previous video.');
            prevButton.click();
        } else {
            console.log('Neither new navigation nor previous button found on video end.');
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
