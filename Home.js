const nativeMax = Math.max;
const nativeMin = Math.min;
const smoothScrollDuration = 1000;

window.disableBgChangeOnChange = false;
window.preventPushingToHistory = false;

const width = window.innerWidth;
const height = window.innerHeight;

updateVHWithJS();
window.addEventListener('resize', updateVHWithJS);
function updateVHWithJS(){
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

console.count("Times this script ran");
const perf0 = performance.now();

//#region assign classes so my css doesnt affect other nodes in different pages
const addLPClasses = [{
    selector: ".super-root",
    classToAdd: ["lp-super-root"]
  },
  {
    selector: ".super-content",
    classToAdd: ["lp-super-content"]
  },
  {
    selector: ".notion-navbar",
    classToAdd: ["lp-notion-navbar", "lp-desktop-notion-navbar"]
  },
  {
    selector: ".notion-icon__search-path",
    classToAdd: ["lp-notion-icon__search-path"]
  },
  {
    selector: ".super-footer",
    classToAdd: ["lp-super-footer"]
  },
  {
    selector: ".notion-navbar__search",
    idToAssign: "desktop-search"
  }
];
addLPClasses.forEach(lp => {
  var el = document.querySelector(lp.selector);
  if(el != null){
    if(lp.idToAssign){
      el.id = lp.idToAssign;
    }
    else{
      el.classList.add(...lp.classToAdd);
    }
  }
});
//#endregion

//#region add mouse trailer
const trailer = document.createElement("div");
trailer.classList.add("lp-mouse-trailer");
trailer.insertAdjacentHTML('beforeend', `<i class="gg-chevron-down"></i>`);
/*trailer.insertAdjacentHTML('beforeend', `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
<g>
	<g id="arrow_x5F_down">
		<path d="M32,16.016l-5.672-5.664c0,0-3.18,3.18-6.312,6.312V0h-8.023v16.664l-6.32-6.32L0,16.016L16,32
			L32,16.016z"/>
	</g>
</g>
</svg>`);*/
document.querySelector(".super-root").parentElement.appendChild(trailer);
//#endregion

//navigationParameterQuery is obtained by writing going to the page and executing "history.state" in the dev tool console
const landingPageItems = [
  {
    navigationText: "Writings",
    navigationPath: "/writings-and-notes",
    navigationParameterQuery: "/[...page]?page=writing-db&page=writings-and-notes",
    bgPictureMimeType: null,
    bgPictureInnerClassAddon: "",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_west,h_${height},w_${width}/v1669009342/Heye.earth/Projects/High%20Res%20Backgrounds/Writings_and_Notes_Background_sssvel.png`
      }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_crop,g_west,h_${height},q_100,w_${width},x_0,y_0/v1669009342/Heye.earth/Projects/High%20Res%20Backgrounds/Writings_and_Notes_Background_sssvel.png`
    },
    bgPictureClasses: "lp-bg bg-writings",
    bgPictureAlt: "Writings and Notes",
    textLinkMimeType: null,
    textLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/a_90/c_crop,g_east,h_893,w_676/v1669001425/Heye.earth/Projects/Fonts/2_tuhqcg.svg`
      }
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669001425/Heye.earth/Projects/Fonts/2_tuhqcg.svg";
    },
    cursorLink: "https://res.cloudinary.com/deepwave-org/image/upload/v1670455121/Heye.earth/Projects/Arrows/Writing_Arrow_hzu1rv.svg",
    textClasses: "lp-text lp-text-writings",
    currentBgForButton: "lp-read-more-button-writings"
  },
  {
    navigationText: "Næxt.one",
    navigationPath: "/nxtone",
    navigationParameterQuery: "/[...page]?page=nxtone",
    bgPictureMimeType: null,
    bgPictureInnerClassAddon: "",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/a_90/c_scale,h_${height}/c_crop,g_center,h_${height},w_${width}/v1669009320/Heye.earth/Projects/High%20Res%20Backgrounds/Naext_one_background__horizontal_fjrnww.jpg`
      }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,g_center,h_${height},w_${width}/v1669009320/Heye.earth/Projects/High%20Res%20Backgrounds/Naext_one_background__horizontal_fjrnww.jpg`
    },
    bgPictureAlt: "Næxt.one",
    bgPictureClasses: "lp-bg bg-naext",
    textLinkMimeType: "video/webm",
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/video/upload/v1670500323/Heye.earth/Projects/Fonts/Naext.one_Main_Animation_wbbwtm.webm";
    },
    cursorLink: "https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_22/v1669933106/Heye.earth/Projects/Arrows/Naext_arrow_oaoxwb.svg",
    textClasses: "lp-text lp-text-naext",
    currentBgForButton: "lp-read-more-button-naext"
  },
  {
    navigationText: "Arcadia",
    navigationPath: "/arcadia",
    navigationParameterQuery: "/[...page]?page=arcadia",
    bgPictureMimeType: null,
    bgPictureInnerClassAddon: "",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,h_${height},w_${width}/v1669013734/Heye.earth/Projects/High%20Res%20Backgrounds/Arcadia_Background_k0earl.jpg`
    }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/v1669013734/Heye.earth/Projects/High%20Res%20Backgrounds/Arcadia_Background_k0earl.jpg`
    },
    bgPictureAlt: "Arcadia",
    bgPictureClasses: "lp-bg bg-arcadia",
    textLinkMimeType: null,
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669001425/Heye.earth/Projects/Fonts/5_fsguhv.svg";
    },
    cursorLink: "https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_22/v1669933105/Heye.earth/Projects/Arrows/Arcadia_Arrow_qthklm.svg",
    textClasses: "lp-text lp-text-arcadia",
    currentBgForButton: "lp-read-more-button-arcadia"
  },
  {
    navigationText: "DEEPWAVE",
    navigationPath: "/deepwave",
    navigationParameterQuery: "/[...page]?page=deepwave",
    bgPictureMimeType: null,
    bgPictureInnerClassAddon: "",
    bgPictureLinkGetter: function(width, height){
            if(width <= 745){
      return `https://res.cloudinary.com/deepwave-org/image/upload/a_90/c_scale,h_${height}/c_crop,h_${height},w_${width}/v1669013918/Heye.earth/Projects//High%20Res%20Backgrounds/DEEPWAVE_Background_Desktop_fsgrr0_32322d_2.png`
    }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,h_${height},w_${width},g_west,x_0,y_0/v1669013918/Heye.earth/Projects//High%20Res%20Backgrounds/DEEPWAVE_Background_Desktop_fsgrr0_32322d_2.png`
    },
    bgPictureAlt: "DEEPWAVE",
    bgPictureClasses: "lp-bg lp-bg-deepwave",
    textLinkMimeType: null,
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/c_crop,g_west,h_893,w_663/v1669001425/Heye.earth/Projects/Fonts/11_hiq2id.svg";
    },
    cursorLink: "https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_22/v1669935663/Heye.earth/Projects/Arrows/Deepwave_arrow_azum1t.svg",
    textClasses: "lp-text lp-text-deepwave",
    currentBgForButton: "lp-read-more-button-deepwave"
  },
  {
    navigationText: "Future Forum",
    navigationPath: "/future-forum",
    navigationParameterQuery: "/[...page]?page=future-forum",
    bgPictureMimeType: null,
    bgPictureInnerClassAddon: "",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_center,h_${height},w_${width}/v1669845133/Heye.earth/Projects/High%20Res%20Backgrounds/52e8cfed-4ac2-4d97-91d4-d755527507de_6192x4128_zik8b3.jpg`
      }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,h_${height},w_${width}/v1669845133/Heye.earth/Projects/High%20Res%20Backgrounds/52e8cfed-4ac2-4d97-91d4-d755527507de_6192x4128_zik8b3.jpg`
    },
    bgPictureAlt: "Future Forum",
    bgPictureClasses: "lp-bg lp-bg-future-forum",
    textLinkMimeType: null,
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669844781/Heye.earth/Projects/Fonts/R2_Future-Forum-White-Logo-Animation_R1_qkldkz.gif";
    },
    cursorLink: "",
    textClasses: "lp-text lp-text-future-forum",
    currentBgForButton: "lp-read-more-button-future-forum"
  },
  {
    navigationText: "ML Explainer",
    navigationPath: "/make-machines-learn-explainer",
    navigationParameterQuery: "/[...page]?page=make-machines-learn-explainer",
    bgPictureMimeType: null,
    bgPictureInnerClassAddon: "",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_center,h_${height},w_${width}/v1669010010/Heye.earth/Projects/High%20Res%20Backgrounds/ML_Explainer_Background_am8pvf.png`
    }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,g_east,h_${height},w_${width}/v1669010010/Heye.earth/Projects/High%20Res%20Backgrounds/ML_Explainer_Background_am8pvf.png`
    },
    bgPictureAlt: "“Make Machines Learn” Explainer",
    bgPictureClasses: "lp-bg lp-bg-ml-explainer",
    textLinkMimeType: null,
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669001425/Heye.earth/Projects/Fonts/8_dux6mo.svg";
    },
    cursorLink: "https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_22/v1669933105/Heye.earth/Projects/Arrows/ML_Arrow_twf9fo.svg",
    textClasses: "lp-text lp-text-ml-explainer",
    currentBgForButton: "lp-read-more-button-ml-explainer"
  },
  {
    navigationText: "The Hike",
    navigationPath: "/the-hike",
    navigationParameterQuery: "/[...page]?page=the-hike",
    bgPictureMimeType: "video/mp4",
    bgPictureInnerClassAddon: "heye-object-position",
    bgPictureLinkGetter: function(width, height){
      return `https://res.cloudinary.com/deepwave-org/video/upload/v1670496048/Heye.earth/Projects/High%20Res%20Backgrounds/Hike-back-animated_sewivx.mp4`
    },
    bgPictureAlt: "The Hike",
    bgPictureClasses: "lp-bg lp-bg-the-hike",
    textLinkMimeType: null,
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669011925/Heye.earth/Projects/Fonts/The_Hike_Font_octbmz.svg";
    },
    cursorLink: "https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_22/v1669935663/Heye.earth/Projects/Arrows/The_hike_arrow_abe3ea.svg",
    textClasses: "lp-text lp-text-the-hike",
    currentBgForButton: "lp-read-more-button-the-hike"
  },
  {
    navigationText: "Art",
    navigationPath: "/ai-art",
    navigationParameterQuery: "/[...page]?page=ai-art",
    bgPictureMimeType: null,
    bgPictureInnerClassAddon: "",
    bgPictureLinkGetter: function(width, height){
      if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_north,h_${height},w_${width}/v1669013716/Heye.earth/Projects/High%20Res%20Backgrounds/AI_Art_Background_ae3c2d.png`
      }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,g_north,h_${height},w_${width},x_0,y_120/v1669013716/Heye.earth/Projects/High%20Res%20Backgrounds/AI_Art_Background_ae3c2d.png`
    },
    bgPictureAlt: "(AI-) Art",
    bgPictureClasses: "lp-bg lp-bg-ai-art",
    textLinkMimeType: null,
    textLinkGetter: function(width, height){
      if(width <= 745){
        return "https://res.cloudinary.com/deepwave-org/image/upload/v1669144557/Heye.earth/Projects/Fonts/AI_Art_Font_ymvkbz.svg"
      }
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669144557/Heye.earth/Projects/Fonts/AI_Art_Font_ymvkbz.svg";
    },
    cursorLink: "https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_22/v1669935663/Heye.earth/Projects/Arrows/AI_art_arrow_oucham.svg",
    textClasses: "lp-text lp-text-ai-art",
    currentBgForButton: "lp-read-more-button-ai-art"
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
    bgPictureMimeType: "video/mp4",
    bgPictureInnerClassAddon: "heye-object-position",
    bgPictureLinkGetter: function(width, height){
      return `https://res.cloudinary.com/deepwave-org/video/upload/v1670499021/Heye.earth/Projects/High%20Res%20Backgrounds/ONNO_Background_Animated_k7wve5.mp4`
    },
    bgPictureAlt: "Onno, Anna & Tjark",
    bgPictureClasses: "lp-bg lp-bg-onna-anna",
    textLinkMimeType: null,
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669001425/Heye.earth/Projects/Fonts/14_mnl60i.svg";
    },
    cursorLink: "https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_22/v1669935663/Heye.earth/Projects/Arrows/Onno_Anna_Tjark_arrow_igizy2.svg",
    textClasses: "lp-text lp-text-onna-anna",
    currentBgForButton: "lp-read-more-button-onna-anna"
  },
  {
    navigationText: "About Me",
    navigationPath: "/hi-i-am-heye-high-ye",
    navigationParameterQuery: "/[...page]?page=hi-i-am-heye-high-ye",
    bgPictureMimeType: null,
    bgPictureInnerClassAddon: "",
    bgPictureLinkGetter: function(width, height){
            if(width <= 745){
        return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,h_${height}/c_crop,g_east,h_${height},w_${width}/v1669009360/Heye.earth/Projects/High%20Res%20Backgrounds/About_me_Background_mpnje8.png`
      }
      return `https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_${width}/c_crop,g_east,h_${height},w_${width},x_0,y_200/v1669009360/Heye.earth/Projects/High%20Res%20Backgrounds/About_me_Background_mpnje8.png`
    },
    bgPictureAlt: "Hi! I am Heye [High ye] 🖐️",
    bgPictureClasses: "lp-bg lp-bg-about-me",
    textLinkMimeType: null,
    textLinkGetter: function(width, height){
      return  "https://res.cloudinary.com/deepwave-org/image/upload/v1669001425/Heye.earth/Projects/Fonts/16_e6kpjc.svg";
    },
    cursorLink: "https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_22/v1669935663/Heye.earth/Projects/Arrows/About_Me_arrow_ugfnsj.svg",
    textClasses: "lp-text lp-text-about-me",
    currentBgForButton: "lp-read-more-button-about-me"
  }
];

const navbar = document.querySelector(".lp-notion-navbar");
navbar.insertAdjacentHTML('beforeend', `<div class="lp-custom-navbar-progress"></div>`);
let navbarProgress = document.querySelectorAll(".lp-custom-navbar-progress");

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
readMoreButtonContainer.insertAdjacentHTML('beforeend', `<button class="lp-read-more-button lp-show" data-current-bg="${landingPageItems[0].currentBgForButton}" title="Expand post" aria-label="Expand post">
  <span>
    <i class="gg-chevron-down"></i>
  </span>
</button>`);

readMoreButtonContainer.insertAdjacentHTML('beforeend', `<span class="swipe-up"><img src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACzklEQVRYhe2YW4hNURjHf8eZcRi5nIRyF0mORmaaOC+KiBc1pXinkFxCkbxMlAflieRWGqXIJQ+E3AYPKMWDoijlNiFErpOZo2/679pO5+x9zt5nnTkP/rVbe6/WWt9vf3utb31rE6KdwDNgXljDvpDB5XR9rTXIXQLr1mX334H5NcDWq07gMrAP+ANsBj4CB2uArVfjgRSwQ96bBowGhlUbpK5I/UuVKZUNwNMqMf2jfn1htBz9B4wrF4Bp4ADwSGXa5Qt4wbqpxPYJ4JT6vFV5UvWRVGkPDgFagQ5gispW1dcEYFJjfgB+qEzqiiQXczDnA0r69vOaASyk7qgdXQPaPl4P3ADWRVks1fCgQU5W4rGn3M6uAesEOAO4BmzR6i5ZYYD1KuO8iC2UN4qPCYWeo8DYUjqHGX4CPAfexQD0IL35Zyt6JXAFGBoX8DjQCLzKq58IrAE25GXZQYvAs7UMWAVMBzYCg8Mgy9U4AXvxLafsezgwCOgCzmrM8wox5sHVapuV537q+T2wPeytylGz5k8bMFvHgEVAu8br8Y31BfgmkITPZkrQj3W82A2srZQHG2XwsK/ukOrW6+zieXCUPqVpk9rMBUbofi8wAHgNvKgUoHniuj5di+pGAp+UwfzyAfq1AHgATADGCNA7hHUoHFVMzRrwrm+atPnmZXvAy5kmqd0RPd8GflcS0LRfRhbr2RbJTeAeMDOkb38tjKxLQPNClwaPKyeApmO+iR9HzgAzCiuXahXQdFpebCmhbTE5BWwS4JkYY9zRzuJMF/SpMxENPKxAQhKoOfLiiQh9G7T73HcJiBKGHm2F5SiTt6s4U1aGzpVpYKv6LXUNiNIrM7awxPZpZdudLvLCQpqqX8WWNMwKaWsHqat6oRXFGkX+ZxKg5fofY7JkolCWMlDhyRINO+ltc8ARKDsG3FJsswCcf30GLgJLAkcB/gLDn6fFC+P8QgAAAABJRU5ErkJggg==" alt="swipe up interaction indicator"></span>`);

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

const lastIndexOfItems = landingPageItems.length - 1;

mobileNavitationAnchorsContainer.insertAdjacentHTML('beforeend', `<div class="lp-mobile-navlink infinite-workaround" data-index="${lastIndexOfItems - 1}">
  <a href="${landingPageItems[lastIndexOfItems - 1].navigationPath}">${landingPageItems[lastIndexOfItems - 1].navigationText}</a>
</div>`);
mobileNavitationAnchorsContainer.insertAdjacentHTML('beforeend', `<div class="lp-mobile-navlink infinite-workaround" data-index="${lastIndexOfItems}">
  <a href="${landingPageItems[lastIndexOfItems].navigationPath}">${landingPageItems[lastIndexOfItems].navigationText}</a>
</div>`);

landingPageItems.forEach((landingPageItem,i) => {
  var bgLinkType = "image";
  var bgMimeType = landingPageItem.bgPictureMimeType;
  if(landingPageItem.bgPictureMimeType != null){
    bgLinkType = bgMimeType.split("/")[0];
  }

  var bgHtmlString = `<img class="default-bg-pic-style" alt="${landingPageItem.bgPictureAlt}" src="${landingPageItem.bgPictureLinkGetter(width, height)}" decoding="async" data-nimg="fill" ></img>`;
  if(bgLinkType == "video"){
    bgHtmlString = `<video src="${landingPageItem.bgPictureLinkGetter(width, height)}" autoplay="" muted="" loop="" type="${bgMimeType}" class="default-bg-pic-style ${landingPageItem.bgPictureInnerClassAddon}"></video>`;
  }

  bgPics.insertAdjacentHTML('beforeend', `<span class="default-bg-pic-container-style lp-bg-pic ${i == 0 ? "active-bg" : ""} ${landingPageItem.bgPictureClasses}">${bgHtmlString}</span>`);

  navitationAnchorsContainer.insertAdjacentHTML('beforeend', `<span class="lp-desktop-navlink ${i == 0 ? "lp-active" : ""}">
    <a class="notion-link link" href="${landingPageItem.navigationPath}" data-parameter-query="${landingPageItem.navigationParameterQuery}">${landingPageItem.navigationText}</a>
    <div class="lp-navigation-link-left-border"></div>
  </span>`);

  var textLinkType = "image";
  var textMimeType = landingPageItem.textLinkMimeType;
  if(landingPageItem.textLinkMimeType != null){
    textLinkType = textMimeType.split("/")[0];
  }
  var textLinkHtmlString = `<img alt="image" src="${landingPageItem.textLinkGetter(width, height)}" decoding="async" data-nimg="responsive"></img>`;
  if(textLinkType == "video"){
    textLinkHtmlString = `<video src="${landingPageItem.textLinkGetter(width, height)}" autoplay="" muted="" type="${textMimeType}"></video>`
  }
  bgTexts.insertAdjacentHTML('beforeend', `
    <div class="${landingPageItem.textClasses} align-start page-width ${i == 0 ? "active-bg-text" : ""}">
      <span>
        <span>
        </span>
        ${textLinkHtmlString}
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

//#region mobile topbar workaround
var upperNotionColumn = document.querySelector(".lp-selector-upper-notion");

var mobileNavbar = document.createElement("div");
mobileNavbar.classList.add("notion-navbar", "lp-notion-navbar", "lp-mobile-notion-navbar");

mobileNavbar.insertAdjacentHTML('beforeend', `<div class="notion-breadcrumb">
  <a class="notion-link notion-breadcrumb__item single has-icon" href="/">
    <span style="box-sizing: border-box; display: inline-block; overflow: hidden; width: 16px; height: 16px; background: none; opacity: 1; border: 0px none; margin: 0px; padding: 0px; position: relative;"><img alt="Heye.Earth" srcset="https://super-static-assets.s3.amazonaws.com/28e2446c-93e3-4c6c-a5c4-f0ab78537f90/images/73d9389b-43e3-42e7-8b9b-11eb7e29be03.svg 1x, https://super-static-assets.s3.amazonaws.com/28e2446c-93e3-4c6c-a5c4-f0ab78537f90/images/73d9389b-43e3-42e7-8b9b-11eb7e29be03.svg 2x" src="https://super-static-assets.s3.amazonaws.com/28e2446c-93e3-4c6c-a5c4-f0ab78537f90/images/73d9389b-43e3-42e7-8b9b-11eb7e29be03.svg" decoding="async" data-nimg="fixed" class="notion-breadcrumb__icon" style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: medium none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;">
    </span>
    <div class="notion-navbar__title notion-breadcrumb__title">Heye.Earth</div>
  </a>
</div>
<div id="mobile-theme-switcher" class="lp-theme-switcher topbar-icons">
  <a>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  </a>
</div>
<div id="mobile-search" class="notion-navbar__search topbar-icons">
  <svg class="notion-icon notion-icon__search" viewBox="0 0 24 24" style="width: 1.25rem; height: 1.25rem; fill: var(--color-text-default-light);">
    <path class="notion-icon__search-path lp-notion-icon__search-path" d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path>
  </svg>
</div>
<div class="lp-custom-navbar-progress"></div>
<div id="nav-toggle-mobile" class="js-menu menu topbar-icons">
  <span class="bar"></span>
</div>`);

upperNotionColumn.parentNode.insertBefore(mobileNavbar, upperNotionColumn.nextSibling);

const menuToggler = document.querySelector("#nav-toggle-mobile");
menuToggler.addEventListener("click", function(){
  const body = document.querySelector("body")
  const sidebar = document.querySelector("article.notion-root > .notion-column-list > .notion-column:first-child");

  if(sidebar){
    if(sidebar.classList.contains("show-nav") == true){
      //is open
      sidebar.classList.remove("show-nav");
      body.classList.remove("menu-open");
      menuToggler.classList.remove("active");
    }
    else{
      //is closed
      sidebar.classList.add("show-nav");
      body.classList.add("menu-open");
      menuToggler.classList.add("active");
    }
  }
});
const mobileThemeSwitcher = document.querySelector("#mobile-theme-switcher");
mobileThemeSwitcher.addEventListener("click", function(){
  document.querySelector(`#desktop-theme-switcher`)?.click();
});
const mobileSearch = document.querySelector("#mobile-search");
mobileSearch.addEventListener("click", function(){
  console.log(document.querySelector("#desktop-search"));
  document.querySelector("#desktop-search")?.click();
});

navbarProgress = document.querySelectorAll(".lp-custom-navbar-progress");

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

initialPixelTranslation -= mobileNavLinks[0].previousSibling.offsetWidth;
initialPixelTranslation -= mobileNavLinks[0].previousSibling.previousSibling.offsetWidth;

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

    smoothScrollTo(window.innerHeight - 60, smoothScrollDuration);

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
          var embeds = document.querySelectorAll(".notion-embed__loader");
          Array.from(embeds).forEach((embed, i) => {
            if(i == 0){
              var parent = embed.parentElement;
              embed.remove();
              parent.querySelector(".LazyLoad").insertAdjacentHTML('beforeend', `<iframe src="https://www.youtube.com/embed/UM4pTGWXrjk" title="YouTube video player" frameborder="0" sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-top-navigation-by-user-activation" allowfullscreen></iframe>`);
            }
            else if(i == 1){
              var parent = embed.parentElement;
              embed.remove();
              parent.querySelector(".LazyLoad").insertAdjacentHTML('beforeend', `<div class="notion-external-object"><a href="https://github.com/DonSqualo/naext-one-plugin" target="_blank" rel="noopener noreferrer" class="notion-external-object__attributes-wrapper"><div class="notion-external-object__attributes"><picture><img class="notion-external-object__avatar" loading="lazy" width="100%"></picture><div class="notion-external-object__details"><p>naext-one-plugin</p><p class="notion-external-object__last-modified">Last modified 8 days ago</p></div></div></a></div>`);
            }
          });
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

        if(lazyLoadedContent.offsetHeight > height * 3){
          const columns = lazyLoadedContent.querySelectorAll(".notion-column"); 
          const leftSidebar = columns[0];
          const rightSidebar = columns[columns.length - 1];
          console.log(leftSidebar);
          console.log(rightSidebar);

          leftSidebar.classList.add("hide-sidebars");
          rightSidebar.classList.add("hide-sidebars");
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
const topbarIcons = Array.from(document.querySelectorAll(".topbar-icons"));
window.addEventListener("scroll", e => {
  var st = window.pageYOffset || document.documentElement.scrollTop;
  if(!navbar.classList.contains("lp-scrolled")){
    if(st > 30){
      navbar.classList.add("lp-scrolled");
      mobileNavbar.classList.add("lp-scrolled");
    }
  }
  else{
    if(st < 30){
      navbar.classList.remove("lp-scrolled");
      mobileNavbar.classList.remove("lp-scrolled");

      if(window.preventPushingToHistory == false){
        window.history.pushState(null, "", "/");
      }
      window.preventPushingToHistory = false;

      window.disableBgChangeOnChange = false;
      lazyLoadedContent.innerHTML = "";
    }
  }

  if(width < 745){
    if(height - 60 >= st){
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

    smoothScrollTo(0, smoothScrollDuration);
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
const swipeThreshhold = width*0.05;
let validToSwitchOnTouchMove = false;

window.addEventListener('touchstart', (e) => {
  touchStartPos = utilGetPosition(e);
  validToSwitchOnTouchMove = true;
});
window.addEventListener('touchmove', (e) => {
  const currentPosition = utilGetPosition(e);
  const verticalDifference = currentPosition.y - touchStartPos.y;
  const horizontalDifference = currentPosition.x - touchStartPos.x;

  if(horizontalDifference != verticalDifference){
    if((Math.abs(touchStartPos.x - currentPosition.x) >= swipeThreshhold || Math.abs(touchStartPos.y - currentPosition.y) >= swipeThreshhold) && validToSwitchOnTouchMove == true)
    {
      console.log(validToSwitchOnTouchMove);
      validToSwitchOnTouchMove = false;
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
  }
});
window.addEventListener('touchend', (e) => {
  validToSwitchOnTouchMove = true;
});


//#region add mouse trailer
if(width > 745){
  const trailerAnimation = (e, interacting) => {
    const x = e.clientX - trailer.offsetWidth * 0.5;
    const y = e.clientY - trailer.offsetHeight * 0.5;

    const positionAnimation = {
      transform: `translate(${x}px, ${y}px) scale(${interacting ? 8 : 1})`
    };

    if(interacting && !trailer.classList.contains("show-arrow")){
      changeCursor(trailer, e.target.getAttribute("data-current-bg"));
      trailer.classList.add("show-arrow");
    }
    else if(!interacting && trailer.classList.contains("show-arrow")){
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
    const interacting =  interactable != null;

    trailerAnimation(e, interacting);
  }
}
document.onkeydown = function (event) {
  if(!navbar.classList.contains("lp-scrolled")){
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

function changeCursor(mouseTrailerEl, cursorCode){
  removeAllImageCursor(mouseTrailerEl);

  const lpItem = landingPageItems.find(lp => lp.currentBgForButton == cursorCode);
  const cursorLink = lpItem.cursorLink;
  if(cursorLink != null && cursorLink != ""){
    console.log(cursorLink);
    mouseTrailerEl.insertAdjacentHTML('afterbegin', 
      `<img alt="Mouse trailer cursor" class="cursor-picture" src="${cursorLink}">`
    );
  }
}
function removeAllImageCursor(mouseTrailerEl){
  const cursors = Array.from(mouseTrailerEl.querySelectorAll(".cursor-picture"));
  cursors.forEach(cursor => {
    cursor.remove();
  });
}
//#endregion
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

function smoothScrollTo(to, duration) {
  const element = document.scrollingElement || document.documentElement,
    start = element.scrollTop,
    change = to - start,
    startDate = +new Date();

  const linearTween = (t, b, c, d) => {
    return c*t/d + b;
  };

  const animateScroll = _ => {
    const currentDate = +new Date();
    const currentTime = currentDate - startDate;
    element.scrollTop = parseInt(linearTween(currentTime, start, change, duration));
    if(currentTime < duration) {
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

function switchBetweenBackground(itemArray,  backgroundPictures, backgroundTexts, mobileNavLinks, index, resetCounter = true){
  //console.error("where is it being fired from");
  if(window.disableBgChangeOnChange == true){
    return;
  }

  if(resetCounter == true){
    console.log("inside reset counter");
    clearInterval(timerToSwitchBackground);
    timerToSwitchBackground = setInterval(switchBackground, timerTime);
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

  //reset gif animations
  const backgroundTextsImg = backgroundTexts[modifiedIndex].querySelector("img");
  if(backgroundTextsImg && backgroundTextsImg.src.includes(".gif")){
    const link = backgroundTextsImg.src;
    backgroundTextsImg.src = "";
    backgroundTextsImg.src = link;
  }
  const backgroundTextsVideo = backgroundTexts[modifiedIndex].querySelector("video");
  if(backgroundTextsVideo){
    backgroundTextsVideo.pause();
    backgroundTextsVideo.currentTime = 0;
    backgroundTextsVideo.load();
  }
  const backgroundVideo = backgroundPictures[modifiedIndex].querySelector("video");
  if(backgroundVideo){
    backgroundVideo.pause();
    backgroundVideo.currentTime = 0;
    backgroundVideo.load();
  }
  //update cursor
  changeCursor(trailer, landingPageItems[modifiedIndex].currentBgForButton);

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

//add Twitter
const aboutMe = document.querySelector(".lp-desktop-navlink:last-child a")
aboutMe.insertAdjacentHTML('afterend', `<a href="mailto:me@heye.earth" title="E-mail me" aria-label="E-mail me" class="notion-link lp-mail" target="_blank" rel="noopener noreferrer">
  <img src="https://res.cloudinary.com/deepwave-org/image/upload/v1669925228/Heye.earth/Projects/mail-142_1_p9c3yd.svg" alt="E-mail icon">
</a>`)
aboutMe.insertAdjacentHTML('afterend', `<a href="https://twitter.com/HeyeGross" title="Link to my twitter" aria-label="Link to my twitter" class="notion-link lp-twitter" target="_blank" rel="noopener noreferrer">
  <img src="https://res.cloudinary.com/deepwave-org/image/upload/v1669936109/Heye.earth/Projects/icons8-twitter_v4kazt.svg" alt="twitter icon">
</a>`);

const perf1= performance.now();
console.log(`Performance between start and end of written script`);
console.log(`Start: ${perf0}`);
console.log(`End: ${perf1}`);


document.querySelector("body").classList.add("loaded");