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
var handleChildParentDrop = function(e, newParent){
    if(e.dataTransfer.getData("text/html")==newParent.id){
        showNotification("Cannot make the active object the active object's parent", "fa-exclamation-circle");
        // same element
    }else if(newParent.parentNode.id!="objects_in_scene" &&
        Array.prototype.indexOf.call(newParent.parentNode.childNodes, newParent)==0 &&
        (hasChildNodeWithId(newParent.parentNode, e.dataTransfer.getData("text/html")))){
        showNotification("The object is already a child", "fa-exclamation-circle");
        // TODO: implement removing parent
        // already a child
    }else{
        var newChild = document.getElementById(e.dataTransfer.getData("text/html"));

        if(newChild.className == "parent_wrapper"){
            objects[Number(newChild.firstChild.id)].parent = objects[Number(newParent.id)];
            cameraPreview.objects[Number(newChild.firstChild.id)].parent = cameraPreview.objects[Number(newParent.id)];
        }else{
            objects[Number(newChild.id)].parent = objects[Number(newParent.id)];
            cameraPreview.objects[Number(newChild.id)].parent = cameraPreview.objects[Number(newParent.id)];
        }

        if(newParent.parentNode.id == "wrapper_of_"+newParent.id){
            newParent.parentNode.appendChild(newChild);
            newChild.style.marginLeft = "10px";
        }else {
            var wrapper = document.createElement("div");
            var newParentCopy = newParent.cloneNode(true);      // need copy to replace the original with the wrapper + copy later
            newParentCopy.style.marginLeft = "0px";
            newParentCopy.addEventListener("dragover", function (e) {
                handleDragover(e)
            });
            newParentCopy.addEventListener("drop", function (e) {
                handleChildParentDrop(e, this)
            });
            newParentCopy.addEventListener("click", handleClickOnObject);
            wrapper.appendChild(newParentCopy);
            wrapper.appendChild(newChild);

            wrapper.style.marginLeft = newParent.style.marginLeft;
            wrapper.id = "wrapper_of_" + newParentCopy.dataset.id;
            wrapper.className = "parent_wrapper";
            wrapper.addEventListener("dragstart", function (e) {            // enables moving parent with children
                handleChildParentDragstart(e, this);
            });
            wrapper.addEventListener("dragend", function (e) {              // disables unlink buttons
                handleChildParentDragend();
            });

            newParent.parentNode.replaceChild(wrapper, newParent);

            newChild.style.marginLeft = "10px";
            newChild.addEventListener("click", handleClickOnObject);
            document.getElementById("delete_"+newParentCopy.id).addEventListener("click", function (e) {
                e.stopPropagation();
                if(newParentCopy.parentNode.firstChild == newParentCopy){
                    deleteParent(newParentCopy);
                }else{
                    deleteObject(newParentCopy);
                }
            });
            uiFactory.updateParentField();
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
    objects[Number(element.id)].parent = null;
    cameraPreview.objects[Number(element.id)].parent = null;
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
        copy.addEventListener("click", handleClickOnObject);
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

var appendObjectInSceneChildNode = function(type){
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
    //child.onclick = showProperties;
    child.addEventListener("click", handleClickOnObject);
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
    //console.log(child);
    return child;
};

var handleDeletedObject = function(child){
    var parent = child.parentNode;

    parent.removeChild(child);

    if(parent.id!="objects_in_scene" && parent.childNodes.length > 0){
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

var deleteParent = function(child){
    for(var i = child.parentNode.childNodes.length-1; i > 0; i--){             // delete all child nodex except for the first (parent object)
        if(child.parentNode.childNodes[i].className == "parent_wrapper"){
            deleteParent(child.parentNode.childNodes[i].firstChild);
        }else{
            deleteObject(child.parentNode.childNodes[i]);
        }
    }
    deleteObject(document.getElementById(child.parentNode.firstChild.id));    // delete first node separately because it doesn't have a wrapper anymore
};