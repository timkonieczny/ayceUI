var mainCanvas = document.getElementById("main_canvas");
var scene = new Ayce.Scene(mainCanvas);
var modifier = new Ayce.CameraModifier();
modifier.position.y = .5;
var mainCameraModifier = new MainCameraModifier(mainCanvas);
scene.getCamera().getManager().modifiers.push(modifier, mainCameraModifier);

scene.addToScene((new BasePlane(30, 30, 31, 31)).getO3D(), false);

var objects = [];
var cameraPreview = new CameraPreview();
//cameraPreview.scene.getCamera().getManager().modifiers.push(mainCameraModifier);
document.getElementById("camera_preview_wrapper").style.display = "none";
var currentObjectId;

var i;
var addObjectButtons = document.getElementsByClassName("add_object");
var handleClickOnObject = function(e){
    showProperties(e.srcElement);
};
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

            objects[objects.length-1].script = function(){};
            cameraPreview.objects[objects.length-1].script = function(){};
            var screenName = this.dataset.type;
            objects[objects.length-1].ayceUI = {
                id: objects.length-1,
                screenName: screenName,
                runScriptInPreview: false
            };

            scene.addToScene(objects[objects.length-1]);
            cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1], false);

            var childNode = appendObjectInSceneChildNode(this.dataset.type);
            showProperties(childNode);
        }
    }
}

document.getElementById("add_light").onclick = function(){
    objects.push(new Ayce.Light());
    cameraPreview.objects.push(new Ayce.Light());
    objects[objects.length-1].script = function(){};
    var screenName = this.dataset.type;
    objects[objects.length-1].ayceUI = {
        id: objects.length-1,
        screenName: screenName,
        runScriptInPreview: false
    };
    cameraPreview.objects[objects.length-1].script = function(){};
    scene.addToScene(objects[objects.length-1]);
    cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1], false);
    var childNode = appendObjectInSceneChildNode(this.dataset.type);
    childNode.addEventListener("click", handleClickOnObject);
    showProperties(childNode);
};

document.getElementById("add_camera").onclick = function(){ // TODO: only allow one camera
    document.getElementById("camera_preview_wrapper").style.display = "block";
    cameraPreview.renderPreview = true;
    var cameraPosition = scene.getCamera().getManager().getGlobalPosition();
    var cameraRotation = scene.getCamera().getManager().getGlobalRotation();
    cameraPreview.modifier.position.x = cameraPosition.x;
    cameraPreview.modifier.position.y = cameraPosition.y;
    cameraPreview.modifier.position.z = cameraPosition.z;
    cameraPreview.modifier.orientation.x = cameraRotation.x;
    cameraPreview.modifier.orientation.y = cameraRotation.y;
    cameraPreview.modifier.orientation.z = cameraRotation.z;
    cameraPreview.modifier.orientation.w = cameraRotation.w;
    var childNode = appendObjectInSceneChildNode(this.dataset.type);
    childNode.addEventListener("click", handleClickOnObject);
    showProperties(childNode);
};

document.getElementById("import_obj").addEventListener('click', function(){
    openModal("obj");
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
            console.log(objects[i]);
            handleClickOnObject({srcElement: document.getElementById(i.toString())});
        }
    }
});