var openModal = function(type, currentObjectId){
    if(type == "obj"){
        document.getElementById("modal").style.display = "block";
        document.getElementById("file_upload_wrapper").style.display = "block";
        document.getElementById("obj_drop").style.display = "flex";
        document.getElementById("mtl_drop").style.display = "flex";
    }else if(type == "code"){
        document.getElementById("modal").style.display = "block";
        document.getElementById("export_code_textarea").style.display = "block";
        document.getElementById("export_code_textarea").value = buildCodeString();
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

var buildCodeString = function(){
    var referenceObject = new Ayce.Object3D();
    var referenceLight = new Ayce.Light();
    var output = 'var scene = new Ayce.Scene(document.getElementById("ayce_canvas"));\n' +
        "var objects = [];\n";
    for(var i=0; i<objects.length; i++){
        var isLight = objects[i] instanceof Ayce.Light;
        if(isLight){
            output += "objects["+i+"] = new Ayce.Light();\n";
        }else{
            output += "objects["+i+"] = new Ayce.Object3D();\n";
        }
        for (var property in objects[i]) {
            if(objects[i].hasOwnProperty(property) && typeof objects[i][property] != "function" && ((!isLight &&objects[i][property]!=referenceObject[property])||(isLight &&objects[i][property]!=referenceLight[property]))) {
                switch (typeof objects[i][property]) {
                    case "string":
                        output += "objects["+i+"]." + property + " = \"" + objects[i][property] + "\";\n";
                        break;
                    case "boolean":
                        output += "objects["+i+"]." + property + " = " + objects[i][property] + ";\n";
                        break;
                    case "object":
                        if (Array.isArray(objects[i][property])&&property != "collideWith") {   // collideWith is handled after this loop
                            output += "objects["+i+"]." + property + " = [";
                            for (var element in objects[i][property]) {
                                output += element + ", ";
                            }
                            output = output.replace(/[, ]+$/, "");  // remove trailing ", "
                            output += "];\n";
                        } else if (objects[i][property] == null) {
                            output += "objects["+i+"]." + property + " = " + objects[i][property] + ";\n";
                        } else {
                            if (property == "parentPositionWeight" || property == "parentRotationWeight" ||
                            property == "position" ||   // properties of type Ayce.Vector3
                            property == "scale" ||
                            property == "velocity") {
                                if(objects[i][property].x != referenceObject[property].x ||     // property is different from default property
                                    objects[i][property].y != referenceObject[property].y ||
                                    objects[i][property].z != referenceObject[property].z) {
                                    output += "objects["+i+"]." + property + " = new Ayce.Vector3(" +
                                        objects[i][property].x + ", " +
                                        objects[i][property].y + ", " +
                                        objects[i][property].z + ");\n";
                                }
                            } else if (property == "rotation") {    // properties of type Ayce.Quaternion
                                if(objects[i][property].x != referenceObject[property].x ||     // property is different from default property
                                    objects[i][property].y != referenceObject[property].y ||
                                    objects[i][property].z != referenceObject[property].z ||
                                    objects[i][property].w != referenceObject[property].w) {
                                    output += "objects["+i+"]." + property + " = new Ayce.Quaternion(" +
                                        objects[i][property].x + ", " +
                                        objects[i][property].y + ", " +
                                        objects[i][property].z + ", " +
                                        objects[i][property].w + ");\n";
                                }
                            } else if (property == "color" || property == "specularColor"){
                                output += "objects["+i+"]." + property + " = {\n" +
                                    "\tred: "+objects[i][property].red + ",\n" +
                                    "\tgreen: "+objects[i][property].green + ",\n" +
                                    "\tblue: "+objects[i][property].blue + "\n};\n";
                            }
                        }
                        break;
                }
            }
        }
    }
    for(i = 0; i < objects.length; i++){
        if(objects[i].parent!=null){
            output += "objects["+i+"].parent = objects[" + objects[i].parent.id + "];\n";
        }
        if(objects[i].collideWith!=null){
            output += "objects["+i+"].collideWith = [";
            for(var j = 0; j < objects[i].collideWith.length; j++){
                output += "objects["+objects[i].collideWith[j].id+"], "
            }
            output = output.replace(/[, ]+$/, "");  // remove trailing ", "
            output += "];\n";
        }
    }
    output += "for(var i = 0; i < objects.length; i++){\n" +
        "\tscene.addToScene(objects[i]);\n" +
        "};\n" +
        "var update = function(){\n" +
        "\tAyce.requestAnimFrame(update);\n" +
        "\tscene.updateScene();\n" +
        "\tscene.drawScene();\n" +
        "};\n" +
        "update();";
    return output;
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

    var object = new Ayce.OBJLoader(obj, mtl, true)[0];
    if(object.vertices) {

        objects.push(object);                // TODO: more efficient solution for copying the O3D
        cameraPreview.objects.push(new Ayce.OBJLoader(obj, mtl, true)[0]);

        objects[objects.length - 1].position.z = -2;
        cameraPreview.objects[cameraPreview.objects.length - 1].position.z = -2;

        objects[objects.length - 1].screenName = "imported object";

        scene.addToScene(objects[objects.length - 1]);
        cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length - 1], false);
        console.log("done");

        var child = appendObjectInSceneChildElement("obj");
        closeModal();
        child.onclick({srcElement: {dataset: {type: "obj"}}});
    }else{
        showNotification("At least one of the provided files is invalid. The object wasn't created.", "fa-exclamation-circle");
        closeModal();
        openModal("obj");
    }
};