// Landing page behaviour. This is the old super.so Home.js (last deployed Nov 2023)
// minus the parts that built DOM at runtime: the template now renders that DOM
// statically, this file only attaches the behaviour to it.
//
//  - rotating background/title slides (timer, hover, wheel, arrow keys, swipe)
//  - click on a slide title / read-more: pushState, skeleton, smooth scroll,
//    fetch the page and inject its <article> under the hero
//  - scroll-position dependent navbar state + mobile progress bar
//  - mouse trailer (custom cursor) on desktop
//  - mobile top bar: hamburger for the loaded page's sidebar, theme + search proxies
(function () {
  const nativeMax = Math.max;
  const nativeMin = Math.min;
  const smoothScrollDuration = 1000;

  window.disableBgChangeOnChange = false;
  window.preventPushingToHistory = false;

  const width = window.innerWidth;
  const height = window.innerHeight;

  updateVHWithJS();
  window.addEventListener('resize', updateVHWithJS);
  function updateVHWithJS() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  const landingPageItems = window.landingPageItems || [];
  if (!landingPageItems.length) return;

  const trailer = document.querySelector(".lp-mouse-trailer");
  const navbar = document.querySelector(".lp-desktop-notion-navbar");
  const mobileNavbar = document.querySelector(".lp-mobile-notion-navbar");
  const upperNotionColumn = document.querySelector(".lp-selector-upper-notion");
  const lazyLoadedContent = document.querySelector(".lp-ll-content");
  const navitationAnchorsContainer = document.querySelector(".lp-nav-container");
  const mobileNavitationAnchorsContainer = document.querySelector(".lp-mobile-nav-container");
  const navbarProgress = Array.from(document.querySelectorAll(".lp-custom-navbar-progress"));

  //#region mobile topbar
  const menuToggler = document.querySelector("#nav-toggle-mobile");
  menuToggler.addEventListener("click", function () {
    const body = document.querySelector("body");
    const sidebar = document.querySelector(".lp-ll-content article.notion-root > .notion-column-list > .notion-column:first-child");

    if (sidebar) {
      if (sidebar.classList.contains("show-nav") == true) {
        //is open
        sidebar.classList.remove("show-nav");
        body.classList.remove("menu-open");
        menuToggler.classList.remove("active");
      }
      else {
        //is closed
        sidebar.classList.add("show-nav");
        body.classList.add("menu-open");
        menuToggler.classList.add("active");
      }
    }
  });
  //#endregion

  const timerTime = 10000;
  let timerToSwitchBackground = setInterval(switchBackground, timerTime);

  const selectedBgPics = Array.from(document.querySelectorAll(".lp-bg-pic"));
  const navLinks = Array.from(document.querySelectorAll(".lp-desktop-navlink"));
  const selectedBgTexts = Array.from(document.querySelectorAll(".lp-text"));
  const readMoreButton = document.querySelector(".lp-read-more-button");
  const mobileNavLinks = Array.from(document.querySelectorAll(".lp-mobile-navlink")).filter(el => !el.classList.contains("infinite-workaround"));
  const unfilteredMobileNavLinks = Array.from(document.querySelectorAll(".lp-mobile-navlink"));

  let initialPixelTranslation = 0;
  initialPixelTranslation = (initialPixelTranslation + window.innerWidth * 0.5) - mobileNavLinks[0].offsetWidth * 0.5;

  initialPixelTranslation -= mobileNavLinks[0].previousElementSibling.offsetWidth;
  initialPixelTranslation -= mobileNavLinks[0].previousElementSibling.previousElementSibling.offsetWidth;

  mobileNavitationAnchorsContainer.style.transform = `translate3d(${initialPixelTranslation}px, 0px, 0px)`;

  //add event listeners
  navLinks.forEach((item, i) => {
    item.onmouseenter = () => {
      switchBetweenBackground(navLinks, selectedBgPics, selectedBgTexts, mobileNavLinks, i);

      upperNotionColumn.classList.add("selecting-from-menu");
      navbar.classList.add("selecting-from-menu");
      mobileNavbar.classList.add("selecting-from-menu");
      clearInterval(timerToSwitchBackground);
    };
    item.onmouseleave = () => {
      navbar.classList.remove("selecting-from-menu");
      mobileNavbar.classList.remove("selecting-from-menu");
      upperNotionColumn.classList.remove("selecting-from-menu");
      timerToSwitchBackground = setInterval(switchBackground, timerTime);
    }

    //anchor on click
    item.querySelector(".notion-link.link").addEventListener("click", e => {
      e.preventDefault();
      const anchor = e.currentTarget;
      switchBetweenBackground(navLinks, selectedBgPics, selectedBgTexts, mobileNavLinks, i);

      if (window.preventPushingToHistory == false) {
        window.history.pushState(anchor.getAttribute("data-parameter-query"), "", anchor.href);
      }
      window.preventPushingToHistory = false;

      //add skeleton
      lazyLoadedContent.innerHTML = "";
      const skeleton = document.createElement("div");
      skeleton.classList.add("skeleton");
      for (let i = 0; i < height / 30; i++) {
        var iteratingSkeleton = skeleton.cloneNode();
        iteratingSkeleton.style.width = `clamp(30%, calc(600px + ${Math.random() * 2 * 100}px), calc(100% - 2rem))`;
        lazyLoadedContent.appendChild(iteratingSkeleton);
      }
      lazyLoadedContent.firstChild.classList.add("skeleton-title");

      window.disableBgChangeOnChange = true;

      smoothScrollTo(window.innerHeight - 60, smoothScrollDuration);

      fetch(anchor.href)
        .then(html => {
          return html.text();
        })
        .then(html => {
          try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');

            var article = doc.querySelector("article.notion-root").cloneNode(true);
            lazyLoadedContent.innerHTML = "";
            lazyLoadedContent.append(article);
            if (window.heyeLoadTweets) window.heyeLoadTweets(lazyLoadedContent);
            if (window.heyeLoadOrbit) window.heyeLoadOrbit(lazyLoadedContent);

            if (lazyLoadedContent.offsetHeight > height * 3) {
              const columns = lazyLoadedContent.querySelectorAll(".notion-column");
              const leftSidebar = columns[0];
              const rightSidebar = columns[columns.length - 1];

              leftSidebar.classList.add("hide-sidebars");
              rightSidebar.classList.add("hide-sidebars");
            }
          }
          catch (e) {
          }
        }).catch(e => {
        });
    });
  });

  //mobile nav links
  mobileNavLinks.forEach((item, i) => {
    item.querySelector("a").addEventListener("click", e => {
      e.preventDefault();
      const index = item.getAttribute("data-index");
      navLinks[index].querySelector("a.link").click();
    });
  });

  let lastScrollTop = document.documentElement.scrollTop || 0;
  const topbarIcons = Array.from(document.querySelectorAll(".topbar-icons"));
  window.addEventListener("scroll", e => {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (!navbar.classList.contains("lp-scrolled")) {
      if (st > 30) {
        navbar.classList.add("lp-scrolled");
        mobileNavbar.classList.add("lp-scrolled");
      }
    }
    else {
      if (st < 30) {
        navbar.classList.remove("lp-scrolled");
        mobileNavbar.classList.remove("lp-scrolled");

        if (window.preventPushingToHistory == false) {
          window.history.pushState(null, "", "/");
        }
        window.preventPushingToHistory = false;

        window.disableBgChangeOnChange = false;
        lazyLoadedContent.innerHTML = "";
      }
    }

    if (width < 745) {
      if (height - 60 >= st) {
        const progress = Math.min(1, st / (height - 60)) * 100;
        const progressAnimation = {
          width: `${progress}%`
        };
        const topbarIconsAnimation = {
          transform: `translateX(${Math.max(0, (32 - (32 / 100) * (progress * 3)))}px)`
        }

        navbarProgress.forEach(navbarProgresses => {
          navbarProgresses.animate(progressAnimation, {
            duration: 50,
            fill: "forwards"
          });
        })

        topbarIcons.forEach(topbarIcon => {
          topbarIcon.animate(topbarIconsAnimation, {
            duration: 0,
            fill: "forwards"
          })
        })
      }
    }

    lastScrollTop = st <= 0 ? 0 : st;
  }, false);

  window.addEventListener("wheel", throttle(e => {
    try {
      if (Math.abs(e.deltaY) < 10) return
      clearInterval(timerToSwitchBackground);
      timerToSwitchBackground = setInterval(switchBackground, timerTime);
      var index = navLinks.indexOf(document.querySelector(".lp-desktop-navlink.lp-active"));
      switchBetweenBackground(navLinks, selectedBgPics, selectedBgTexts, mobileNavLinks, e.deltaY > 0 ? index + 1 : index - 1);
    }
    catch {
    }
  }, 400));

  try {
    document.querySelector(".lp-notion-navbar > div > a").addEventListener("click", e => {
      e.preventDefault();

      if (window.preventPushingToHistory == false) {
        window.history.pushState(null, "", "/");
      }
      window.preventPushingToHistory = false;

      window.disableBgChangeOnChange = true;

      smoothScrollTo(0, smoothScrollDuration);
    });
  }
  catch (e) {

  }

  document.querySelector(".lp-read-more-button").addEventListener("click", (e) => {
    clearInterval(timerToSwitchBackground);
    timerToSwitchBackground = setInterval(switchBackground, timerTime);
    document.querySelector(".lp-desktop-navlink.lp-active").querySelector("a").click();
  });

  window.addEventListener("popstate", function (e) {
    if (e.state != null) {
      Array.from(navitationAnchorsContainer.querySelectorAll(".notion-link.link")).forEach(anchor => {
        if (anchor.getAttribute("data-parameter-query") == e.state) {
          window.preventPushingToHistory = true;
          anchor.click();
        }
      });
    }
  });

  let touchStartPos = { x: 0, y: 0 };
  const swipeThreshhold = width * 0.05;
  let validToSwitchOnTouchMove = false;

  window.addEventListener('touchstart', (e) => {
    touchStartPos = utilGetPosition(e);
    validToSwitchOnTouchMove = true;
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    const currentPosition = utilGetPosition(e);
    const verticalDifference = currentPosition.y - touchStartPos.y;
    const horizontalDifference = currentPosition.x - touchStartPos.x;

    if (horizontalDifference != verticalDifference) {
      if ((Math.abs(touchStartPos.x - currentPosition.x) >= swipeThreshhold || Math.abs(touchStartPos.y - currentPosition.y) >= swipeThreshhold) && validToSwitchOnTouchMove == true) {
        validToSwitchOnTouchMove = false;
        if (Math.abs(horizontalDifference) > Math.abs(verticalDifference)) {
          clearInterval(timerToSwitchBackground);
          timerToSwitchBackground = setInterval(switchBackground, timerTime);

          if (horizontalDifference > 0) {
            switcToPreviousBackground();
          }
          else {
            switchBackground();
          }
          if (e.cancelable) e.preventDefault();
          return
        }
        else {
          clearInterval(timerToSwitchBackground);
          timerToSwitchBackground = setInterval(switchBackground, timerTime);

          if (verticalDifference < 0) {
            if (!navbar.classList.contains("lp-scrolled")) {
              document.querySelector(".lp-desktop-navlink.lp-active").querySelector("a").click();
            }
          }

          if (e.cancelable) e.preventDefault();
          return
        }
      }
    }
  }, { passive: false });
  window.addEventListener('touchend', (e) => {
    validToSwitchOnTouchMove = true;
  }, { passive: true });


  //#region add mouse trailer
  if (width > 745) {
    const trailerAnimation = (e, interacting) => {
      const x = e.clientX - trailer.offsetWidth * 0.5;
      const y = e.clientY - trailer.offsetHeight * 0.5;

      const positionAnimation = {
        transform: `translate(${x}px, ${y}px) scale(${interacting ? 8 : 1})`
      };

      if (interacting && !trailer.classList.contains("show-arrow")) {
        changeCursor(trailer, e.target.getAttribute("data-current-bg"));
        trailer.classList.add("show-arrow");
      }
      else if (!interacting && trailer.classList.contains("show-arrow")) {
        removeAllImageCursor(trailer);
        trailer.classList.remove("show-arrow");
      }

      trailer.animate(positionAnimation, {
        duration: 800,
        fill: "forwards"
      });

    }
    window.onmousemove = e => {
      const interactable = e.target.closest(".lp-read-more-button");
      const interacting = interactable != null;

      trailerAnimation(e, interacting);
    }
  }
  document.onkeydown = function (event) {
    if (document.querySelector(".notion-search.open")) return;
    if (!navbar.classList.contains("lp-scrolled")) {
      switch (event.keyCode) {
        case 37:
          switcToPreviousBackground();
          break;
        case 38:
          switcToPreviousBackground();
          break;
        case 39:
          switchBackground();
          break;
        case 40:
          switchBackground();
          break;
      }
    }
  };

  function changeCursor(mouseTrailerEl, cursorCode) {
    removeAllImageCursor(mouseTrailerEl);

    const lpItem = landingPageItems.find(lp => lp.button == cursorCode);
    const cursorLink = lpItem ? lpItem.cursor : null;
    if (cursorLink != null && cursorLink != "") {
      mouseTrailerEl.insertAdjacentHTML('afterbegin',
        `<img alt="Mouse trailer cursor" class="cursor-picture" src="${cursorLink}">`
      );
    }
  }
  function removeAllImageCursor(mouseTrailerEl) {
    const cursors = Array.from(mouseTrailerEl.querySelectorAll(".cursor-picture"));
    cursors.forEach(cursor => {
      cursor.remove();
    });
  }
  //#endregion

  function smoothScrollTo(to, duration) {
    const element = document.scrollingElement || document.documentElement,
      start = element.scrollTop,
      change = to - start,
      startDate = +new Date();

    const linearTween = (t, b, c, d) => {
      return c * t / d + b;
    };

    const animateScroll = _ => {
      const currentDate = +new Date();
      const currentTime = currentDate - startDate;
      element.scrollTop = parseInt(linearTween(currentTime, start, change, duration));
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      }
      else {
        element.scrollTop = to;
      }
    };
    animateScroll();
  };

  function debounce(func, wait, options) {
    let lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;
    wait = Number(wait) || 0;
    if (typeof options === 'object') {
      leading = !!options.leading;
      maxing = 'maxWait' in options;
      maxWait = maxing
        ? nativeMax(Number(options.maxWait) || 0, wait)
        : maxWait;
      trailing = 'trailing' in options
        ? !!options.trailing
        : trailing;
    }

    function invokeFunc(time) {
      let args = lastArgs,
        thisArg = lastThis;

      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading
        ? invokeFunc(time)
        : result;
    }

    function remainingWait(time) {
      let timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;
      return maxing
        ? nativeMin(result, maxWait - timeSinceLastInvoke)
        : result;
    }

    function shouldInvoke(time) {
      let timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;
      return (lastCallTime === undefined || (timeSinceLastCall >= wait) || (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
    }

    function timerExpired() {
      const time = Date.now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    function debounced() {
      let time = Date.now(),
        isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    return debounced;
  }

  function throttle(func, wait, options) {
    let leading = true,
      trailing = true;
    if (typeof options === 'object') {
      leading = 'leading' in options
        ? !!options.leading
        : leading;
      trailing = 'trailing' in options
        ? !!options.trailing
        : trailing;
    }
    return debounce(func, wait, {
      leading,
      maxWait: wait,
      trailing,
    });
  }

  function switchBetweenBackground(itemArray, backgroundPictures, backgroundTexts, mobileNavLinks, index, resetCounter = true) {
    if (window.disableBgChangeOnChange == true) {
      return;
    }

    if (resetCounter == true) {
      clearInterval(timerToSwitchBackground);
      timerToSwitchBackground = setInterval(switchBackground, timerTime);
    }

    let modifiedIndex = index >= itemArray.length ? 0 : index;
    modifiedIndex = modifiedIndex < 0 ? itemArray.length - 1 : modifiedIndex;

    itemArray.forEach(innerItem => {
      innerItem.classList.remove("lp-active");
    });

    backgroundPictures.forEach((bgItem) => {
      bgItem.classList.remove("active-bg");
    });

    backgroundTexts.forEach((bgText) => {
      bgText.classList.remove("active-bg-text");
    });

    mobileNavLinks.forEach(mobileNavLink => {
      mobileNavLink.classList.remove("lp-mobile-active");
    });

    itemArray[modifiedIndex].classList.add("lp-active");
    backgroundPictures[modifiedIndex].classList.add("active-bg");
    backgroundTexts[modifiedIndex].classList.add("active-bg-text");
    mobileNavLinks[modifiedIndex].classList.add("lp-mobile-active");

    //reset gif animations
    const backgroundTextsImg = backgroundTexts[modifiedIndex].querySelector("img");
    if (backgroundTextsImg && backgroundTextsImg.src.includes(".gif")) {
      const link = backgroundTextsImg.src;
      backgroundTextsImg.src = "";
      backgroundTextsImg.src = link;
    }
    const backgroundTextsVideo = backgroundTexts[modifiedIndex].querySelector("video");
    if (backgroundTextsVideo) {
      backgroundTextsVideo.pause();
      backgroundTextsVideo.currentTime = 0;
      backgroundTextsVideo.load();
    }
    const backgroundVideo = backgroundPictures[modifiedIndex].querySelector("video");
    if (backgroundVideo) {
      backgroundVideo.pause();
      backgroundVideo.currentTime = 0;
      backgroundVideo.load();
    }
    //update cursor
    changeCursor(trailer, landingPageItems[modifiedIndex].button);

    readMoreButton.setAttribute("data-current-bg", landingPageItems[modifiedIndex].button);

    let pixelsToTranslate = 0;
    mobileNavLinks.forEach((mobileNavLink, i) => {
      if (i < modifiedIndex) {
        pixelsToTranslate -= mobileNavLink.offsetWidth;
      }
    });
    pixelsToTranslate = (pixelsToTranslate + width * 0.5) - mobileNavLinks[modifiedIndex].offsetWidth * 0.5;
    pixelsToTranslate -= mobileNavLinks[0].previousElementSibling.offsetWidth;
    pixelsToTranslate -= mobileNavLinks[0].previousElementSibling.previousElementSibling.offsetWidth;

    //no transition when wrapping around
    if (index == modifiedIndex) {
      mobileNavLinks[modifiedIndex].parentElement.style.transform = `translate3d(${pixelsToTranslate}px, 0px, 0px)`;
    }
    else {
      window.disableBgChangeOnChange = true;

      let pixels = 0;

      if (index < modifiedIndex) {
        pixels = (pixels + width * 0.5) - mobileNavLinks[0].previousElementSibling.offsetWidth * 0.5;
        pixels -= mobileNavLinks[0].previousElementSibling.previousElementSibling.offsetWidth;
        mobileNavLinks[0].previousElementSibling.classList.add("lp-mobile-active");
      }
      else {
        unfilteredMobileNavLinks.forEach((mobileNavLink, i) => {
          if (i < unfilteredMobileNavLinks.length - 2) {
            pixels -= mobileNavLink.offsetWidth;
          }
        });
        pixels = (pixels + width * 0.5) - mobileNavLinks[mobileNavLinks.length - 2].nextElementSibling.offsetWidth * 0.5;
        mobileNavLinks[mobileNavLinks.length - 1].nextElementSibling.classList.add("lp-mobile-active");
      }

      mobileNavLinks[modifiedIndex].parentElement.style.transform = `translate3d(${pixels}px, 0px, 0px)`;

      setTimeout(() => {

        mobileNavLinks[modifiedIndex].parentElement.style.transition = "none";
        mobileNavLinks[modifiedIndex].parentElement.style.transform = `translate3d(${pixelsToTranslate}px, 0px, 0px)`;

        setTimeout(() => {
          mobileNavLinks[modifiedIndex].parentElement.style.transition = null;

          mobileNavLinks[0].previousElementSibling.classList.remove("lp-mobile-active");
          mobileNavLinks[mobileNavLinks.length - 1].nextElementSibling.classList.remove("lp-mobile-active");
          window.disableBgChangeOnChange = false;
        }, 1);
      }, 600);
    }
  }

  function switchBackground() {
    var index = navLinks.indexOf(document.querySelector(".lp-desktop-navlink.lp-active"));
    switchBetweenBackground(navLinks, selectedBgPics, selectedBgTexts, mobileNavLinks, index + 1);
  }
  function switcToPreviousBackground() {
    var index = navLinks.indexOf(document.querySelector(".lp-desktop-navlink.lp-active"));
    switchBetweenBackground(navLinks, selectedBgPics, selectedBgTexts, mobileNavLinks, index - 1);
  }

  function utilGetPosition(e) {
    var x = 0, y = 0;
    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
      var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
      var touch = evt.touches[0] || evt.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
    }
    else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
      x = e.clientX;
      y = e.clientY;
    }
    return { x, y };
  }

  // Deep link: /?p=/arcadia (used by the 404 fallback) or a slide path given as hash
  const wanted = new URLSearchParams(location.search).get("p");
  if (wanted) {
    const anchor = navitationAnchorsContainer.querySelector(`.notion-link.link[href="${wanted}"]`);
    if (anchor) {
      window.preventPushingToHistory = true;
      history.replaceState(anchor.getAttribute("data-parameter-query"), "", wanted);
      anchor.click();
    }
  }
})();
