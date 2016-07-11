var setEventListeners = function() {
    var propertyInputs = document.getElementsByClassName("property_input");
    for (i = 0; i < propertyInputs.length; i++) {
        propertyInputs[i].onchange = function (e) {

            switch (e.srcElement.id) {
                case "rotation_x":
                    objects[currentObjectId].rotation.fromEulerAngles(
                        Number(e.target.value),
                        document.getElementById("rotation_y").value,
                        document.getElementById("rotation_z").value
                    );
                    e.target.value = Number(e.target.value);
                    break;
                case "rotation_y":
                    objects[currentObjectId].rotation.fromEulerAngles(
                        document.getElementById("rotation_x").value,
                        Number(e.target.value),
                        document.getElementById("rotation_z").value
                    );
                    e.target.value = Number(e.target.value);
                    break;
                case "rotation_z":
                    objects[currentObjectId].rotation.fromEulerAngles(
                        document.getElementById("rotation_x").value,
                        document.getElementById("rotation_y").value,
                        Number(e.target.value)
                    );
                    e.target.value = Number(e.target.value) + 0.1;
                    break;
                case "colors_r":            // TODO: color per vertex (enable edit array in textarea). Set transparency attribute from there too.
                case "colors_g":
                case "colors_b":
                case "colors_a":
                    scene.removeFromScene(objects[currentObjectId]);
                    objects[currentObjectId].colors = [];
                    document.getElementById("colors_r").value = Math.min(Number(document.getElementById("colors_r").value), 1);
                    document.getElementById("colors_r").value = Math.max(Number(document.getElementById("colors_r").value), 0);
                    document.getElementById("colors_g").value = Math.min(Number(document.getElementById("colors_g").value), 1);
                    document.getElementById("colors_g").value = Math.max(Number(document.getElementById("colors_g").value), 0);
                    document.getElementById("colors_b").value = Math.min(Number(document.getElementById("colors_b").value), 1);
                    document.getElementById("colors_b").value = Math.max(Number(document.getElementById("colors_b").value), 0);
                    document.getElementById("colors_a").value = Math.min(Number(document.getElementById("colors_a").value), 1);
                    document.getElementById("colors_a").value = Math.max(Number(document.getElementById("colors_a").value), 0);
                    for (var i = 0; i < objects[currentObjectId].vertices.length / 3; i++) {
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_r").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_g").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_b").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_a").value));
                    }
                    if (document.getElementById("colors_a").value < 1) {
                        objects[currentObjectId].transparent = true;
                    }
                    scene.addToScene(objects[currentObjectId]);
                    break;
                case "visible":
                    objects[currentObjectId].visible = e.target.checked;
                    break;
                case "use_fragment_lighting":
                    scene.removeFromScene(objects[currentObjectId]);
                    objects[currentObjectId].useFragmentLighting = e.target.checked;
                    scene.addToScene(objects[currentObjectId]);
                    break;
                case "use_specular_lighting":
                    scene.removeFromScene(objects[currentObjectId]);
                    objects[currentObjectId].useSpecularLighting = e.target.checked;
                    scene.addToScene(objects[currentObjectId]);
                    break;
                default:
                    var attribute = e.srcElement.id.split("_");
                    switch (attribute[0]) {
                        case "scale":
                            e.target.value = Number(Math.max(e.target.value, 0.00001));
                            break;
                    }
                    objects[currentObjectId][attribute[0]][attribute[1]] = Number(e.target.value);
            }
        };
        propertyInputs[i].onwheel = function (e) {
            e.preventDefault();
            var factor = e.deltaY / 100;
            var i;
            switch (e.srcElement.id) {
                case "rotation_x":
                    e.target.value = (Number(e.target.value) + factor * 0.1) % (2 * Math.PI);
                    if (Number(e.target.value) < 0) e.target.value = Number(e.target.value) + Math.PI * 2;
                    objects[currentObjectId].rotation.fromEulerAngles(
                        Number(e.target.value),
                        document.getElementById("rotation_y").value,
                        document.getElementById("rotation_z").value
                    );
                    break;
                case "rotation_y":
                    e.target.value = (Number(e.target.value) + factor * 0.1) % (2 * Math.PI);
                    if (Number(e.target.value) < 0) e.target.value = Number(e.target.value) + Math.PI * 2;
                    objects[currentObjectId].rotation.fromEulerAngles(
                        document.getElementById("rotation_x").value,
                        Number(e.target.value),
                        document.getElementById("rotation_z").value
                    );
                    break;
                case "rotation_z":
                    e.target.value = (Number(e.target.value) + factor * 0.1) % (2 * Math.PI);
                    if (Number(e.target.value) < 0) e.target.value = Number(e.target.value) + Math.PI * 2;
                    objects[currentObjectId].rotation.fromEulerAngles(
                        document.getElementById("rotation_x").value,
                        document.getElementById("rotation_y").value,
                        Number(e.target.value)
                    );
                    break;
                case "colors_r":
                    scene.removeFromScene(objects[currentObjectId]);
                    objects[currentObjectId].colors = [];
                    e.target.value = Number(e.target.value) + factor * 0.1;
                    document.getElementById("colors_r").value = Math.min(Number(document.getElementById("colors_r").value), 1);
                    document.getElementById("colors_r").value = Math.max(Number(document.getElementById("colors_r").value), 0);
                    for (i = 0; i < objects[currentObjectId].vertices.length / 3; i++) {
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_r").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_g").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_b").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_a").value));
                    }
                    scene.addToScene(objects[currentObjectId]);
                    break;
                case "colors_g":
                    scene.removeFromScene(objects[currentObjectId]);
                    objects[currentObjectId].colors = [];
                    e.target.value = Number(e.target.value) + factor * 0.1;
                    document.getElementById("colors_g").value = Math.min(Number(document.getElementById("colors_g").value), 1);
                    document.getElementById("colors_g").value = Math.max(Number(document.getElementById("colors_g").value), 0);
                    for (i = 0; i < objects[currentObjectId].vertices.length / 3; i++) {
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_r").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_g").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_b").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_a").value));
                    }
                    scene.addToScene(objects[currentObjectId]);
                    break;
                case "colors_b":
                    scene.removeFromScene(objects[currentObjectId]);
                    objects[currentObjectId].colors = [];
                    e.target.value = Number(e.target.value) + factor * 0.1;
                    document.getElementById("colors_b").value = Math.min(Number(document.getElementById("colors_b").value), 1);
                    document.getElementById("colors_b").value = Math.max(Number(document.getElementById("colors_b").value), 0);
                    for (i = 0; i < objects[currentObjectId].vertices.length / 3; i++) {
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_r").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_g").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_b").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_a").value));
                    }
                    scene.addToScene(objects[currentObjectId]);
                    break;
                case "colors_a":
                    scene.removeFromScene(objects[currentObjectId]);
                    objects[currentObjectId].colors = [];
                    e.target.value = Number(e.target.value) + factor * 0.1;
                    document.getElementById("colors_a").value = Math.min(Number(document.getElementById("colors_a").value), 1);
                    document.getElementById("colors_a").value = Math.max(Number(document.getElementById("colors_a").value), 0);
                    for (i = 0; i < objects[currentObjectId].vertices.length / 3; i++) {
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_r").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_g").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_b").value));
                        objects[currentObjectId].colors.push(Number(document.getElementById("colors_a").value));
                    }
                    if (document.getElementById("colors_a").value < 1) {
                        objects[currentObjectId].transparent = true;
                    }
                    scene.addToScene(objects[currentObjectId]);
                    break;
                default:
                    var attribute = e.srcElement.id.split("_");
                    e.target.value = Number(e.target.value) + factor * 0.1;
                    switch (attribute[0]) {
                        case "scale":
                            e.target.value = Math.max(e.target.value, 0.00001);
                            break;
                    }
                    objects[currentObjectId][attribute[0]][attribute[1]] = Number(e.target.value);
            }
        };
    }
};

var uiFactory = new UIFactory();

var showProperties = function(e) {
    document.getElementById("sidebar_right").style.display = "block";
    addClass(this, "button_active");
    currentObjectId = this.dataset.id;
    uiFactory.resetAttributes();
    if (e.srcElement.dataset.type == "plane"||
        e.srcElement.dataset.type == "cube"||
        e.srcElement.dataset.type == "sphere"||
        e.srcElement.dataset.type == "icosahedron"){
        uiFactory.position = true;
        uiFactory.rotation = true;
        uiFactory.scale = true;
        uiFactory.color = true;
        uiFactory.twoFaceTransparency = true;
        uiFactory.lighting = true;
        uiFactory.visibility = true;
    }else if(e.srcElement.dataset.type == "light"){
        uiFactory.position = true;
    }
    document.getElementById("properties_list").innerHTML = uiFactory.buildUI();
    setEventListeners();

    this.removeEventListener("click", showProperties);
    this.addEventListener("click", hideProperties, false);
    if(activeObject!=null && activeObject != this){
        activeObject.removeEventListener("click", hideProperties);
        activeObject.addEventListener("click", showProperties, false);
        removeClass(activeObject, "button_active");
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
};

var hideProperties = function(){
    document.getElementById("sidebar_right").style.display = "none";
    this.removeEventListener("click", hideProperties);
    this.addEventListener("click", showProperties, false);
    removeClass(activeObject, "button_active");
};