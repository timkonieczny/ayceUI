var quaternion_to_euler = function(q){   // TODO: move to ayceVR
    var sqw = q.w*q.w;
    var sqx = q.x*q.x;
    var sqy = q.y*q.y;
    var sqz = q.z*q.z;
    var unit = sqx + sqy + sqz + sqw; // if normalised is one, otherwise is correction factor
    var test = q.x*q.y + q.z*q.w;
    if (test > 0.499*unit) { // singularity at north pole
        return [
            2 * Math.atan2(q.x,q.w),
            Math.PI/2,
            0
        ]
    }
    if (test < -0.499*unit) { // singularity at south pole
        return [
            -2 * Math.atan2(q.x,q.w)
            -Math.PI/2,
            0
        ]
    }
    return[
        Math.atan2(2*q.y*q.w-2*q.x*q.z , sqx - sqy - sqz + sqw),
        Math.asin(2*test/unit),
        Math.atan2(2*q.x*q.w-2*q.y*q.z , -sqx + sqy - sqz + sqw)
    ]
};
var canvas = document.getElementById("main_canvas");
var cursor = {
    x: 0,
    y: 0,
    down: false
};

canvas.addEventListener('mousemove', function(e) {
    cursor.x = e.offsetX / canvas.width * 2 - 1;
    cursor.y = ((canvas.height - e.offsetY) / canvas.height * 2 - 1);
}, false);

canvas.addEventListener("mousedown", function() {
    cursor.down = true;
});
canvas.addEventListener("mouseup", function() {
    cursor.down = false;
});

var scene = new Ayce.Scene(canvas);

var objects = [];
var currentObjectId;

function update() {
    if(cursor.down){
        console.log(cursor.x + " " + cursor.y);
    }
    /*var y = (Date.now() / 2000) % Math.PI * 2.0;
    cube.rotation.fromEulerAngles(0, y, 0);*/

    Ayce.requestAnimFrame(update);
    scene.updateScene();
    scene.drawScene();
}

var addClass = function(element, className){
    element.className += " "+className;
};

var removeClass = function(element, className2){
    element.className = element.className.replace(new RegExp(className2, 'g'), "");
};

var activeObject = null;

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

var i;
var addObjectButtons = document.getElementsByClassName("add_object");
for(i = 0; i < addObjectButtons.length; i++){
    addObjectButtons[i].onclick = function(){
        document.getElementById("objects_in_scene_div").style.display = "block";
        objects.push(eval(this.dataset.constructor));
        if(!eval(this.dataset.centered)) {
            objects[objects.length - 1].offset.set(
                -objects[objects.length - 1].a / 2.0,
                -objects[objects.length - 1].b / 2.0,
                -objects[objects.length - 1].c / 2.0
            );
        }
        objects[objects.length-1] = objects[objects.length-1].getO3D();
        objects[objects.length-1].position.z = -2;

        scene.addToScene(objects[objects.length-1]);
        var child = document.createElement('li');
        child.innerHTML = this.innerText;
        child.dataset.id = (objects.length-1);
        child.dataset.type = (this.dataset.type);
        child.className = "object_in_scene";
        child.onclick = showProperties;

        //var child = document.createElement('input');
        //child.dataset.id = (objects.length-1);
        //child.className = "object_in_scene";
        //child.title = this.innerText;
        //child.type = "radio";
        //child.onclick = showProperties;

        document.getElementById("objects_in_scene").appendChild(child);
    }
}

document.getElementById("add_light").onclick = function(){
    document.getElementById("objects_in_scene_div").style.display = "block";
    //document.getElementById('test').appendChild(child);
    objects.push(new Ayce.Light());
    scene.addToScene(objects[objects.length-1]);
    var child = document.createElement('li');
    child.innerHTML = "Light";
    child.dataset.id = (objects.length-1);
    child.dataset.type = (this.dataset.type);
    child.className = "object_in_scene";
    child.onclick = showProperties;
    document.getElementById("objects_in_scene").appendChild(child);
};
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

update();

document.getElementById("export_code").onclick = function(){
    var output = "";
    for(var i = 0; i < objects.length; i++){
        output+="object"+i+JSON.stringify(objects[i], null, "\t")+";\n";      // TODO: assign object name
    }
    document.getElementById("export_code_div").style.display = "block";
    document.getElementById("export_code_textarea").value = output;
    document.getElementById("export_code_close").onclick = function(){
        document.getElementById("export_code_div").style.display = "none"
    }
};