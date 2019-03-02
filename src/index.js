import _ from 'lodash';
import printMe from './print.js';
import './scss/styles.scss';
import * as d3 from 'd3';
import 'd3-selection-multi';
import map from './js/map.js'
import showPanel from './js/panel.js'

//Initialize Panel
showPanel(0, "#17c4ff");


function component() {
  let element = document.createElement('div');
  var btn = document.createElement('button');

  element.innerHTML = _.join(['Airbnb', 'Analytics'], ' ');

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;

  element.appendChild(btn);

  return element;
}

let element = component(); // Store the element to re-render on print.js changes
document.body.appendChild(element);

if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');
    document.body.removeChild(element);
    element = component(); // Re-render the "component" to update the click handler
    document.body.appendChild(element);
  })
}