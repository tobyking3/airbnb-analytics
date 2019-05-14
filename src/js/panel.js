let typePanels = document.querySelectorAll(".average-prices_type");
let typeMenuContainer = document.querySelector(".average-prices_menu");
let typeButtons = document.querySelectorAll(".average-prices_type-btn");
let typeHome = document.querySelector("#average-prices_type-btn--home");
let typePrivate = document.querySelector("#average-prices_type-btn--private");
let typeShared = document.querySelector("#average-prices_type-btn--shared");

typeHome.addEventListener("click", () => {showPanel(0, "#17c4ff");}, false);
typePrivate.addEventListener("click", () => {showPanel(1, "#00688b");}, false);
typeShared.addEventListener("click", () => {showPanel(2, "#003445");}, false);

// Update the panel element 

export default function showPanel(panelIndex, colorCode) {

  typeButtons.forEach(node => {
    node.style.backgroundColor="white";
    node.style.color=""
  })

  typeButtons[panelIndex].style.backgroundColor= colorCode;
  typeMenuContainer.style.borderColor= colorCode;
  typeButtons[panelIndex].style.color= "white";

  typePanels.forEach(node => {
    node.style.display="none";
  })

  typePanels[panelIndex].style.display="block";
}