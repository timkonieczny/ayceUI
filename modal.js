var evaluateInitScript = function(){
    var errorInfo = document.getElementById("init_script_error");
    try{
        eval("objects[currentObjectId].initScript = " + document.getElementById("edit_script_textarea").value);
        errorInfo.style.display = "none";
        objects[currentObjectId].ayceUI.initScriptError = null;
        removeClass(document.getElementById(currentObjectId), "button_error");
    }catch(error){
        showNotification("Code contains errors. Initialization script will not be run.", "fa-exclamation-circle", "error");
        errorInfo.style.display = "block";
        errorInfo.innerHTML = objects[currentObjectId].ayceUI.initScriptError = '<i class="fa fa-exclamation-circle"></i>' + error;
        objects[currentObjectId].initScript = document.getElementById("edit_script_textarea").value;
        addClass(document.getElementById(currentObjectId), "button_error");
    }
    closeModal();
};
var evaluateUpdateScript = function(){
    var errorInfo = document.getElementById("update_script_error");
    try{
        eval("objects[currentObjectId].updateScript = "+document.getElementById("edit_script_textarea").value);
        errorInfo.style.display = "none";
        objects[currentObjectId].ayceUI.updateScriptError = null;
        removeClass(document.getElementById(currentObjectId), "button_error");
    }catch(error){
        showNotification("Code contains errors. Update script will not be run.", "fa-exclamation-circle", "error");
        errorInfo.style.display = "block";
        errorInfo.innerHTML = objects[currentObjectId].ayceUI.updateScriptError = '<i class="fa fa-exclamation-circle"></i>' + error;
        objects[currentObjectId].updateScript = document.getElementById("edit_script_textarea").value;
        addClass(document.getElementById(currentObjectId), "button_error");
    }
    closeModal();
};
var evaluateCameraInitScript = function(){
    eval("cameraPreview.modifier.initScript = "+document.getElementById("edit_script_textarea").value);
    closeModal();
};
var evaluateCameraUpdateScript = function(){
    eval("cameraPreview.modifier.updateScript = "+document.getElementById("edit_script_textarea").value);
    closeModal();
};
var resetCameraInitScript = function(){
    document.getElementById("edit_script_textarea").value = cameraPreview.modifier.initScript;
};
var resetCameraUpdateScript = function(object){
    document.getElementById("edit_script_textarea").value = cameraPreview.modifier.updateScript;
};
var resetInitScript = function(object){
    document.getElementById("edit_script_textarea").value = object.initScript;
};
var resetUpdateScript = function(object){
    console.log(object);
    document.getElementById("edit_script_textarea").value = object.updateScript;
};
var openModal = function(type, object){
    if(type == "obj"){
        document.getElementById("modal").style.display = "block";
        document.getElementById("file_upload_wrapper").style.display = "block";
        document.getElementById("obj_drop").style.display = "flex";
        document.getElementById("mtl_drop").style.display = "flex";
    }else if(type == "updateScript"){
        document.getElementById("modal").style.display = "block";
        document.getElementById("edit_script_wrapper").style.display = "block";
        document.getElementById("edit_script_textarea").style.display = "block";
        resetUpdateScript(object);
        document.getElementById("save_script").removeEventListener("click", evaluateInitScript);
        document.getElementById("save_script").removeEventListener("click", evaluateCameraInitScript);
        document.getElementById("save_script").removeEventListener("click", evaluateUpdateScript);
        document.getElementById("save_script").removeEventListener("click", evaluateCameraUpdateScript);
        if(object instanceof Ayce.CameraModifier){
            document.getElementById("save_script").addEventListener("click", evaluateCameraUpdateScript);
            document.getElementById("reset_script").addEventListener("click", resetCameraUpdateScript);
        }else {
            document.getElementById("save_script").addEventListener("click", evaluateUpdateScript);
            document.getElementById("reset_script").addEventListener("click", function(){resetUpdateScript(objects[currentObjectId])});
        }
    }else if(type == "initScript"){
        document.getElementById("modal").style.display = "block";
        document.getElementById("edit_script_wrapper").style.display = "block";
        document.getElementById("edit_script_textarea").style.display = "block";
        resetInitScript(object);
        document.getElementById("save_script").removeEventListener("click", evaluateInitScript);
        document.getElementById("save_script").removeEventListener("click", evaluateCameraInitScript);
        document.getElementById("save_script").removeEventListener("click", evaluateUpdateScript);
        document.getElementById("save_script").removeEventListener("click", evaluateCameraUpdateScript);
        if(object instanceof Ayce.CameraModifier) {
            document.getElementById("save_script").addEventListener("click", evaluateCameraInitScript);
            document.getElementById("reset_script").addEventListener("click", resetCameraInitScript);
        }else{
            document.getElementById("save_script").addEventListener("click", evaluateInitScript);
            document.getElementById("reset_script").addEventListener("click", function(){resetInitScript(objects[currentObjectId])});
        }
        object.ayceUI.runInitScript = true;
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
        showNotification("Please provide a valid ." + type + " file.", "fa-exclamation-circle", "error");
    }
};

var createGeometry = function(obj, mtl){

    var object = new Ayce.OBJLoader(null, obj, mtl, true)[0];
    if(object.vertices) {

        objects.push(object);                // TODO: more efficient solution for copying the O3D
        objects[objects.length-1].updateScript = function(){};
        objects[objects.length-1].initScript = function(){};
        cameraPreview.objects.push(new Ayce.OBJLoader(null, obj, mtl, true)[0]);
        cameraPreview.objects[cameraPreview.objects.length-1].updateScript = function(){};
        cameraPreview.objects[cameraPreview.objects.length-1].initScript = function(){};
        objects[objects.length-1].ayceUI = new AyceUIMetaObject("imported object");
        scene.addToScene(objects[objects.length - 1]);
        cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length - 1], false);
        console.log("done");

        var child = appendObjectInSceneChildNode("obj");
        closeModal();
        showProperties(child);
    }else{
        showNotification("At least one of the provided files is invalid. The object wasn't created.", "fa-exclamation-circle", "error");
        closeModal();
        openModal("obj");
    }
};