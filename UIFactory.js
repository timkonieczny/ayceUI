var UIFactory = function(){

    var scope = this;

    this.resetAttributes = function(){
        this.position = false;
        this.rotation = false;
        this.scale = false;
        this.color = false;
        this.lightColor = false;
        this.lightSpecularColor = false;
        this.twoFaceTransparency = false;
        this.lighting = false;
        this.visibility = false;
        this.camera = false;
        this.editScript = false;
        this.parent = false;
        this.skybox = false;
    };
    this.resetAttributes();

    this.inflatePropertiesUI = function(parent){
        var ui = "";
        if(this.parent){
            ui+='<li>Parent:<br>' +
                '<div class="property_input property_drop" id="parent_drop" title="parent">' +
                '<span class="property_drop_text">drag and drop parent object here</span>' +
                '</div>' +
                '</li>';
        }
        if(this.position){
            ui+='<li>Position:<br>' +
                '<input type="number" class="property_input" id="position_x" title="position_x"/>' +
                '<input type="number" class="property_input" id="position_y" title="position_y"/>' +
                '<input type="number" class="property_input" id="position_z" title="position_z"/>' +
                '</li>';
        }
        if(this.rotation){
            ui+='<li>Rotation:<br>' +
                '<input type="number" class="property_input" id="rotation_x" title="rotation_x"/>' +
                '<input type="number" class="property_input" id="rotation_y" title="rotation_y"/>' +
                '<input type="number" class="property_input" id="rotation_z" title="rotation_z"/>' +
                '</li>';
        }
        if(this.scale){
            ui+='<li>Scale:<br>' +
                '<input type="number" class="property_input" id="scale_x" title="scale_x"/>' +
                '<input type="number" class="property_input" id="scale_y" title="scale_y"/>' +
                '<input type="number" class="property_input" id="scale_z" title="scale_z"/>' +
                '</li>';
        }
        if(this.color){
            ui+='<li>Color:<br>' +
                '<input type="number" class="property_input" id="colors_r" title="colors_r"/>' +
                '<input type="number" class="property_input" id="colors_g" title="colors_g"/>' +
                '<input type="number" class="property_input" id="colors_b" title="colors_b"/>' +
                '<input type="number" class="property_input" id="colors_a" title="colors_a"/>' +
                '</li>';
        }
        if(this.lightColor){
            ui+='<li>Color:<br>' +
                '<input type="number" class="property_input" id="light_color_r" title="light_color_r"/>' +
                '<input type="number" class="property_input" id="light_color_g" title="light_color_g"/>' +
                '<input type="number" class="property_input" id="light_color_b" title="light_color_b"/>' +
                '</li>';
        }
        if(this.lightSpecularColor){
            ui+='<li>Specular Color:<br>' +
                '<input type="number" class="property_input" id="light_specular_color_r" title="light_specular_color_r"/>' +
                '<input type="number" class="property_input" id="light_specular_color_g" title="light_specular_color_g"/>' +
                '<input type="number" class="property_input" id="light_specular_color_b" title="light_specular_color_b"/>' +
                '</li>';
        }
        if(this.twoFaceTransparency){
            ui+='<li>Two-Face Transparency:<br>' +
                '<input type="checkbox" class="property_input" id="two_face_transparency" title="two_face_transparency"/>' +
                '</li>';
        }
        if(this.lighting){
            ui+='<li>Lighting:<br>' +
                '<input type="checkbox" class="property_input" id="use_fragment_lighting"/>' +
                '<label for="use_fragment_lighting">Fragment Lighting</label>' +
                '<input type="checkbox" class="property_input" id="use_specular_lighting" />' +
                '<label for="use_specular_lighting">Specular Lighting</label>' +
                '</li>';
        }
        if(this.lighting){
            ui+='<li>Visible:<br>' +
                '<input type="checkbox" class="property_input" id="visible" title="visible"/>' +
                '</li>';
        }
        if(this.editScript){
            ui+='<li>Scripts:<br>' +
                '<a id="edit_script" class="button_dark"><i class="fa fa-code"></i>Edit script</a>' +
                '<input type="checkbox" class="property_input" id="run_script_in_preview" />' +
                '<label for="run_script_in_preview">Run script in preview</label>' +
                '</li>';
        }
        if(this.camera){
            ui+='<li>Position:<br>' +
                '<input type="number" class="property_input" id="camera_position_x" title="camera_position_x"/>' +
                '<input type="number" class="property_input" id="camera_position_y" title="camera_position_y"/>' +
                '<input type="number" class="property_input" id="camera_position_z" title="camera_position_z"/>' +
                '</li>' +
                '<li>Rotation:<br>' +
                '<input type="number" class="property_input" id="camera_rotation_x" title="camera_rotation_x"/>' +
                '<input type="number" class="property_input" id="camera_rotation_y" title="camera_rotation_y"/>' +
                '<input type="number" class="property_input" id="camera_rotation_z" title="camera_rotation_z"/>' +
                '</li>';
        }
        if(this.skybox){
            // editScript
            // visibility

            ui+='<li>Texture Images:<br>' +
                '<div class="property_input property_drop texture_drop" id="skybox_top_texture_drop" title="top">' +
                '<span class="property_drop_text">Top<br><span class="texture_drop_hint">drag and drop texture image here</span></span>' +
                '</div>' +
                '<div class="property_input property_drop texture_drop" id="skybox_bottom_texture_drop" title="top">' +
                '<span class="property_drop_text">Bottom<br><span class="texture_drop_hint">drag and drop texture image here</span></span>' +
                '</div>' +
                '<div class="property_input property_drop texture_drop" id="skybox_left_texture_drop" title="top">' +
                '<span class="property_drop_text">Left<br><span class="texture_drop_hint">drag and drop texture image here</span></span>' +
                '</div>' +
                '<div class="property_input property_drop texture_drop" id="skybox_right_texture_drop" title="top">' +
                '<span class="property_drop_text">Right<br><span class="texture_drop_hint">drag and drop texture image here</span></span>' +
                '</div>' +
                '<div class="property_input property_drop texture_drop" id="skybox_front_texture_drop" title="top">' +
                '<span class="property_drop_text">Front<br><span class="texture_drop_hint">drag and drop texture image here</span></span>' +
                '</div>' +
                '<div class="property_input property_drop texture_drop" id="skybox_back_texture_drop" title="top">' +
                '<span class="property_drop_text">Back<br><span class="texture_drop_hint">drag and drop texture image here</span></span>' +
                '</div>' +
                '</li>';
        }

        parent.innerHTML = ui;
        setPropertyValues();
        setPropertyEventListeners();
    };

    var setObjectRotationFromEulerAngles = function(x, y, z){
        objects[currentObjectId].rotation.fromEulerAngles(x, y, z);
        cameraPreview.objects[currentObjectId].rotation = objects[currentObjectId].rotation;
    };
    var setObjectColor = function(r, g, b, a){
        scene.removeFromScene(objects[currentObjectId]);
        cameraPreview.scene.removeFromScene(cameraPreview.objects[currentObjectId]);
        objects[currentObjectId].colors = cameraPreview.objects[currentObjectId].colors = [];
        for (var i = 0; i < objects[currentObjectId].vertices.length / 3; i++) {
            objects[currentObjectId].colors.push(Number(r), Number(g), Number(b), Number(a));
            cameraPreview.objects[currentObjectId].colors.push(Number(r), Number(g), Number(b), Number(a));
        }
        if (a < 1) {
            objects[currentObjectId].transparent = cameraPreview.objects[currentObjectId].transparent = true;
        }
        scene.addToScene(objects[currentObjectId]);
        cameraPreview.scene.addToScene(cameraPreview.objects[currentObjectId], false);
    };

    var setPropertyEventListeners = function() {
        var updateProperties = function(e){
            e.preventDefault();
            var factor = e.deltaY / 100;
            switch (e.srcElement.id) {
                case "rotation_x":
                case "rotation_y":
                case "rotation_z":
                    if(e.type == "wheel"){
                        e.target.value = (Number(e.target.value) + factor * 0.1) % (2 * Math.PI);
                    }
                    if (Number(e.target.value) < 0) e.target.value = Number(e.target.value) + Math.PI * 2;
                    setObjectRotationFromEulerAngles(
                        document.getElementById("rotation_x").value,
                        document.getElementById("rotation_y").value,
                        document.getElementById("rotation_z").value
                    );
                    break;
                case "colors_r":
                case "colors_g":
                case "colors_b":
                case "colors_a":
                    var element = document.getElementById(e.srcElement.id);
                    if(e.type == "wheel") {
                        element.value = Number(element.value) + factor * 0.1;
                    }
                    element.value = Math.min(Number(element.value), 1);
                    element.value = Math.max(Number(element.value), 0);
                    setObjectColor(
                        document.getElementById("colors_r").value,
                        document.getElementById("colors_g").value,
                        document.getElementById("colors_b").value,
                        document.getElementById("colors_a").value
                    );
                    break;
                case "use_fragment_lighting":
                    if(e.type != "wheel"){
                        scene.removeFromScene(objects[currentObjectId]);
                        cameraPreview.scene.removeFromScene(cameraPreview.objects[currentObjectId]);
                        objects[currentObjectId].useFragmentLighting =
                            cameraPreview.objects[currentObjectId].useFragmentLighting = e.target.checked;
                        scene.addToScene(objects[currentObjectId]);
                        cameraPreview.scene.addToScene(cameraPreview.objects[currentObjectId], false);
                    }
                    break;
                case "use_specular_lighting":
                    if(e.type != "wheel"){
                        objects[currentObjectId].useSpecularLighting= e.target.checked;
                        cameraPreview.objects[currentObjectId].useSpecularLighting = e.target.checked;
                    }
                    break;
                case "visible":
                    if(e.type != "wheel"){
                        objects[currentObjectId].visible = e.target.checked;
                        cameraPreview.objects[currentObjectId].visible = e.target.checked;
                    }
                    break;
                case "camera_position_x":
                case "camera_position_y":
                case "camera_position_z":
                    if(e.type == "wheel") {
                        e.target.value = Number(e.target.value) + factor * 0.1;
                    }
                    cameraPreview.modifier.position.x = Number(document.getElementById("camera_position_x").value);
                    cameraPreview.modifier.position.y = Number(document.getElementById("camera_position_y").value);
                    cameraPreview.modifier.position.z = Number(document.getElementById("camera_position_z").value);
                    break;
                case "camera_rotation_x":
                case "camera_rotation_y":
                case "camera_rotation_z":
                    if(e.type == "wheel") {
                        e.target.value = Number(e.target.value) + factor * 0.1;
                    }

                    var orientation = (new Ayce.Quaternion()).fromEulerAngles(
                        document.getElementById("camera_rotation_x").value,
                        document.getElementById("camera_rotation_y").value,
                        document.getElementById("camera_rotation_z").value
                    );

                    cameraPreview.modifier.orientation.x = orientation.x;
                    cameraPreview.modifier.orientation.y = orientation.y;
                    cameraPreview.modifier.orientation.z = orientation.z;
                    cameraPreview.modifier.orientation.w = orientation.w;

                    break;
                case "light_color_r":
                case "light_color_g":
                case "light_color_b":
                    element = document.getElementById(e.srcElement.id);
                    if(e.type == "wheel") {
                        element.value = Number(element.value) + factor * 0.1;
                    }
                    element.value = Math.min(Number(element.value), 1);
                    element.value = Math.max(Number(element.value), 0);
                    objects[currentObjectId].color.red = document.getElementById("light_color_r").value;
                    objects[currentObjectId].color.green = document.getElementById("light_color_g").value;
                    objects[currentObjectId].color.blue = document.getElementById("light_color_b").value;
                    break;
                case "light_specular_color_r":
                case "light_specular_color_g":
                case "light_specular_color_b":
                    element = document.getElementById(e.srcElement.id);
                    if(e.type == "wheel") {
                        element.value = Number(element.value) + factor * 0.1;
                    }
                    element.value = Math.min(Number(element.value), 1);
                    element.value = Math.max(Number(element.value), 0);
                    objects[currentObjectId].specularColor.red = document.getElementById("light_specular_color_r").value;
                    objects[currentObjectId].specularColor.green = document.getElementById("light_specular_color_g").value;
                    objects[currentObjectId].specularColor.blue = document.getElementById("light_specular_color_b").value;
                    break;
                case "run_script_in_preview":
                    if(e.type != "wheel") {
                        objects[currentObjectId].ayceUI.runScriptInPreview = e.target.checked;
                    }
                    break;
                default:
                    var attribute = e.srcElement.id.split("_");
                    if(e.type == "wheel") {
                        e.target.value = Number(e.target.value) + factor * 0.1;
                    }
                    switch (attribute[0]) {
                        case "scale":
                            e.target.value = Math.max(e.target.value, 0.00001);
                            break;
                    }
                    objects[currentObjectId][attribute[0]][attribute[1]] =
                        cameraPreview.objects[currentObjectId][attribute[0]][attribute[1]] = Number(e.target.value);
            }
        };

        var propertyInputs = document.getElementsByClassName("property_input");
        for (var i = 0; i < propertyInputs.length; i++) {
            if(propertyInputs[i].type=="number")
                propertyInputs[i].addEventListener("wheel", function (e) {
                    updateProperties(e)
                });
            propertyInputs[i].addEventListener("change", function (e) {
                updateProperties(e)
            });
        }
        if(document.getElementById("edit_script")) {     // TODO: enable scripting with every object
            document.getElementById("edit_script").addEventListener("click", function () {
                openModal("script", currentObjectId);
            });
            document.getElementById("run_script_in_preview").addEventListener("click", function (e) {
                objects[currentObjectId].ayceUI.runScriptInPreview = e.checked;
            });
        }
        document.getElementById("object_name").addEventListener("input", function(e){
            if(currentObjectId == undefined){                           // if object is camera
                cameraPreview.ayceUI.screenName = e.srcElement.value;
                document.getElementById("camera").innerHTML = e.srcElement.value;
            }else{                                                      // if regular object
                objects[currentObjectId].ayceUI.screenName = e.srcElement.value;
                document.getElementById(currentObjectId).innerHTML = e.srcElement.value;
            }
        });
        document.getElementById("object_name").addEventListener("focusout", function(e){
            if(e.srcElement.value == ""){
                showNotification("Please enter an object name.", "fa-exclamation-circle");
                e.srcElement.focus();
            }
        });
        if(scope.parent) {
            document.getElementById("parent_drop").removeEventListener("change", updateProperties);
            document.getElementById("parent_drop").removeEventListener("wheel", updateProperties);

            document.getElementById("parent_drop").addEventListener("dragenter", function () {
                console.log("dragenter");
            });
            document.getElementById("parent_drop").addEventListener("dragover", function (e) {
                console.log("dragover");
                e.preventDefault();
                e.dataTransfer.dropEffect = 'link';
            });
            document.getElementById("parent_drop").addEventListener("dragleave", function () {
                console.log("dragleave");
            });
            document.getElementById("parent_drop").addEventListener("drop", function (e) {
                e.stopPropagation();
                console.log("drop");
                if (Number(e.dataTransfer.getData("text/html")) == currentObjectId) {
                    showNotification("Cannot make the active object the active object's parent", "fa-exclamation-circle");
                } else {
                    var parentObject = objects[Number(e.dataTransfer.getData("text/html"))];
                    this.innerHTML = "<div id='parent_dropped'>" + parentObject.ayceUI.screenName + "</div>";
                    objects[currentObjectId].parent = parentObject;
                }
                return false;
            });
        }
        if(scope.skybox){
            var textureDrops = document.getElementsByClassName("texture_drop");
            var frontTexture = null;
            var backTexture = null;
            var topTexture = null;
            var bottomTexture = null;
            var leftTexture = null;
            var rightTexture = null;
            for(i = 0; i < textureDrops.length; i++){
                var element = textureDrops[i];
                textureDrops[i].removeEventListener("change", updateProperties);
                textureDrops[i].removeEventListener("wheel", updateProperties);

                textureDrops[i].addEventListener("dragenter", function () {
                    console.log("texture dragenter");
                });
                textureDrops[i].addEventListener("dragover", function (e) {
                    console.log("texture dragover");
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'link';
                });
                textureDrops[i].addEventListener("dragleave", function () {
                    console.log("texture dragleave");
                });
                textureDrops[i].addEventListener("drop", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log("texture drop");
                    var file = e.dataTransfer.files[0];

                    if(/(?:\.([^.]+))?$/.exec(file.name)[1] == "png" ||
                        /(?:\.([^.]+))?$/.exec(file.name)[1] == "jpg" ||
                        /(?:\.([^.]+))?$/.exec(file.name)[1] == "jpeg" ) {          // check if correct file was dropped

                        var reader  = new FileReader();

                        var textureDrop = this;
                        reader.addEventListener("load", function () {
                            textureDrop.style.background = "url(" + reader.result + ")";
                            textureDrop.style.backgroundSize = "cover";
                            switch (textureDrop.id){
                                case "skybox_top_texture_drop":
                                    topTexture = reader.result;
                                    break;
                                case "skybox_bottom_texture_drop":
                                    bottomTexture = reader.result;
                                    break;
                                case "skybox_front_texture_drop":
                                    frontTexture = reader.result;
                                    break;
                                case "skybox_back_texture_drop":
                                    backTexture = reader.result;
                                    break;
                                case "skybox_left_texture_drop":
                                    leftTexture = reader.result;
                                    break;
                                case "skybox_right_texture_drop":
                                    rightTexture = reader.result;
                                    break;
                            }

                            if(frontTexture&&backTexture&&topTexture&&bottomTexture&&leftTexture&&rightTexture){
                                objects.push(new Ayce.Skybox(
                                    frontTexture, backTexture, topTexture,
                                    bottomTexture, leftTexture, rightTexture,
                                    "", scene.getCamera().getManager(), scene.getCamera().farPlane
                                ));
                                cameraPreview.objects.push(new Ayce.Skybox(
                                    frontTexture, backTexture, topTexture,
                                    bottomTexture, leftTexture, rightTexture,
                                    "", scene.getCamera().getManager(), scene.getCamera().farPlane
                                ));
                                objects[objects.length-1].ayceUI = {
                                    id: objects.length-1,
                                    screenName: "skybox",
                                    runScriptInPreview: false
                                };
                                cameraPreview.objects[objects.length-1].ayceUI = {runScriptInPreview: false};
                                scene.addToScene(objects[objects.length-1]);
                                cameraPreview.scene.addToScene(objects[objects.length-1]);
                            }
                        }, false);

                        reader.readAsDataURL(file);
                    }else{
                        showNotification("Please provide a valid image file.", "fa-exclamation-circle");
                    }
                });
            }
        }
    };
    var setPropertyValues = function() {
        if (uiFactory.parent) {
            scope.updateParentField();
        }
        if (uiFactory.position) {
            document.getElementById("position_x").value = objects[currentObjectId].position.x;
            document.getElementById("position_y").value = objects[currentObjectId].position.y;
            document.getElementById("position_z").value = objects[currentObjectId].position.z;
        }
        if (uiFactory.rotation) {
            var eulerAngles = quaternion_to_euler(objects[currentObjectId].rotation);
            document.getElementById("rotation_x").value = eulerAngles[0];
            document.getElementById("rotation_y").value = eulerAngles[1];
            document.getElementById("rotation_z").value = eulerAngles[2];
        }
        if (uiFactory.scale) {
            document.getElementById("scale_x").value = objects[currentObjectId].scale.x;
            document.getElementById("scale_y").value = objects[currentObjectId].scale.y;
            document.getElementById("scale_z").value = objects[currentObjectId].scale.z;
        }
        if (uiFactory.color) {
            document.getElementById("colors_r").value = document.getElementById("colors_g").value = document.getElementById("colors_b").value = 0.5;
            document.getElementById("colors_a").value = 1;
        }
        if (uiFactory.lightColor) {
            document.getElementById("light_color_r").value = document.getElementById("light_color_g").value = document.getElementById("light_color_b").value = 1.0;
        }
        if(uiFactory.lightSpecularColor){
            document.getElementById("light_specular_color_r").value = document.getElementById("light_specular_color_g").value = document.getElementById("light_specular_color_b").value = 1.0;
        }
        if (uiFactory.visibility) {
            document.getElementById("visible").checked = objects[currentObjectId].visible;
        }
        if (uiFactory.lighting) {
            document.getElementById("use_fragment_lighting").checked = objects[currentObjectId].useFragmentLighting;
            document.getElementById("use_specular_lighting").checked = objects[currentObjectId].useSpecularLighting;
        }
        if (uiFactory.camera) {
            document.getElementById("camera_position_x").value = cameraPreview.modifier.position.x;
            document.getElementById("camera_position_y").value = cameraPreview.modifier.position.y;
            document.getElementById("camera_position_z").value = cameraPreview.modifier.position.z;

            eulerAngles = quaternion_to_euler(cameraPreview.modifier.orientation);
            document.getElementById("camera_rotation_x").value = eulerAngles[0];
            document.getElementById("camera_rotation_y").value = eulerAngles[1];
            document.getElementById("camera_rotation_z").value = eulerAngles[2];
        }
        if (uiFactory.camera) {
            document.getElementById("object_name").value = cameraPreview.ayceUI.screenName;
        } else if(uiFactory.skybox){
            document.getElementById("object_name").value = "skybox";
        } else {
            document.getElementById("object_name").value = objects[currentObjectId].ayceUI.screenName;
        }
    };
    this.updateParentField = function(){
        if(objects[currentObjectId].parent)
            document.getElementById("parent_drop").innerHTML = "<div id='parent_dropped'>"+objects[currentObjectId].parent.ayceUI.screenName+"</div>";
    }
};