const projectWindowStyle = `
  position: absolute; 
  top: 100px; left: 5%; 
  width: 50%; 
  min-width: 200px; 
  min-height: 200px; 
  z-index: 100; 
  display: flex; 
  flex-direction: column; 
  resize: both; 
  overflow: auto
`

export function loadFunWindow() {
  fetch("data/info.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("project-display");
      data.projects.forEach((project, index) => {
        let element = document.createElement("div");
        element.className = "project-container";
        let title = document.createElement("h2");
        title.className = "project-title"
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

        const frameDiv = document.createElement('div');
        frameDiv.style.display = 'flex';
        frameDiv.style.flexDirection = 'row-reverse';
    
        const header = document.createElement('div');
        header.className = 'window-frame';
        header.textContent = project.name;
        header.style.cssText = `
          border-image-slice: 1;
          border-image-width: 5px;
          flex-grow: 1;
          font-size: smaller;
          max-height: 35px;
          margin: 0;
          overflow: hidden;
          text-wrap: nowrap;
          text-overflow: ellipsis;
          padding: 5px;
          padding-left: 10px;
        `;

        const buttons = ['minimize', 'shrink', 'close'].map(type => {
          const button = document.createElement('button');
          button.className = 'window-button';
          button.style.backgroundImage = `url(images/wd_button_${type}.png)`;
          button.style.backgroundSize = 'cover';
          return button;
        });
    
        frameDiv.append(...buttons.reverse(), header);

        const slideshowContainer = document.createElement('div');
        slideshowContainer.className = 'image-slideshow window-frame';
        slideshowContainer.style.cssText = `
          display: grid;
          grid: 
          "a b c" 100% / 5px auto 5px;
          flex-grow: 1;
          gap: 5px;
          justify-items: center;
          align-items: center;
          overflow: hidden;
          padding: 10px;
        `;
    
        // Image Display Area
        const imageGridDiv = document.createElement("div");
        imageGridDiv.style.cssText = `
          height: 100%;
          grid-area: b;
        `
        const imageDisplay = document.createElement('img');
        imageDisplay.className = 'slideshow-image';
        imageDisplay.style.cssText = `
          width: 100%;
          height: 100%;
          image-rendering: auto;
          object-fit: contain;
          transition: opacity 0.3s ease;
        `;
    
        // Navigation Buttons
        const prevButton = createSlideshowButton('←', 'prev');
        prevButton.style.gridArea = "a"
        const nextButton = createSlideshowButton('→', 'next');
        nextButton.style.gridArea = "c"
    
        imageGridDiv.append(imageDisplay)
        slideshowContainer.append(prevButton, imageGridDiv, nextButton);
    
        // Image Management
        const imageName = project.imgs
        const images = []
        imageName.forEach((id) => {
          images.push(project.imgSource + "/" + id)
        })
        let currentImageIndex = 0;
    
        // Initial image load
        if (images.length > 0) {
          imageDisplay.src = images[0];
        }
    
        // Button click handlers
        prevButton.addEventListener('click', () => {
          currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
          imageDisplay.src = images[currentImageIndex];
        });
    
        nextButton.addEventListener('click', () => {
          currentImageIndex = (currentImageIndex + 1) % images.length;
          imageDisplay.src = images[currentImageIndex];
        });
    
        // Hide buttons if only one image
        if (images.length <= 1) {
          prevButton.style.display = 'none';
          nextButton.style.display = 'none';
        }

        function createSlideshowButton(text, type) {
          const button = document.createElement('button');
          button.textContent = text;
          button.className = `slideshow-${type}-button`;
          button.style.cssText = `
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            padding: 10px;
            margin: 0 10px;
            cursor: pointer;
            transition: background 0.3s ease;
          `;
      
          // Hover effects
          button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(0,0,0,0.7)';
          });
      
          button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(0,0,0,0.5)';
          });
      
          return button;
        }

        slideshowWindow.append(frameDiv, slideshowContainer)

        let description = document.createElement("p");
        // description.setAttribute("class", "project-description");
        description.setAttribute("id", "proj-win" + index + "des");
        description.style.cssText = `
            align-self: flex-end;
            flex-grow: 1;
            margin-right: 30px;
            width: 35%;
          `
        description.innerHTML = project.description;
        
        slideshowWindow.onmouseenter = () => {
          console.log("Window changed")
          description.style.width = (element.clientWidth - slideshowWindow.style.width - slideshowWindow.style.left) + "px"
        }

        makeDraggable(slideshowWindow, header, description)
        element.appendChild(slideshowWindow)
        element.appendChild(description)
        // Append to the container
        container.appendChild(element);
        console.log("loaded project");
      });
    })
    .catch((error) => console.error("Error:", error));
}

function makeDraggable(element, handle, textBlock) {
  let isDragging = false;
  let startX, startY;

  const onMouseDown = (event) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    element.style.left = `${element.offsetLeft + deltaX}px`;
    element.style.top = `${element.offsetTop + deltaY}px`;

    // if (textBlock.clientWidth % 20 == 0) console.log(textBlock.clientWidth)
    changeTextWidth(event)
  };

  const onMouseUp = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const changeTextWidth = (event) => {
    let newWidth = Math.max(document.getElementById("project-display").clientWidth - element.clientWidth - element.offsetLeft - 120, 150)
    textBlock.style.width = `${newWidth}px`
    startX = event.clientX;
    startY = event.clientY;
  }


  document.addEventListener('mousemove', (e) => {
    
  })
  handle.addEventListener('mousedown', onMouseDown);
}
