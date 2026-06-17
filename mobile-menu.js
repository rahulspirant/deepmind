/* ===================================================================
   DEEP MIND IT SOLUTIONS — MOBILE-MENU.JS
=================================================================== */
(function(){
  "use strict";

  var hamburger=document.querySelector(".hamburger");
  var panel=document.querySelector(".mobile-panel");
  var scrim=document.querySelector(".mobile-scrim");
  if(!hamburger||!panel) return;

  function openMenu(){
    hamburger.classList.add("active");
    panel.classList.add("open");
    if(scrim) scrim.classList.add("open");
    document.body.style.overflow="hidden";
    hamburger.setAttribute("aria-expanded","true");
  }
  function closeMenu(){
    hamburger.classList.remove("active");
    panel.classList.remove("open");
    if(scrim) scrim.classList.remove("open");
    document.body.style.overflow="";
    hamburger.setAttribute("aria-expanded","false");
  }
  hamburger.addEventListener("click",function(){
    panel.classList.contains("open")?closeMenu():openMenu();
  });
  if(scrim) scrim.addEventListener("click",closeMenu);
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape") closeMenu();
  });

  /* accordion groups inside mobile panel (e.g. Services submenu) */
  panel.querySelectorAll(".m-group > .m-link").forEach(function(trigger){
    trigger.addEventListener("click",function(e){
      var group=trigger.parentElement;
      if(group.querySelector(".m-sub")){
        e.preventDefault();
        group.classList.toggle("open");
      }
    });
  });

  /* close on plain link click */
  panel.querySelectorAll("a.m-link:not(.m-group > .m-link)").forEach(function(link){
    link.addEventListener("click",closeMenu);
  });
  panel.querySelectorAll(".m-sub a").forEach(function(link){
    link.addEventListener("click",closeMenu);
  });
  panel.querySelectorAll(".nav-cta a").forEach(function(link){
    link.addEventListener("click",closeMenu);
  });

})();