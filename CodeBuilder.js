CodeBuilder = function(){

    var referenceObject = new Ayce.Object3D();
    var referenceLight = new Ayce.Light();

    this.getCode = function(){
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
    }
};