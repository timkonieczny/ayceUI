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

    this.getO3Ds = function(trajString, dataString){
        var trajectories = [];
        var csvTraj = trajString;
        var csvData = dataString;
        var trajHeader, dataHeader, dataHeaderNiceNames;
        csvTraj = csvTraj.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        trajHeader = csvTraj.split("\n")[0].split(",");
        for(i = 0; i < trajHeader.length; i++){
            trajHeader[i] = trajHeader[i].replace(new RegExp("[^a-zA-Z_]+", 'g'), "");
        }
        csvTraj = csvTraj.replace("trID,trN,pIdx,X,Y,time,SPEED,COURSE,SPEED_C,ACCELERATION_C,COURSE_C,TURN_C\n", "");
        csvTraj = csvTraj.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        csvTraj = csvTraj.split("\n");
        csvTraj.splice(csvTraj.length-1, 1);    // because \n at end of string can't be removed

        csvData = csvData.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        dataHeader = csvData.split("\n")[0].split(",");
        dataHeaderNiceNames = csvData.split("\n")[0].split(",");
        for(i = 0; i < dataHeader.length; i++){
            dataHeader[i] = dataHeader[i].replace(new RegExp("[^a-zA-Z_]+", 'g'), "");
        }
        csvData = csvData.replace("id,Name,trN,trN,Entity ID,Number of positions,Track length,Start date+time,End date+time,Start date,End date,Start time,End time,Duration (second),Duration (minutes),Duration (hours),Year (start),Year (end),Month (start),Month (end),Day of week (start),Day of week (end),Hour (start),Hour (end),Stop duration,Stop duration (hours),Stop duration (minutes),Distance to next trajectory,max_SPEED,median_SPEED,Clusters (Route similarity; 1km/5)\n", "");
        csvData = csvData.split("\n");
        csvData.splice(csvTraj.length-1, 1);    // because \n at end of string can't be removed

        var point;
        var prevTrID = null;
        var j = -1;

        var maxAcceleration = 0;

        var csvTimer = Date.now();
        console.log("extracting data");
        var speeds = [];
        var accelerations = [];
        for(var i = 0; i < csvTraj.length; i++){
            point = csvTraj[i].split(",");

            var trID = point[0]!="" ? Number(point[0]) : null;
            if(trID != prevTrID){
                trajectories.push([]);
                j++;
            }
            prevTrID = trID;

            trajectories[j].push({
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
            if(trajectories[j][trajectories[j].length-1].speed!=null)
                speeds.push(trajectories[j][trajectories[j].length - 1].speed);
            if(trajectories[j][trajectories[j].length-1].accelerationC!=null)
                accelerations.push(trajectories[j][trajectories[j].length-1].accelerationC);
        }

        var getMedianAt = function(array, middle){
            //var divider = middle>0.5 ? 1-middle : middle;
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
            if(minorUpperOutliers.length > 0)
                scaleTop = Math.max.apply( Math, minorUpperOutliers );
            else
                scaleTop = Math.min.apply( Math, array );

            if(minorLowerOutliers.length>0)
                scaleBottom = Math.max.apply( Math, minorLowerOutliers );
            else
                scaleBottom = Math.min.apply(Math, array);

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

        for(i = 0; i < trajectories.length; i++){
            var object = new Ayce.Object3D();
            object.visualization = {niceNames:{}};
            point = csvData[i].split(",");
            for(j = 0; j < dataHeader.length; j++){
                object.visualization[dataHeader[j]] = point[j]!="" ? point[j] : null;
                object.visualization.niceNames[dataHeader[j]] = dataHeaderNiceNames[j];
            }           //TODO: Where is trajectory 1
            colors.reset();
            object.vertices = [];
            object.indices = [];
            object.colors = [];
            for(j = 0; j < trajectories[i].length; j++) {
                object.vertices.push(
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(trajectories[i][j].y-offsetY),    // foreign front bottom
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(trajectories[i][j].y-offsetY),    // foreign front top
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(trajectories[i][j].y-offsetY),    // foreign back bottom
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(trajectories[i][j].y-offsetY),    // foreign back top
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(trajectories[i][j].y-offsetY),    // front bottom
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(trajectories[i][j].y-offsetY),    // front top
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(trajectories[i][j].y-offsetY),    // back bottom
                    scalingFactor*(trajectories[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(trajectories[i][j].y-offsetY)     // back top
                );

                var color = speedScale(trajectories[i][j].speed).rgb();

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

                var numberOfVertices = trajectories[i].length*8;

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
            object.parent = csvObjects[0];
            object.colors = colors.speed;
            object.visualization.speedColors = colors.speed;
            object.visualization.accelerationColors = colors.acceleration;
            csvObjects.push(object);
        }

        return csvObjects;
    };
};