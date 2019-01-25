import _ from 'lodash';
import './style.css';
import Icon from './icon.png';
import Data from './data.xml';

/*This can be especially helpful when implementing some sort of data visualization using a tool like d3.
Instead of making an ajax request and parsing the data at runtime you can load it into your module during
the build process so that the parsed data is ready to go as soon as the module hits the browser.*/

function component() {
  let element = document.createElement('div');

  element.innerHTML = _.join(['Airbnb', 'Analytics'], ' ');
  element.classList.add('hello');

  var myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  console.log(Data);
  console.log("Working");

  return element;
}

document.body.appendChild(component());