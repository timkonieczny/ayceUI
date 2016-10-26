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

document.getElementById("csv_drop").addEventListener("drop", function(e){
    e.stopPropagation();
    e.preventDefault();

    var file = e.dataTransfer.files[0];

    if(/(?:\.([^.]+))?$/.exec(file.name)[1] == "csv") {          // check if correct file was dropped in correct field

        document.getElementById("csv_drop").style.display = "none";
        document.getElementById("csv_drop_loading").style.display = "flex";

        var reader = new FileReader();
        reader.onload = function (e) {
            handleCSV(e);
            document.getElementById("csv_drop_loading").style.display = "none";
        };
        reader.readAsText(file);
    }else{
        showNotification("Please provide a valid .csv file.", "fa-exclamation-circle");
    }
}, false);

var handleCSV = function(e){
    var data = [];
    var csv = e.currentTarget.result;
    csv = csv.replace("trID,trN,pIdx,X,Y,time,SPEED,COURSE,SPEED_C,ACCELERATION_C,COURSE_C,TURN_C\n", "");
    csv = csv.split("\n");
    var point;
    var prevTrID;
    var j = -1;

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
    }

    var csvObjects = [];
    var factor = 0.01;

    for(i = 0; i < data.length; i++){
        var object2 = new Ayce.Object3D();
        object2.vertices = [];
        object2.indices = [];
        object2.colors = [];
        for(j = 0; j < data[i].length-1; j++) {
            object2.vertices.push(
                factor*data[i][j].x, 0, factor*data[i][j].y,
                factor*data[i][j].x, i*0.2+0.2, factor*data[i][j].y,
                factor*data[i][j + 1].x, i*0.2+0.2, factor*data[i][j + 1].y,
                factor*data[i][j + 1].x, i*0.2+0, factor*data[i][j + 1].y
            );
            object2.indices.push(
                j * 2 + 0, j * 2 + 1, j * 2 + 2,
                j * 2 + 0, j * 2 + 2, j * 2 + 3
            );
            object2.colors.push(
                0.8, 0.8, 0.8, 1.0,
                0.8, 0.8, 0.8, 1.0,
                0.8, 0.8, 0.8, 1.0,
                0.8, 0.8, 0.8, 1.0
            );
            object2.indices = object2.indices.reverse();
        }
        csvObjects.push(object2);
        console.log(Math.min.apply( Math, object2.vertices )+" "+Math.max.apply( Math, object2.vertices ));
    }

    for(i = 0; i < csvObjects.length; i++){

        objects.push(csvObjects[i]);
        cameraPreview.objects.push(csvObjects[i]);

        objects[objects.length - 1].position.z = -2;
        cameraPreview.objects[cameraPreview.objects.length - 1].position.z = -2;

        objects[objects.length - 1].screenName = "csv object";

        objects[objects.length-1].script = function(){};
        cameraPreview.objects[objects.length-1].script = function(){};
        objects[objects.length-1].runScriptInPreview = false;

        scene.addToScene(objects[objects.length - 1]);
        cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length-1]);

        var child = appendObjectInSceneChildElement("csv"); // TODO: This doesn't work. Add code for CSV generated objects
        child.onclick({srcElement: {dataset: {type: "csv"}}});

        console.log(objects);
    }

    closeModal();

};