var openModal = function(type, currentObjectId){
    if(type == "obj"){
        document.getElementById("modal").style.display = "block";
        document.getElementById("file_upload_wrapper").style.display = "block";
        document.getElementById("obj_drop").style.display = "flex";
        document.getElementById("mtl_drop").style.display = "flex";
    }else if(type == "script"){
        var resetScript = function(){
            document.getElementById("edit_script_textarea").value = objects[currentObjectId].script;
        };
        document.getElementById("modal").style.display = "block";
        document.getElementById("edit_script_wrapper").style.display = "block";
        document.getElementById("edit_script_textarea").style.display = "block";
        resetScript();
        document.getElementById("save_script").addEventListener("click", function(){
            eval("objects[currentObjectId].script = "+document.getElementById("edit_script_textarea").value);
            closeModal();
        });
        document.getElementById("reset_script").addEventListener("click", resetScript);
    }else if(type == "initScript"){
        resetScript = function(){
            document.getElementById("edit_script_textarea").value = objects[currentObjectId].initScript;
        };
        document.getElementById("modal").style.display = "block";
        document.getElementById("edit_script_wrapper").style.display = "block";
        document.getElementById("edit_script_textarea").style.display = "block";
        resetScript();
        document.getElementById("save_script").addEventListener("click", function(){
            eval("objects[currentObjectId].initScript = "+document.getElementById("edit_script_textarea").value);
            objects[currentObjectId].ayceUI.runInitScript = true;
            closeModal();
        });
        document.getElementById("reset_script").addEventListener("click", resetScript);
    }
    document.getElementById("modal_close").addEventListener("click", closeModal);
};

var closeModal = function(){
    document.getElementById("obj_drop").style.display = "none";
    document.getElementById("obj_drop_done").style.display = "none";
    document.getElementById("mtl_drop").style.display = "none";
    document.getElementById("mtl_drop_done").style.display = "none";
    document.getElementById("file_upload_wrapper").style.display = "none";
    document.getElementById("import_processing").style.display = "none";
    document.getElementById("export_code_textarea").style.display = "none";
    document.getElementById("edit_script_textarea").style.display = "none";
    document.getElementById("edit_script_wrapper").style.display = "none";
    document.getElementById("modal").style.display = "none";
    objString = null;
    mtlString = null;
};

document.getElementById("obj_drop").addEventListener("dragover", function(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}, false);

document.getElementById("mtl_drop").addEventListener("dragover", function(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}, false);

var objString = null;
var mtlString = null;

document.getElementById("obj_drop").addEventListener("drop", function(e){
    fileToGeometry(e, "obj");
}, false);

document.getElementById("mtl_drop").addEventListener("drop", function(e){
    fileToGeometry(e, "mtl")
}, false);

var fileToGeometry = function(e, type){
    e.stopPropagation();
    e.preventDefault();

    var file = e.dataTransfer.files[0];

    if(/(?:\.([^.]+))?$/.exec(file.name)[1] == type) {          // check if correct file was dropped in correct field
        document.getElementById(type + "_drop").style.display = "none";
        document.getElementById(type + "_drop_loading").style.display = "flex";

        var reader = new FileReader();
        reader.onload = function (e) {
            if(type == "mtl") mtlString = e.currentTarget.result;
            else if(type == "obj") objString = e.currentTarget.result;
            document.getElementById(type + "_drop_loading").style.display = "none";
            document.getElementById(type + "_drop_done").style.display = "flex";
            if (objString && mtlString) {
                document.getElementById("obj_drop_done").style.display = "none";
                document.getElementById("mtl_drop_done").style.display = "none";
                document.getElementById("import_processing").style.display = "flex";
                createGeometry(objString, mtlString)
            }
        };
        reader.readAsText(file);    // TODO: enable direct data passing to OBJLoader
    }else{
        showNotification("Please provide a valid ." + type + " file.", "fa-exclamation-circle");
    }
};

var createGeometry = function(obj, mtl){

    var object = new Ayce.OBJLoader(null, obj, mtl, true)[0];
    if(object.vertices) {

        objects.push(object);                // TODO: more efficient solution for copying the O3D
        cameraPreview.objects.push(new Ayce.OBJLoader(null, obj, mtl, true)[0]);
        objects[objects.length-1].ayceUI = new AyceUIMetaObject("imported object");
        scene.addToScene(objects[objects.length - 1]);
        cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length - 1], false);
        console.log("done");

        var child = appendObjectInSceneChildNode("obj");
        closeModal();
        child.onclick({srcElement: {dataset: {type: "obj"}}});
    }else{
        showNotification("At least one of the provided files is invalid. The object wasn't created.", "fa-exclamation-circle");
        closeModal();
        openModal("obj");
    }
};