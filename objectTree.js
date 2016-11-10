var handleChildParentDragstart = function(e, draggedElement){
    e.dataTransfer.effectAllowed = "link";
    e.dataTransfer.setData('text/html', draggedElement.id);
    e.stopPropagation();
    if(draggedElement.parentNode.id!="objects_in_scene")
        document.getElementById("parent_actions").style.display = "block";
};
var handleDragover = function(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = 'link';
};
var handleChildParentDrop = function(e, passiveElement){
    if(e.dataTransfer.getData("text/html")==passiveElement.id){
        showNotification("Cannot make the active object the active object's parent", "fa-exclamation-circle");
        // same element
    }else if(passiveElement.parentNode.id!="objects_in_scene" &&
        Array.prototype.indexOf.call(passiveElement.parentNode.childNodes, passiveElement)==0 &&
        (hasChildNodeWithId(passiveElement.parentNode, e.dataTransfer.getData("text/html")))){
        showNotification("The object is already a child", "fa-exclamation-circle");
        // TODO: implement removing parent
        // already a child
    }else{
        var element = document.getElementById(e.dataTransfer.getData("text/html"));

        if(element.className == "parent_wrapper"){
            objects[Number(element.firstChild.id)].parent = objects[Number(passiveElement.id)];
        }else{
            objects[Number(element.id)].parent = objects[Number(passiveElement.id)];
        }

        if(passiveElement.parentNode.id == "wrapper_of_"+passiveElement.id){
            passiveElement.parentNode.appendChild(element);
            element.style.marginLeft = "10px";
        }else {
            var wrapper = document.createElement("div");
            var copy = passiveElement.cloneNode(true);      // need copy to replace the original with the wrapper + copy later
            copy.style.marginLeft = "0px";
            copy.addEventListener("dragover", function (e) {
                handleDragover(e)
            });
            copy.addEventListener("drop", function (e) {
                handleChildParentDrop(e, this)
            });
            copy.onclick = showProperties;
            wrapper.appendChild(copy);
            wrapper.appendChild(element);

            wrapper.style.marginLeft = passiveElement.style.marginLeft;
            wrapper.id = "wrapper_of_" + copy.dataset.id;
            wrapper.className = "parent_wrapper";
            wrapper.addEventListener("dragstart", function (e) {            // enables moving parent with children
                handleChildParentDragstart(e, this);
            });
            wrapper.addEventListener("dragend", function (e) {              // disables unlink buttons
                handleChildParentDragend();
            });

            passiveElement.parentNode.replaceChild(wrapper, passiveElement);

            element.style.marginLeft = "10px";
            element.onclick = showProperties;
        }
    }
};
var handleChildParentDragend = function(){
    document.getElementById("parent_actions").style.display = "none";
};

document.getElementById("parent_actions_unlink").addEventListener("dragover", function(e){
    handleDragover(e);
});
document.getElementById("parent_actions_unlink").addEventListener("drop", function(e){
    var element = document.getElementById(e.dataTransfer.getData("text/html")); // element that is being dropped
    var parent = element.parentNode;                                            // the element's div wrapper / #objects_in_scene
    var currentScene = document.getElementById("objects_in_scene");             // #objects_in_scene
    currentScene.appendChild(element);

    cleanUpObjectNode(parent);

    element.style.marginLeft = "0px";
});

var cleanUpObjectNode = function(wrapper){     // removes unnecessary wrappers
    if(wrapper.childNodes.length==1 && wrapper.id!="objects_in_scene"){    // if only first (former parent) element is left, remove the div wrapper
        var copy = wrapper.firstChild.cloneNode(true);

        wrapper.parentNode.replaceChild(copy, wrapper);
        copy.style.marginLeft = wrapper.style.marginLeft;
        copy.addEventListener("dragstart", function(e){
            handleChildParentDragstart(e, this);
        });
        copy.addEventListener("dragover", function(e){
            handleDragover(e);
        });
        copy.addEventListener("drop", function(e){
            handleChildParentDrop(e, this);
        });
        copy.onclick = showProperties;
        document.getElementById("delete_"+copy.id).addEventListener("click", function (e) {
            e.stopPropagation();
            deleteObject(copy);
        });
    }
};

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
    child.addEventListener("dragend", function(){
        handleChildParentDragend();
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

var handleDeletedObject = function(child){
    var parent = child.parentNode;

    parent.removeChild(child);

    if(parent.id!="objects_in_scene"){
        parent.id = "wrapper_of_" + parent.firstChild.id;
        parent.className = "parent_wrapper";
    }

    cleanUpObjectNode(parent);
    hideProperties();
};

var deleteObject = function(child){
    scene.removeFromScene(objects[child.id]);
    objects[child.id] = null;
    cameraPreview.scene.removeFromScene(cameraPreview.objects[child.id]);
    cameraPreview.objects[child.id] = null;
    handleDeletedObject(child);
};