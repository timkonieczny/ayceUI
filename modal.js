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
    }else if(type == "csv"){
        document.getElementById("modal").style.display = "block";
        document.getElementById("csv_upload_wrapper").style.display = "block";
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
    document.getElementById("csv_upload_wrapper").style.display = "none";
    document.getElementById("csv_drop_loading").style.display = "none";
    objString = null;
    mtlString = null;
};

var buildCodeString = function(){
    var output = 'var scene = new Ayce.Scene(document.getElementById("ayce_canvas"));\n' +
        "var objects = [\n";
    for(var i=0; i<objects.length; i++){
        var objectString = JSON.stringify(objects[i], null, "\t")+",";
        objectString = formatJSONProperty(objectString, "vertices");
        objectString = formatJSONProperty(objectString, "colors");
        objectString = formatJSONProperty(objectString, "normals");
        objectString = formatJSONProperty(objectString, "indices");
        objectString = formatJSONProperty(objectString, "textureCoords");
        objectString = formatJSONProperty(objectString, "textureIndices");
        objectString = objectString.replace(/(\n)/g, "\n\t");
        output += "\t"+objectString+"\n";
    }
    output += "\n];\n" +
        "for(var i = 0; i < objects.length; i++){\n" +
        "\tscene.addToScene(objects[i]);\n" +
        "};\n" +
        "var update = function(){\n" +
        "\tAyce.requestAnimFrame(update);\n" +
        "\tscene.updateScene();\n" +
        "\tscene.drawScene();\n" +
        "};\n" +
        "update();";
    return output;
};

var formatJSONProperty = function(JSONString, propertyName){
    // /("propertyName": \[[^\]]*)/
    var substrings = JSONString.match(new RegExp('("'+propertyName+'": \\[[^\\]]*)'));
    if(substrings){
        return JSONString.replace(substrings[0], substrings[0].replace(/(\t)+/g, " ").replace(/\n/g, ""));  // replace \t and \n and reinsert substring
    }else{
        return JSONString;
    }
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

        objects[objects.length - 1].screenName = "imported object";

        scene.addToScene(objects[objects.length - 1]);
        cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length - 1]);
        console.log("done");

        var child = appendObjectInSceneChildElement("obj");
        closeModal();
        child.onclick({srcElement: {dataset: {type: "obj"}}});
    }else{
        showNotification("At least one of the provided files is invalid. The object wasn't created.", "fa-exclamation-circle");
        closeModal();
        openModal("obj");
    }
};

document.getElementById("csv_drop").addEventListener("dragover", function(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}, false);

var csvTimer;

document.getElementById("csv_drop").addEventListener("drop", function(e){
    e.stopPropagation();
    e.preventDefault();

    var file = e.dataTransfer.files[0];

    if(/(?:\.([^.]+))?$/.exec(file.name)[1] == "csv") {          // check if correct file was dropped in correct field

        document.getElementById("csv_drop").style.display = "none";
        document.getElementById("csv_drop_loading").style.display = "flex";

        csvTimer = Date.now();
        console.log("reading file");
        var reader = new FileReader();
        reader.onload = function (e) {
            console.log("done (" + (Date.now()-csvTimer) + "ms)");
            handleCSV(e);
            document.getElementById("csv_drop_loading").style.display = "none";
            closeModal();
        };
        reader.readAsText(file);
    }else{
        showNotification("Please provide a valid .csv file.", "fa-exclamation-circle");
    }
}, false);

var handleCSV = function(e){
    var data = [];
    var csv = e.currentTarget.result;
    csv = csv.replace(/^\s+|\s+$/g, "");    // remove \n from start and end of string
    csv = csv.replace("trID,trN,pIdx,X,Y,time,SPEED,COURSE,SPEED_C,ACCELERATION_C,COURSE_C,TURN_C\n", "");
    csv = csv.split("\n");
    var point;
    var prevTrID = null;
    var j = -1;

    var maxSpeed = 0;

    csvTimer = Date.now();
    console.log("extracting data");
    for(var i = 0; i < csv.length; i++){
        point = csv[i].split(",");

        var trID = point[0]!="" ? Number(point[0]) : null;
        if(trID != prevTrID){
            data.push([]);
            j++;
        }
        prevTrID = trID;

        data[j].push({
           trID: point[0]!="" ? Number(point[0]) : null,
           trN: point[1]!="" ? Number(point[1]) : null,
           pIdx: point[2]!="" ? Number(point[2]) : null,
           x: point[3]!="" ? Number(point[3]) : null,
           y: point[4]!="" ? Number(point[4]) : null,
           time: point[5],
           speed: point[6]!="" ? Number(point[6]) : null,
           course: point[7]!="" ? Number(point[7]) : null,
           speedC: point[8]!="" ? Number(point[8]) : null,
           accelerationC: point[9]!="" ? Number(point[9]) : null,
           courseC: point[10]!="" ? Number(point[10]) : null,
           turnC: point[11]!="" ? Number(point[11]) : null
        });
        if(data[j][data[j].length-1].speed!=null) maxSpeed = Math.max(maxSpeed, data[j][data[j].length-1].speed);
    }

    console.log("done (" + (Date.now()-csvTimer) + "ms)");

    var csvObjects = [];
    var factor = 10;
    var subtractX = 7;  // TODO: calculate dynamically based on statistic of whole data set
    var subtractY = 50;
    var offsetX = -2;
    var offsetY = -6.5;
    var yHeight = 0.02;

    csvTimer = Date.now();
    console.log("building Ayce.Object3Ds");

    for(i = 0; i < data.length; i++){
        var object = new Ayce.Object3D();
        object.vertices = [];
        object.indices = [];
        object.colors = [];
        //for(j = 0; j < data[i].length-1; j++) {
        for(j = 0; j < data[i].length; j++) {
            object.vertices.push(
                factor*(data[i][j].x-subtractX)+offsetX,        i*yHeight,        factor*(data[i][j].y-subtractY)+offsetY,    // foreign front bottom
                factor*(data[i][j].x-subtractX)+offsetX,        i*yHeight+yHeight,  factor*(data[i][j].y-subtractY)+offsetY,    // foreign front top
                factor*(data[i][j].x-subtractX)+offsetX,        i*yHeight,        factor*(data[i][j].y-subtractY)+offsetY,    // foreign back bottom
                factor*(data[i][j].x-subtractX)+offsetX,        i*yHeight+yHeight,  factor*(data[i][j].y-subtractY)+offsetY,    // foreign back top
                factor*(data[i][j].x-subtractX)+offsetX,        i*yHeight,        factor*(data[i][j].y-subtractY)+offsetY,    // front bottom
                factor*(data[i][j].x-subtractX)+offsetX,        i*yHeight+yHeight,  factor*(data[i][j].y-subtractY)+offsetY,    // front top
                factor*(data[i][j].x-subtractX)+offsetX,        i*yHeight,        factor*(data[i][j].y-subtractY)+offsetY,    // back bottom
                factor*(data[i][j].x-subtractX)+offsetX,        i*yHeight+yHeight,  factor*(data[i][j].y-subtractY)+offsetY     // back top
            );
            object.colors.push(
                data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0
            );

            /*object.colors.push(
                0.5, 0.5, 0.5, 1.0,
                0.5, 0.5, 0.5, 1.0,
                0.5, 0.5, 0.5, 1.0,
                0.5, 0.5, 0.5, 1.0,
                0.5, 0.5, 0.5, 1.0,
                0.5, 0.5, 0.5, 1.0,
                0.5, 0.5, 0.5, 1.0,
                0.5, 0.5, 0.5, 1.0
            );*/

            var numberOfVertices = data[i].length*8;

            object.indices.push(
                (j*8+4)%numberOfVertices, (j*8+5)%numberOfVertices, (j*8+9)%numberOfVertices,   // front 1
                (j*8+4)%numberOfVertices, (j*8+9)%numberOfVertices, (j*8+8)%numberOfVertices,   // front 2
                (j*8+11)%numberOfVertices, (j*8+7)%numberOfVertices, (j*8+6)%numberOfVertices,  // back 1
                (j*8+10)%numberOfVertices, (j*8+11)%numberOfVertices, (j*8+6)%numberOfVertices  // back 2
            );
        }

        object.normals = [];

        for(j = 0; j < object.indices.length; j+=12){

            // get vertex coordinates
            var x1 = object.vertices[object.indices[j]*3];
            var y1 = object.vertices[object.indices[j]*3+1];
            var z1 = object.vertices[object.indices[j]*3+2];

            var x2 = object.vertices[object.indices[j+1]*3];
            var y2 = object.vertices[object.indices[j+1]*3+1];
            var z2 = object.vertices[object.indices[j+1]*3+2];

            var x3 = object.vertices[object.indices[j+2]*3];
            var y3 = object.vertices[object.indices[j+2]*3+1];
            var z3 = object.vertices[object.indices[j+2]*3+2];

            // calculate normal vector
            var nx = (y2 - y1)*(z3 - z1) - (z2 - z1)*(y3 - y1);
            var ny = (z2 - z1)*(x3 - x1) - (x2 - x1)*(z3 - z1);
            var nz = (x2 - x1)*(y3 - y1) - (y2 - y1)*(x3 - x1);
            var vectorLength = Math.sqrt(nx*nx+ny*ny+nz*nz);
            // normalize normal vector
            nx /= vectorLength;
            ny /= vectorLength;
            nz /= vectorLength;

            for(var k = j; k < j+6; k++){   // set normals for front
                object.normals[object.indices[k]*3] = nx;
                object.normals[object.indices[k]*3+1] = ny;
                object.normals[object.indices[k]*3+2] = nz;
            }
            for(k = j+6; k < j+12; k++){    // set normals for back
                object.normals[object.indices[k]*3] = -nx;
                object.normals[object.indices[k]*3+1] = -ny;
                object.normals[object.indices[k]*3+2] = -nz;
            }
        }
        csvObjects.push(object);
    }

    var csvObjects2 = [];

    for(i = 0; i < csvObjects.length; i++) {
        csvObjects2[i] = cloneO3D(csvObjects[i]);
    }

    for(i = 0; i < csvObjects.length; i++){
        objects.push(csvObjects[i]);
        cameraPreview.objects.push(csvObjects2[i]);
        objects[objects.length - 1].position.z = -2;
        cameraPreview.objects[cameraPreview.objects.length - 1].position.z = -2;
        objects[objects.length - 1].screenName = "imported object (csv)";
        objects[objects.length-1].script = function(){};
        cameraPreview.objects[objects.length-1].script = function(){};
        objects[objects.length-1].runScriptInPreview = false;
        scene.addToScene(objects[objects.length - 1]);
        cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1]);
        var child = appendObjectInSceneChildElement("csv");
        showProperties(child);
    }

    console.log("done (" + (Date.now()-csvTimer) + "ms)");
};