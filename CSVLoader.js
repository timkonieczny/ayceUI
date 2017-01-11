CSVLoader = function(){

    var boundarySize = 3;
    var trajectoryHeight = 0.05;

    var colors = {
        speed: [],
        acceleration: [],
        reset: function(){
            this.speed = [];
            this.acceleration = []
        }
    };

    var extractTrajectories = function(trajString, firstTrajectory, lastTrajectory, outTrajectories, outSpeeds, outAccelerations){
        //outTrajectories = [];
        var csvTraj = trajString;
        var trajHeader;
        csvTraj = csvTraj.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        trajHeader = csvTraj.split("\n")[0].split(",");
        for(i = 0; i < trajHeader.length; i++){
            trajHeader[i] = trajHeader[i].replace(new RegExp("[^a-zA-Z_]+", 'g'), "");
        }
        csvTraj = csvTraj.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        csvTraj = csvTraj.replace(/^(.*)$/m, "");         // remove first line (header)
        csvTraj = csvTraj.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        csvTraj = csvTraj.split("\n");
        csvTraj.splice(csvTraj.length-1, 1);    // because \n at end of string can't be removed

        var point;
        var prevTrID = null;
        var j = -1;

        var maxAcceleration = 0;

        var csvTimer = Date.now();
        console.log("extracting data");
        //outSpeeds = [];
        //outAccelerations = [];
        var addTrajectory = true;
        for(var i = 0; i < csvTraj.length; i++){
            point = csvTraj[i].split(",");

            var trID = point[0]!="" ? Number(point[0]) : null;
            if(trID != prevTrID){
                j++;
                addTrajectory = (j >= firstTrajectory);
                if(j == lastTrajectory) break;
                if(addTrajectory) outTrajectories.push([]);
            }
            prevTrID = trID;

            if(addTrajectory) {
                var dataPoint = {};
                for (k = 0; k < trajHeader.length; k++) {
                    dataPoint[trajHeader[k].toLowerCase()] = point[k] != "" ? point[k] : null
                }
                if (dataPoint.x && dataPoint.x != undefined) dataPoint.x = Number(dataPoint.x);
                if (dataPoint.y && dataPoint.y != undefined) dataPoint.y = Number(dataPoint.y);
                outTrajectories[j-firstTrajectory].push(dataPoint);

                if (outTrajectories[j-firstTrajectory][outTrajectories[j-firstTrajectory].length - 1].speed) {
                    outSpeeds.push(Number(outTrajectories[j-firstTrajectory][outTrajectories[j-firstTrajectory].length - 1].speed));
                    //console.log(Number(outTrajectories[j-firstTrajectory][outTrajectories[j-firstTrajectory].length - 1].speed));
                } else if (outTrajectories[j-firstTrajectory][outTrajectories[j-firstTrajectory].length - 1].speed_c) {
                    outSpeeds.push(Number(outTrajectories[j-firstTrajectory][outTrajectories[j-firstTrajectory].length - 1].speed_c));
                    //console.log(Number(outTrajectories[j-firstTrajectory][outTrajectories[j-firstTrajectory].length - 1].speed_c));
                }
                if (outTrajectories[j-firstTrajectory][outTrajectories[j-firstTrajectory].length - 1].acceleration_c)
                    outAccelerations.push(Number(outTrajectories[j-firstTrajectory][outTrajectories[j-firstTrajectory].length - 1].acceleration_c));
            }
        }
    };

    var extractData = function(dataString, firstTrajectory, lastTrajectory){
        var csvData = dataString;
        var dataHeader, dataHeaderNiceNames;

        csvData = csvData.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        dataHeader = csvData.split("\n")[0].split(",");
        dataHeaderNiceNames = csvData.split("\n")[0].split(",");
        for(i = 0; i < dataHeader.length; i++){
            dataHeader[i] = dataHeader[i].replace(new RegExp("[^a-zA-Z_]+", 'g'), "");
        }

        csvData = csvData.replace(/^(.*)$/m, "");           // remove first line (header)
        csvData = csvData.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        csvData = csvData.split("\n");

        var newCSVData = [];

        for(var i = 0; i < csvData.length; i++){
            if(csvData[i] != "" && i >= firstTrajectory && i < lastTrajectory) {
                var point = csvData[i].split(",");
                newCSVData.push({niceNames: {}});
                for (var j = 0; j < point.length; j++) {
                    newCSVData[newCSVData.length - 1][dataHeader[j].toLowerCase()] = point[j];
                    newCSVData[newCSVData.length - 1].niceNames[dataHeader[j].toLowerCase()] = dataHeaderNiceNames[j]
                }
                newCSVData[newCSVData.length - 1].points = [];
            }
        }
        return newCSVData;
    };

    var getMedianAt = function(array, middle){
        if(array.length%(1/(middle>0.5 ? 1-middle : middle))>0){
            return (array[Math.floor(array.length*middle)]+array[Math.ceil(array.length*middle)])/2
        }else{
            return array[array.length*middle]
        }
    };
    var getMinMaxWithoutOutliers = function(array){
        array.sort(function(a,b){return a-b});

        var q2 = getMedianAt(array, 0.5);
        var q1 = getMedianAt(array, 0.25);
        var q3 = getMedianAt(array, 0.75);

        var interQuartRange = q3 - q1;

        var upperFenceI = q3+interQuartRange*1.5;
        var lowerFenceI = q1-interQuartRange*1.5;

        var upperFenceO = q3+interQuartRange*3;
        var lowerFenceO = q1-interQuartRange*3;
        var majorUpperOutliers = [];
        var minorUpperOutliers = [];
        var majorLowerOutliers = [];
        var minorLowerOutliers = [];

        /*console.log("upperMedian = "+q1+
         "\nmedian = "+q2+
         "\nlowerMedian = "+q3+
         "\ninnerQuartRange = "+interQuartRange+
         "\nupperFenceI = "+upperFenceI+
         "\nlowerFenceI = "+lowerFenceI+
         "\nupperFenceO = "+upperFenceO+
         "\nlowerFenceO = "+lowerFenceO
         );*/

        for(i = 0; i < array.length; i++){
            if(array[i]<lowerFenceI){
                if(array[i]<lowerFenceO)
                    majorLowerOutliers.push(array[i]);
                else
                    minorLowerOutliers.push(array[i]);
            }else if(array[i]>upperFenceI){
                if(array[i]>upperFenceO)
                    majorUpperOutliers.push(array[i]);
                else
                    minorUpperOutliers.push(array[i]);
            }
        }

        var scaleTop, scaleBottom;

        var min = function(array){          // Workaround for bug in chrome http://stackoverflow.com/questions/18308700/chrome-how-to-solve-maximum-call-stack-size-exceeded-errors-on-math-max-apply
            var maxArrayLength = 124980;
            var minimaOfArraySlices = [];
            for(i = 0; i < Math.ceil(array.length / maxArrayLength); i++) {
                minimaOfArraySlices.push(Math.min.apply(Math, array.slice(i * maxArrayLength, Math.min((i + 1) * maxArrayLength, array.length))));
            }
            return Math.min.apply(Math, minimaOfArraySlices);
        };

        if(minorUpperOutliers.length > 0)
            scaleTop = Math.max.apply( Math, minorUpperOutliers );
        else
            scaleTop = min(array);

        if(minorLowerOutliers.length>0)
            scaleBottom = Math.max.apply( Math, minorLowerOutliers );
        else
            scaleBottom = min(array);

        if(minorUpperOutliers.length > 0)
            scaleTop = Math.max.apply( Math, minorUpperOutliers );
        else
            scaleTop = min(array);

        if(minorLowerOutliers.length>0)
            scaleBottom = Math.max.apply( Math, minorLowerOutliers );
        else
            scaleBottom = min(array);

        return [scaleTop, scaleBottom]
    };

    var speeds = [],
        accelerations = [],
        csvData,
        speedScale,
        accelerationScale,
        csvObjects,
        offsetX,
        offsetY,
        scalingFactor;

    var preprocessData = function(trajString, dataString, firstTrajectory, lastTrajectory){
        if(firstTrajectory==undefined||firstTrajectory<0||firstTrajectory>lastTrajectory){
            firstTrajectory = 0;
        }
        if(lastTrajectory==undefined||lastTrajectory<0||lastTrajectory<firstTrajectory){
            lastTrajectory = Infinity;
        }

        csvData = extractData(dataString, firstTrajectory, lastTrajectory);

        var trajectories = [];

        extractTrajectories(trajString, firstTrajectory, lastTrajectory, trajectories, speeds, accelerations);

        for(i = 0; i < csvData.length; i++){
            csvData[i].points = trajectories[i];
        }

        csvData = csvData.sort(function(a, b){
            return Number(a.clustersroutesimilaritykm) - Number(b.clustersroutesimilaritykm);
        });

        speedScale = chroma.scale("Spectral").domain(getMinMaxWithoutOutliers(speeds));
        //speedScale = chroma.scale("Spectral").domain(speeds);
        accelerationScale = chroma.scale('Spectral').domain(getMinMaxWithoutOutliers(accelerations).reverse());

        console.log("done (" + (Date.now()-csvTimer) + "ms)");


        csvTimer = Date.now();
        console.log("building Ayce.Object3Ds");

        offsetX = 0;
        offsetY = 0;
        var minX = null, minY = null, maxX = null, maxY = null, numberOfPoints = 0;
        for(var i = 0; i < csvData.length; i++) {
            for(var j = 0; j < csvData[i].points.length; j++) {
                if(csvData[i].points[j].x){
                    offsetX += csvData[i].points[j].x;
                    if(maxX)
                        maxX = Math.max(maxX, csvData[i].points[j].x);
                    else
                        maxX = csvData[i].points[j].x;

                    if(maxY)
                        maxY = Math.max(maxY, csvData[i].points[j].y);
                    else
                        maxY = csvData[i].points[j].y;

                    if(minX)
                        minX = Math.min(minX, csvData[i].points[j].x);
                    else
                        minX = csvData[i].points[j].x;

                    if(minY)
                        minY = Math.min(minY, csvData[i].points[j].y);
                    else
                        minY = csvData[i].points[j].y;
                }
                if(csvData[i].points[j].y){
                    offsetY += csvData[i].points[j].y;
                }
                numberOfPoints++;
            }
        }
        offsetX /= numberOfPoints;
        offsetY /= numberOfPoints;
        scalingFactor = boundarySize/Math.max(maxX-minX, maxY-minY);

        csvObjects = [new EmptyObject()];
    };

    var color, prevColor, numberOfVertices, x1, y1, z1, x2, y2, z2, x3, y3, z3, nx, ny, nz, vectorLength, k, j, numOfPrevInds;

    var getVerticesColorsIndices = function(trajectory, object, heightIndex){

        var addFirstSplitPointVertex = function(){
            object.vertices.push(

                scalingFactor * ((trajectory[j-1].x - offsetX + trajectory[j].x - offsetX) / 2),
                heightIndex * trajectoryHeight,
                scalingFactor * ((trajectory[j-1].y - offsetY + trajectory[j].y - offsetY) / 2),    // prev split front bottom

                scalingFactor * ((trajectory[j-1].x - offsetX + trajectory[j].x - offsetX) / 2),
                heightIndex * trajectoryHeight + trajectoryHeight,
                scalingFactor * ((trajectory[j-1].y - offsetY + trajectory[j].y - offsetY) / 2),    // prev split front top

                scalingFactor * ((trajectory[j-1].x - offsetX + trajectory[j].x - offsetX) / 2),
                heightIndex * trajectoryHeight,
                scalingFactor * ((trajectory[j-1].y - offsetY + trajectory[j].y - offsetY) / 2),    // prev split back bottom

                scalingFactor * ((trajectory[j-1].x - offsetX + trajectory[j].x - offsetX) / 2),
                heightIndex * trajectoryHeight + trajectoryHeight,
                scalingFactor * ((trajectory[j-1].y - offsetY + trajectory[j].y - offsetY) / 2)     // prev split back top
            );
        };

        var addMiddleVertex = function(){
            object.vertices.push(

                scalingFactor * (trajectory[j].x - offsetX),
                heightIndex * trajectoryHeight,
                scalingFactor * (trajectory[j].y - offsetY),    // front bottom

                scalingFactor * (trajectory[j].x - offsetX),
                heightIndex * trajectoryHeight + trajectoryHeight,
                scalingFactor * (trajectory[j].y - offsetY),    // front top

                scalingFactor * (trajectory[j].x - offsetX),
                heightIndex * trajectoryHeight,
                scalingFactor * (trajectory[j].y - offsetY),    // back bottom

                scalingFactor * (trajectory[j].x - offsetX),
                heightIndex * trajectoryHeight + trajectoryHeight,
                scalingFactor * (trajectory[j].y - offsetY)     // back top

            );
        };

        var addSecondSplitPointVertex = function(){
            object.vertices.push(

                scalingFactor * ((trajectory[j].x - offsetX + trajectory[j+1].x - offsetX) / 2),
                heightIndex * trajectoryHeight,
                scalingFactor * ((trajectory[j].y - offsetY + trajectory[j+1].y - offsetY) / 2),    // next split front bottom

                scalingFactor * ((trajectory[j].x - offsetX + trajectory[j+1].x - offsetX) / 2),
                heightIndex * trajectoryHeight + trajectoryHeight,
                scalingFactor * ((trajectory[j].y - offsetY + trajectory[j+1].y - offsetY) / 2),    // next split front top

                scalingFactor * ((trajectory[j].x - offsetX + trajectory[j+1].x - offsetX) / 2),
                heightIndex * trajectoryHeight,
                scalingFactor * ((trajectory[j].y - offsetY + trajectory[j+1].y - offsetY) / 2),    // next split back bottom

                scalingFactor * ((trajectory[j].x - offsetX + trajectory[j+1].x - offsetX) / 2),
                heightIndex * trajectoryHeight + trajectoryHeight,
                scalingFactor * ((trajectory[j].y - offsetY + trajectory[j+1].y - offsetY) / 2)     // next split back top

            );
        };

        colors.reset();
        object.vertices = [];
        object.indices = [];
        object.colors = [];
        for(j = 0; j < trajectory.length; j++) {

            numOfPrevInds = 8 + (j-1)*12;   // 8 indices of first data point + j-1 regular data points with 12 indices

            if(j == 0){
                addMiddleVertex();
                addSecondSplitPointVertex();

                if(trajectory[j].speed){
                    color = speedScale(trajectory[j].speed).rgb();
                }else {
                    color = speedScale(trajectory[j].speed_c).rgb();
                }

                colors.speed.push(
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0
                );

                color = accelerationScale(trajectory[j].acceleration).rgb();

                colors.acceleration.push(
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0
                );

                object.indices.push(
                    1, 0, 5,    // front 1
                    5, 0, 4,    // front 2
                    3, 7, 2,    // back 1
                    2, 7, 6     // back 2
                );
            }else if(j == trajectory.length-1){
                addFirstSplitPointVertex();
                addMiddleVertex();

                if(trajectory[j].speed){
                    color = speedScale(trajectory[j].speed).rgb();
                }else {
                    color = speedScale(trajectory[j].speed_c).rgb();
                }


                colors.speed.push(
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0
                );

                color = accelerationScale(trajectory[j].acceleration).rgb();

                colors.acceleration.push(
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0
                );

                object.indices.push(
                    numOfPrevInds + 1, numOfPrevInds + 0, numOfPrevInds + 5,    // front 1
                    numOfPrevInds + 5, numOfPrevInds + 0, numOfPrevInds + 4,    // front 2
                    numOfPrevInds + 3, numOfPrevInds + 7, numOfPrevInds + 2,    // back 1
                    numOfPrevInds + 2, numOfPrevInds + 7, numOfPrevInds + 6     // back 2
                );
            }else {

                addFirstSplitPointVertex();
                addMiddleVertex();
                addSecondSplitPointVertex();

                if(trajectory[j].speed){
                    color = speedScale(trajectory[j].speed).rgb();
                }else {
                    color = speedScale(trajectory[j].speed_c).rgb();
                }


                colors.speed.push(
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0
                );

                color = accelerationScale(trajectory[j].acceleration).rgb();

                colors.acceleration.push(
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0,
                    color[0]/255, color[1]/255, color[2]/255, 1.0
                );

                object.indices.push(
                    numOfPrevInds + 1, numOfPrevInds + 0, numOfPrevInds + 5,    // front 1
                    numOfPrevInds + 5, numOfPrevInds + 0, numOfPrevInds + 4,    // front 2
                    numOfPrevInds + 3, numOfPrevInds + 7, numOfPrevInds + 2,    // back 1
                    numOfPrevInds + 2, numOfPrevInds + 7, numOfPrevInds + 6,    // back 2
                    numOfPrevInds + 7, numOfPrevInds + 6, numOfPrevInds + 11,   // front 3
                    numOfPrevInds + 11, numOfPrevInds + 6, numOfPrevInds + 10,  // front 4
                    numOfPrevInds + 7, numOfPrevInds + 11, numOfPrevInds + 6,   // back 3
                    numOfPrevInds + 6, numOfPrevInds + 11, numOfPrevInds + 10   // back 4
                );
            }
        }

        object.normals = [];

        for(j = 0; j < object.indices.length; j+=12){

            // get vertex coordinates
            x1 = object.vertices[object.indices[j]*3];
            y1 = object.vertices[object.indices[j]*3+1];
            z1 = object.vertices[object.indices[j]*3+2];

            x2 = object.vertices[object.indices[j+1]*3];
            y2 = object.vertices[object.indices[j+1]*3+1];
            z2 = object.vertices[object.indices[j+1]*3+2];

            x3 = object.vertices[object.indices[j+2]*3];
            y3 = object.vertices[object.indices[j+2]*3+1];
            z3 = object.vertices[object.indices[j+2]*3+2];

            // calculate normal vector
            nx = (y2 - y1)*(z3 - z1) - (z2 - z1)*(y3 - y1);
            ny = (z2 - z1)*(x3 - x1) - (x2 - x1)*(z3 - z1);
            nz = (x2 - x1)*(y3 - y1) - (y2 - y1)*(x3 - x1);
            vectorLength = Math.sqrt(nx*nx+ny*ny+nz*nz);
            // normalize normal vector
            nx /= vectorLength;
            ny /= vectorLength;
            nz /= vectorLength;

            for(k = j; k < j+6; k++){   // set normals for front
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
        return object
    };

    this.getIndividualO3Ds = function(trajString, dataString, firstTrajectory, lastTrajectory){

        preprocessData(trajString, dataString, firstTrajectory, lastTrajectory);

        var index;

        for(var i = 0; i < csvData.length; i++){
            csvObjects.push(new Ayce.Object3D());
            index = csvObjects.length-1;
            csvObjects[index].visualization = csvData[index-1];
            getVerticesColorsIndices(csvData[i].points, csvObjects[index], i);

            csvObjects[index].parent = csvObjects[0];
            csvObjects[index].colors = colors.speed;
            csvObjects[index].visualization.speedColors = colors.speed;
            csvObjects[index].visualization.accelerationColors = colors.acceleration;
        }
        console.log("done (" + (Date.now()-csvTimer) + "ms)");

        csvObjects[0].visualization = {isGrouped: false};

        return csvObjects;
    };

    this.getGroupedO3Ds = function(trajString, dataString, firstTrajectory, lastTrajectory){

        preprocessData(trajString, dataString, firstTrajectory, lastTrajectory);

        var geometry = {
            vertices: [],
            indices: [],
            addedIndices: [],
            colors: [],
            normals: []
        };

        csvObjects.push(new Ayce.Object3D());
        csvObjects[csvObjects.length-1].vertices = [];
        csvObjects[csvObjects.length-1].indices = [];
        csvObjects[csvObjects.length-1].colors = [];
        csvObjects[csvObjects.length-1].normals = [];

        var label = {startId: null, endId: null, reset: function(){this.startId = null; this.endId = null}};

        for(var i = 0; i < csvData.length; i++){
            if(!label.startId) label.startId = Number(csvData[i].id);
            //csvObjects[index].visualization = csvData[index];
            geometry = getVerticesColorsIndices(csvData[i].points, geometry, i);

            for(var j = 0; j < geometry.indices.length; j++){
                if(geometry.indices[j] + csvObjects[csvObjects.length-1].vertices.length/3 <= 65535) {
                    geometry.addedIndices.push(
                        geometry.indices[j] + csvObjects[csvObjects.length-1].vertices.length/3
                    );
                }else{
                    label.endId = Number(csvData[i-1].id);
                    csvObjects[csvObjects.length-1].visualization.id = csvObjects[csvObjects.length-1].visualization.id.replace(/(, )$/, "");
                    console.log("Splitting imported data into "+csvObjects.length+" objects.");
                    csvObjects.push(new Ayce.Object3D());
                    csvObjects[csvObjects.length-1].vertices = [];
                    csvObjects[csvObjects.length-1].indices = [];
                    csvObjects[csvObjects.length-1].colors = [];
                    csvObjects[csvObjects.length-1].normals = [];
                    geometry.addedIndices = geometry.indices;

                    label.reset();
                    break;
                }
            }

            if(csvObjects[csvObjects.length-1].visualization == undefined)
                csvObjects[csvObjects.length-1].visualization = {speedColors: [], accelerationColors: [], id: ""};
            csvObjects[csvObjects.length-1].visualization.id += csvData[i].id+", ";
            csvObjects[csvObjects.length-1].visualization.speedColors = csvObjects[csvObjects.length-1].visualization.speedColors.concat(colors.speed);
            csvObjects[csvObjects.length-1].visualization.accelerationColors = csvObjects[csvObjects.length-1].visualization.accelerationColors.concat(colors.acceleration);
            csvObjects[csvObjects.length-1].parent = csvObjects[0];
            csvObjects[csvObjects.length-1].indices = geometry.addedIndices.slice();
            csvObjects[csvObjects.length-1].vertices = csvObjects[csvObjects.length-1].vertices.concat(geometry.vertices);
            csvObjects[csvObjects.length-1].normals = csvObjects[csvObjects.length-1].normals.concat(geometry.normals);
            csvObjects[csvObjects.length-1].colors = csvObjects[csvObjects.length-1].colors.concat(colors.speed);
        }
        console.log("done (" + (Date.now()-csvTimer) + "ms)");

        csvObjects[0].visualization = {isGrouped: true};

        return csvObjects;
    };
};