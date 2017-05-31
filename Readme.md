How to use it.

Wrap Wrap your content e.g. images into DIV elements as children slides for the slider:

      <div id="fadeSlider" class="sliderWrapper">
        <div class="slider">
          <div class="slide"><img src="http://www.bionagroup.com/upload/resize_cache/iblock/823/990_320_1/img53.jpg"></div>
          <div class="slide"><img src="http://www.seyclub.ru/gallery/video//img/banner.jpg"></div>
          <div class="slide"><img src="http://lifeglobe.net/x/entry/1014/grandcanyon1-2.jpg"></div>
          <div class="slide"><img src="https://iskin.co.uk/wallpapers/styles/851x315/public/rainforest_plants.jpg"></div>
        </div>
      </div>

The basic CSS styles for the slider & navigation.

      #fadeSlider.sliderWrapper {
        box-shadow: 0 0 4px 2px #000;
        height:140px;
        width: 320px;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
      }
      #fadeSlider .slider {
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: relative;
        background: #aaa;
      }
      #fadeSlider .slide {
        z-index: 0;
        position: absolute;
        display: none;
        height: 100%;
        width: 100%;
      }
      #fadeSlider img {
        height: 100%;
        width: 100%;
      }

      .slider-direction-prev, .slider-direction-next {
        z-index: 2;
        position: absolute;
        top:35%;
        height: 48px;
        width: 34px;
        background: black;
        color:white;
        font-size: 24px;
        font-weight:bold;
        line-height: 48px;
        text-align: center;
        transition: all 1s ease;
        border-radius: 3px;
        opacity: 0;
        border: 2px solid grey;
        cursor: pointer;
      }

      .slider-direction-prev:after {
        content: '<<';
      }

      .slider-direction-next:after {
        content: '>>';
      }

      .slider-direction-prev:hover , .slider-direction-next:hover {
        opacity: 1;
      }

      .slider-direction-prev {
        left: -40px;
      }

      .slider-direction-next {
        right: -40px;
      }

      .sliderWrapper:hover .slider-direction-prev {
        left: 8px;
        opacity: 0.45;
        z-index: 100;
      }
      .sliderWrapper:hover .slider-direction-next {
        right: 8px;
        opacity: 0.45;
      }

      .sliderWrapper .navigation {
        z-index: 2;
        position: absolute;
        bottom: -20px;
        left:10px;
        opacity: 0;
        transition: all 1s ease;
      }

      .sliderWrapper:hover .navigation {
        bottom:5px;
        opacity: 1;
      }

      .sliderWrapper .navigation .nav-item {
        display: inline-block;
        height: 12px;
        width: 12px;
        background-color: aliceblue;
        border-radius: 8px;
        cursor:pointer;
        margin: 0 2px;
      }

      .sliderWrapper .navigation .nav-item.active {

        background-color: dodgerblue;

      }


import slider module into your .js file like this: 

      import Slider from './slider';

create the slider 

      const demoSlider = new slider('#fadeSlider', {
  
        autoRun: true,
        arrows: true,
        navigation: true, 
        duration: 3000, //The time that the slide is on the screen, 
                          including the transition to the next slide (1000)
        effect: 'fadeIn', //'fadeIn' is the only draw-effect available now
        timing: 'linear' //quad, circ, elastic, bounce

      });