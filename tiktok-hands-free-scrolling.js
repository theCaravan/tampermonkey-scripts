// ==UserScript==
// @name         TikTok Auto Next on Video End with Delay
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Automatically scroll to the next video on TikTok when the current video ends, with a delay to ensure video length loads
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    let isCarousel = false;
    let intervalId;
    let imageCount = 0;
    let carouselProgress = 0;

    function detectCarousel() {
        const carouselControl = document.querySelector('.css-1afuipw-DivPhotoControl');
        if (carouselControl) {
            const paginationDots = carouselControl.querySelectorAll('.css-1jirnpf-DivDotWrapper, .css-19ikq1l-DivDotWrapper');
            imageCount = paginationDots.length;
            console.log('Carousel detected with', imageCount, 'images');
            return imageCount > 0;
        }
        return false;
    }

    function handleCarousel() {
        carouselProgress = 0;
        console.log("Carousel auto-advancing; loop detection active");

        intervalId = setInterval(() => {
            carouselProgress++;
            if (carouselProgress >= imageCount) {
                console.log("Carousel loop detected; moving to next video");
                goToNext();
                clearInterval(intervalId);
            }
        }, 4000); // 4-second check for TikTok's auto-advance timing
    }

    function goToNext() {
        const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
        if (nextButton) {
            console.log('Scrolling to next video');
            nextButton.click();
        } else {
            console.log('Next button not found');
        }
    }

    function handleMedia() {
        isCarousel = detectCarousel();
        if (isCarousel) {
            if (imageCount === 1) {
                console.log("Single image detected; advancing in 4 seconds");
                setTimeout(goToNext, 4000); // 4-second wait for single image
            } else {
                handleCarousel(); // Detect loop for multi-image carousel
            }
        } else {
            const video = document.querySelector('video');
            if (video) {
                video.removeEventListener('ended', goToNext);
                video.addEventListener('ended', goToNext);
                console.log("Video detected; will scroll on end");
            }
        }
    }

    function observeNewMedia() {
        const observer = new MutationObserver(() => {
            clearInterval(intervalId); // Clear previous interval when detecting new media
            handleMedia();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeNewMedia(); // Start script
})();
