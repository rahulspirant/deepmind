/* ===================================================================
   DEEP MIND IT SOLUTIONS — ANIMATIONS.JS
   Scroll reveals, ambient particle canvas, testimonial slider, quick view
=================================================================== */
(function(){
  "use strict";

  /* ---------- scroll reveal via IntersectionObserver ---------- */
  var revealEls=document.querySelectorAll(".reveal, .reveal-stagger");
  if(revealEls.length){
    var revealObserver=new IntersectionObserver(function(entries,obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    },{threshold:.15,rootMargin:"0px 0px -60px 0px"});
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  }

  /* stagger child delays */
  document.querySelectorAll(".reveal-stagger").forEach(function(group){
    Array.prototype.forEach.call(group.children,function(child,i){
      child.style.transitionDelay=(i*90)+"ms";
    });
  });

  /* ---------- ambient particle canvas (used behind hero / CTA sections) ---------- */
  function initParticles(canvas){
    var ctx=canvas.getContext("2d");
    var particles=[];
    var count=window.innerWidth<768?28:55;
    var w,h;

    function resize(){
      w=canvas.width=canvas.offsetWidth*devicePixelRatio;
      h=canvas.height=canvas.offsetHeight*devicePixelRatio;
    }
    resize();
    window.addEventListener("resize",resize);

    for(var i=0;i<count;i++){
      particles.push({
        x:Math.random()*w,
        y:Math.random()*h,
        r:(Math.random()*1.6+.6)*devicePixelRatio,
        vx:(Math.random()-.5)*.25*devicePixelRatio,
        vy:(Math.random()-.5)*.25*devicePixelRatio,
        a:Math.random()*.5+.25
      });
    }

    function draw(){
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle="#00D4FF";
      particles.forEach(function(p){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w) p.vx*=-1;
        if(p.y<0||p.y>h) p.vy*=-1;
        ctx.globalAlpha=p.a;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      });
      // connecting lines for nearby particles
      ctx.globalAlpha=.12;
      ctx.strokeStyle="#0088FF";
      ctx.lineWidth=devicePixelRatio;
      for(var i=0;i<particles.length;i++){
        for(var j=i+1;j<particles.length;j++){
          var dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
          var dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<120*devicePixelRatio){
            ctx.beginPath();
            ctx.moveTo(particles[i].x,particles[i].y);
            ctx.lineTo(particles[j].x,particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha=1;
      requestAnimationFrame(draw);
    }
    if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      requestAnimationFrame(draw);
    }
  }
  document.querySelectorAll(".particle-canvas").forEach(initParticles);

  /* ---------- marquee infinite loop: duplicate track content once ---------- */
  document.querySelectorAll(".marquee-track").forEach(function(track){
    track.innerHTML+=track.innerHTML;
  });

  /* ---------- testimonial slider ---------- */
  var tWrap=document.querySelector(".testimonial-slider");
  if(tWrap){
    var track=tWrap.querySelector(".testimonial-track");
    var slides=tWrap.querySelectorAll(".testimonial-slide");
    var dotsWrap=tWrap.querySelector(".t-dots");
    var index=0;
    slides.forEach(function(_,i){
      var dot=document.createElement("button");
      dot.className="t-dot"+(i===0?" active":"");
      dot.setAttribute("aria-label","Go to testimonial "+(i+1));
      dot.addEventListener("click",function(){ goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots=tWrap.querySelectorAll(".t-dot");
    function goTo(i){
      index=i;
      track.style.transform="translateX(-"+(i*100)+"%)";
      dots.forEach(function(d,di){ d.classList.toggle("active",di===i); });
    }
    function next(){ goTo((index+1)%slides.length); }
    var auto=setInterval(next,5500);
    tWrap.addEventListener("mouseenter",function(){ clearInterval(auto); });
    tWrap.addEventListener("mouseleave",function(){ auto=setInterval(next,5500); });
  }

  /* ---------- product quick view modal ---------- */
  var modal=document.querySelector(".modal-overlay");
  if(modal){
    var modalTitle=modal.querySelector(".modal-title");
    var modalDesc=modal.querySelector(".modal-desc");
    var modalImg=modal.querySelector(".modal-img");
    var modalTag=modal.querySelector(".modal-tag");

    document.querySelectorAll(".quick-view").forEach(function(btn){
      btn.addEventListener("click",function(e){
        e.preventDefault();
        var card=btn.closest(".product-card");
        if(!card) return;
        if(modalTitle) modalTitle.textContent=card.dataset.name||"";
        if(modalDesc) modalDesc.textContent=card.dataset.desc||"";
        if(modalTag) modalTag.textContent=card.dataset.tag||"";
        if(modalImg) modalImg.src=card.dataset.img||"";
        modal.classList.add("open");
        document.body.style.overflow="hidden";
      });
    });
    modal.addEventListener("click",function(e){
      if(e.target===modal || e.target.closest(".modal-close")){
        modal.classList.remove("open");
        document.body.style.overflow="";
      }
    });
    document.addEventListener("keydown",function(e){
      if(e.key==="Escape"){
        modal.classList.remove("open");
        document.body.style.overflow="";
      }
    });
  }

})();