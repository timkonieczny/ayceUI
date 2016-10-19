var setRotation = function(x, y, z){
    objects[currentObjectId].rotation.fromEulerAngles(x, y, z);
    cameraPreview.objects[currentObjectId].rotation = objects[currentObjectId].rotation;
};

var setColor = function(r, g, b, a){
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

var setEventListeners = function() {
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
                setRotation(
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
                setColor(
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
        propertyInputs[i].onchange = propertyInputs[i].onwheel = function (e) {
            updateProperties(e)
        };
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
};

var uiFactory = new UIFactory();

var showProperties = function(e) {
    document.getElementById("sidebar_right").style.display = "block";
    addClass(this, "button_dark_active");
    currentObjectId = this.dataset.id;
    uiFactory.resetAttributes();
    if (e.srcElement.dataset.type == "plane"||
        e.srcElement.dataset.type == "cube"||
        e.srcElement.dataset.type == "sphere"||
        e.srcElement.dataset.type == "icosahedron"||
        e.srcElement.dataset.type == "obj"){
        uiFactory.position = true;
        uiFactory.rotation = true;
        uiFactory.scale = true;
        uiFactory.color = true;
        uiFactory.twoFaceTransparency = true;
        uiFactory.lighting = true;
        uiFactory.visibility = true;
        uiFactory.editScript = true;
    }else if(e.srcElement.dataset.type == "light"){
        uiFactory.position = true;
        uiFactory.editScript = true;
    }else if(e.srcElement.dataset.type == "camera"){
        uiFactory.camera = true;
        // TODO: assemble ui
        // TODO: add editScript
    }
    document.getElementById("properties_list").innerHTML = uiFactory.buildUI();
    setEventListeners();

    this.removeEventListener("click", showProperties);
    this.addEventListener("click", hideProperties, false);
    if(activeObject!=null && activeObject != this){
        activeObject.removeEventListener("click", hideProperties);
        activeObject.addEventListener("click", showProperties, false);
        removeClass(activeObject, "button_dark_active");
    }
    activeObject = this;

    if(uiFactory.position) {
        document.getElementById("position_x").value = objects[currentObjectId].position.x;
        document.getElementById("position_y").value = objects[currentObjectId].position.y;
        document.getElementById("position_z").value = objects[currentObjectId].position.z;
    }
    if(uiFactory.rotation) {
        var eulerAngles = quaternion_to_euler(objects[currentObjectId].rotation);
        document.getElementById("rotation_x").value = eulerAngles[0];    // TODO: quaternion to euler angle
        document.getElementById("rotation_y").value = eulerAngles[1];
        document.getElementById("rotation_z").value = eulerAngles[2];
    }
    if(uiFactory.scale) {
        document.getElementById("scale_x").value = objects[currentObjectId].scale.x;
        document.getElementById("scale_y").value = objects[currentObjectId].scale.y;
        document.getElementById("scale_z").value = objects[currentObjectId].scale.z;
    }
    if(uiFactory.color) {
        document.getElementById("colors_r").value = document.getElementById("colors_g").value = document.getElementById("colors_b").value = 0.5;
        document.getElementById("colors_a").value = 1;    // TODO: Can't use 1 here
    }
    if(uiFactory.visibility) {
        document.getElementById("visible").checked = objects[currentObjectId].visible;
    }
    if(uiFactory.lighting) {
        document.getElementById("use_fragment_lighting").checked = objects[currentObjectId].useFragmentLighting;
        document.getElementById("use_specular_lighting").checked = objects[currentObjectId].useSpecularLighting;
    }
    if(uiFactory.camera){
        document.getElementById("camera_position_x").value = cameraPreview.modifier.position.x;
        document.getElementById("camera_position_y").value = cameraPreview.modifier.position.y;
        document.getElementById("camera_position_z").value = cameraPreview.modifier.position.z;
        eulerAngles = quaternion_to_euler(cameraPreview.modifier.orientation);
        document.getElementById("camera_rotation_x").value = eulerAngles[0];
        document.getElementById("camera_rotation_y").value = eulerAngles[1];
        document.getElementById("camera_rotation_z").value = eulerAngles[2];
    }
    if(uiFactory.camera){
        document.getElementById("object_name").value = cameraPreview.screenName;
    }else{
        document.getElementById("object_name").value = objects[currentObjectId].screenName;
    }
};

var hideProperties = function(){
    document.getElementById("sidebar_right").style.display = "none";
    this.removeEventListener("click", hideProperties);
    this.addEventListener("click", showProperties, false);
    removeClass(activeObject, "button_dark_active");
};