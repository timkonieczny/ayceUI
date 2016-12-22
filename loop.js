function update() {

    for(var i=0; i < objects.length; i++)
        if(objects[i] && objects[i].ayceUI.runScriptInPreview && objects[i].ayceUI.runInitScript) {
            objects[i].initScript();
            objects[i].ayceUI.runInitScript = false;
        }

    for(i=0; i < objects.length; i++)
        if(objects[i] && objects[i].ayceUI.runScriptInPreview)
            objects[i].script();

    Ayce.requestAnimFrame(update);
    if(renderScene) {
        scene.updateScene();
        scene.drawScene();
    }
    if(cameraPreview.renderPreview)
        cameraPreview.update();
}

update();