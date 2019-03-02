var typePanels = document.querySelectorAll(".average-prices_type");
var typeMenuContainer = document.querySelector(".average-prices_menu");
var typeButtons = document.querySelectorAll(".average-prices_type-btn");
var typeHome = document.querySelector("#average-prices_type-btn--home");
var typePrivate = document.querySelector("#average-prices_type-btn--private");
var typeShared = document.querySelector("#average-prices_type-btn--shared");

typeHome.addEventListener("click", function(){showPanel(0, "#17c4ff");}, false);
typePrivate.addEventListener("click", function(){showPanel(1, "#00688b");}, false);
typeShared.addEventListener("click", function(){showPanel(2, "#003445");}, false);

export default function showPanel(panelIndex, colorCode) {
  typeButtons.forEach(function(node){
    node.style.backgroundColor="white";
    node.style.color=""
  })
  typeButtons[panelIndex].style.backgroundColor= colorCode;
  typeMenuContainer.style.borderColor= colorCode;
  typeButtons[panelIndex].style.color= "white";

  typePanels.forEach(function(node){
    node.style.display="none";
  })
  typePanels[panelIndex].style.display="block";
}