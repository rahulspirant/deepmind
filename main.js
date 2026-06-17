/* ===================================================================
   DEEP MIND IT SOLUTIONS — MAIN.JS
   Core interactions: loader, navbar, counters, forms, parallax, utils
=================================================================== */
(function(){
  "use strict";

  /* ---------- loading screen ---------- */
  window.addEventListener("load",function(){
    var loader=document.querySelector(".loader");
    if(loader){
      setTimeout(function(){
        loader.classList.add("hidden");
        setTimeout(function(){ loader.remove(); },700);
      },420);
    }
    document.body.classList.add("loaded");
  });

  /* ---------- footer year ---------- */
  document.querySelectorAll(".js-year").forEach(function(el){
    el.textContent=new Date().getFullYear();
  });

  /* ---------- navbar shrink on scroll + active link ---------- */
  var navbar=document.querySelector(".navbar");
  var lastScroll=0;
  function onScroll(){
    var y=window.scrollY||window.pageYOffset;
    if(navbar){
      if(y>40) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    }
    var backTop=document.querySelector(".back-to-top");
    if(backTop){
      if(y>520) backTop.classList.add("show");
      else backTop.classList.remove("show");
    }
    lastScroll=y;
  }
  document.addEventListener("scroll",onScroll,{passive:true});
  onScroll();

  var backTopBtn=document.querySelector(".back-to-top");
  if(backTopBtn){
    backTopBtn.addEventListener("click",function(){
      window.scrollTo({top:0,behavior:"smooth"});
    });
  }

  /* highlight current page in nav */
  (function setActiveNav(){
    var path=location.pathname.split("/").pop()||"index.html";
    document.querySelectorAll(".nav-link, .m-link").forEach(function(link){
      var href=(link.getAttribute("href")||"").split("/").pop();
      if(href===path) link.classList.add("active");
    });
  })();

  /* ---------- animated stat counters ---------- */
  function animateCounter(el){
    var target=parseFloat(el.dataset.count||"0");
    var decimals=(el.dataset.count||"").includes(".")?1:0;
    var duration=1400;
    var start=null;
    function step(ts){
      if(!start) start=ts;
      var progress=Math.min((ts-start)/duration,1);
      var eased=1-Math.pow(1-progress,3);
      var current=target*eased;
      el.textContent=decimals?current.toFixed(1):Math.floor(current).toLocaleString();
      if(progress<1) requestAnimationFrame(step);
      else el.textContent=decimals?target.toFixed(1):target.toLocaleString();
    }
    requestAnimationFrame(step);
  }
  var counterEls=document.querySelectorAll("[data-count]");
  if(counterEls.length){
    var counterObserver=new IntersectionObserver(function(entries,obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },{threshold:.5});
    counterEls.forEach(function(el){ counterObserver.observe(el); });
  }

  /* ---------- mouse parallax on hero floating cards ---------- */
  var heroVisual=document.querySelector(".hero-visual");
  if(heroVisual && window.matchMedia("(min-width: 769px)").matches){
    var floaters=heroVisual.querySelectorAll(".floating-card, .hero-globe-wrap svg");
    heroVisual.addEventListener("mousemove",function(e){
      var rect=heroVisual.getBoundingClientRect();
      var px=(e.clientX-rect.left)/rect.width-.5;
      var py=(e.clientY-rect.top)/rect.height-.5;
      floaters.forEach(function(el,i){
        var depth=(i+1)*6;
        el.style.transform="translate("+(px*depth)+"px,"+(py*depth)+"px)";
      });
    });
    heroVisual.addEventListener("mouseleave",function(){
      floaters.forEach(function(el){ el.style.transform=""; });
    });
  }

  /* ---------- card cursor glow (radial highlight follows pointer) ---------- */
  document.querySelectorAll(".card").forEach(function(card){
    card.addEventListener("mousemove",function(e){
      var rect=card.getBoundingClientRect();
      card.style.setProperty("--mx",((e.clientX-rect.left)/rect.width*100)+"%");
      card.style.setProperty("--my",((e.clientY-rect.top)/rect.height*100)+"%");
    });
  });

  /* ---------- magnetic buttons ---------- */
  document.querySelectorAll(".btn-primary, .btn-ghost").forEach(function(btn){
    if(window.matchMedia("(pointer: coarse)").matches) return;
    btn.addEventListener("mousemove",function(e){
      var rect=btn.getBoundingClientRect();
      var x=(e.clientX-rect.left-rect.width/2)*.25;
      var y=(e.clientY-rect.top-rect.height/2)*.5;
      btn.style.transform="translate("+x+"px,"+y+"px)";
    });
    btn.addEventListener("mouseleave",function(){
      btn.style.transform="";
    });
  });

  /* ---------- smooth in-page scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener("click",function(e){
      var id=a.getAttribute("href");
      if(id.length>1){
        var target=document.querySelector(id);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:"smooth",block:"start"});
        }
      }
    });
  });

  /* ---------- contact / newsletter form handling with validation + success animation ---------- */
  document.querySelectorAll("form[data-validate]").forEach(function(form){
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var valid=true;
      form.querySelectorAll("[required]").forEach(function(input){
        if(!input.value.trim()){
          valid=false;
          input.style.borderColor="#ff5c7a";
        } else {
          input.style.borderColor="";
        }
      });
      if(!valid) return;
      var btn=form.querySelector("button[type=submit]");
      var success=form.parentElement.querySelector(".form-success")||form.querySelector(".form-success");
      if(btn){
        var original=btn.innerHTML;
        btn.innerHTML="<span>Sending…</span>";
        btn.disabled=true;
        setTimeout(function(){
          btn.innerHTML=original;
          btn.disabled=false;
          form.reset();
          if(success) success.classList.add("show");
          setTimeout(function(){ if(success) success.classList.remove("show"); },5000);
        },1100);
      }
    });
  });

  /* ---------- generic image error fallback -> branded gradient placeholder ---------- */
  document.querySelectorAll("img[data-fallback]").forEach(function(img){
    img.addEventListener("error",function(){
      var wrap=img.parentElement;
      img.style.display="none";
      if(wrap && !wrap.querySelector(".img-fallback")){
        var ph=document.createElement("div");
        ph.className="img-fallback";
        ph.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"+
          "background:linear-gradient(135deg,rgba(0,136,255,.18),rgba(0,212,255,.06));color:#00D4FF;"+
          "font-family:Inter,sans-serif;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;font-weight:700;";
        ph.innerHTML="<span>Deep Mind IT</span>";
        wrap.style.position="relative";
        wrap.appendChild(ph);
      }
    },{once:true});
  });

})();