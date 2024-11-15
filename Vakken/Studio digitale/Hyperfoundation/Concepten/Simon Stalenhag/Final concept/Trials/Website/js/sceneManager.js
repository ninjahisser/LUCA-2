initiate("intro");

const parentElement = document.getElementById("sceneImageParent");
let currentScene = null;

const debug = true;

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
                
                const interactions = layer.getInteractions();  

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

                        interaction.getEvents = function(){
                            return this.events ? this.events : null
                        }

                        interaction.hasEvents = function(){
                            return (this.events != null);
                        }

                        interaction.getID = function(){
                            return this.id ? this.id : null
                        }

                        const events = interaction.getEvents(); 

                        if(events){
                            events.forEach(event => {
                                event.getType = function(){
                                    return this.type ? this.type : null
                                }
        
                                event.getContent = function(){
                                    return this.content ? this.content : null
                                }
        
                                event.getChoices = function(){
                                    return this.choices ? this.choices : null
                                }

                                const choices = event.getChoices();

                                if(choices){
                                    choices.forEach(choice => {
                                        choice.getType = function(){
                                            return this.type ? this.type : null
                                        }
                
                                        choice.getText = function(){
                                            return this.text ? this.text : null
                                        }
                
                                        choice.getTargetScene = function(){
                                            return this.scene ? this.scene : null
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });  

    return json;
}
function interactionActive(targetID){
    activeInteractions.forEach((interaction)=>{
        if(interaction.getID() == targetID){
            return true;
        }
    });

    return false;
}

function addLayer(layer) {
    const imageSrc = layer.getImage();
    if (imageSrc) {
        const imgElement = document.createElement("img");
        const parallaxStrength = layer.getParallax();

        imgElement.src = imageSrc; 
        imgElement.alt = `Layer ${i + 1}`; 
        imgElement.classList.add("scene-layer-image"); 
        imgElement.style.transform = `translateX(calc(-${parallaxStrength}px * var(--cursorX))) translateY(calc(-${parallaxStrength}px * var(--cursorY)))`;
        parentElement.appendChild(imgElement); 
        console.log("Loading layer image: ", imageSrc);

        const interactions = layer.getInteractions();
        if (interactions) { // Add this check to avoid null reference errors
            for (let i = 0; i < interactions.length; i++) {
                (function(index) {
                    const interaction = interactions[index];

                    const posX = interaction.getPosX();
                    const posY = interaction.getPosY();
                    const width = interaction.getWidth();
                    const height = interaction.getHeight();

                    const interactionElement = document.createElement("a");
                    interactionElement.classList.add("scene-layer-interaction"); 
                    interactionElement.style.transform = `translateX(calc(-${parallaxStrength}px * var(--cursorX))) translateY(calc(-${parallaxStrength}px * var(--cursorY)))`;

                    interactionElement.style.left = `${posX}%`;
                    interactionElement.style.top = `${posY}%`;
                    interactionElement.style.width = `${width}%`;
                    interactionElement.style.height = `${height}%`;

                    if (debug) {
                        interactionElement.style.backgroundColor = "rgba(255, 0, 0, .2)";
                    }

                    interactionElement.addEventListener("click", function() {
                        if(!interaction.hasEvents()){
                            alert("no events found");
                        } else {
                            if(interactionActive(interaction.getID())){
                                alert("dialogue has already been opened");
                            } else {
                                var interaction = {
                                    id: interaction.getID(),
                                    index: 0
                                };
                                activeInteractions.push(interaction)
                            }
                        }

                        //DO EVENT RELATED STUFF HERE
                        //ADD A TEXT THING ABOVE IT AND MAKE IT GO TROUGH ALL THE EVENTS ON CLICK
                        //PRESENT CHOICES
                        //MAKE CHOICES OPEN SCENES

                    });
                    parentElement.appendChild(interactionElement);
                })(i);
            }
        } else {
            console.log("No interactions found for this layer.");
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