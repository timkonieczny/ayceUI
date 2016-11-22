function update() {
    for(var i=0; i < objects.length; i++) if(objects[i] && objects[i].ayceUI.runScriptInPreview) objects[i].script();

    Ayce.requestAnimFrame(update);
    scene.updateScene();
    scene.drawScene();

    if(cameraPreview.renderPreview){}
        cameraPreview.update();
}

update();