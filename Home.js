//<script>
const nativeMax = Math.max;
const nativeMin = Math.min;

window.disableBgChangeOnChange = false;
window.preventPushingToHistory = false;

console.count("Times this script ran");
const perf0 = performance.now();

//#region assign classes so my css doesnt affect other nodes in different pages
document.querySelector(".super-root").classList.add("lp-super-root");
document.querySelector(".super-footer").classList.add("lp-super-footer");
document.querySelector(".super-content").classList.add("lp-super-content");
document.querySelector(".notion-navbar").classList.add("lp-notion-navbar");
document.querySelector(".notion-icon__search-path").classList.add("lp-notion-icon__search-path");
//#endregion

//navigationParameterQuery is obtained by writing going to the page and executing "history.state" in the dev tool console
const landingPageItems = [
  {
    navigationText: "Writings",
    navigationPath: "/writings-and-notes",
    navigationParameterQuery: "/[...page]?page=writing-db&page=writings-and-notes",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_west,h_${height},w_${width}/v1669009342/Heye.earth/Projects/High%20Res%20Backgrounds/Writings_and_Notes_Background_sssvel.png`
      }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_crop,g_west,h_${height},q_100,w_${width},x_0,y_0/v1669009342/Heye.earth/Projects/High%20Res%20Backgrounds/Writings_and_Notes_Background_sssvel.png`
    },
    bgPictureClasses: "lp-bg bg-writings",
    bgPictureAlt: "Writings and Notes",
    textLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/a_90/c_crop,g_east,h_893,w_676/v1669001425/Heye.earth/Projects/Fonts/2_tuhqcg.svg`
      }
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669001425/Heye.earth/Projects/Fonts/2_tuhqcg.svg";
    },
    textClasses: "lp-text lp-text-writings",
    currentBgForButton: "lp-read-more-button-writings"
  },
  {
    navigationText: "Næxt.one",
    navigationPath: "/nxtone",
    navigationParameterQuery: "/[...page]?page=nxtone",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/a_90/c_scale,h_${height}/c_crop,g_center,h_${height},w_${width}/v1669009320/Heye.earth/Projects/High%20Res%20Backgrounds/Naext_one_background__horizontal_fjrnww.jpg`
      }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,g_center,h_${height},w_${width}/v1669009320/Heye.earth/Projects/High%20Res%20Backgrounds/Naext_one_background__horizontal_fjrnww.jpg`
    },
    bgPictureAlt: "Næxt.one",
    bgPictureClasses: "lp-bg bg-naext",
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669276814/Heye.earth/Projects/Fonts/Naext-logo-combined_itagq1.svg";
    },
    textClasses: "lp-text lp-text-naext",
    currentBgForButton: "lp-read-more-button-naext"
  },
  {
    navigationText: "Arcadia",
    navigationPath: "/arcadia",
    navigationParameterQuery: "/[...page]?page=arcadia",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,h_${height},w_${width}/v1669013734/Heye.earth/Projects/High%20Res%20Backgrounds/Arcadia_Background_k0earl.jpg`
    }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/v1669013734/Heye.earth/Projects/High%20Res%20Backgrounds/Arcadia_Background_k0earl.jpg`
    },
    bgPictureAlt: "Arcadia",
    bgPictureClasses: "lp-bg bg-arcadia",
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669001425/Heye.earth/Projects/Fonts/5_fsguhv.svg";
    },
    textClasses: "lp-text lp-text-arcadia",
    currentBgForButton: "lp-read-more-button-arcadia"
  },
  {
    navigationText: "DEEPWAVE",
    navigationPath: "/deepwave",
    navigationParameterQuery: "/[...page]?page=deepwave",
    bgPictureLinkGetter: function(width, height){
            if(width <= 745){
      return `https://res.cloudinary.com/deepwave-org/image/upload/a_90/c_scale,h_${height}/c_crop,h_${height},w_${width}/v1669013918/Heye.earth/Projects//High%20Res%20Backgrounds/DEEPWAVE_Background_Desktop_fsgrr0_32322d_2.png`
    }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,h_${height},w_${width},g_west,x_0,y_0/v1669013918/Heye.earth/Projects//High%20Res%20Backgrounds/DEEPWAVE_Background_Desktop_fsgrr0_32322d_2.png`
    },
    bgPictureAlt: "DEEPWAVE",
    bgPictureClasses: "lp-bg lp-bg-deepwave",
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/c_crop,g_west,h_893,w_663/v1669001425/Heye.earth/Projects/Fonts/11_hiq2id.svg";
    },
    textClasses: "lp-text lp-text-deepwave",
    currentBgForButton: "lp-read-more-button-deepwave"
  },
  {
    navigationText: "Future Forum",
    navigationPath: "/future-forum",
    navigationParameterQuery: "/[...page]?page=future-forum",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_center,h_${height},w_${width}/v1669845133/Heye.earth/Projects/High%20Res%20Backgrounds/52e8cfed-4ac2-4d97-91d4-d755527507de_6192x4128_zik8b3.jpg`
      }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,h_${height},w_${width}/v1669845133/Heye.earth/Projects/High%20Res%20Backgrounds/52e8cfed-4ac2-4d97-91d4-d755527507de_6192x4128_zik8b3.jpg`
    },
    bgPictureAlt: "Future Forum",
    bgPictureClasses: "lp-bg lp-bg-future-forum",
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669844781/Heye.earth/Projects/Fonts/R2_Future-Forum-White-Logo-Animation_R1_qkldkz.gif";
    },
    textClasses: "lp-text lp-text-future-forum",
    currentBgForButton: "lp-read-more-button-future-forum"
  },
  {
    navigationText: "ML Explainer",
    navigationPath: "/make-machines-learn-explainer",
    navigationParameterQuery: "/[...page]?page=make-machines-learn-explainer",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_center,h_${height},w_${width}/v1669010010/Heye.earth/Projects/High%20Res%20Backgrounds/ML_Explainer_Background_am8pvf.png`
    }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,g_east,h_${height},w_${width}/v1669010010/Heye.earth/Projects/High%20Res%20Backgrounds/ML_Explainer_Background_am8pvf.png`
    },
    bgPictureAlt: "“Make Machines Learn” Explainer",
    bgPictureClasses: "lp-bg lp-bg-ml-explainer",
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669001425/Heye.earth/Projects/Fonts/8_dux6mo.svg";
    },
    textClasses: "lp-text lp-text-ml-explainer",
    currentBgForButton: "lp-read-more-button-ml-explainer"
  },
  {
    navigationText: "The Hike",
    navigationPath: "/the-hike",
    navigationParameterQuery: "/[...page]?page=the-hike",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_north,h_${height},w_${width}/v1669009989/Heye.earth/Projects/High%20Res%20Backgrounds/The_Hike_Backgroun_p1xfb2.webp`
    }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,g_north,h_${height},w_${width},y_0,y_200/v1669009989/Heye.earth/Projects/High%20Res%20Backgrounds/The_Hike_Backgroun_p1xfb2.webp`
    },
    bgPictureAlt: "The Hike",
    bgPictureClasses: "lp-bg lp-bg-the-hike",
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669011925/Heye.earth/Projects/Fonts/The_Hike_Font_octbmz.svg";
    },
    textClasses: "lp-text lp-text-the-hike",
    currentBgForButton: "lp-read-more-button-the-hike"
  },
  {
    navigationText: "Art",
    navigationPath: "/ai-art",
    navigationParameterQuery: "/[...page]?page=ai-art",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_north,h_${height},w_${width}/v1669013716/Heye.earth/Projects/High%20Res%20Backgrounds/AI_Art_Background_ae3c2d.png`
      }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,g_north,h_${height},w_${width},x_0,y_120/v1669013716/Heye.earth/Projects/High%20Res%20Backgrounds/AI_Art_Background_ae3c2d.png`
    },
    bgPictureAlt: "(AI-) Art",
    bgPictureClasses: "lp-bg lp-bg-ai-art",
    textLinkGetter: function(width, height){
      if(width <= 745){
        return "https://res.cloudinary.com/deepwave-org/image/upload/v1669144557/Heye.earth/Projects/Fonts/AI_Art_Font_ymvkbz.svg"
      }
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669144557/Heye.earth/Projects/Fonts/AI_Art_Font_ymvkbz.svg";
    },
    textClasses: "lp-text lp-text-ai-art"
  },/*
  {
    navigationText: "Fake News",
    navigationPath: "/fake-db/how-to-deal-with-fake-news",
    navigationParameterQuery: "/[...page]?page=fake-db&page=how-to-deal-with-fake-news",
    bgPictureLinkGetter: function(width, height){
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,h_${height},w_${width}/v1669013716/Heye.earth/Projects/High%20Res%20Backgrounds/Fake_News_Background_desktop_hqcv63.png`
    },
    bgPictureAlt: "How to deal with Fake News",
    bgPictureClasses: "lp-bg lp-bg-fake-news",
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669012106/Heye.earth/Projects/Fonts/Fake_News_Font_oonkrk.png";
    },
    textClasses: "lp-text lp-text-fake-news",
    currentBgForButton: "lp-read-more-button-fake-news"
  },*/
  {
    navigationText: "Onno, Anna & Tjark",
    navigationPath: "/onno-anna",
    navigationParameterQuery: "/[...page]?page=onna-anna",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_north,h_${height},w_${width}/v1669013682/Heye.earth/Projects/High%20Res%20Backgrounds/Onno_Background_ypldvs.png`
    }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_crop,g_north_east,h_${height},w_${width},x_0,y_200/v1669013682/Heye.earth/Projects/High%20Res%20Backgrounds/Onno_Background_ypldvs.png`
    },
    bgPictureAlt: "Onno, Anna & Tjark",
    bgPictureClasses: "lp-bg lp-bg-onna-anna",
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669001425/Heye.earth/Projects/Fonts/14_mnl60i.svg";
    },
    textClasses: "lp-text lp-text-onna-anna",
    currentBgForButton: "lp-read-more-button-onna-anna"
  },
  {
    navigationText: "About Me",
    navigationPath: "/hi-i-am-heye-high-ye",
    navigationParameterQuery: "/[...page]?page=hi-i-am-heye-high-ye",
    bgPictureLinkGetter: function(width, height){
            if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_east,h_${height},w_${width}/v1669009360/Heye.earth/Projects/High%20Res%20Backgrounds/About_me_Background_mpnje8.png`
      }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,g_east,h_${height},w_${width},x_0,y_200/v1669009360/Heye.earth/Projects/High%20Res%20Backgrounds/About_me_Background_mpnje8.png`
    },
    bgPictureAlt: "Hi! I am Heye [High ye] 🖐️",
    bgPictureClasses: "lp-bg lp-bg-about-me",
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669001425/Heye.earth/Projects/Fonts/16_e6kpjc.svg";
    },
    textClasses: "lp-text lp-text-about-me",
    currentBgForButton: "lp-read-more-button-about-me"
  }
];

const navbar = document.querySelector(".lp-notion-navbar");
navbar.insertAdjacentHTML('beforeend', `<div class="lp-custom-navbar-progress"></div>`);

const covers = document.querySelector(".notion-collection-card__cover");
var contentNotionColumn = covers.parentElement.parentElement.parentElement.parentElement;
var upperNotionColumn = contentNotionColumn.parentElement;
upperNotionColumn.classList.add("lp-selector-upper-notion");
contentNotionColumn.remove()

var darkBg = document.createElement("div");
darkBg.classList.add("lp-dark-bg");

upperNotionColumn.insertAdjacentHTML('afterbegin', `<div class="lp-effect-line-upper-container">
  <div class="lp-effect-line-container">
    <div class="lp-effect-line">
    </div>
  </div>
</div>`);

const readMoreButtonContainer = document.createElement("div");
readMoreButtonContainer.classList.add("lp-read-more-button-container");
readMoreButtonUpperContainer = document.createElement("div");
readMoreButtonUpperContainer.classList.add("lp-read-more-button-upper-container");
readMoreButtonContainer.insertAdjacentHTML('beforeend', `<button class="lp-read-more-button lp-show" data-current-bg="${landingPageItems[0].currentBgForButton}">
  <span>
    <i class="gg-chevron-down"></i>
  </span>
</button>`);

readMoreButtonUpperContainer.append(readMoreButtonContainer);
upperNotionColumn.append(readMoreButtonUpperContainer);

var bgPics = document.createElement("div");
bgPics.append(darkBg);
bgPics.classList.add("lp-bg-pics");
upperNotionColumn.append(bgPics);

const lazyLoadedContent = document.createElement("div");
lazyLoadedContent.classList.add("lp-ll-content");
upperNotionColumn.parentElement.insertBefore(lazyLoadedContent, upperNotionColumn.nextSibling);

var bgTexts = document.createElement("div");
bgTexts.classList.add("lp-bg-texts");
upperNotionColumn.append(bgTexts);

//iterate through landingPageItems to append neccessary HTML
var navitationAnchorsContainer = document.createElement("div");
navitationAnchorsContainer.classList.add("lp-nav-container");

var mobileNavitationAnchorsContainer = document.createElement("div");
mobileNavitationAnchorsContainer.classList.add("lp-mobile-nav-container");

var upperMobileNavitationAnchorsContainer = document.createElement("div");
upperMobileNavitationAnchorsContainer.classList.add("lp-mobile-nav-upper-container");
upperMobileNavitationAnchorsContainer.appendChild(mobileNavitationAnchorsContainer);

const width = window.innerWidth;
const height = window.innerHeight;

const lastIndexOfItems = landingPageItems.length - 1;

mobileNavitationAnchorsContainer.insertAdjacentHTML('beforeend', `<div class="lp-mobile-navlink infinite-workaround" data-index="${lastIndexOfItems - 1}">
  <a href="${landingPageItems[lastIndexOfItems - 1].navigationPath}">${landingPageItems[lastIndexOfItems - 1].navigationText}</a>
</div>`);
mobileNavitationAnchorsContainer.insertAdjacentHTML('beforeend', `<div class="lp-mobile-navlink infinite-workaround" data-index="${lastIndexOfItems}">
  <a href="${landingPageItems[lastIndexOfItems].navigationPath}">${landingPageItems[lastIndexOfItems].navigationText}</a>
</div>`);

landingPageItems.forEach((landingPageItem,i) => {
  bgPics.insertAdjacentHTML('beforeend', `<span class="default-bg-pic-container-style lp-bg-pic ${i == 0 ? "active-bg" : ""} ${landingPageItem.bgPictureClasses}">
    <img class="default-bg-pic-style" alt="${landingPageItem.bgPictureAlt}" src="${landingPageItem.bgPictureLinkGetter(width, height)}" decoding="async" data-nimg="fill" >
  </span>`);

  navitationAnchorsContainer.insertAdjacentHTML('beforeend', `<span class="lp-desktop-navlink ${i == 0 ? "lp-active" : ""}">
    <a class="notion-link link" href="${landingPageItem.navigationPath}" data-parameter-query="${landingPageItem.navigationParameterQuery}">${landingPageItem.navigationText}</a>
    <div class="lp-navigation-link-left-border"></div>
  </span>`);

  bgTexts.insertAdjacentHTML('beforeend', `
    <div class="${landingPageItem.textClasses} align-start page-width ${i == 0 ? "active-bg-text" : ""}">
      <span>
        <span>
        </span>
        <img alt="image" src="${landingPageItem.textLinkGetter(width, height)}" decoding="async" data-nimg="responsive" >
      </span>
    </div>`);

  mobileNavitationAnchorsContainer.insertAdjacentHTML('beforeend', `<div class="lp-mobile-navlink ${i == 0 ? "lp-mobile-active" : ""}" data-index="${i}">
      <a href="${landingPageItem.navigationPath}">${landingPageItem.navigationText}</a>
    </div>`);
});

mobileNavitationAnchorsContainer.insertAdjacentHTML('beforeend', `<div class="lp-mobile-navlink infinite-workaround" data-index="${0}">
  <a href="${landingPageItems[0].navigationPath}">${landingPageItems[0].navigationText}</a>
</div>`);

mobileNavitationAnchorsContainer.insertAdjacentHTML('beforeend', `<div class="lp-mobile-navlink infinite-workaround" data-index="${1}">
  <a href="${landingPageItems[1].navigationPath}">${landingPageItems[1].navigationText}</a>
</div>`);

upperNotionColumn.append(navitationAnchorsContainer);
upperNotionColumn.append(upperMobileNavitationAnchorsContainer);


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

initialPixelTranslation -= mobileNavLinks[0].previousSibling.offsetWidth;
initialPixelTranslation -= mobileNavLinks[0].previousSibling.previousSibling.offsetWidth;

mobileNavitationAnchorsContainer.style.transform = `translate3d(${initialPixelTranslation}px, 0px, 0px)`;

//add event listeners
navLinks.forEach((item, i) => {
  item.onmouseenter = () => {
    switchBetweenBackground(navLinks, selectedBgPics, selectedBgTexts, mobileNavLinks, i);

    upperNotionColumn.classList.add("selecting-from-menu");
    navbar.classList.add("selecting-from-menu");
    clearInterval(timerToSwitchBackground);
  };
  item.onmouseleave = () => {
    navbar.classList.remove("selecting-from-menu");
    upperNotionColumn.classList.remove("selecting-from-menu");
    timerToSwitchBackground = setInterval(switchBackground, timerTime);
  }

  //anchor on click
  item.querySelector(".notion-link.link").addEventListener("click", e => {
    e.preventDefault();
    switchBetweenBackground(navLinks, selectedBgPics, selectedBgTexts, mobileNavLinks, i);

    if(window.preventPushingToHistory == false){
      window.history.pushState(e.target.getAttribute("data-parameter-query"), "", e.target.href);
    }
    window.preventPushingToHistory = false;

    //add skeleton
    const skeleton = document.createElement("div");
    skeleton.classList.add("skeleton");
    for(let i = 0; i < height / 30; i++){
      var iteratingSkeleton = skeleton.cloneNode();
      iteratingSkeleton.style.width = `clamp(30%, calc(600px + ${Math.random() * 2 * 100}px), calc(100% - 2rem))`;
      lazyLoadedContent.appendChild(iteratingSkeleton);
    }
    lazyLoadedContent.firstChild.classList.add("skeleton-title");

    window.disableBgChangeOnChange = true;
    scrollTo(window.innerHeight - 70, 1000);

    fetch(e.target.href)
    .then(html => {
      return html.text();
    })
    .then(html => {
      try{
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        if(doc){
          doc.querySelector("head").remove();
        }

        Array.from(doc.querySelectorAll("img")).forEach(img => {
          if(img.src.includes("data:image/gif;base64")){
            img.src = img.nextSibling.firstChild.src;
          }
        })

        var article = doc.querySelector("article.notion-root").cloneNode(true);
        lazyLoadedContent.innerHTML = "";
        lazyLoadedContent.append(article);

        if(e.target.href.includes("/make-machines-learn-explainer")){
          document.querySelector(".notion-embed__loader").remove();
          document.querySelector(".LazyLoad").insertAdjacentHTML('beforeend', `<div class="notion-external-object"><a href="https://github.com/DonSqualo/Machine-Learning-Explainer" target="_blank" rel="noopener noreferrer" class="notion-external-object__attributes-wrapper"><div class="notion-external-object__attributes"><picture><img class="notion-external-object__avatar" loading="lazy" width="100%"></picture><div class="notion-external-object__details"><p>Machine-Learning-Explainer</p><p class="notion-external-object__last-modified">Last modified 8 days ago</p></div></div></a></div>`);
        }
        else if(e.target.href.includes("/nxtone")){
          document.querySelector(".notion-embed__loader").remove();
          document.querySelector(".LazyLoad").insertAdjacentHTML('beforeend', `<div class="notion-external-object"><a href="https://github.com/DonSqualo/naext-one-plugin" target="_blank" rel="noopener noreferrer" class="notion-external-object__attributes-wrapper"><div class="notion-external-object__attributes"><picture><img class="notion-external-object__avatar" loading="lazy" width="100%"></picture><div class="notion-external-object__details"><p>naext-one-plugin</p><p class="notion-external-object__last-modified">Last modified 8 days ago</p></div></div></a></div>`);
        }
        else if(e.target.href.includes("/deepwave")){
          document.querySelector(".notion-embed__loader").remove();

          var link = "https://www.deepwave.org/icrs-filmfestival-2022/"
          var iframe = document.createElement('iframe');
          iframe.title= "www.deepwave.org";
          iframe.setAttribute("sandbox", "allow-scripts allow-popups allow-forms allow-same-origin allow-top-navigation-by-user-activation");
          iframe.setAttribute("allowfullscreen", "");
          iframe.setAttribute("loading", "lazy");
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("src", link);
          document.querySelector(".LazyLoad").appendChild(iframe);
        }
        else if(e.target.href.includes("/onno-anna")){
          document.querySelector(".notion-embed__loader").remove();

          var link = "https://player.vimeo.com/video/343616752?h=94a6754689&app_id=122963"
          var iframe = document.createElement('iframe');
          iframe.title= "player.vimeo.com";
          iframe.setAttribute("sandbox", "allow-scripts allow-popups allow-forms allow-same-origin allow-top-navigation-by-user-activation");
          iframe.setAttribute("allowfullscreen", "");
          iframe.setAttribute("loading", "lazy");
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("src", link);
          document.querySelector(".LazyLoad").appendChild(iframe);
        }
      }
      catch(e){
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
window.addEventListener("scroll", e => {
  var st = window.pageYOffset || document.documentElement.scrollTop;
  if(!navbar.classList.contains("lp-scrolled")){
    if(document.documentElement.scrollTop > 30){
      navbar.classList.add("lp-scrolled");
    }
  }
  else{
    if(document.documentElement.scrollTop < 30){
      navbar.classList.remove("lp-scrolled");

      if(window.preventPushingToHistory == false){
        window.history.pushState(null, "", "/");
      }
      window.preventPushingToHistory = false;

      window.disableBgChangeOnChange = false;
      lazyLoadedContent.innerHTML = "";
    }
  }
  lastScrollTop = st <= 0 ? 0 : st;
}, false);

window.addEventListener("wheel", throttle(e => {
  try{
    if(Math.abs(e.deltaY) < 10) return
    clearInterval(timerToSwitchBackground);
    timerToSwitchBackground = setInterval(switchBackground, timerTime);
    var index = navLinks.indexOf(document.querySelector(".lp-desktop-navlink.lp-active"));
    switchBetweenBackground(navLinks, selectedBgPics, selectedBgTexts, mobileNavLinks, e.deltaY > 0 ? index + 1 : index - 1);
  }
  catch{
  }
}, 400));

try{
  document.querySelector(".lp-notion-navbar > div > a").addEventListener("click", e => {
    e.preventDefault();

    if(window.preventPushingToHistory == false){
      window.history.pushState(null, "", "/");
    }
    window.preventPushingToHistory = false;

    window.disableBgChangeOnChange = true;
    scrollTo(0, 800);
  });
}
catch(e){

}

document.querySelector(".lp-read-more-button").addEventListener("click", (e) => {
  clearInterval(timerToSwitchBackground);
  timerToSwitchBackground = setInterval(switchBackground, timerTime);
  document.querySelector(".lp-desktop-navlink.lp-active").querySelector("a").click();
});

window.addEventListener("popstate", function(e) { 
  if(e.state != null){
    Array.from(navitationAnchorsContainer.querySelectorAll(".notion-link.link")).forEach(anchor => {
      if(anchor.getAttribute("data-parameter-query") == e.state){
        window.preventPushingToHistory = true;
        anchor.click();
      }
    });
  }
});

let touchStartPos = {x:0, y:0};

window.addEventListener('touchstart', (e) => {
  touchStartPos = utilGetPosition(e);
});
window.addEventListener('touchend', (e) => {
  const currentPosition = utilGetPosition(e);
  console.log(currentPosition);
  const verticalDifference = currentPosition.y - touchStartPos.y;
  const horizontalDifference = currentPosition.x - touchStartPos.x;

  console.log({"verticalDifference": verticalDifference});
  console.log({"horizontalDifference": horizontalDifference});

  if(horizontalDifference != verticalDifference){
    if(Math.abs(horizontalDifference) > Math.abs(verticalDifference)){
      clearInterval(timerToSwitchBackground);
      timerToSwitchBackground = setInterval(switchBackground, timerTime);

      if(horizontalDifference > 0){
        switcToPreviousBackground();
      }
      else{
        switchBackground();
      }
      e.preventDefault();
      return
    }
    else{
      clearInterval(timerToSwitchBackground);
      timerToSwitchBackground = setInterval(switchBackground, timerTime);

      if(verticalDifference < 0){
        if(!navbar.classList.contains("lp-scrolled")){
          document.querySelector(".lp-desktop-navlink.lp-active").querySelector("a").click();
        }
      }

      e.preventDefault();
      return
    }
  }
});

  //window.addEventListener('touchmove', throttle((e) => {
    //console.log("touchmove fired");
    //// Different devices give different values with different decimal percentages.
    //const currentPageX = Math.round(e.changedTouches[0].screenY);
    //if (touchStartPosX === currentPageX) return;

    //if (touchStartPosX - currentPageX > 0) {
      //clearInterval(timerToSwitchBackground);
      //timerToSwitchBackground = setInterval(switchBackground, timerTime);
      //console.log("down");
      //switchBackground();
    //} 
    //else {
      //clearInterval(timerToSwitchBackground);
      //timerToSwitchBackground = setInterval(switchBackground, timerTime);
      //console.log("up");
      //switcToPreviousBackground();
    //}
    //touchStartPosX = currentPageX;
  //}, 1000));

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
  if (typeof func !== 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
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
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading
      ? invokeFunc(time)
      : result;
  }

  function remainingWait(time) {
    let timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime,
      result = wait - timeSinceLastCall;
    console.log('remainingWait');
    return maxing
      ? nativeMin(result, maxWait - timeSinceLastInvoke)
      : result;
  }

  function shouldInvoke(time) {
    let timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime;
    // Either this is the first call, activity has stopped and we're at the trailing
    // edge, the system time has gone backwards and we're treating it as the
    // trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) || (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been debounced at
    // least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined
      ? result
      : trailingEdge(Date.now());
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
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

function throttle(func, wait, options) {
  let leading = true,
    trailing = true;

  if (typeof func !== 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
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

function throttleAlt(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

function switchBetweenBackground(itemArray,  backgroundPictures, backgroundTexts, mobileNavLinks, index){
  //console.error("where is it being fired from");
  if(window.disableBgChangeOnChange == true){
    return;
  }

  modifiedIndex = index >= itemArray.length ? 0 : index;
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

  readMoreButton.setAttribute("data-current-bg", landingPageItems[modifiedIndex].currentBgForButton);

  let pixelsToTranslate = 0;
  mobileNavLinks.forEach((mobileNavLink, i) => {
    if(i < modifiedIndex){
      pixelsToTranslate -= mobileNavLink.offsetWidth;
    }
  });
  pixelsToTranslate = (pixelsToTranslate + width * 0.5) - mobileNavLinks[modifiedIndex].offsetWidth * 0.5;
  pixelsToTranslate -= mobileNavLinks[0].previousSibling.offsetWidth;
  pixelsToTranslate -= mobileNavLinks[0].previousSibling.previousSibling.offsetWidth;

  //transition baihgui bolgo
  if(index == modifiedIndex){
    mobileNavLinks[modifiedIndex].parentElement.style.transform = `translate3d(${pixelsToTranslate}px, 0px, 0px)`;
  }
  else{
    window.disableBgChangeOnChange = true;

    let pixels = 0;

    if(index < modifiedIndex){
      unfilteredMobileNavLinks.forEach((mobileNavLink, i) => {
        if(i < 0){
          pixels -= mobileNavLink.offsetWidth;
        }
      });
      pixels = (pixels + width * 0.5) - mobileNavLinks[0].previousSibling.offsetWidth * 0.5;
      pixels -= mobileNavLinks[0].previousSibling.previousSibling.offsetWidth;
      mobileNavLinks[0].previousSibling.classList.add("lp-mobile-active");
    }
    else{
      unfilteredMobileNavLinks.forEach((mobileNavLink, i) => {
        if(i < unfilteredMobileNavLinks.length - 2){
          pixels -= mobileNavLink.offsetWidth;
        }
      });
      pixels = (pixels + width * 0.5) - mobileNavLinks[mobileNavLinks.length - 2].nextSibling.offsetWidth * 0.5;
      mobileNavLinks[mobileNavLinks.length - 1].nextSibling.classList.add("lp-mobile-active");
    }

    mobileNavLinks[modifiedIndex].parentElement.style.transform = `translate3d(${pixels}px, 0px, 0px)`;

    setTimeout(() => {

      mobileNavLinks[modifiedIndex].parentElement.style.transition = "none";
      mobileNavLinks[modifiedIndex].parentElement.style.transform = `translate3d(${pixelsToTranslate}px, 0px, 0px)`;

      setTimeout(() => {
        mobileNavLinks[modifiedIndex].parentElement.style.transition = null;

        mobileNavLinks[0].previousSibling.classList.remove("lp-mobile-active");
        mobileNavLinks[mobileNavLinks.length - 1].nextSibling.classList.remove("lp-mobile-active");
        window.disableBgChangeOnChange = false;
      }, 1);
    }, 600);
  }
}

function switchBackground(){
  var index = navLinks.indexOf(document.querySelector(".lp-desktop-navlink.lp-active"));
  switchBetweenBackground(navLinks, selectedBgPics, selectedBgTexts, mobileNavLinks, index + 1);
}
function switcToPreviousBackground(){
  var index = navLinks.indexOf(document.querySelector(".lp-desktop-navlink.lp-active"));
  switchBetweenBackground(navLinks, selectedBgPics, selectedBgTexts, mobileNavLinks, index - 1);
}

function utilGetPosition(e){
  var x=0,y=0;
  if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
      var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
      var touch = evt.touches[0] || evt.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
  } 
  else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
      x = e.clientX;
      y = e.clientY;
  }
  return {x, y};
}

/*--------------------------------------------
 Functions to make scroll with speed control - https://stackoverflow.com/questions/50589137/scrollto-speed-duration-setting
---------------------------------------------*/

// Element or Position to move + Time in ms (milliseconds)
function scrollTo(element, duration) {
    var e = document.documentElement;
    if(e.scrollTop===0){
        var t = e.scrollTop;
        ++e.scrollTop;
        e = t+1===e.scrollTop--?e:document.body;
    }
    scrollToC(e, e.scrollTop, element, duration);
}

// Element to move, element or px from, element or px to, time in ms to animate
function scrollToC(element, from, to, duration) {
    if (duration <= 0) return;
    if(typeof from === "object")from=from.offsetTop;
    if(typeof to === "object")to=to.offsetTop;
    // Choose one effect like easeInQuart
    scrollToX(element, from, to, 0, 1/duration, 20, linearTween);
}

function scrollToX(element, xFrom, xTo, t01, speed, step, motion) {
    if (t01 < 0 || t01 > 1 || speed<= 0) {
       element.scrollTop = xTo;
        return;
    }
    element.scrollTop = xFrom - (xFrom - xTo) * motion(t01);
    t01 += speed * step;
    
    setTimeout(function() {
        scrollToX(element, xFrom, xTo, t01, speed, step, motion);
    }, step);
}

/* Effects List */
function linearTween(t){
    return t;
}

const perf1= performance.now();
console.log(`Performance between start and end of written script`);
console.log(`Start: ${perf0}`);
console.log(`End: ${perf1}`);
//</script>