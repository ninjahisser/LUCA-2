initiate("intro");

const parentElement = document.getElementById("sceneImageParent");
let currentScene = null;

const debug = false;

parentElement.innerHTML = '';

async function fetch_scenes() {
    const response = await fetch("../Data/scenes.json");
    const json = await response.json();

    json.hasScene = function(scenename) {
        return this.scenes.some(scene => scene.id === scenename);
    };

    json.getScene = function(scenename) {
        return this.scenes.find(scene => scene.id === scenename);    
    }

    json.scenes.forEach(scene => {
        scene.getType = function() {
            return this.type ? this.type : null;
        }

        scene.getTargetScene = function() {
            return this.target_scene ? this.target_scene : null;
        }

        scene.getLayers = function() {
            return this.layers ? this.layers : null;
        };

        scene.getWidth = function() {
            return this.width ? this.width : null;
        };

        scene.getHeight = function() {
            return this.height ? this.height : null;
        };

        scene.getTextContent = function() {
            return this.text ? this.text : null;
        }

        if(scene.layers){
            scene.layers.forEach(layer => {
                layer.getImage = function() {
                    return this.image ? this.image : null  
                }
    
                layer.getParallax = function() {
                    return this.parallaxStrength ? this.parallaxStrength : null
                }
    
                layer.getInteractions = function() {
                    return this.interactions ? this.interactions : null
                }
                
                const interactions = layer.getInteractions();  // Defined here
                
                if (interactions) {
                    interactions.forEach(interaction => {
                        interaction.getPosX = function() {
                            return this.position[0] ? this.position[0] : null
                        }
            
                        interaction.getPosY = function() {
                            return this.position[1] ? this.position[1] : null
                        }
    
                        interaction.getWidth = function() {
                            return this.size[0] ? this.size[0] : null
                        }
            
                        interaction.getHeight = function() {
                            return this.size[1] ? this.size[1] : null  
                        }
                    });
                }
            });
        }
    });  

    return json;
}


function addLayer(layer){
    imageSrc = layer.getImage();
    if (imageSrc) {
        const imgElement = document.createElement("img");
        const parallaxStrength = layer.getParallax();

        imgElement.src = imageSrc; 
        imgElement.alt = `Layer ${i + 1}`; 
        imgElement.classList.add("scene-layer-image"); 
        imgElement.style.transform = `translateX(calc(-${parallaxStrength}px * var(--cursorX))) translateY(calc(-${parallaxStrength}px * var(--cursorY)))`;
        parentElement.appendChild(imgElement); 
        console.log("Loading layer image: ", imageSrc);

        interactions = layer.getInteractions();
        for(i in interactions){
            const interactionElement = document.createElement("a");
            interactionElement.classList.add("scene-layer-interaction"); 
            interactionElement.style.transform = `translateX(calc(-${parallaxStrength}px * var(--cursorX))) translateY(calc(-${parallaxStrength}px * var(--cursorY)))`;
            
            posX = interactions[i].getPosX();
            posY = interactions[i].getPosY();
            width = interactions[i].getWidth();
            height = interactions[i].getHeight();

            interactionElement.style.left = `${posX}%`;
            interactionElement.style.top = `${posY}%`;
            interactionElement.style.width = `${width}%`;
            interactionElement.style.height = `${height}%`;
            
            if(debug){
                interactionElement.style.backgroundColor = "rgba(255, 0, 0, .2)"
            }

            parentElement.appendChild(interactionElement); 
            console.log("Adding interaction: ", interactionElement);
        }
    } else {
        console.log("Failed to load image from layer: ", layers[i]);
    }
}

function resizeParent(scene) {
    const ratio = scene.getHeight() / scene.getWidth();
    
    const windowWidth = window.innerWidth; 
    const windowHeight = window.innerHeight;
    
    let width = windowWidth;
    let height = width * ratio;
    
    if (height > windowHeight) {
        height = windowHeight;
        width = height / ratio;
    }

    parentElement.style.width = `${width}px`;
    parentElement.style.height = `${height}px`;

    let offsetLeft = (windowWidth - width)/2;
    parentElement.style.left = `${offsetLeft}px`;
}

function onWindowResized(){
    resizeParent(currentScene);
}

window.addEventListener("resize", onWindowResized);
   
function loadTextScene(scene){
    console.log("Loading text scene");
    const textElement = document.createElement("p");
    textElement.classList.add("scene-text");
    parentElement.appendChild(textElement);

    const textContent = scene.getTextContent();
    let index = 0;

    // Function to add one letter at a time
    function typeLetter() {
        if (index < textContent.length) {
            textElement.textContent += textContent.charAt(index);
            index++;

            let delay = 100;
            if(debug){
                delay = 20;
            }

            setTimeout(typeLetter, delay);
        } else {

            delay = 1500;
            if(debug){
                delay = 100;
            }

            setTimeout(() => initiate(scene.getTargetScene()), delay);
        }
    }

    // Start typing the text
    typeLetter();
}


async function initiate(scenename){
    const scenes = await fetch_scenes();
    if(scenes.hasScene(scenename)){
        const scene = scenes.getScene(scenename);
        console.log("Loading scene '" + scenename + "' type '" + scene.getType() + "'");
        parentElement.innerHTML = ""
        currentScene = scene;

        if(scene.getType() == "image"){
            const layers = scene.getLayers();
            console.log("Layer count: " + layers.length);
            for(i in layers){
                addLayer(layers[i]);
            }
    
            resizeParent(scene);
        }
        else if(scene.getType() == "text"){
            loadTextScene(scene);
        }
    } else {
        console.log("No scenes found");
    }
}