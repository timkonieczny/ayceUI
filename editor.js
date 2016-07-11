var canvas = document.getElementById("main_canvas");

/* Code for direct object modification
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
*/

var scene = new Ayce.Scene(canvas);
var basePlane = (new Ayce.Geometry.Plane(10, 10, 2, 2, false)).getO3D();
basePlane.position.x = -2.5;
basePlane.position.y = -0.5;    // TODO: move camera up instead
basePlane.rotation.fromEulerAngles(Math.PI/2, 0, 0);
basePlane.textureCoords = [
     0, 0,
     0,10,
    10, 0,
    10,10
];
basePlane.transparent = true;
basePlane.colors = null;
basePlane.imageSrc = "grid.png";
scene.addToScene(basePlane);

var objects = [];
var currentObjectId;
var activeObject = null;

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

        document.getElementById("objects_in_scene").appendChild(child);
    }
}

document.getElementById("add_light").onclick = function(){
    document.getElementById("objects_in_scene_div").style.display = "block";
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

function update() {
    /*if(cursor.down){
        console.log(cursor.x + " " + cursor.y);
    }*/

    Ayce.requestAnimFrame(update);
    scene.updateScene();
    scene.drawScene();
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