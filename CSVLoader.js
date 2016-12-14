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

    this.getO3Ds = function(trajString, dataString, firstTrajectory, lastTrajectory){
        var trajectories = [];
        var csvTraj = trajString;
        var csvData = dataString;
        var trajHeader, dataHeader, dataHeaderNiceNames;
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

        csvData = csvData.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        dataHeader = csvData.split("\n")[0].split(",");
        dataHeaderNiceNames = csvData.split("\n")[0].split(",");
        for(i = 0; i < dataHeader.length; i++){
            dataHeader[i] = dataHeader[i].replace(new RegExp("[^a-zA-Z_]+", 'g'), "");
        }
        csvData = csvData.replace(/^(.*)$/m, "");           // remove first line (header)
        csvData = csvData.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        csvData = csvData.split("\n");
        csvData.splice(csvData.length-1, 1);    // because \n at end of string can't be removed
        if(firstTrajectory==undefined||firstTrajectory<0||firstTrajectory>lastTrajectory||firstTrajectory>csvData.length-1){
            firstTrajectory = 0;
        }
        if(lastTrajectory==undefined||lastTrajectory<0||lastTrajectory<firstTrajectory||lastTrajectory>csvData.length-1){
            lastTrajectory = csvData.length-1;
        }
        csvData = csvData.slice(firstTrajectory, lastTrajectory);    // because \n at end of string can't be removed

        var point;
        var prevTrID = null;
        var j = -1;

        var maxAcceleration = 0;

        var csvTimer = Date.now();
        console.log("extracting data");
        var speeds = [];
        var accelerations = [];
        var addTrajectory = true;
        for(var i = 0; i < csvTraj.length; i++){
            point = csvTraj[i].split(",");

            var trID = point[0]!="" ? Number(point[0]) : null;
            if(trID != prevTrID){
                j++;
                addTrajectory = (j >= firstTrajectory);
                if(j == lastTrajectory) break;
                if(addTrajectory) trajectories.push([]);
            }
            prevTrID = trID;

            if(addTrajectory) {
                var dataPoint = {};
                for (k = 0; k < trajHeader.length; k++) {
                    dataPoint[trajHeader[k].toLowerCase()] = point[k] != "" ? point[k] : null
                }
                if (dataPoint.x && dataPoint.x != undefined) dataPoint.x = Number(dataPoint.x);
                if (dataPoint.y && dataPoint.y != undefined) dataPoint.y = Number(dataPoint.y);
                trajectories[j-firstTrajectory].push(dataPoint);

                if (trajectories[j-firstTrajectory][trajectories[j-firstTrajectory].length - 1].speed) {
                    speeds.push(Number(trajectories[j-firstTrajectory][trajectories[j-firstTrajectory].length - 1].speed));
                    //console.log(Number(trajectories[j-firstTrajectory][trajectories[j-firstTrajectory].length - 1].speed));
                } else if (trajectories[j-firstTrajectory][trajectories[j-firstTrajectory].length - 1].speed_c) {
                    speeds.push(Number(trajectories[j-firstTrajectory][trajectories[j-firstTrajectory].length - 1].speed_c));
                    //console.log(Number(trajectories[j-firstTrajectory][trajectories[j-firstTrajectory].length - 1].speed_c));
                }
                if (trajectories[j-firstTrajectory][trajectories[j-firstTrajectory].length - 1].acceleration_c)
                    accelerations.push(Number(trajectories[j-firstTrajectory][trajectories[j-firstTrajectory].length - 1].acceleration_c));
            }
        }

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

        var speedScale = chroma.scale("Spectral").domain(getMinMaxWithoutOutliers(speeds));
        var accelerationScale = chroma.scale('Spectral').domain(getMinMaxWithoutOutliers(accelerations).reverse());

        console.log("done (" + (Date.now()-csvTimer) + "ms)");

        var csvObjects = [];

        csvTimer = Date.now();
        console.log("building Ayce.Object3Ds");

        var offsetX = 0, offsetY = 0, minX = null, minY = null, maxX = null, maxY = null, numberOfPoints = 0;
        for(i = 0; i < trajectories.length; i++) {
            for(j = 0; j < trajectories[i].length; j++) {
                if(trajectories[i][j].x){
                    offsetX += trajectories[i][j].x;
                    if(maxX)
                        maxX = Math.max(maxX, trajectories[i][j].x);
                    else
                        maxX = trajectories[i][j].x;

                    if(maxY)
                        maxY = Math.max(maxY, trajectories[i][j].y);
                    else
                        maxY = trajectories[i][j].y;

                    if(minX)
                        minX = Math.min(minX, trajectories[i][j].x);
                    else
                        minX = trajectories[i][j].x;

                    if(minY)
                        minY = Math.min(minY, trajectories[i][j].y);
                    else
                        minY = trajectories[i][j].y;
                }
                if(trajectories[i][j].y){
                    offsetY += trajectories[i][j].y;
                }
                numberOfPoints++;
            }
        }
        offsetX /= numberOfPoints;
        offsetY /= numberOfPoints;
        var scalingFactor = boundarySize/Math.max(maxX-minX, maxY-minY);

        csvObjects.push(new EmptyObject());

        var object, color, numberOfVertices, x1, y1, z1, x2, y2, z2, x3, y3, z3, nx, ny, nz, vectorLength, k, index;

        var newObject = new Ayce.Object3D();

        for(i = 0; i < trajectories.length; i++){
            csvObjects.push(new Ayce.Object3D());
            index = csvObjects.length-1;
            csvObjects[index].visualization = {niceNames:{}};
            point = csvData[i].split(",");
            for(j = 0; j < dataHeader.length; j++){
                csvObjects[index].visualization[dataHeader[j]] = point[j]!="" ? point[j] : null;
                csvObjects[index].visualization.niceNames[dataHeader[j]] = dataHeaderNiceNames[j];
            }
            colors.reset();
            csvObjects[index].vertices = [];
            csvObjects[index].indices = [];
            csvObjects[index].colors = [];
            for(j = 0; j < trajectories[i].length; j++) {
                csvObjects[index].vertices.push(
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(trajectories[i][j].y-offsetY),    // foreign front bottom
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(trajectories[i][j].y-offsetY),    // foreign front top
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(trajectories[i][j].y-offsetY),    // foreign back bottom
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(trajectories[i][j].y-offsetY),    // foreign back top
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(trajectories[i][j].y-offsetY),    // front bottom
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(trajectories[i][j].y-offsetY),    // front top
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(trajectories[i][j].y-offsetY),    // back bottom
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(trajectories[i][j].y-offsetY)     // back top
                );

                if(trajectories[i][j].speed) color = speedScale(trajectories[i][j].speed).rgb();
                else color = speedScale(trajectories[i][j].speed_c).rgb();

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

                color = accelerationScale(trajectories[i][j].acceleration).rgb();

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

                /*colors.speed.push(
                    0.5, 0.5, 0.5, 1.0,
                    0.5, 0.5, 0.5, 1.0,
                    0.5, 0.5, 0.5, 1.0,
                    0.5, 0.5, 0.5, 1.0,
                    0.5, 0.5, 0.5, 1.0,
                    0.5, 0.5, 0.5, 1.0,
                    0.5, 0.5, 0.5, 1.0,
                    0.5, 0.5, 0.5, 1.0
                );*/

                numberOfVertices = trajectories[i].length*8;

                csvObjects[index].indices.push(
                    (j*8+4)%numberOfVertices, (j*8+5)%numberOfVertices, (j*8+9)%numberOfVertices,   // front 1
                    (j*8+4)%numberOfVertices, (j*8+9)%numberOfVertices, (j*8+8)%numberOfVertices,   // front 2
                    (j*8+11)%numberOfVertices, (j*8+7)%numberOfVertices, (j*8+6)%numberOfVertices,  // back 1
                    (j*8+10)%numberOfVertices, (j*8+11)%numberOfVertices, (j*8+6)%numberOfVertices  // back 2
                );
            }

            csvObjects[index].normals = [];

            for(j = 0; j < csvObjects[index].indices.length; j+=12){

                // get vertex coordinates
                x1 = csvObjects[index].vertices[csvObjects[index].indices[j]*3];
                y1 = csvObjects[index].vertices[csvObjects[index].indices[j]*3+1];
                z1 = csvObjects[index].vertices[csvObjects[index].indices[j]*3+2];

                x2 = csvObjects[index].vertices[csvObjects[index].indices[j+1]*3];
                y2 = csvObjects[index].vertices[csvObjects[index].indices[j+1]*3+1];
                z2 = csvObjects[index].vertices[csvObjects[index].indices[j+1]*3+2];

                x3 = csvObjects[index].vertices[csvObjects[index].indices[j+2]*3];
                y3 = csvObjects[index].vertices[csvObjects[index].indices[j+2]*3+1];
                z3 = csvObjects[index].vertices[csvObjects[index].indices[j+2]*3+2];

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
                    csvObjects[index].normals[csvObjects[index].indices[k]*3] = nx;
                    csvObjects[index].normals[csvObjects[index].indices[k]*3+1] = ny;
                    csvObjects[index].normals[csvObjects[index].indices[k]*3+2] = nz;
                }
                for(k = j+6; k < j+12; k++){    // set normals for back
                    csvObjects[index].normals[csvObjects[index].indices[k]*3] = -nx;
                    csvObjects[index].normals[csvObjects[index].indices[k]*3+1] = -ny;
                    csvObjects[index].normals[csvObjects[index].indices[k]*3+2] = -nz;
                }
            }
            csvObjects[index].parent = csvObjects[0];
            csvObjects[index].colors = colors.speed;
            csvObjects[index].visualization.speedColors = colors.speed;
            csvObjects[index].visualization.accelerationColors = colors.acceleration;
        }
        console.log("done (" + (Date.now()-csvTimer) + "ms)");
        return csvObjects;
    };
};