var CameraPreview = function() {

    this.scene = new Ayce.Scene(document.getElementById("camera_preview"));
    this.modifier = new Ayce.CameraModifier();
    this.objects = [];
    this.modifier.position.y = .5;
    this.scene.getCamera().getManager().modifiers.push(this.modifier);
    this.screenName = "camera";
    this.renderPreview = false;

    this.update = function() {
        this.scene.updateScene();
        this.scene.drawScene();
    }
};