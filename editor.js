/* Code for direct object modification
var cursor = {
    x: 0,
    y: 0,
    down: false
};

canvas.addEventListener('mousemove', function(e) {
    cursor.x = e.offsetX / canvas.width * 2 - 1;
    cursor.y = ((canvas.height - e.offsetY) / canvas.height * 2 - 1);
}, false);

canvas.addEventListener("mousedown", function() {
    cursor.down = true;
});
canvas.addEventListener("mouseup", function() {
    cursor.down = false;
});
*/

var scene = new Ayce.Scene(document.getElementById("main_canvas"));
var modifier = new Ayce.CameraModifier();
modifier.position.y = .5;
scene.getCamera().getManager().modifiers.push(modifier);

var basePlane = (new Ayce.Geometry.Plane(10, 10, 2, 2, false)).getO3D();
basePlane.position.x = -2.5;
basePlane.rotation.fromEulerAngles(Math.PI/2, 0, 0);
basePlane.textureCoords = [
     0, 0,
     0,10,
    10, 0,
    10,10
];
basePlane.transparent = true;
basePlane.colors = null;
basePlane.imageSrc = "grid.png";
scene.addToScene(basePlane);

var objects = [];
var cameraPreview = new CameraPreview();
document.getElementById("camera_preview_wrapper").style.display = "none";
var currentObjectId;
var activeElement = null;

var i;
var addObjectButtons = document.getElementsByClassName("add_object");
for(i = 0; i < addObjectButtons.length; i++){
    addObjectButtons[i].onclick = function(){
        if(this.id != "import_obj"){
            objects.push(eval(this.dataset.objectconstructor));
            if(!eval(this.dataset.centered)) {
                objects[objects.length - 1].offset.set(
                    -objects[objects.length - 1].a / 2.0,
                    -objects[objects.length - 1].b / 2.0,
                    -objects[objects.length - 1].c / 2.0
                );
            }

            var geometry = objects[objects.length-1];

            objects[objects.length-1] = geometry.getO3D();
            cameraPreview.objects.push(geometry.getO3D());

            objects[objects.length-1].position.z = -2;
            cameraPreview.objects[cameraPreview.objects.length-1].position.z = -2;

            objects[objects.length-1].screenName = this.dataset.type;

            objects[objects.length-1].script = function(){};
            cameraPreview.objects[objects.length-1].script = function(){};
            objects[objects.length-1].runScriptInPreview = false;

            scene.addToScene(objects[objects.length-1]);
            cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1]);

            var child = appendObjectInSceneChildElement(this.dataset.type);
            child.onclick({srcElement: this});
        }
    }
}

document.getElementById("add_light").onclick = function(){
    objects.push(new Ayce.Light());
    cameraPreview.objects.push(new Ayce.Light());
    objects[objects.length-1].screenName = this.dataset.type;
    objects[objects.length-1].script = function(){};
    cameraPreview.objects[objects.length-1].script = function(){};
    scene.addToScene(objects[objects.length-1]);
    cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1]);
    var child = appendObjectInSceneChildElement(this.dataset.type);
    child.onclick({srcElement: this});
};

document.getElementById("add_camera").onclick = function(){
    document.getElementById("camera_preview_wrapper").style.display = "block";
    var child = appendObjectInSceneChildElement(this.dataset.type);
    child.onclick({srcElement: this});
    cameraPreview.renderPreview = true;
};

document.getElementById("import_obj").addEventListener('click', function(){
    openModal("obj");
});

document.getElementById("export_code").addEventListener('click', function(){
    openModal("code");
});