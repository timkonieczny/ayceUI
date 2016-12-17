var codeBuilder = new CodeBuilder();

var openModal = function(type, currentObjectId){
    if(type == "obj"){
        document.getElementById("modal").style.display = "block";
        document.getElementById("file_upload_wrapper").style.display = "block";
        document.getElementById("obj_drop").style.display = "flex";
        document.getElementById("mtl_drop").style.display = "flex";
    }else if(type == "code"){
        document.getElementById("modal").style.display = "block";
        document.getElementById("export_code_textarea").style.display = "block";
        document.getElementById("export_code_textarea").value = codeBuilder.getCode();
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

        document.getElementById("csv_drop").style.display = "flex";
        document.getElementById("csv_data_drop").style.display = "flex";

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
    objString = null;
    mtlString = null;

    document.getElementById("export_code_textarea").style.display = "none";
    document.getElementById("edit_script_textarea").style.display = "none";
    document.getElementById("edit_script_wrapper").style.display = "none";

    document.getElementById("csv_drop").style.display = "none";
    document.getElementById("csv_drop_done").style.display = "none";
    document.getElementById("csv_data_drop").style.display = "none";
    document.getElementById("csv_data_drop_done").style.display = "none";
    document.getElementById("csv_data_drop_done").style.display = "none";
    document.getElementById("csv_upload_wrapper").style.display = "none";
    document.getElementById("import_csv_processing").style.display = "none";
    csvString = null;
    csvDataString = null;

    document.getElementById("modal").style.display = "none";
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

    var object = new Ayce.OBJLoader(null, obj, mtl, true)[0];
    if(object.vertices) {

        objects.push(object);                // TODO: more efficient solution for copying the O3D
        cameraPreview.objects.push(new Ayce.OBJLoader(null, obj, mtl, true)[0]);

        objects[objects.length-1].ayceUI = {
            id: objects.length-1,
            screenName: "imported object",
            runScriptInPreview: false
        };

        scene.addToScene(objects[objects.length - 1]);
        cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length - 1], false);
        console.log("done");

        var child = appendObjectInSceneChildNode("obj");
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
document.getElementById("csv_data_drop").addEventListener("dragover", function(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}, false);

var csvString = null, csvDataString = null;

var processCSV = function(e, type){
    e.stopPropagation();
    e.preventDefault();

    var file = e.dataTransfer.files[0];

    if(/(?:\.([^.]+))?$/.exec(file.name)[1] == "csv") {          // check if correct file was dropped in correct field

        if(type=="traj") {
            document.getElementById("csv_drop").style.display = "none";
            document.getElementById("csv_drop_loading").style.display = "flex";
        }else if(type=="data"){
            document.getElementById("csv_data_drop").style.display = "none";
            document.getElementById("csv_data_drop_loading").style.display = "flex";
        }

        csvTimer = Date.now();
        console.log("reading file");
        var reader = new FileReader();
        reader.onload = function (e) {
            console.log("done (" + (Date.now()-csvTimer) + "ms)");
            if(type == "traj") csvString = e.currentTarget.result;
            else if(type == "data") csvDataString = e.currentTarget.result;
            if(type=="traj") {
                document.getElementById("csv_drop_loading").style.display = "none";
                document.getElementById("csv_drop_done").style.display = "flex";
            }else if(type=="data"){
                document.getElementById("csv_data_drop_loading").style.display = "none";
                document.getElementById("csv_data_drop_done").style.display = "flex";
            }
            if(csvString && csvDataString) {

                document.getElementById("csv_drop_done").style.display = "none";
                document.getElementById("csv_data_drop_done").style.display = "none";
                document.getElementById("import_csv_processing").style.display = "flex";
                var o3Ds = csvLoader.getO3Ds(csvString, csvDataString, 0, 1000);
                var joinedTrajectories = [];
                var startObjectIndex = 1;
                var startNewObject = false;
                joinedTrajectories[0] = new Ayce.Object3D();

                for(var k = 0; k < joinedTrajectories.length; k++) {        // TODO: build this right into CSVLoader to avoid memory issues
                    joinedTrajectories[k].vertices = [];
                    joinedTrajectories[k].indices = [];
                    joinedTrajectories[k].colors = [];
                    joinedTrajectories[k].normals = [];
                    var numberOfIndices = 0;
                    for (var i = startObjectIndex; i < o3Ds.length; i++) {
                        var indicesToConcat = [];
                        for (var j = 0; j < o3Ds[i].indices.length; j++) {
                            if (o3Ds[i].indices[j] + numberOfIndices <= 65535) {    // 65535 is maximum number of indices that can be handled by WebGL. Starting new Object here
                                indicesToConcat.push(o3Ds[i].indices[j] + numberOfIndices);
                            } else {
                                joinedTrajectories.push(new Ayce.Object3D());
                                startObjectIndex = i;
                                numberOfIndices = 0;
                                startNewObject = true;
                                break;
                            }
                        }
                        if(startNewObject){
                            startNewObject = false;
                            break;
                        }
                        joinedTrajectories[k].indices = joinedTrajectories[k].indices.concat(indicesToConcat);
                        joinedTrajectories[k].vertices = joinedTrajectories[k].vertices.concat(o3Ds[i].vertices);
                        joinedTrajectories[k].colors = joinedTrajectories[k].colors.concat(o3Ds[i].colors);
                        joinedTrajectories[k].normals = joinedTrajectories[k].normals.concat(o3Ds[i].normals);
                        numberOfIndices += o3Ds[i].vertices.length / 3;
                    }

                    objects.push(joinedTrajectories[k]);
                    cameraPreview.objects.push(joinedTrajectories[k]);
                    objects[objects.length - 1].script = function () {
                    };
                    cameraPreview.objects[objects.length - 1].script = function () {
                    };
                    objects[objects.length - 1].ayceUI = {
                        id: objects.length - 1,
                        screenName: "trajectory",
                        runScriptInPreview: false
                    };
                    scene.addToScene(objects[objects.length - 1]);
                    cameraPreview.scene.addToScene(cameraPreview.objects[cameraPreview.objects.length - 1], false);
                    appendObjectInSceneChildNode("obj");        // TODO
                    currentObjectId = objects.length - 1;
                    joinedTrajectories[k] = null;
                }
                document.getElementById("csv_drop_loading").style.display = "none";
                closeModal();
            }
        };
        reader.readAsText(file);
    }else{
        showNotification("Please provide a valid .csv file.", "fa-exclamation-circle");
    }
};

var csvTimer;

var csvLoader = new CSVLoader();

document.getElementById("csv_drop").addEventListener("drop", function(e){
    processCSV(e, "traj")
}, false);

document.getElementById("csv_data_drop").addEventListener("drop", function(e){
    processCSV(e, "data")
}, false);