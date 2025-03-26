const projectWindowStyle = "border: 5px solid red; position: absolute; top: 40px; left: 40px; width: 200px; min-width: 95px; min-height: 35px; z-index: 100; display: flex; flex-direction: column"
const projectDescStyle = "align-self: flex-end; width: 50%;"
const frameDivStyle = "display: flex; flex-direction: row-reverse;"
const headerStyle = "height: 35px; margin: 0; text-align: center; text-overflow: ellipsis; text-wrap-mode: nowrap;"

export function loadJSON() {
  fetch("data/info.json")
    .then((response) => response.json())
    .then((data) => {
      const containerEducation = document.getElementById("Education");
      let element = document.createElement("div");
      let smallerElement1 = document.createElement("p");
      smallerElement1.textContent = data.education.name;
      let smallerElement2 = document.createElement("p");
      smallerElement2.textContent = data.education.gpa;
      element.appendChild(smallerElement1);
      element.appendChild(smallerElement2);
      // Append to the container
      containerEducation.appendChild(element);
    })
    .catch((error) => console.error("Error:", error));
}

export function loadFunWindow() {
  fetch("data/info.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("project-display");
      data.projects.forEach((project, index) => {
        let element = document.createElement("div");
        element.setAttribute("class", "project-container");
        let title = document.createElement("h2");
        title.setAttribute("class", "project-title")
        title.innerHTML =
          '<a href="' +
          project.link +
          '" class="project-title-link" target="_blank" rel="noopener noreferrer">' +
          project.name +
          "</a>";
        element.appendChild(title);

        let slideshowWindow = document.createElement("div");
        slideshowWindow.setAttribute("class", "project-window");
        slideshowWindow.setAttribute("id", "proj-win" + index);
        slideshowWindow.style = projectWindowStyle;

        let frameDiv = document.createElement("div")
        frameDiv.style = frameDivStyle
        let header = document.createElement("p")
        header.setAttribute("class", "window-frame")
        header.textContent = project.name
        header.style = headerStyle
        let minimizeButton = document.createElement("button")
        minimizeButton.setAttribute("class", "window-button")
        minimizeButton.style = "background-image: url(images/wd_button_minimize.png); background-size: cover"
        let windowButton = document.createElement("button")
        windowButton.setAttribute("class", "window-button")
        minimizeButton.style = "background-image: url(images/wd_button_minimize.png); background-size: cover"
        let closeButton = document.createElement("button")
        closeButton.setAttribute("class", "window-button")
        minimizeButton.style = "background-image: url(images/wd_button_minimize.png); background-size: cover"
        frameDiv.appendChild(closeButton)
        frameDiv.appendChild(windowButton)
        frameDiv.appendChild(minimizeButton)
        frameDiv.appendChild(header)

        slideshowWindow.appendChild(frameDiv)


        let description = document.createElement("p");
        // description.setAttribute("class", "project-description");
        description.setAttribute("id", "proj-win" + index + "des");
        description.style = projectDescStyle;
        description.innerHTML = project.description;
        
        makeDraggable(slideshowWindow, header)
        element.appendChild(slideshowWindow)
        element.appendChild(description)
        // Append to the container
        container.appendChild(element);
        console.log("loaded project");
      });
    })
    .catch((error) => console.error("Error:", error));
}

function setDraggableWindow(element, elementHeader) {
  elementHeader.addEventListener("mousedown", drag)
  console.log("set draggable for " + element.id)

  function drag(event) {
    event.preventDefault()
    var posX0 = event.clientX;
    var posY0 = event.clientY;
    var posX;
    var posY;
    
    document.onmousemove = moveElement;

    document.onmouseup = endDrag;
    let victim = document.getElementById(element.id + "des")
    console.log(victim.style.width)

    function moveElement(event) {
      event.preventDefault()
      posX = event.clientX - posX0;
      posY = event.clientY - posY0;
      posX0 = event.clientX;
      posY0 = event.clientY;

      element.style.left = (element.offsetLeft + posX) + "px"
      element.style.top = (element.offsetTop + posY) + "px"

      const newWidth = Math.max();
      
      // console.log(posX)
      // console.log(posY)
    }

    function endDrag(event) {
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }
}
// function makeDraggable(element, handle) {
//   let isDragging = false;
//   let startX, startY;

//   const onMouseDown = (event) => {
//     isDragging = true;
//     startX = event.clientX;
//     startY = event.clientY;
    
//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);
//   };

//   const onMouseMove = (event) => {
//     if (!isDragging) return;

//     const deltaX = event.clientX - startX;
//     const deltaY = event.clientY - startY;

//     element.style.left = `${element.offsetLeft + deltaX}px`;
//     element.style.top = `${element.offsetTop + deltaY}px`;

//     startX = event.clientX;
//     startY = event.clientY;
//   };

//   const onMouseUp = () => {
//     isDragging = false;
//     document.removeEventListener('mousemove', onMouseMove);
//     document.removeEventListener('mouseup', onMouseUp);
//   };

//   handle.addEventListener('mousedown', onMouseDown);
// }