// ==UserScript==
// @name        Google Sheets Continuous Auto Scroll
// @namespace   Violentmonkey Scripts
// @match       https://docs.google.com/spreadsheets/d/*
// @grant       none
// @version     2.6
// @author      theCaravan (GitHub)
// @description Continuous auto-scroll through a Google Sheet, looping back to the top after reaching the bottom.
// ==/UserScript==

(function() {
  const SCROLL_SPEED = 0.5;  // Speed of the continuous scroll in pixels per step (can be less than 1)
  const DELAY_SEC = 1;       // Delay in seconds at the bottom before scrolling back to the top

  const DELAY_MS = DELAY_SEC * 1000;
  let scrollingElement;
  let accumulatedScroll = 0; // Accumulator for fractional scroll values

  function findScrollingElement() {
    scrollingElement = document.querySelector('.native-scrollbar.native-scrollbar-ltr.native-scrollbar-y');
    if (!scrollingElement) setTimeout(findScrollingElement, 1000);
  }

  function continuousScroll() {
    if (scrollingElement) {
      accumulatedScroll += SCROLL_SPEED;
      if (accumulatedScroll >= 1) {
        scrollingElement.scrollBy(0, Math.floor(accumulatedScroll)); // Apply the accumulated scroll
        accumulatedScroll -= Math.floor(accumulatedScroll); // Subtract the applied scroll amount
      }

      if (scrollingElement.scrollTop + scrollingElement.clientHeight >= scrollingElement.scrollHeight - 1) {
        // Reached the bottom, pause and scroll back to top
        setTimeout(scrollToTop, DELAY_MS);
      } else {
        // Continue scrolling
        requestAnimationFrame(continuousScroll);
      }
    }
  }

  function scrollToTop() {
    scrollingElement.scrollTo(0, 0);
    // Restart scrolling after resetting to the top
    setTimeout(continuousScroll, DELAY_MS);
  }

  findScrollingElement();
  setTimeout(continuousScroll, DELAY_MS);  // Start scrolling after the initial delay
})();
