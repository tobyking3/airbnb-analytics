const content = document.querySelectorAll('section');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

const home = document.querySelector('.home-btn');
const about = document.querySelector('.about-btn');
const map = document.querySelector('.map-btn');
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

calendar.addEventListener('click', () => {
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

accommodates.addEventListener('click', () => {
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

prev.addEventListener('click', () => {
  if (index < 1) return;
  toggleText(index, 'hide');
  index--;
  content.forEach((section, i) => {
    console.log(section);
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