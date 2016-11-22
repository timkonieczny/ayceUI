var CameraPreview = function() {
    this.canvas = document.getElementById("camera_preview");
    this.scene = new Ayce.Scene(this.canvas);
    this.modifier = new Ayce.CameraModifier();
    this.objects = [];
    this.modifier.position.y = .5;
    this.scene.getCamera().getManager().modifiers.push(this.modifier);
    this.screenName = "camera";
    this.renderPreview = false;

    this.update = function() {

        for(var i=0; i < this.objects.length; i++) if(this.objects[i]) this.objects[i].script();

        this.scene.updateScene();
        this.scene.drawScene();
    }
};