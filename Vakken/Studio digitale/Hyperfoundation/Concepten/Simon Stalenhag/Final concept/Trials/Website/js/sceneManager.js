initiate("svema_37");

const parentElement = document.getElementById("sceneImageParent");

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
        scene.getLayers = function() {
            return this.layers ? this.layers : null;
        };

        scene.layers.forEach(layer => {
            layer.getImage = function() {
              return this.image ? this.image : null  
            }
        })
    });

    return json;
}

async function initiate(scenename){
    const scenes = await fetch_scenes();
    if(scenes.hasScene(scenename)){
        console.log("Loading scene " + scenename);
        const scene = scenes.getScene(scenename);
        const layers = scene.getLayers();
        console.log("Layer count: " + layers.length);
        for(i in layers){
            imageSrc = layers[i].getImage();
            if (imageSrc) {
                const imgElement = document.createElement("img");
                imgElement.src = imageSrc; 
                imgElement.alt = `Layer ${i + 1}`; 
                imgElement.classList.add("scene-layer-image"); 
                parentElement.appendChild(imgElement); 
                console.log("Loading layer image: ", imageSrc);
            } else {
                console.log("Failed to load image from layer: ", layers[i]);
            }
        }

    } else {
        console.log("No scenes found");
    }
    
}