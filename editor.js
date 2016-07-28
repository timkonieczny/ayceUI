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
var activeObject = null;

var i;
var addObjectButtons = document.getElementsByClassName("add_object");
for(i = 0; i < addObjectButtons.length; i++){
    addObjectButtons[i].onclick = function(){
        if(this.id != "import_obj"){
            document.getElementById("objects_in_scene_div").style.display = "block";
            objects.push(eval(this.dataset.constructor));
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

            scene.addToScene(objects[objects.length-1]);
            cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1]);

            var child = document.createElement('li');
            child.innerHTML = objects[objects.length-1].screenName;
            child.dataset.id = (objects.length-1);          //TODO: eliminate data-id
            child.id = objects.length-1;
            child.dataset.type = (this.dataset.type);
            child.className = "object_in_scene button";
            child.onclick = showProperties;

            document.getElementById("objects_in_scene").appendChild(child);

            child.onclick({srcElement: this});
        }
    }
}

document.getElementById("add_light").onclick = function(){
    document.getElementById("objects_in_scene_div").style.display = "block";
    objects.push(new Ayce.Light());
    cameraPreview.objects.push(new Ayce.Light());
    objects[objects.length-1].screenName = this.dataset.type;
    scene.addToScene(objects[objects.length-1]);
    cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1]);
    var child = document.createElement('li');
    child.innerHTML = objects[objects.length-1].screenName;
    child.dataset.id = (objects.length-1);
    child.id = objects.length-1;
    child.dataset.type = (this.dataset.type);
    child.className = "object_in_scene button";
    child.onclick = showProperties;
    document.getElementById("objects_in_scene").appendChild(child);
    child.onclick({srcElement: this});
};

document.getElementById("add_camera").onclick = function(){
    document.getElementById("objects_in_scene_div").style.display = "block";
    document.getElementById("camera_preview_wrapper").style.display = "block";
    var child = document.createElement('li');
    child.innerHTML = cameraPreview.screenName;
    child.dataset.type = (this.dataset.type);
    child.id = "camera";
    child.className = "object_in_scene button";
    child.onclick = showProperties;
    document.getElementById("objects_in_scene").appendChild(child);
    child.onclick({srcElement: this});
};

var openModal = function(type){
    if(type == "obj"){
        document.getElementById("modal").style.display = "block";
        document.getElementById("obj_drop").style.display = "flex";
        document.getElementById("mtl_drop").style.display = "flex";
    }else if(type == "code"){
        var output = "";
        for(var i = 0; i < objects.length; i++){
            output+="object"+i+JSON.stringify(objects[i], null, "\t")+";\n";      // TODO: assign object name
        }
        document.getElementById("modal").style.display = "block";
        document.getElementById("export_code_textarea").style.display = "block";
        document.getElementById("export_code_textarea").value = output;
    }
    document.getElementById("modal_close").onclick = closeModal;
};

var closeModal = function(){
    document.getElementById("obj_drop").style.display = "none";
    document.getElementById("obj_drop_done").style.display = "none";
    document.getElementById("mtl_drop").style.display = "none";
    document.getElementById("mtl_drop_done").style.display = "none";
    document.getElementById("import_processing").style.display = "none";
    document.getElementById("export_code_textarea").style.display = "none";
    document.getElementById("modal").style.display = "none";
    objString = null;
    mtlString = null;
};

document.getElementById("import_obj").addEventListener('click', function(){
    openModal("obj");
});


var renderPreview = true;

function update() {
    /*if(cursor.down){
        console.log(cursor.x + " " + cursor.y);
    }*/

    Ayce.requestAnimFrame(update);
    scene.updateScene();
    scene.drawScene();

    if(renderPreview)
        cameraPreview.update();
}

update();

document.getElementById("export_code").addEventListener('click', function(){
    openModal("code");
});

document.getElementById("obj_drop").addEventListener("dragover", function(e){
    //e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    console.log("drag");
}, false);

document.getElementById("mtl_drop").addEventListener("dragover", function(e){
    //e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    console.log("drag");
}, false);

var objString = null;
var mtlString = null;

document.getElementById("obj_drop").addEventListener("drop", function(e){       // TODO: include Ayce in long form
    e.stopPropagation();
    e.preventDefault();

    document.getElementById("obj_drop").style.display = "none";
    document.getElementById("obj_drop_loading").style.display = "flex";

    var file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        console.log(e.currentTarget.result);
        objString = e.currentTarget.result;
        document.getElementById("obj_drop_loading").style.display = "none";
        document.getElementById("obj_drop_done").style.display = "flex";
        if(mtlString){
            document.getElementById("obj_drop_done").style.display = "none";
            document.getElementById("mtl_drop_done").style.display = "none";
            document.getElementById("import_processing").style.display = "flex";
            createGeometry(objString, mtlString)
        }
    };
    reader.readAsText(file);     // TODO: enable direct data passing to OBJLoader
}, false);

document.getElementById("mtl_drop").addEventListener("drop", function(e){       // TODO: include Ayce in long form
    e.stopPropagation();
    e.preventDefault();

    document.getElementById("mtl_drop").style.display = "none";
    document.getElementById("mtl_drop_loading").style.display = "flex";

    var file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        console.log(e.currentTarget.result);
        mtlString = e.currentTarget.result;
        document.getElementById("mtl_drop_loading").style.display = "none";
        document.getElementById("mtl_drop_done").style.display = "flex";
        if(objString){
            document.getElementById("obj_drop_done").style.display = "none";
            document.getElementById("mtl_drop_done").style.display = "none";
            document.getElementById("import_processing").style.display = "flex";
            createGeometry(objString, mtlString)
        }
    };
    reader.readAsText(file);
}, false);

var createGeometry = function(obj, mtl){

    objects.push(new Ayce.OBJLoader(obj, mtl, true)[0]);                // TODO: more efficient solution for copying the O3D
    cameraPreview.objects.push(new Ayce.OBJLoader(obj, mtl, true)[0]);

    objects[objects.length-1].position.z = -2;
    cameraPreview.objects[cameraPreview.objects.length-1].position.z = -2;

    scene.addToScene(objects[objects.length-1]);
    cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1]);

    document.getElementById("objects_in_scene_div").style.display = "block";
    var child = document.createElement('li');
    child.innerHTML = "Imported Object";
    child.dataset.id = (objects.length-1);
    child.dataset.type = "obj";
    child.className = "object_in_scene button";
    child.onclick = showProperties;

    document.getElementById("objects_in_scene").appendChild(child);

    closeModal();
};