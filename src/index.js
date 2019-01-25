import _ from 'lodash';
import printMe from './print.js';
import './styles.css';
import * as d3 from 'd3';

/*This can be especially helpful when implementing some sort of data visualization using a tool like d3.
Instead of making an ajax request and parsing the data at runtime you can load it into your module during
the build process so that the parsed data is ready to go as soon as the module hits the browser.*/

console.log("HELLO RELOAD");

const square = d3.selectAll("rect");
square.style("fill", "orange");

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