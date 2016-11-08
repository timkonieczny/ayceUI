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

// TODO: handle moving a parent with its children

var handleChildParentDragstart = function(e, draggedElement){
    e.dataTransfer.effectAllowed = "link";
    e.dataTransfer.setData('text/html', draggedElement.dataset.id);
    if(draggedElement.parentNode.id!="objects_in_scene")
    document.getElementById("parent_actions").style.display = "block";
};
var handleDragover = function(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = 'link';
};
var handleChildParentDrop = function(e, passiveElement){
    if(e.dataTransfer.getData("text/html")!=passiveElement.id &&                                // not the same element
        (passiveElement.parentNode.id=="objects_in_scene" ||                                    // not a root element
        !hasChildNodeWithId(passiveElement.parentNode, e.dataTransfer.getData("text/html")))){  // not already a child
        var wrapper = document.createElement("div");
        var copy = passiveElement.cloneNode(true);
        var element = document.getElementById(e.dataTransfer.getData("text/html"));
        copy.style.marginLeft = "0px";
        copy.addEventListener("dragstart", function (e) {
            handleChildParentDragstart(e, this);
        });
        copy.addEventListener("dragover", function (e) {
            handleDragover(e)
        });
        copy.addEventListener("drop", function (e) {
            handleChildParentDrop(e, this)
        });
        wrapper.appendChild(copy);
        wrapper.appendChild(element);

        wrapper.style.marginLeft = passiveElement.style.marginLeft;
        passiveElement.parentNode.replaceChild(wrapper, passiveElement);


        element.style.marginLeft = "10px";
    }else{
        showNotification("Cannot make the active object the active object's parent", "fa-exclamation-circle");
    }
};
document.getElementById("parent_actions_unlink").addEventListener("dragover", function(e){
    handleDragover(e);
});

// TODO: move parent with children. Missing eventlisteners still left?

document.getElementById("parent_actions_unlink").addEventListener("drop", function(e){
    var element = document.getElementById(e.dataTransfer.getData("text/html")); // element that is being dropped
    var parent = element.parentNode;                                            // the element's div wrapper / #objects_in_scene
    var currentScene = document.getElementById("objects_in_scene");             // #objects_in_scene
    currentScene.appendChild(element);

    if(parent.childNodes.length==1){    // if only first (former parent) element is left, remove the div wrapper
        var copy = parent.firstChild.cloneNode(true);

        parent.parentNode.replaceChild(copy, parent);
        copy.style.marginLeft = parent.style.marginLeft;
        copy.addEventListener("dragstart", function(e){
            handleChildParentDragstart(e, this);
        });
        copy.addEventListener("dragover", function(e){
            handleDragover(e);
        });
        copy.addEventListener("drop", function(e){
            handleChildParentDrop(e, this);
        });
    }
    element.style.marginLeft = "0px";
});

document.getElementById("parent_actions_cancel").addEventListener("dragover", function(e){
    handleDragover(e);
});
document.getElementById("parent_actions_cancel").addEventListener("drop", function(e){});   // do nothing on cancel

var appendObjectInSceneChildElement = function(type){
    var child = document.createElement('li');
    if(type=="camera"){
        child.innerHTML = cameraPreview.screenName;
        // TODO: camera deletion
        //child.dataset.id = type;
        //child.id = type;
    }else{
        child.innerHTML = objects[objects.length-1].screenName+"</div>" +
            "<a class='delete_object_from_scene' id='delete_"+(objects.length-1)+"' data-id='"+(objects.length-1)+"'>&#215</a>";
        child.dataset.id = (objects.length-1);          //TODO: eliminate data-id
        child.id = objects.length-1;
    }
    child.dataset.type = type;
    child.className = "object_in_scene button_dark";
    child.onclick = showProperties;
    child.draggable = true;
    child.addEventListener("dragstart", function(e){
        handleChildParentDragstart(e, this);
    });
    child.addEventListener("dragover", function(e){
        handleDragover(e);
    });
    child.addEventListener("drop", function(e){
        handleChildParentDrop(e, this);
    });
    child.addEventListener("dragend", function(e){
        document.getElementById("parent_actions").style.display = "none";
    });
    document.getElementById("objects_in_scene_div").style.display = "block";
    document.getElementById("objects_in_scene").appendChild(child);
    if(type!=="camera") {
        document.getElementById("delete_" + child.id).addEventListener("click", function (e) {
            e.stopPropagation();
            deleteObject(child);
        });
    }
    return child;
};

var deleteObject = function(child){
    scene.removeFromScene(objects[child.id]);
    objects[child.id] = null;
    cameraPreview.scene.removeFromScene(cameraPreview.objects[child.id]);
    cameraPreview.objects[child.id] = null;
    document.getElementById("objects_in_scene").removeChild(child);
};

document.getElementById("import_obj").addEventListener('click', function(){
    openModal("obj");
});

document.getElementById("export_code").addEventListener('click', function(){
    openModal("code");
});