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
    var output = '<html style="height: 100%; width: 100%; margin: 0; padding: 0; border: 0;">\n' +
        '\t<head>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/allyoucaneatVR.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/math/Vector2.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/math/Vector3.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/math/Matrix3.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/math/Matrix4.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/math/Quaternion.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/math/Geometry.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/buffer/Buffer.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/buffer/BufferMulti.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/buffer/Shader.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/buffer/ShaderGenerator.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/camera/Camera.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/camera/CameraManager.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/camera/cameraModifiers/CameraModifier.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/camera/cameraModifiers/Cardboard.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/camera/cameraModifiers/Gamepad.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/camera/cameraModifiers/MouseKeyboard.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/camera/cameraModifiers/WebVR.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/renderer/Renderer.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/renderer/VRRenderer.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/sound/AudioContext.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/sound/Sound.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/Light.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/Scene.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/Timer.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/stage/XMLLoader.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/inputHandlers/GamepadHandler.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/inputHandlers/HMDHandler.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/inputHandlers/KeyboardHandler.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/inputHandlers/MouseHandler.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/inputHandlers/SensorsHandler.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/objects/Object3D.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/objects/loader/OBJLoader.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/objects/types/ParticleSystem.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/objects/types/Skybox.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/objects/types/VRSquare.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/objects/examples/Cube3D.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/objects/examples/Pyramid3D.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/objects/examples/Sphere3D.js"></script>\n' +
        '\t\t<script type="text/javascript" src="allyoucaneatvr/objects/examples/Square.js"></script>\n' +

        //'\t\t<script src="AyceVR.min.js"></script>\n' +
        '\t</head>\n' +
        '\t<body style="height: 100%; width: 100%; margin: 0; padding: 0; border: 0;">\n' +
        '\t\t<div  style="width: 100%; height: 100%;">\n' +
        '\t\t\t<canvas id="ayce_canvas"></canvas>\n' +
        '\t\t</div>\n' +
        '\t\t<script type="text/javascript" >\n';
    output += '\t\t\tvar scene = new Ayce.Scene(document.getElementById("ayce_canvas"));\n' +
        "\t\t\tvar objects = [];\n";
    for(var i=0; i<objects.length; i++){
        var isLight = objects[i] instanceof Ayce.Light;
        if(isLight){
            output += "\t\t\tobjects["+i+"] = new Ayce.Light();\n";
        }else{
            output += "\t\t\tobjects["+i+"] = new Ayce.Object3D();\n";
        }
        for (var property in objects[i]) {
            if(objects[i].hasOwnProperty(property) && typeof objects[i][property] != "function" && ((!isLight &&objects[i][property]!=referenceObject[property])||(isLight &&objects[i][property]!=referenceLight[property]))) {
                switch (typeof objects[i][property]) {
                    case "string":
                        output += "\t\t\tobjects["+i+"]." + property + " = \"" + objects[i][property] + "\";\n";
                        break;
                    case "boolean":
                        output += "\t\t\tobjects["+i+"]." + property + " = " + objects[i][property] + ";\n";
                        break;
                    case "object":
                        if (Array.isArray(objects[i][property])&&property != "collideWith") {   // collideWith is handled after this loop
                            output += "\t\t\tobjects["+i+"]." + property + " = [";
                            for (j = 0; j < objects[i][property].length; j++) {
                                output += objects[i][property][j] + ", ";
                            }
                            output = output.replace(/[, ]+$/, "");  // remove trailing ", "
                            output += "];\n";
                        } else if (objects[i][property] == null) {
                            output += "\t\t\tobjects["+i+"]." + property + " = " + objects[i][property] + ";\n";
                        } else {
                            if (property == "parentPositionWeight" || property == "parentRotationWeight" ||
                            property == "position" ||   // properties of type Ayce.Vector3
                            property == "scale" ||
                            property == "velocity") {
                                if(objects[i][property].x != referenceObject[property].x ||     // property is different from default property
                                    objects[i][property].y != referenceObject[property].y ||
                                    objects[i][property].z != referenceObject[property].z) {
                                    output += "\t\t\tobjects["+i+"]." + property + " = new Ayce.Vector3(" +
                                        objects[i][property].x + ", " +
                                        objects[i][property].y + ", " +
                                        objects[i][property].z + ");\n";
                                }
                            } else if (property == "rotation") {    // properties of type Ayce.Quaternion
                                if(objects[i][property].x != referenceObject[property].x ||     // property is different from default property
                                    objects[i][property].y != referenceObject[property].y ||
                                    objects[i][property].z != referenceObject[property].z ||
                                    objects[i][property].w != referenceObject[property].w) {
                                    output += "\t\t\tobjects["+i+"]." + property + " = new Ayce.Quaternion(" +
                                        objects[i][property].x + ", " +
                                        objects[i][property].y + ", " +
                                        objects[i][property].z + ", " +
                                        objects[i][property].w + ");\n";
                                }
                            } else if (property == "color" || property == "specularColor"){
                                output += "\t\t\tobjects["+i+"]." + property + " = {\n" +
                                    "\t\t\t\tred: "+objects[i][property].red + ",\n" +
                                    "\t\t\t\tgreen: "+objects[i][property].green + ",\n" +
                                    "\t\t\t\tblue: "+objects[i][property].blue + "\n\t\t\t};\n";
                            } else if(property == "ayceUI"){
                                output += "\t\t\tobjects["+i+"]." + property + " = {\n" +
                                    "\t\t\t\tid: "+objects[i][property].id + ",\n" +
                                    "\t\t\t\tscreenName: \""+objects[i][property].screenName + "\",\n" +
                                    "\t\t\t\trunScriptInPreview: "+objects[i][property].runScriptInPreview+ "\n\t\t\t};\n";
                            }
                        }
                        break;
                }
            }
        }
    }
    for(i = 0; i < objects.length; i++){
        if(objects[i].parent!=null){
            output += "\t\t\tobjects["+i+"].parent = objects[" + objects[i].parent.ayceUI.id + "];\n";
        }
        if(objects[i].collideWith!=null){
            output += "\t\t\tobjects["+i+"].collideWith = [";
            for(var j = 0; j < objects[i].collideWith.length; j++){
                output += "\t\t\tobjects["+objects[i].collideWith[j].ayceUI.id+"], "
            }
            output = output.replace(/[, ]+$/, "");  // remove trailing ", "
            output += "\t\t\t];\n";
        }
    }
    var cameraPosition = cameraPreview.scene.getCamera().getManager().getGlobalPosition();
    var cameraOrientation = cameraPreview.scene.getCamera().getManager().getGlobalRotation();
    output += "\t\t\tfor(var i = 0; i < objects.length; i++){\n" +
        "\t\t\t\tscene.addToScene(objects[i]);\n" +
        "\t\t\t};\n" +
        "\t\t\tvar modifier = new Ayce.CameraModifier();\n" +         // TODO: proper support for cameras (parents, modifiers,...)
        "\t\t\tmodifier.position.x = " + cameraPosition.x + ";\n" +
        "\t\t\tmodifier.position.y = " + cameraPosition.y + ";\n" +
        "\t\t\tmodifier.position.z = " + cameraPosition.z + ";\n" +
        "\t\t\tmodifier.orientation.x = " + cameraOrientation.x + ";\n" +
        "\t\t\tmodifier.orientation.y = " + cameraOrientation.y + ";\n" +
        "\t\t\tmodifier.orientation.z = " + cameraOrientation.z + ";\n" +
        "\t\t\tmodifier.orientation.w = " + cameraOrientation.w + ";\n" +
        "\t\t\tscene.getCamera().getManager().modifiers.push(modifier);\n" +
        "\t\t\tvar update = function(){\n" +
        "\t\t\t\tAyce.requestAnimFrame(update);\n" +
        "\t\t\t\tscene.updateScene();\n" +
        "\t\t\t\tscene.drawScene();\n" +
        "\t\t\t};\n" +
        "\t\t\tupdate();\n" +
        "\t\t</script>\n" +
        "\t</body>\n" +
        "</html>";
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

        var screenName = this.dataset.type;
        objects[objects.length-1].ayceUI = {
            id: objects.length-1,
            screenName: "imported object",
            runScriptInPreview: false
        };

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