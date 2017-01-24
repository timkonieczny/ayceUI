function update() {

    for(var i=0; i < objects.length; i++)
        if(
            objects[i] &&
            objects[i].ayceUI.runScriptInPreview &&
            objects[i].ayceUI.runInitScript &&
            typeof objects[i].initScript == typeof objects[i].script == "function"  // if script is of type string the code has errors
        ) {
            objects[i].initScript();
            objects[i].ayceUI.runInitScript = false;
        }

    for(i=0; i < objects.length; i++) {
        if (
            objects[i] &&
            objects[i].ayceUI.runScriptInPreview &&
            typeof objects[i].initScript == typeof objects[i].script == "function"  // if script is of type string the code has errors
        ) {
            objects[i].script();
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
            cameraPreview.modifier.script();
        }
        cameraPreview.update();
    }
}

update();