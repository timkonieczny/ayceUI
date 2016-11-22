var mainCanvas = document.getElementById("main_canvas");
var scene = new Ayce.Scene(mainCanvas);
var modifier = new Ayce.CameraModifier();
modifier.position.y = .5;
var mainCameraModifier = new MainCameraModifier(mainCanvas);
scene.getCamera().getManager().modifiers.push(modifier, mainCameraModifier);

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
scene.addToScene(basePlane, false);

var objects = [];
var cameraPreview = new CameraPreview();
//cameraPreview.scene.setRenderer(new StereoProjectorRenderer(cameraPreview.canvas));
document.getElementById("camera_preview_wrapper").style.display = "none";
var currentObjectId;

var i;
var addObjectButtons = document.getElementsByClassName("add_object");
var handleClickOnObject = function(e){
    showProperties(e.srcElement);
};
for(i = 0; i < addObjectButtons.length; i++){
    addObjectButtons[i].onclick = function(){
        if(this.id != "import_obj" && this.id != "import_csv"){
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
            cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1], false);

            var child = appendObjectInSceneChildElement(this.dataset.type);
            showProperties(child);
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
    cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1], false);
    var child = appendObjectInSceneChildElement(this.dataset.type);
    child.addEventListener("click", handleClickOnObject);
};

document.getElementById("add_camera").onclick = function(){
    document.getElementById("camera_preview_wrapper").style.display = "block";
    var child = appendObjectInSceneChildElement(this.dataset.type);
    child.addEventListener("click", handleClickOnObject);
    cameraPreview.renderPreview = true;
};

document.getElementById("import_obj").addEventListener('click', function(){
    openModal("obj");
});

document.getElementById("import_csv").addEventListener('click', function(){
    openModal("csv");
});

document.getElementById("export_code").addEventListener('click', function(){
    openModal("code");
});

mainCanvas.addEventListener("click", function(e){
    var identifier = scene.getPickedIdentifier(e.clientX, e.clientY);
    for(var i = 0; i < objects.length; i++){
        if(objects[i].identifier[0]==identifier[0] &&
            objects[i].identifier[1]==identifier[1] &&
            objects[i].identifier[2]==identifier[2] &&
            objects[i].identifier[3]==identifier[3]){
            handleClickOnObject({srcElement: document.getElementById(i.toString())});
        }
    }
});