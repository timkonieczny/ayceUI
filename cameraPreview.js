var CameraPreview = function() {

    this.scene = new Ayce.Scene(document.getElementById("camera_preview"));
    this.modifier = new Ayce.CameraModifier();
    this.objects = [];
    this.modifier.position.y = .5;
    this.scene.getCamera().getManager().modifiers.push(this.modifier);
    this.ayceUI = {
        id: null,
        screenName: "camera",
        runScriptInPreview: false
    };
    this.renderPreview = false;

    this.update = function() {

        for(var i=0; i < this.objects.length; i++) if(this.objects[i]) this.objects[i].script();

        this.scene.updateScene();
        this.scene.drawScene();
    }
};