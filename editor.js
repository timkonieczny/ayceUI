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

/*function quat_to_axis(q1) {
    if (q1.w > 1) q1.normalize(); // if w>1 acos and sqrt will produce errors, this cant happen if quaternion is normalised
    angle = 2 * Math.acos(q1.w);
    double s = Math.sqrt(1-q1.w*q1.w); // assuming quaternion normalised then w is less than 1, so term always positive.
    if (s < 0.001) { // test to avoid divide by zero, s is always positive due to sqrt
        // if s close to zero then direction of axis not important
        x = q1.x; // if it is important that axis is normalised then replace with x=1; y=z=0;
        y = q1.y;
        z = q1.z;
    } else {
        x = q1.x / s; // normalise axis
        y = q1.y / s;
        z = q1.z / s;
    }
}*/

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
//window.onscroll = function(e){
//    console.log(e);
//    console.log("bal");
//};

var propertiesUI = {
    rotation: {
        x: document.getElementById("rotation_x"),
        y: document.getElementById("rotation_y"),
        z: document.getElementById("rotation_z"),
        w: document.getElementById("rotation_w")
    },
    position: {
        x: document.getElementById("position_x"),
        y: document.getElementById("position_y"),
        z: document.getElementById("position_z")
    },
    scale: {
        x: document.getElementById("scale_x"),
        y: document.getElementById("scale_y"),
        z: document.getElementById("scale_z")
    },
    colors: {
        r: document.getElementById("colors_r"),
        g: document.getElementById("colors_g"),
        b: document.getElementById("colors_b"),
        a: document.getElementById("colors_a")
    },
    visible: document.getElementById("visible"),
    lighting: {
        fragment: document.getElementById("use_fragment_lighting"),
        specular: document.getElementById("use_specular_lighting")
    }
};

var scene = new Ayce.Scene(canvas);

var objects = [];
var lights = [];
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
    element.className =
        element.className.replace
        (className2, '');
};

var activeProperties = null;

var showProperties = function(e){           // TODO: create properties screen for lighting
    document.getElementById("sidebar_right").style.display = "block";
    addClass(this, "button_active");
    currentObjectId = this.dataset.id;
    
    this.removeEventListener("click", showProperties);
    this.addEventListener("click", hideProperties, false);
    if(activeProperties!=null && activeProperties != this){
        activeProperties.removeEventListener("click", hideProperties);
        activeProperties.addEventListener("click", showProperties, false);
        removeClass(activeProperties, "button_active");
    }
    activeProperties = this;

    propertiesUI.position.x.value = objects[currentObjectId].position.x;
    propertiesUI.position.y.value = objects[currentObjectId].position.y;
    propertiesUI.position.z.value = objects[currentObjectId].position.z;

    var eulerAngles = quaternion_to_euler(objects[currentObjectId].rotation);
    propertiesUI.rotation.x.value = eulerAngles[0];    // TODO: quaternion to euler angle
    propertiesUI.rotation.y.value = eulerAngles[1];
    propertiesUI.rotation.z.value = eulerAngles[2];

    propertiesUI.scale.x.value = objects[currentObjectId].scale.x;
    propertiesUI.scale.y.value = objects[currentObjectId].scale.y;
    propertiesUI.scale.z.value = objects[currentObjectId].scale.z;

    propertiesUI.colors.r.value = propertiesUI.colors.g.value = propertiesUI.colors.b.value = 0.5;
    propertiesUI.colors.a.value = 1;    // TODO: Can't use 1 here

    propertiesUI.visible.checked = objects[currentObjectId].visible;

    propertiesUI.lighting.fragment.checked = objects[currentObjectId].useFragmentLighting;
    propertiesUI.lighting.specular.checked = objects[currentObjectId].useSpecularLighting;
};

var hideProperties = function(){
    document.getElementById("sidebar_right").style.display = "none";
    this.removeEventListener("click", hideProperties);
    this.addEventListener("click", showProperties, false);
};

var i;
var addObjectButtons = document.getElementsByClassName("add_object");
for(i = 0; i < addObjectButtons.length; i++){
    addObjectButtons[i].onclick = function(){
        objects.push(eval(this.dataset.constructor));
        if(!eval(this.dataset.centered)) {
            objects[objects.length - 1].offset.set(-objects[objects.length - 1].a / 2.0, -objects[objects.length - 1].b / 2.0, -objects[objects.length - 1].c / 2.0);
        }
        objects[objects.length-1] = objects[objects.length-1].getO3D();
        objects[objects.length-1].position.z = -2;

        scene.addToScene(objects[objects.length-1]);
        var child = document.createElement('li');
        child.innerHTML = this.innerText;
        child.dataset.id = (objects.length-1);
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
    //document.getElementById('test').appendChild(child);
    lights.push(new Ayce.Light());
    scene.addToScene(lights[lights.length-1]);
    var child = document.createElement('li');
    child.innerHTML = "Light";
    child.dataset.id = (lights.length-1);
    child.className = "object_in_scene";
    child.onclick = showProperties;
    document.getElementById("objects_in_scene").appendChild(child);
};

var propertyInputs = document.getElementsByClassName("property_input");
for(i = 0; i < propertyInputs.length; i++){
    propertyInputs[i].onchange = function(e){

        switch(e.srcElement.id){
            case "rotation_x":
                objects[currentObjectId].rotation.fromEulerAngles(Number(e.target.value), propertiesUI.rotation.y.value, propertiesUI.rotation.z.value);
                e.target.value = Number(e.target.value);
                break;
            case "rotation_y":
                objects[currentObjectId].rotation.fromEulerAngles(propertiesUI.rotation.x.value, Number(e.target.value), propertiesUI.rotation.z.value);
                e.target.value = Number(e.target.value);
                break;
            case "rotation_z":
                objects[currentObjectId].rotation.fromEulerAngles(propertiesUI.rotation.x.value, propertiesUI.rotation.y.value, Number(e.target.value));
                e.target.value = Number(e.target.value) + 0.1;
                break;
            case "colors_r":            // TODO: color per vertex (enable edit array in textarea). Set transparency attribute from there too.
            case "colors_g":
            case "colors_b":
            case "colors_a":
                scene.removeFromScene(objects[currentObjectId]);
                objects[currentObjectId].colors = [];
                propertiesUI.colors.r.value = Math.min(propertiesUI.colors.r.value, 1);
                propertiesUI.colors.r.value = Math.max(propertiesUI.colors.r.value, 0);
                propertiesUI.colors.r.value = Math.min(propertiesUI.colors.g.value, 1);
                propertiesUI.colors.r.value = Math.max(propertiesUI.colors.g.value, 0);
                propertiesUI.colors.r.value = Math.min(propertiesUI.colors.b.value, 1);
                propertiesUI.colors.r.value = Math.max(propertiesUI.colors.b.value, 0);
                for(var i = 0; i < objects[currentObjectId].vertices.length/3; i++){
                    objects[currentObjectId].colors.push(propertiesUI.colors.r.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.g.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.b.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.a.value);
                }
                if(propertiesUI.colors.a.value < 1){
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
                switch (attribute[0]){
                    case "scale":
                        e.target.value = Number(Math.max(e.target.value, 0.00001));
                        break;
                }
                objects[currentObjectId][attribute[0]][attribute[1]] = Number(e.target.value);
        }
    };
    propertyInputs[i].onwheel = function(e){
        e.preventDefault();
        var factor = e.deltaY / 100;
        switch(e.srcElement.id){
            case "rotation_x":
                e.target.value = (Number(e.target.value) + factor * 0.1)%(2*Math.PI);
                if(Number(e.target.value) < 0) e.target.value = Number(e.target.value) + Math.PI*2;
                objects[currentObjectId].rotation.fromEulerAngles(Number(e.target.value), propertiesUI.rotation.y.value, propertiesUI.rotation.z.value);
                break;
            case "rotation_y":
                e.target.value = (Number(e.target.value) + factor * 0.1)%(2*Math.PI);
                if(Number(e.target.value) < 0) e.target.value = Number(e.target.value) + Math.PI*2;
                objects[currentObjectId].rotation.fromEulerAngles(propertiesUI.rotation.x.value, Number(e.target.value), propertiesUI.rotation.z.value);
                break;
            case "rotation_z":
                e.target.value = (Number(e.target.value) + factor * 0.1)%(2*Math.PI);
                if(Number(e.target.value) < 0) e.target.value = Number(e.target.value) + Math.PI*2;
                objects[currentObjectId].rotation.fromEulerAngles(propertiesUI.rotation.x.value, propertiesUI.rotation.y.value, Number(e.target.value));
                break;
            case "colors_r":
                scene.removeFromScene(objects[currentObjectId]);
                objects[currentObjectId].colors = [];
                e.target.value = Number(e.target.value) + factor * 0.1;
                propertiesUI.colors.r.value = Math.min(propertiesUI.colors.r.value, 1);
                propertiesUI.colors.r.value = Math.max(propertiesUI.colors.r.value, 0);
                for(var i = 0; i < objects[currentObjectId].vertices.length/3; i++){
                    objects[currentObjectId].colors.push(propertiesUI.colors.r.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.g.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.b.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.a.value);
                }
                scene.addToScene(objects[currentObjectId]);
                break;
            case "colors_g":
                scene.removeFromScene(objects[currentObjectId]);
                objects[currentObjectId].colors = [];
                e.target.value = Number(e.target.value) + factor * 0.1;
                propertiesUI.colors.g.value = Math.min(propertiesUI.colors.g.value, 1);
                propertiesUI.colors.g.value = Math.max(propertiesUI.colors.g.value, 0);
                for(var i = 0; i < objects[currentObjectId].vertices.length/3; i++){
                    objects[currentObjectId].colors.push(propertiesUI.colors.r.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.g.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.b.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.a.value);
                }
                scene.addToScene(objects[currentObjectId]);
                break;
            case "colors_b":
                scene.removeFromScene(objects[currentObjectId]);
                objects[currentObjectId].colors = [];
                e.target.value = Number(e.target.value) + factor * 0.1;
                propertiesUI.colors.b.value = Math.min(propertiesUI.colors.b.value, 1);
                propertiesUI.colors.b.value = Math.max(propertiesUI.colors.b.value, 0);
                for(var i = 0; i < objects[currentObjectId].vertices.length/3; i++){
                    objects[currentObjectId].colors.push(propertiesUI.colors.r.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.g.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.b.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.a.value);
                }
                scene.addToScene(objects[currentObjectId]);
                break;
            case "colors_a":
                scene.removeFromScene(objects[currentObjectId]);
                objects[currentObjectId].colors = [];
                e.target.value = Number(e.target.value) + factor * 0.1;
                propertiesUI.colors.a.value = Math.min(propertiesUI.colors.a.value, 1);
                propertiesUI.colors.a.value = Math.max(propertiesUI.colors.a.value, 0);
                for(var i = 0; i < objects[currentObjectId].vertices.length/3; i++){
                    objects[currentObjectId].colors.push(propertiesUI.colors.r.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.g.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.b.value);
                    objects[currentObjectId].colors.push(propertiesUI.colors.a.value);
                }
                if(propertiesUI.colors.a.value < 1){
                    objects[currentObjectId].transparent = true;
                }
                scene.addToScene(objects[currentObjectId]);
                break;
            default:
                var attribute = e.srcElement.id.split("_");
                e.target.value = Number(e.target.value) + factor * 0.1;
                switch (attribute[0]){
                    case "scale":
                        e.target.value = Math.max(e.target.value, 0.00001);
                        break;
                }
                objects[currentObjectId][attribute[0]][attribute[1]] = Number(e.target.value);
        }
    };
}

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