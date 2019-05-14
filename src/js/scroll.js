/***************************************************************************************

  Page scrolling has been implemented following a tutorial found on Youtube.
  https://www.youtube.com/watch?v=HLgGnwwrJ0Y

  The code has been adapted to suit the needs of the application.

*    Title: Full page scroll using javascript time and scrollIntoview
*    Author: Codify
*    Date: 2019
*    Code version: 1.0
*    Availability: http://www.kodhus.com/kodnest/codify/yhxQeaX/layout/1

***************************************************************************************/

const content = document.querySelectorAll('section');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

const home = document.querySelector('.home-btn');
const about = document.querySelector('.about-btn');
const map = document.querySelector('.map-btn');
const bookings = document.querySelector('.bookings-btn');
const calendar = document.querySelector('.calendar-btn');
const accommodates = document.querySelector('.accommodates-btn');

const idlePeriod = 100;
const animationDuration = 1000;

let lastAnimation = 0;
let index = 0;
let component;

const toggleText = (index, state) => {
  component = content[index].querySelector('.component');
  state === 'show' ? component.classList.add('show') : component.classList.remove('show');
}

toggleText(0, 'show');

// Add click event listeners to each element in the navigation

home.addEventListener('click', () => {
  if (index === 0) return;
  toggleText(index, 'hide');
  index = 0;
  content.forEach((section, i) => {
    if (i === index) {
      toggleText(i, 'show');
      section.scrollIntoView({behavior: "smooth"});
    }
  });
})

about.addEventListener('click', () => {
  if (index === 1) return;
  toggleText(index, 'hide');
  index = 1;
  content.forEach((section, i) => {
    if (i === index) {
      toggleText(i, 'show');
      section.scrollIntoView({behavior: "smooth"});
    }
  });
})

map.addEventListener('click', () => {
  if (index === 2) return;
  toggleText(index, 'hide');
  index = 2;
  content.forEach((section, i) => {
    if (i === index) {
      toggleText(i, 'show');
      section.scrollIntoView({behavior: "smooth"});
    }
  });
})

bookings.addEventListener('click', () => {
  if (index === 3) return;
  toggleText(index, 'hide');
  index = 3;
  content.forEach((section, i) => {
    if (i === index) {
      toggleText(i, 'show');
      section.scrollIntoView({behavior: "smooth"});
    }
  });
})

calendar.addEventListener('click', () => {
  if (index === 4) return;
  toggleText(index, 'hide');
  index = 4;
  content.forEach((section, i) => {
    if (i === index) {
      toggleText(i, 'show');
      section.scrollIntoView({behavior: "smooth"});
    }
  });
})

accommodates.addEventListener('click', () => {
  if (index === 5) return;
  toggleText(index, 'hide');
  index = 5;
  content.forEach((section, i) => {
    if (i === index) {
      toggleText(i, 'show');
      section.scrollIntoView({behavior: "smooth"});
    }
  });
})

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
  if (index > 4) return;
  toggleText(index, 'hide');
  index++;
  content.forEach((section, i) => {
    if (i === index) {
      toggleText(i, 'show');
      section.scrollIntoView({behavior: "smooth"});
    }
  })
})

// Add wheel event listener to jump to next section when event is fired

document.addEventListener('wheel', event => {
  let delta = event.wheelDelta;
  let timeNow = new Date().getTime();
  // Cancel scroll if currently animating or within quiet period
  if(timeNow - lastAnimation < idlePeriod + animationDuration) {
    event.preventDefault();
    return;
  }
  
  if (delta < 0) {
    let event = new Event('click');
    next.dispatchEvent(event);
  } else {
    let event = new Event('click');
    prev.dispatchEvent(event);
  }
  
  lastAnimation = timeNow;
}) 