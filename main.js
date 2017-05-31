import slider from './slider';

const demoSlider = new slider('#fadeSlider', {
  
  autoRun: true,
  arrows: true,
  navigation: true,
  duration: 3000,
  effect: 'fadeIn',
  timing: 'linear'
  
});