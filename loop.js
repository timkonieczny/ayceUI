function update() {
    /*if(cursor.down){
     console.log(cursor.x + " " + cursor.y);
     }*/

    for(var i=0; i < objects.length; i++) if(objects[i].runScriptInPreview) objects[i].script();

    Ayce.requestAnimFrame(update);
    scene.updateScene();
    scene.drawScene();

    if(cameraPreview.renderPreview)
        cameraPreview.update();
}

update();