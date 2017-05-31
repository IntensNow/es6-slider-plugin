/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slider = __webpack_require__(1);

	var _slider2 = _interopRequireDefault(_slider);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var demoSlider = new _slider2.default('#fadeSlider', {

	  autoRun: true,
	  arrows: true,
	  navigation: true,
	  duration: 3000,
	  effect: 'fadeIn',
	  timing: 'linear'

	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	*  private variables
	*/

	var options = void 0;

	var default_options = {
	  arrows: true,
	  autoRun: true,
	  navigation: true
	};

	var data = {

	  firstSlideIdx: 0,
	  currentSlideIdx: 0,
	  prevSlideIdx: null,
	  sliderWrapper: null

	};

	var classes = {

	  navigation: 'navigation',
	  navItem: 'nav-item',
	  navItemActive: 'active',
	  slide: 'slide',
	  slider: 'slider'

	};

	//animation-timing-functions

	var timing = {

	  linear: function linear(timeFraction) {
	    return timeFraction;
	  },

	  quad: function quad(timeFraction) {
	    return Math.pow(timeFraction, 4);
	  },

	  circ: function circ(timeFraction) {
	    return 1 - Math.sin(Math.acos(timeFraction));
	  },

	  elastic: function elastic(x, timeFraction) {
	    return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction);
	  },

	  bounce: function bounce(timeFraction) {
	    for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
	      if (timeFraction >= (7 - 4 * a) / 11) {
	        return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
	      }
	    }
	  }

	};

	//draw functions for animations

	var draw = {
	  fadeIn: function fadeIn(progress) {

	    var slides = data.slides;
	    var slide = slides[data.currentSlideIdx];

	    if (progress === 1) {
	      if (data.prevSlideIdx !== null) slides[data.prevSlideIdx].style.display = 'none';
	    }

	    slide.style.opacity = progress;
	  }
	};

	/*
	*  public methods
	*/

	var Slider = function () {
	  function Slider(sliderId, optionsObj) {
	    _classCallCheck(this, Slider);

	    data.sliderWrapper = document.querySelector(sliderId);
	    this.slider = data.sliderWrapper.querySelector('.' + classes.slider);

	    var slides = this.slider.querySelectorAll('.' + classes.slide);
	    data.slides = Array.prototype.slice.call(slides);
	    options = optionsObj;

	    slides[data.currentSlideIdx].style.zIndex = '1';
	    slides[data.currentSlideIdx].style.display = 'block';

	    this.play = this.play.bind(this);
	    this.pause = this.pause.bind(this);
	    this.prevSlide = this.prevSlide.bind(this);
	    this.nextSlide = this.nextSlide.bind(this);

	    this.init();
	  }

	  _createClass(Slider, [{
	    key: 'init',
	    value: function init() {

	      var that = this;

	      this.animationState = Slider.ANIMATION_PENDING;

	      if (options.autoRun) this.turnOn();else this.status = Slider.STATUS_PAUSED;

	      if (options.arrows) {
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

	      if (options.navigation) {

	        var nav = document.createElement('div');
	        nav.className = classes.navigation;

	        for (var i = 0; i < data.slides.length; i++) {

	          var navItem = document.createElement('div');
	          navItem.className = classes.navItem;
	          navItem.dataset.slide = i;

	          nav.appendChild(navItem);
	        }

	        nav.addEventListener('click', function (e) {

	          if (!e.target.classList.contains(classes.navItem)) {
	            return;
	          }

	          var nextSlideIdx = +e.target.dataset.slide;

	          if (nextSlideIdx === data.currentSlideIdx) {
	            return;
	          }

	          that.changeSlide(nextSlideIdx);
	        });

	        data.navigation = nav.children;
	        data.navigation[data.firstSlideIdx].classList.add(classes.navItemActive);

	        data.sliderWrapper.appendChild(nav);
	      }
	    }
	  }, {
	    key: 'turnOn',
	    value: function turnOn() {
	      if (this.status === Slider.STATUS_ON) {
	        console.warn('Slider has already turned on');
	        return;
	      }

	      this.status = Slider.STATUS_ON;
	      initializeHoverPauseEvents.call(this);
	      this.play();
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      this.status = Slider.STATUS_OFF;
	      clearInterval(data.intervalId);
	      removeHoverPauseEvents.call(this);
	    }

	    /*
	      метод начинает или продолжает смену слайдов.
	    */

	  }, {
	    key: 'play',
	    value: function play() {
	      var _this = this;

	      if (this.status === Slider.STATUS_PLAYING) {
	        console.warn('Slider has already playing');
	        return;
	      }

	      this.status = Slider.STATUS_PLAYING;

	      data.intervalId = setInterval(function () {
	        _this.nextSlide();
	      }, options.duration);
	    }
	  }, {
	    key: 'pause',
	    value: function pause() {
	      this.status = Slider.STATUS_PAUSED;
	      clearInterval(data.intervalId);
	    }
	  }, {
	    key: 'changeSlide',
	    value: function changeSlide(nextSlideIdx) {

	      if (this.animationState === Slider.ANIMATION_IN_PROGRESS) {
	        console.log('You can not change the slide during the animation');
	        return false;
	      }

	      this.animationState = Slider.ANIMATION_IN_PROGRESS;

	      data.prevSlideIdx = data.currentSlideIdx;
	      data.currentSlideIdx = nextSlideIdx;

	      if (data.navigation) {
	        try {
	          data.navigation[data.prevSlideIdx].classList.remove(classes.navItemActive);
	          data.navigation[data.currentSlideIdx].classList.add(classes.navItemActive);
	        } catch (err) {
	          console.log(err);
	        }
	      }

	      var prevSlide = data.slides[data.prevSlideIdx];
	      prevSlide.style.zIndex = 0;
	      prevSlide.style.display = 'block';
	      var currentSlide = data.slides[data.currentSlideIdx];
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
	  }, {
	    key: 'nextSlide',
	    value: function nextSlide(e) {
	      var _this2 = this;

	      var slideIdx = data.currentSlideIdx + 1;

	      if (slideIdx === data.slides.length) slideIdx = 0;

	      if (e && this.status !== Slider.STATUS_OFF && this.status !== Slider.STATUS_PAUSED) {
	        this.pause();
	        setTimeout(function () {
	          _this2.play();
	        }, options.duration);
	      }

	      this.changeSlide(slideIdx);
	    }
	  }, {
	    key: 'prevSlide',
	    value: function prevSlide(e) {
	      var _this3 = this;

	      var slideIdx = data.currentSlideIdx - 1;

	      if (slideIdx < 0) slideIdx = data.slides.length - 1;

	      if (e && this.status !== Slider.STATUS_OFF && this.status !== Slider.STATUS_PAUSED) {
	        this.pause();
	        setTimeout(function () {
	          _this3.play();
	        }, options.duration);
	      }

	      this.changeSlide(slideIdx);
	    }
	  }]);

	  return Slider;
	}();

	/* static variables */

	/*
	  значения которые может принимать свойство status экземпляра слайдера.
	*/

	//Параметр autoRun = false или был использован метод stop();


	Slider.STATUS_OFF = 'STATUS_OFF';
	//Параметр autoRun = true или был использован метод play();
	Slider.STATUS_ON = 'STATUS_ON';
	//Происходит перелистывание слайдов (работает setInteral);
	Slider.STATUS_PLAYING = 'STATUS_PLAYING';
	//был использован метод pause();
	Slider.STATUS_PAUSED = 'STATUS_PAUSED';

	/*
	  значения которые может принимать свойство animationState экземпляра слайдера.
	*/

	//анимации не происходит.
	Slider.ANIMATION_PENDING = 'ANIMATION_PENDING';
	//в данный момент анимация в процессе => новую анимацию запустить нельзя.
	Slider.ANIMATION_IN_PROGRESS = 'ANIMATION_IN_PROGRESS';

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

	var animate = function animate(_ref) {
	  var duration = _ref.duration,
	      timing = _ref.timing,
	      draw = _ref.draw;


	  var start = performance.now();

	  var makeFrame = function makeFrame(time) {

	    var timeStamp = performance.now();

	    var timeFraction = (timeStamp - start) / duration;

	    if (timeFraction > 1) {
	      timeFraction = 1;
	    }

	    var progress = timing(timeFraction);
	    draw(progress);

	    if (timeFraction < 1) {
	      requestAnimationFrame(makeFrame);
	    }
	  };

	  requestAnimationFrame(makeFrame);
	};

	//функция-декоратор draw-функций для изменения animationState; 
	function makeDraw(drawFc) {

	  return function (progress) {
	    if (this.animationState === Slider.ANIMATION_PENDING) {
	      this.animationState = Slider.ANIMATION_IN_PROGRESS;
	    }
	    if (progress === 1) {
	      this.animationState = Slider.ANIMATION_PENDING;
	    }

	    return drawFc(progress);
	  };
	}

	exports.default = Slider;

/***/ }
/******/ ]);