CodeBuilder = function(){

    var referenceObject = new Ayce.Object3D();
    var referenceLight = new Ayce.Light();

    this.saveProject = function(){

        var saveProject = function(indexHTML){
            var sourceFiles = [];
            var numberOfSourceFiles = 0;

            var getFileAsString = function(path){
                numberOfSourceFiles++;
                var client = new XMLHttpRequest();
                var filename = path.replace(/^.*[\\\/]/, '');   // remove folder prefix
                var directory = path.replace(/[^\/]*$/, '');   // remove folder prefix
                client.open('GET', path);
                client.onreadystatechange = function() {
                    if(this.readyState == this.DONE) {
                        sourceFiles.push({directory: directory, filename: filename, content: client.responseText});
                        if (sourceFiles.length == numberOfSourceFiles) {
                            var zip = new JSZip();
                            var lib = zip.folder("lib");
                            var allyoucaneatvr = lib.folder("allyoucaneatvr");
                            var inputHandlers = allyoucaneatvr.folder("inputHandlers");
                            var math = allyoucaneatvr.folder("math");
                            var objects = allyoucaneatvr.folder("objects");
                            var loader = objects.folder("loader");
                            var types = objects.folder("types");
                            var stage = allyoucaneatvr.folder("stage");
                            var buffer = stage.folder("buffer");
                            var camera = stage.folder("camera");
                            var cameraModifiers = camera.folder("cameraModifiers");
                            var renderer = stage.folder("renderer");
                            var sound = stage.folder("sound");
                            var ayceFiles = {
                                inputHandlers: {
                                    folder: allyoucaneatvr.folder("inputHandlers"),
                                    gamepadHandler: inputHandlers.file("GamepadHandler.js"),
                                    hmdHandler: inputHandlers.file("HMDHandler.js"),
                                    keyboardHandler: inputHandlers.file("KeyboardHandler.js"),
                                    mouseHandler: inputHandlers.file("MouseHandler.js"),
                                    sensorsHandler: inputHandlers.file("SensorsHandler.js")
                                },
                                math: {
                                    folder: allyoucaneatvr.folder("math"),
                                    geometry: math.file("Geometry.js"),
                                    matrix3: math.file("Matrix3.js"),
                                    matrix4: math.file("Matrix4.js"),
                                    quaternion: math.file("Quaternion.js"),
                                    vector2: math.file("Vector2.js"),
                                    vector3: math.file("Vector3.js")
                                },
                                objects: {
                                    folder: allyoucaneatvr.folder("Objects")
                                },
                                stage: {
                                    folder: allyoucaneatvr.folder("stage")
                                },
                                allyoucaneatvr: allyoucaneatvr.file("allyoucaneatVR.js")
                            };
                            ayceFiles.objects.loader = {
                                folder: ayceFiles.objects.folder.folder("loader")
                            };
                            ayceFiles.objects.types = {
                                folder: ayceFiles.objects.folder.folder("types")
                            };
                            ayceFiles.stage.buffer = {
                                folder: ayceFiles.stage.folder.folder("buffer")
                            };
                            ayceFiles.stage.camera = {
                                folder: ayceFiles.stage.folder.folder("camera")
                            };
                            ayceFiles.stage.renderer = {
                                folder: ayceFiles.stage.folder.folder("renderer")
                            };
                            ayceFiles.stage.sound = {
                                folder: ayceFiles.stage.folder.folder("sound")
                            };
                            ayceFiles.stage.camera.cameraModifiers = {
                                folder: ayceFiles.stage.camera.folder.folder("cameraModifiers")
                            };

                            for (var i = 0; i < sourceFiles.length; i++) {
                                var directories = sourceFiles[i].directory.replace(/^(lib\/allyoucaneatvr\/)/, "").replace(/\/$/, "").split("/");
                                switch(directories.length){
                                    case 0:
                                        allyoucaneatvr.file(sourceFiles[i].filename, sourceFiles[i].content);
                                        break;
                                    case 1:
                                        if(directories[0]=="") allyoucaneatvr.file(sourceFiles[i].filename, sourceFiles[i].content);
                                        else ayceFiles[directories[0]].folder.file(sourceFiles[i].filename, sourceFiles[i].content);
                                        break;
                                    case 2:
                                        ayceFiles[directories[0]][directories[1]].folder.file(sourceFiles[i].filename, sourceFiles[i].content);
                                        break;
                                    case 3:
                                        ayceFiles[directories[0]][directories[1]][directories[2]].folder.file(sourceFiles[i].filename, sourceFiles[i].content);
                                        break;
                                    case 4:
                                        ayceFiles[directories[0]][directories[1]][directories[2]][directories[3]].folder.file(sourceFiles[i].filename, sourceFiles[i].content);
                                        break;
                                }
                            }
                            zip.file("index.html", buildCodeString());
                            zip.generateAsync({type: "blob"})
                                .then(function (content) {
                                    saveAs(content, "ayceUI-project.zip");
                                });

                        }
                    }
                };
                client.send();
            };

            getFileAsString("lib/allyoucaneatvr/allyoucaneatVR.js");
            getFileAsString("lib/allyoucaneatvr/math/Vector2.js");
            getFileAsString("lib/allyoucaneatvr/math/Vector3.js");
            getFileAsString("lib/allyoucaneatvr/math/Matrix3.js");
            getFileAsString("lib/allyoucaneatvr/math/Matrix4.js");
            getFileAsString("lib/allyoucaneatvr/math/Quaternion.js");
            getFileAsString("lib/allyoucaneatvr/math/Geometry.js");
            getFileAsString("lib/allyoucaneatvr/stage/buffer/Buffer.js");
            getFileAsString("lib/allyoucaneatvr/stage/buffer/BufferMulti.js");
            getFileAsString("lib/allyoucaneatvr/stage/buffer/Shader.js");
            getFileAsString("lib/allyoucaneatvr/stage/buffer/ShaderGenerator.js");
            getFileAsString("lib/allyoucaneatvr/stage/camera/Camera.js");
            getFileAsString("lib/allyoucaneatvr/stage/camera/CameraManager.js");
            getFileAsString("lib/allyoucaneatvr/stage/camera/cameraModifiers/CameraModifier.js");
            getFileAsString("lib/allyoucaneatvr/stage/camera/cameraModifiers/Cardboard.js");
            getFileAsString("lib/allyoucaneatvr/stage/camera/cameraModifiers/Gamepad.js");
            getFileAsString("lib/allyoucaneatvr/stage/camera/cameraModifiers/MouseKeyboard.js");
            getFileAsString("lib/allyoucaneatvr/stage/camera/cameraModifiers/WebVR.js");
            getFileAsString("lib/allyoucaneatvr/stage/renderer/Renderer.js");
            getFileAsString("lib/allyoucaneatvr/stage/renderer/VRRenderer.js");
            getFileAsString("lib/allyoucaneatvr/stage/sound/AudioContext.js");
            getFileAsString("lib/allyoucaneatvr/stage/sound/Sound.js");
            getFileAsString("lib/allyoucaneatvr/stage/Light.js");
            getFileAsString("lib/allyoucaneatvr/stage/Scene.js");
            getFileAsString("lib/allyoucaneatvr/stage/Timer.js");
            getFileAsString("lib/allyoucaneatvr/stage/XMLLoader.js");
            getFileAsString("lib/allyoucaneatvr/inputHandlers/GamepadHandler.js");
            getFileAsString("lib/allyoucaneatvr/inputHandlers/HMDHandler.js");
            getFileAsString("lib/allyoucaneatvr/inputHandlers/KeyboardHandler.js");
            getFileAsString("lib/allyoucaneatvr/inputHandlers/MouseHandler.js");
            getFileAsString("lib/allyoucaneatvr/inputHandlers/SensorsHandler.js");
            getFileAsString("lib/allyoucaneatvr/objects/Object3D.js");
            getFileAsString("lib/allyoucaneatvr/objects/loader/OBJLoader.js");
            getFileAsString("lib/allyoucaneatvr/objects/types/ParticleSystem.js");
            getFileAsString("lib/allyoucaneatvr/objects/types/Skybox.js");
            getFileAsString("lib/allyoucaneatvr/objects/types/VRSquare.js");
        };

        saveProject("bla");

        var buildCodeString = function(){
            var output = '<html style="height: 100%; width: 100%; margin: 0; padding: 0; border: 0;">\n' +
                '\t<head>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/allyoucaneatVR.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/math/Vector2.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/math/Vector3.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/math/Matrix3.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/math/Matrix4.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/math/Quaternion.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/math/Geometry.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/buffer/Buffer.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/buffer/BufferMulti.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/buffer/Shader.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/buffer/ShaderGenerator.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/camera/Camera.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/camera/CameraManager.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/camera/cameraModifiers/CameraModifier.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/camera/cameraModifiers/Cardboard.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/camera/cameraModifiers/Gamepad.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/camera/cameraModifiers/MouseKeyboard.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/camera/cameraModifiers/WebVR.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/renderer/Renderer.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/renderer/VRRenderer.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/sound/AudioContext.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/sound/Sound.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/Light.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/Scene.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/Timer.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/stage/XMLLoader.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/inputHandlers/GamepadHandler.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/inputHandlers/HMDHandler.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/inputHandlers/KeyboardHandler.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/inputHandlers/MouseHandler.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/inputHandlers/SensorsHandler.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/objects/Object3D.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/objects/loader/OBJLoader.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/objects/types/ParticleSystem.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/objects/types/Skybox.js"></script>\n' +
                '\t\t<script type="text/javascript" src="lib/allyoucaneatvr/objects/types/VRSquare.js"></script>\n' +
                //'\t\t<script type="text/javascript" src="lib/allyoucaneatvr/objects/examples/Cube3D.js"></script>\n' +
                //'\t\t<script type="text/javascript" src="lib/allyoucaneatvr/objects/examples/Pyramid3D.js"></script>\n' +
                //'\t\t<script type="text/javascript" src="lib/allyoucaneatvr/objects/examples/Sphere3D.js"></script>\n' +
                //'\t\t<script type="text/javascript" src="lib/allyoucaneatvr/objects/examples/Square.js"></script>\n' +

                //'\t\t<script src="AyceVR.min.js"></script>\n' +
                '\t</head>\n' +
                '\t<body style="height: 100%; width: 100%; margin: 0; padding: 0; border: 0;">\n' +
                '\t\t<div  style="width: 100%; height: 100%;">\n' +
                '\t\t\t<canvas id="ayce_canvas"></canvas>\n' +
                '\t\t</div>\n' +
                '\t\t<script type="text/javascript" >\n';
            output += '\t\t\tvar scene = new Ayce.Scene(document.getElementById("ayce_canvas"));\n' +
                "\t\t\tvar objects = [];\n";
            var outputObjectIndex = 0;
            for(var i=0; i<objects.length; i++){
                console.log(Math.round(i/objects.length*100)+"%");
                if(objects[i]) {
                    var isLight = objects[i] instanceof Ayce.Light;
                    if (isLight) {
                        output += "\t\t\tobjects[" + outputObjectIndex + "] = new Ayce.Light();\t// " + objects[i].ayceUI.screenName + "\n";
                    } else if (objects[i] instanceof EmptyObject) {
                        output += "\t\t\tobjects[" + outputObjectIndex + "] = {\t// " + objects[i].ayceUI.screenName + "\n" +
                            "\t\t\t\tposition: new Ayce.Vector3(" + objects[i].position.x + ", " + objects[i].position.y + ", " + objects[i].position.z + "),\n" +
                            "\t\t\t\trotation: new Ayce.Quaternion(" + objects[i].rotation.x + ", " + objects[i].rotation.y + ", " + objects[i].rotation.z + ", " + objects[i].rotation.w + "),\n" +
                            "\t\t\t\tgetGlobalPosition: function(){return this.position},\n" +
                            "\t\t\t\tgetGlobalRotation: function(){return this.rotation}\n\t\t\t};\n";
                    } else {
                        output += "\t\t\tobjects[" + outputObjectIndex + "] = new Ayce.Object3D();\t// " + objects[i].ayceUI.screenName + "\n";
                    }
                    for (var property in objects[i]) {
                        if (objects[i].hasOwnProperty(property) && ((!isLight && objects[i][property] != referenceObject[property]) || (isLight && objects[i][property] != referenceLight[property]))) {
                            switch (typeof objects[i][property]) {
                                case "string":
                                    console.log(objects[i][property]);
                                    output += "\t\t\tobjects[" + outputObjectIndex + "]." + property + " = \"" + objects[i][property] + "\";\n";
                                    break;
                                case "boolean":
                                    output += "\t\t\tobjects[" + outputObjectIndex + "]." + property + " = " + objects[i][property] + ";\n";
                                    break;
                                case "object":
                                    if (Array.isArray(objects[i][property]) && property != "collideWith") {   // collideWith is handled after this loop
                                        output += "\t\t\tobjects[" + outputObjectIndex + "]." + property + " = [" + objects[i][property].toString() + "];\n";
                                    } else if (objects[i][property] == null) {
                                        output += "\t\t\tobjects[" + outputObjectIndex + "]." + property + " = " + objects[i][property] + ";\n";
                                    } else {
                                        if (property == "parentPositionWeight" || property == "parentRotationWeight" ||
                                            property == "position" ||   // properties of type Ayce.Vector3
                                            property == "scale" ||
                                            property == "velocity") {
                                            if (objects[i][property].x != referenceObject[property].x ||     // property is different from default property
                                                objects[i][property].y != referenceObject[property].y ||
                                                objects[i][property].z != referenceObject[property].z) {
                                                output += "\t\t\tobjects[" + outputObjectIndex + "]." + property + " = new Ayce.Vector3(" +
                                                    objects[i][property].x + ", " +
                                                    objects[i][property].y + ", " +
                                                    objects[i][property].z + ");\n";
                                            }
                                        } else if (property == "rotation") {    // properties of type Ayce.Quaternion
                                            if (objects[i][property].x != referenceObject[property].x ||     // property is different from default property
                                                objects[i][property].y != referenceObject[property].y ||
                                                objects[i][property].z != referenceObject[property].z ||
                                                objects[i][property].w != referenceObject[property].w) {
                                                output += "\t\t\tobjects[" + outputObjectIndex + "]." + property + " = new Ayce.Quaternion(" +
                                                    objects[i][property].x + ", " +
                                                    objects[i][property].y + ", " +
                                                    objects[i][property].z + ", " +
                                                    objects[i][property].w + ");\n";
                                            }
                                        } else if (property == "color" || property == "specularColor") {
                                            output += "\t\t\tobjects[" + outputObjectIndex + "]." + property + " = {\n" +
                                                "\t\t\t\tred: " + objects[i][property].red + ",\n" +
                                                "\t\t\t\tgreen: " + objects[i][property].green + ",\n" +
                                                "\t\t\t\tblue: " + objects[i][property].blue + "\n\t\t\t};\n";
                                        } else if (property == "ayceUI") {
                                            output += "\t\t\tobjects[" + outputObjectIndex + "]." + property + " = {\n" +
                                                "\t\t\t\tid: " + objects[i][property].id + ",\n" +
                                                "\t\t\t\tscreenName: \"" + objects[i][property].screenName + "\",\n" +
                                                "\t\t\t\trunScriptInPreview: " + objects[i][property].runScriptInPreview + "\n\t\t\t};\n";
                                        }
                                    }
                                    break;
                                case "function":
                                    if (property == "updateScript" || property == "initScript") {
                                        if (objects[i][property] != referenceObject[property]) {
                                            output += "\t\t\tobjects[" + outputObjectIndex + "]." + property + " = " + objects[i][property].toString() + ";\n";    // TODO: function to string
                                        }
                                    }
                            }
                        }
                    }
                    outputObjectIndex ++;
                }
            }
            outputObjectIndex = 0;
            for(i = 0; i < objects.length; i++){
                if(objects[i]) {
                    if (objects[i].parent != null) {
                        output += "\t\t\tobjects[" + outputObjectIndex + "].parent = objects[" + objects[i].parent.ayceUI.id + "];\n";
                    }
                    if (objects[i].collideWith != null) {
                        output += "\t\t\tobjects[" + outputObjectIndex + "].collideWith = [";
                        for (var j = 0; j < objects[i].collideWith.length; j++) {
                            output += "\t\t\tobjects[" + objects[i].collideWith[j].ayceUI.id + "], "    // TODO: this is not the correct ID because deleted objects are replaced by null. Best solution is to splice() deleted objects out of array and update ids of other objects
                        }
                        output = output.replace(/[, ]+$/, "");  // remove trailing ", "
                        output += "\t\t\t];\n";
                    }
                    outputObjectIndex ++;
                }
            }

            output += "\t\t\tfor(var i = 0; i < objects.length; i++){\n" +
                "\t\t\t\tif(objects[i] instanceof Ayce.Object3D || objects[i] instanceof Ayce.Light){\n" +
                "\t\t\t\t\tscene.addToScene(objects[i]);\n" +
                "\t\t\t\t};\n" +
                "\t\t\t};\n";      // TODO: code export of modifiers

            if(cameraPreview.renderPreview) {           // if camera was added, use its pose
                var modifiers = cameraPreview.scene.getCamera().getManager().modifiers;

                for(i = 0; i < modifiers.length; i++){
                    if(modifiers[i] instanceof Ayce.MouseKeyboard)
                        output += "\t\t\tscene.getCamera().getManager().modifiers.push(new Ayce.MouseKeyboard(document.getElementById('ayce_canvas'), document.getElementById('ayce_canvas')));\n";
                    else if(modifiers[i] instanceof Ayce.Gamepad)
                        output += "\t\t\tscene.getCamera().getManager().modifiers.push(new Ayce.Gamepad());\n";
                    else
                        output += "\t\t\tvar modifier = new Ayce.CameraModifier();\n" +         // TODO: proper support for camera parenting
                            "\t\t\tmodifier.position.x = " + modifiers[i].position.x + ";\n" +
                            "\t\t\tmodifier.position.y = " + modifiers[i].position.y + ";\n" +
                            "\t\t\tmodifier.position.z = " + modifiers[i].position.z + ";\n" +
                            "\t\t\tmodifier.orientation.x = " + modifiers[i].orientation.x + ";\n" +
                            "\t\t\tmodifier.orientation.y = " + modifiers[i].orientation.y + ";\n" +
                            "\t\t\tmodifier.orientation.z = " + modifiers[i].orientation.z + ";\n" +
                            "\t\t\tmodifier.orientation.w = " + modifiers[i].orientation.w + ";\n" +
                            "\t\t\tmodifier.updateScript = " + cameraPreview.modifier.updateScript + ";\n" +  // TODO: can modifier.update() be used for this?
                            "\t\t\tmodifier.initScript = " + cameraPreview.modifier.initScript + ";\n" +
                            "\t\t\tscene.getCamera().getManager().modifiers.push(modifier);\n" +
                            "\t\t\tmodifier.initScript();\n";
                }
            }else{
                // else use pose of editor camera
                var cameraPosition = scene.getCamera().getManager().getGlobalPosition();
                var cameraOrientation = scene.getCamera().getManager().getGlobalRotation();
                output += "\t\t\tvar modifier = new Ayce.CameraModifier();\n" +
                    "\t\t\tmodifier.position.x = " + cameraPosition.x + ";\n" +
                    "\t\t\tmodifier.position.y = " + cameraPosition.y + ";\n" +
                    "\t\t\tmodifier.position.z = " + cameraPosition.z + ";\n" +
                    "\t\t\tmodifier.orientation.x = " + cameraOrientation.x + ";\n" +
                    "\t\t\tmodifier.orientation.y = " + cameraOrientation.y + ";\n" +
                    "\t\t\tmodifier.orientation.z = " + cameraOrientation.z + ";\n" +
                    "\t\t\tmodifier.orientation.w = " + cameraOrientation.w + ";\n" +
                    "\t\t\tmodifier.updateScript = " + cameraPreview.modifier.updateScript + ";\n" +
                    "\t\t\tmodifier.initScript = " + cameraPreview.modifier.initScript + ";\n" +
                    "\t\t\tscene.getCamera().getManager().modifiers.push(modifier);\n" +
                    "\t\t\tmodifier.initScript();\n";
            }
            output += "\t\t\t// Switch to different rendering modes by un-commenting one of the following lines.\n" +
                "\t\t\t// Desktop rendering is enabled by default.\n" +
                "\t\t\t//scene.setRendererDesktop();\n" +
                "\t\t\t//scene.setRendererVR(false);\t//The argument toggles barrel distortion / chromatic abberation correction.\n" +
                "\t\t\tfor(i = 0; i < objects.length; i++)\n" +
                "\t\t\t\tobjects[i].initScript();\n" +
                "\t\t\tvar update = function(){\n" +
                "\t\t\t\tAyce.requestAnimFrame(update);\n" +
                "\t\t\t\tfor(i = 0; i < objects.length; i++)\n" +
                "\t\t\t\t\tobjects[i].updateScript();\n" +
                "\t\t\t\tmodifier.updateScript();\n" +
                "\t\t\t\tscene.updateScene();\n" +
                "\t\t\t\tscene.drawScene();\n" +
                "\t\t\t};\n" +
                "\t\t\tupdate();\n" +
                "\t\t</script>\n" +
                "\t</body>\n" +
                "</html>";

            return output;
        };
    }
}