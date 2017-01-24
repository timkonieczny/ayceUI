AyceUIMetaObject = function(screenName){
    this.id = objects.length-1;
    this.screenName = screenName;
    this.runScriptInPreview = false;
    this.runInitScript = false;
    this.initScriptError = null;
    this.updateScriptError = null;
};
var mainCanvas = document.getElementById("main_canvas");
var scene = new Ayce.Scene(mainCanvas);
var renderScene = true;
var modifier = new Ayce.CameraModifier();
modifier.position.y = .5;
modifier.position.z = 2;
var mainCameraModifier = new MainCameraModifier(mainCanvas);
scene.getCamera().getManager().modifiers.push(modifier, mainCameraModifier);
scene.addToScene((new BasePlane(30, 30, 31, 31)).getO3D(), false);

var objects = [];
var cameraPreview = new CameraPreview();
document.getElementById("camera_preview_expand").addEventListener("click", function(){
    cameraPreview.expand();
    renderScene = false;

});
document.getElementById("camera_preview_compress").addEventListener("click", function(){
    cameraPreview.compress();
    renderScene = true;
});
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
            if(this.id!="create_skybox") {
                objects.push(eval(this.dataset.objectconstructor));
                if (!eval(this.dataset.centered)) {
                    objects[objects.length - 1].offset.set(
                        -objects[objects.length - 1].a / 2.0,
                        -objects[objects.length - 1].b / 2.0,
                        -objects[objects.length - 1].c / 2.0
                    );
                }

                var geometry = objects[objects.length - 1];

                var o3D = geometry.getO3D();
                o3D.textureCoords = o3D.textureIndices = null;
                objects[objects.length - 1] = o3D;
                o3D = geometry.getO3D();
                o3D.textureCoords = o3D.textureIndices = null;
                cameraPreview.objects.push(o3D);
            }else{
                objects.push(new Ayce.Skybox("", "", "", "", "", "", "", scene.getCamera().getManager(), scene.getCamera().farPlane));
                cameraPreview.objects.push(new Ayce.Skybox("", "", "", "", "", "", "", scene.getCamera().getManager(), scene.getCamera().farPlane));
            }

            objects[objects.length-1].script = function(){};
            objects[objects.length-1].initScript = function(){};
            cameraPreview.objects[objects.length-1].script = function(){};
            cameraPreview.objects[objects.length-1].initScript = function(){};
            var screenName = this.dataset.type;
            objects[objects.length-1].ayceUI = new AyceUIMetaObject(this.dataset.type);

            if(!objects[objects.length-1].textureCoords){
                scene.addToScene(objects[objects.length-1]);
                cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1], false);
            }

            var childNode = appendObjectInSceneChildNode(this.dataset.type);
            showProperties(childNode);
        }
    }
}

document.getElementById("add_empty").onclick = function(){
    objects.push(new EmptyObject());
    cameraPreview.objects.push(new EmptyObject());
    var childNode = appendObjectInSceneChildNode(this.dataset.type);
    childNode.addEventListener("click", handleClickOnObject);
    showProperties(childNode);
};

document.getElementById("add_light").onclick = function(){
    objects.push(new Ayce.Light());
    cameraPreview.objects.push(new Ayce.Light());
    objects[objects.length-1].script = function(){};
    objects[objects.length-1].initScript = function(){};
    cameraPreview.objects[objects.length-1].script = function(){};
    cameraPreview.objects[objects.length-1].initScript = function(){};
    var screenName = this.dataset.type;
    objects[objects.length-1].ayceUI = new AyceUIMetaObject(this.dataset.type);
    scene.addToScene(objects[objects.length-1]);
    cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1], false);
    var childNode = appendObjectInSceneChildNode(this.dataset.type);
    childNode.addEventListener("click", handleClickOnObject);
    showProperties(childNode);
};

document.getElementById("add_camera").onclick = function(){
    if(document.getElementById("camera_preview_wrapper").style.display == "block"){
        showNotification("There is already a camera in the scene", "fa-exclamation-circle", "info");
    }else {
        document.getElementById("camera_preview_wrapper").style.display = "block";  // TODO: scripts
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
    }
};

document.getElementById("import_obj").addEventListener('click', function(){
    openModal("obj");
});

var codeBuilder = new CodeBuilder();

document.getElementById("export_code").addEventListener('click', function(){
    openModal("code");
    codeBuilder.saveProject();
});

mainCanvas.addEventListener("click", function(e){
    var identifier = scene.getPickedIdentifier(e.clientX, e.clientY);
    for(var i = 0; i < objects.length; i++){
        if(objects[i] instanceof Ayce.Object3D &&
            objects[i].identifier[0]==identifier[0] &&
            objects[i].identifier[1]==identifier[1] &&
            objects[i].identifier[2]==identifier[2] &&
            objects[i].identifier[3]==identifier[3]){
            handleClickOnObject({srcElement: document.getElementById(i.toString())});
        }
    }
});