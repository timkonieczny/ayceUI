function update() {

    for(var i=0; i < objects.length; i++)
        if(
            objects[i] &&
            objects[i].ayceUI.runScriptInPreview &&
            objects[i].ayceUI.runInitScript &&
            typeof objects[i].initScript == "function" &&
            typeof objects[i].updateScript == "function"  // if script is of type string the code has errors
        ) {
            objects[i].initScript();
            objects[i].ayceUI.runInitScript = false;
        }

    for(i=0; i < objects.length; i++) {
        if (
            objects[i] &&
            objects[i].ayceUI.runScriptInPreview &&
            typeof objects[i].initScript == "function" &&
            typeof objects[i].updateScript == "function"  // if script is of type string the code has errors
        ) {
            objects[i].updateScript();
        }
    }

    Ayce.requestAnimFrame(update);
    if(renderScene) {
        scene.updateScene();
        scene.drawScene();
    }
    if(cameraPreview.renderPreview){
        if(cameraPreview.modifier.ayceUI.runScriptInPreview) {
            if (cameraPreview.modifier.ayceUI.runScriptInPreview && cameraPreview.modifier.ayceUI.runInitScript) {
                cameraPreview.modifier.initScript();
                cameraPreview.modifier.ayceUI.runInitScript = false;
            }
            cameraPreview.modifier.updateScript();
        }
        cameraPreview.update();
    }
}

var trajPath = "data/traj.csv";
var dataPath = "data/traj_data.csv";
var data, traj;
data = Ayce.XMLLoader.getSourceSynch(dataPath);
if(data != null){
    traj = Ayce.XMLLoader.getSourceSynch(trajPath);
    if(traj != null){
        o3DFromCSVStrings(traj, data);
    }else{
        console.log("Dataset could not be loaded. There is no file "+trajPath);
        showNotification("Dataset could not be loaded. There is no file "+trajPath, "fa-exclamation-circle", "info")
    }
}else{
    console.log("Dataset could not be loaded. There is no file "+dataPath);
    showNotification("Dataset could not be loaded. There is no file "+dataPath, "fa-exclamation-circle", "info")
}

update();