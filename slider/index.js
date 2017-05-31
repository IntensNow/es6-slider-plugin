

/*
*  private variables
*/

  let options;

  let default_options = {
    arrows: true,
    autoRun: true,
    navigation: true
  }

  let data = {
    
    firstSlideIdx: 0,
    currentSlideIdx: 0,
    prevSlideIdx: null,
    sliderWrapper: null
    
  };

  const classes = {
    
    navigation: 'navigation',
    navItem: 'nav-item',
    navItemActive: 'active',
    slide : 'slide',
    slider : 'slider'
    
  }

  //animation-timing-functions

var timing = {

  linear: function (timeFraction) {
      return timeFraction;
  },

  quad:function (timeFraction) {
    return Math.pow(timeFraction, 4);
  },

  circ: function (timeFraction) {
    return 1 - Math.sin(Math.acos(timeFraction))
  },

  elastic: function (x, timeFraction) {
    return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction)
  },

  bounce: function (timeFraction) {
    for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
      if (timeFraction >= (7 - 4 * a) / 11) {
        return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
      }
    }
  }

}

//draw functions for animations

var draw = {

  fadeIn(progress) {
    
    let slides = data.slides;
    let slide = slides[data.currentSlideIdx];
    
    if(progress === 1) {
      if(data.prevSlideIdx !== null) 
        slides[data.prevSlideIdx].style.display = 'none';
    }
    
    slide.style.opacity = progress;
    
  }

}

/*
*  public methods
*/

class Slider {
  
  constructor(sliderId, optionsObj) {
    data.sliderWrapper = document.querySelector(sliderId);
    this.slider  = data.sliderWrapper.querySelector(`.${classes.slider}`);
    
    const slides = this.slider.querySelectorAll(`.${classes.slide}`);
    data.slides  = Array.prototype.slice.call(slides);
    options = optionsObj;
    
    slides[data.currentSlideIdx].style.zIndex = '1';
    slides[data.currentSlideIdx].style.display = 'block';
    
    this.play      = this.play.bind(this);
    this.pause     = this.pause.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    
    this.init();
  }
  
  init() {
    
    const that = this;
    
    this.animationState = Slider.ANIMATION_PENDING;
    
    if(options.autoRun) this.turnOn() 
      else this.status = Slider.STATUS_PAUSED;
    
    if(options.arrows) {
      //Созданем 2 элемента arrow (prev, next);
      var prev = document.createElement('div');
      var next = document.createElement('div');
      
      prev.className = 'slider-direction-prev';
      next.className = 'slider-direction-next';
      
      prev.addEventListener('click', this.prevSlide, false);
      next.addEventListener('click', this.nextSlide, false);
      
      this.slider.parentElement.appendChild(prev);
      this.slider.parentElement.appendChild(next);
    }
    
    if(options.navigation) {
      
      const nav = document.createElement('div');
      nav.className = classes.navigation;
      
      for(let i = 0; i < data.slides.length; i++) {
        
        const navItem = document.createElement('div');
        navItem.className = classes.navItem;
        navItem.dataset.slide = i;
        
        nav.appendChild(navItem);  
      }
      
      nav.addEventListener('click', function(e) {
          
          if(!e.target.classList.contains(classes.navItem)) {
            return
          }
          
          const nextSlideIdx = +e.target.dataset.slide;
          
          if(nextSlideIdx === data.currentSlideIdx) {
            return 
          }
          
          that.changeSlide(nextSlideIdx);
        });
      
      data.navigation = nav.children;
      data.navigation[data.firstSlideIdx].classList.add(classes.navItemActive);
      
      data.sliderWrapper.appendChild(nav);
    }
  }
  
  turnOn() {
    if(this.status === Slider.STATUS_ON) {
      console.warn('Slider has already turned on');
      return;
    }
    
    this.status = Slider.STATUS_ON;
    initializeHoverPauseEvents.call(this);
    this.play();
  }
  
  stop() {
    this.status = Slider.STATUS_OFF;
    clearInterval(data.intervalId);
    removeHoverPauseEvents.call(this);
  }
  
  /*
    метод начинает или продолжает смену слайдов.
  */
  
  play() {
    
    if(this.status === Slider.STATUS_PLAYING) {
      console.warn('Slider has already playing');
      return;
    }
    
    this.status = Slider.STATUS_PLAYING;
    
    data.intervalId = setInterval(() => {
      this.nextSlide();
    }, options.duration);
  }
  
  pause() {
    this.status = Slider.STATUS_PAUSED;
    clearInterval(data.intervalId); 
  }
  
  changeSlide(nextSlideIdx) {
    
    if(this.animationState === Slider.ANIMATION_IN_PROGRESS) {
      console.log(`You can not change the slide during the animation`);
      return false;
    }
    
    this.animationState = Slider.ANIMATION_IN_PROGRESS;
    
    data.prevSlideIdx = data.currentSlideIdx;
    data.currentSlideIdx = nextSlideIdx;
    
    if(data.navigation) {
      try {
        data.navigation[data.prevSlideIdx].classList.remove(classes.navItemActive);
        data.navigation[data.currentSlideIdx].classList.add(classes.navItemActive);
      } catch (err) {
        console.log(err);
      }
      
    }
    
    let prevSlide = data.slides[data.prevSlideIdx];
    prevSlide.style.zIndex = 0;
    prevSlide.style.display = 'block';
    let currentSlide = data.slides[data.currentSlideIdx];
    currentSlide.style.zIndex = 1;
    currentSlide.style.display = 'block';
    
    var drawFc = makeDraw(draw[options.effect]);
    
    //запускаем анимацию следующего слайда
    
    animate({
      duration: 1000,
      draw: drawFc.bind(this),
      timing: timing[options.timing]
    });
    
    return true;
    
  }
  
  nextSlide(e) {
    var slideIdx = data.currentSlideIdx + 1;
    
    if(slideIdx === data.slides.length) 
      slideIdx = 0;
    
    if(e && this.status !== Slider.STATUS_OFF && this.status !== Slider.STATUS_PAUSED) {
      this.pause();
      setTimeout(() => {
        this.play();
      }, options.duration);
    }
    
    this.changeSlide(slideIdx);
    
  }
  
  prevSlide(e) {
    var slideIdx = data.currentSlideIdx - 1;
    
    if(slideIdx < 0) 
      slideIdx = data.slides.length - 1;
    
    if(e && this.status !== Slider.STATUS_OFF && this.status !== Slider.STATUS_PAUSED) {
      this.pause();
      setTimeout(() => {
        this.play();
      }, options.duration);
    }
    
    this.changeSlide(slideIdx);
  }
}

/* static variables */

/*
  значения которые может принимать свойство status экземпляра слайдера.
*/

//Параметр autoRun = false или был использован метод stop();
Slider.STATUS_OFF = `STATUS_OFF`;
//Параметр autoRun = true или был использован метод play();
Slider.STATUS_ON = `STATUS_ON`;
//Происходит перелистывание слайдов (работает setInteral);
Slider.STATUS_PLAYING = `STATUS_PLAYING`;
//был использован метод pause();
Slider.STATUS_PAUSED = `STATUS_PAUSED`;

/*
  значения которые может принимать свойство animationState экземпляра слайдера.
*/

//анимации не происходит.
Slider.ANIMATION_PENDING = `ANIMATION_PENDING`;
//в данный момент анимация в процессе => новую анимацию запустить нельзя.
Slider.ANIMATION_IN_PROGRESS = `ANIMATION_IN_PROGRESS`;

/*
*  private methods
*/

function initializeHoverPauseEvents() {
  
  data.sliderWrapper.addEventListener('mouseenter', this.pause, false);
  data.sliderWrapper.addEventListener('mouseleave', this.play, false);
  
}

function removeHoverPauseEvents() {
  
  data.sliderWrapper.removeEventListener('mouseenter', this.pause, false);
  data.sliderWrapper.removeEventListener('mouseleave', this.play, false);
  
}

const animate = ({ duration, timing, draw }) => {

  const start = performance.now();

  const makeFrame = time => {

    var timeStamp = performance.now();

    let timeFraction = (timeStamp - start) / duration;

    if (timeFraction > 1) {
      timeFraction = 1;
    }

    const progress = timing(timeFraction);
    draw(progress);

    if(timeFraction < 1) {
      requestAnimationFrame(makeFrame);
    }

  }
  
  requestAnimationFrame(makeFrame);

}

//функция-декоратор draw-функций для изменения animationState; 
function makeDraw(drawFc) {
  
  return function(progress) {
    if(this.animationState === Slider.ANIMATION_PENDING) {
      this.animationState = Slider.ANIMATION_IN_PROGRESS;
    }
    if(progress === 1) {
      this.animationState = Slider.ANIMATION_PENDING;
    }
    
    return drawFc(progress);
  }
}

export default Slider;


