var CameraPreview = function() {

    this.scene = new Ayce.Scene(document.getElementById("camera_preview"));
    var modifier = new Ayce.CameraModifier();
    this.objects = [];
    modifier.position.y = .5;
    this.scene.getCamera().getManager().modifiers.push(modifier);

    this.update = function() {
        this.scene.updateScene();
        this.scene.drawScene();
    }
};