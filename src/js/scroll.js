const content = document.querySelectorAll('section');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

const idlePeriod = 100;
const animationDuration = 1000;

let lastAnimation = 0;
let index = 0;


const toggleText = (index, state) => {
  if (state === 'show') {
    content[index].querySelector('.text').classList.add('show');  
  } else {
    content[index].querySelector('.text').classList.remove('show');  
  } 
}

toggleText(0, 'show');

prev.addEventListener('click', () => {
  if (index < 1) return;
  toggleText(index, 'hide');
  index--;
  
  content.forEach((section, i) => {
    if (i === index) {
      toggleText(i, 'show');
      section.scrollIntoView({behavior: "smooth"});
    }
  });
})

next.addEventListener('click', () => {
  if (index > 3) return;
  toggleText(index, 'hide');
  index++;
  content.forEach((section, i) => {
    if (i === index) {
      toggleText(i, 'show');
      section.scrollIntoView({behavior: "smooth"});
    }
  })
})

document.addEventListener('wheel', event => {
  var delta = event.wheelDelta;
  var timeNow = new Date().getTime();
  // Cancel scroll if currently animating or within quiet period
  if(timeNow - lastAnimation < idlePeriod + animationDuration) {
    event.preventDefault();
    return;
  }
  
  if (delta < 0) {
    var event = new Event('click');
    next.dispatchEvent(event);
  } else {
    var event = new Event('click');
    prev.dispatchEvent(event);
  }
  
  lastAnimation = timeNow;
}) 