var UIFactory = function(){

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
    };
    this.resetAttributes();

    this.inflatePropertiesUI = function(parent){
        var ui = "";
        if(this.parent){
            ui+='<li>Parent:<br>' +
                '<div class="property_input property_drop" id="parent_drop" title="parent">' +
                'drop parent object here' +
                '</div>' +
                '</li>';
        }
        if(this.position){
            ui+='<li>Position:<br>' +
                '<input class="property_input" id="position_x" title="position_x"/>' +
                '<input class="property_input" id="position_y" title="position_y"/>' +
                '<input class="property_input" id="position_z" title="position_z"/>' +
                '</li>';
        }
        if(this.rotation){
            ui+='<li>Rotation:<br>' +
                '<input class="property_input" id="rotation_x" title="rotation_x"/>' +
                '<input class="property_input" id="rotation_y" title="rotation_y"/>' +
                '<input class="property_input" id="rotation_z" title="rotation_z"/>' +
                '</li>';
        }
        if(this.scale){
            ui+='<li>Scale:<br>' +
                '<input class="property_input" id="scale_x" title="scale_x"/>' +
                '<input class="property_input" id="scale_y" title="scale_y"/>' +
                '<input class="property_input" id="scale_z" title="scale_z"/>' +
                '</li>';
        }
        if(this.color){
            ui+='<li>Color:<br>' +
                '<input class="property_input" id="colors_r" title="colors_r"/>' +
                '<input class="property_input" id="colors_g" title="colors_g"/>' +
                '<input class="property_input" id="colors_b" title="colors_b"/>' +
                '<input class="property_input" id="colors_a" title="colors_a"/>' +
                '</li>';
        }
        if(this.lightColor){
            ui+='<li>Color:<br>' +
                '<input class="property_input" id="light_color_r" title="light_color_r"/>' +
                '<input class="property_input" id="light_color_g" title="light_color_g"/>' +
                '<input class="property_input" id="light_color_b" title="light_color_b"/>' +
                '</li>';
        }
        if(this.lightSpecularColor){
            ui+='<li>Specular Color:<br>' +
                '<input class="property_input" id="light_specular_color_r" title="light_specular_color_r"/>' +
                '<input class="property_input" id="light_specular_color_g" title="light_specular_color_g"/>' +
                '<input class="property_input" id="light_specular_color_b" title="light_specular_color_b"/>' +
                '</li>';
        }
        if(this.twoFaceTransparency){
            ui+='<li>Two-Face Transparency:<br>' +
                '<input class="property_input" id="two_face_transparency" type="checkbox" title="two_face_transparency"/>' +
                '</li>';
        }
        if(this.lighting){
            ui+='<li>Lighting:<br>' +
                '<input class="property_input" id="use_fragment_lighting" type="checkbox"/>' +
                '<label for="use_fragment_lighting">Fragment Lighting</label>' +
                '<input class="property_input" id="use_specular_lighting" type="checkbox"/>' +
                '<label for="use_specular_lighting">Specular Lighting</label>' +
                '</li>';
        }
        if(this.lighting){
            ui+='<li>Visible:<br>' +
                '<input class="property_input" id="visible" type="checkbox" title="visible"/>' +
                '</li>';
        }
        if(this.editScript){
            ui+='<li>Scripts:<br>' +
                '<a id="edit_script" class="button_dark"><i class="fa fa-code"></i>Edit script</a>' +
                '<input class="property_input" id="run_script_in_preview" type="checkbox"/>' +
                '<label for="run_script_in_preview">Run script in preview</label>' +
                '</li>';
        }
        if(this.camera){
            ui+='<li>Position:<br>' +
                '<input class="property_input" id="camera_position_x" title="camera_position_x"/>' +
                '<input class="property_input" id="camera_position_y" title="camera_position_y"/>' +
                '<input class="property_input" id="camera_position_z" title="camera_position_z"/>' +
                '</li>' +
                '<li>Rotation:<br>' +
                '<input class="property_input" id="camera_rotation_x" title="camera_rotation_x"/>' +
                '<input class="property_input" id="camera_rotation_y" title="camera_rotation_y"/>' +
                '<input class="property_input" id="camera_rotation_z" title="camera_rotation_z"/>' +
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
        cameraPreview.scene.addToScene(cameraPreview.objects[currentObjectId]);
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
                        cameraPreview.scene.addToScene(cameraPreview.objects[currentObjectId]);
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
                        objects[currentObjectId].runScriptInPreview = e.target.checked;
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
                objects[currentObjectId].runScriptInPreview = e.checked;
            });
        }
        document.getElementById("object_name").addEventListener("input", function(e){
            if(currentObjectId == undefined){                           // if object is camera
                cameraPreview.screenName = e.srcElement.value;
                document.getElementById("camera").innerHTML = e.srcElement.value;
            }else{                                                      // if regular object
                objects[currentObjectId].screenName = e.srcElement.value;
                document.getElementById(currentObjectId).innerHTML = e.srcElement.value;
            }
        });
        document.getElementById("object_name").addEventListener("focusout", function(e){
            if(e.srcElement.value == ""){
                showNotification("Please enter an object name.", "fa-exclamation-circle");
                e.srcElement.focus();
            }
        });
        document.getElementById("parent_drop").removeEventListener("change", updateProperties);
        document.getElementById("parent_drop").removeEventListener("wheel", updateProperties);

        document.getElementById("parent_drop").addEventListener("dragenter", function(e){
            console.log("dragenter");
        });
        document.getElementById("parent_drop").addEventListener("dragover", function(e){
            console.log("dragover");
            e.preventDefault();
            e.dataTransfer.dropEffect = 'link';
        });
        document.getElementById("parent_drop").addEventListener("dragleave", function(e){
            console.log("dragleave");
        });
        document.getElementById("parent_drop").addEventListener("drop", function(e){
            e.stopPropagation();
            console.log("drop");
            if(Number(e.dataTransfer.getData("text/html")) == currentObjectId){
                showNotification("Cannot make the active object the active object's parent", "fa-exclamation-circle");
            }else{
                var parentObject = objects[Number(e.dataTransfer.getData("text/html"))];
                this.innerHTML = parentObject.screenName;
                objects[currentObjectId].parent = parentObject;
            }
            return false;
        });
    };
    var setPropertyValues = function() {
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
            document.getElementById("object_name").value = cameraPreview.screenName;
        } else {
            document.getElementById("object_name").value = objects[currentObjectId].screenName;
        }
    };
};