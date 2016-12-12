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
        var data = [];
        var csvTraj = trajString;
        var csvData = dataString;
        csvTraj = csvTraj.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        csvTraj = csvTraj.replace("trID,trN,pIdx,X,Y,time,SPEED,COURSE,SPEED_C,ACCELERATION_C,COURSE_C,TURN_C\n", "");
        csvTraj = csvTraj.split("\n");

        csvData = csvData.replace(/^\s+|\s+cn$/g, "");    // remove \n from start and end of string
        csvData = csvData.replace("id,Name,trN,trN,Entity ID,Number of positions,Track length,Start date+time,End date+time,Start date,End date,Start time,End time,Duration (second),Duration (minutes),Duration (hours),Year (start),Year (end),Month (start),Month (end),Day of week (start),Day of week (end),Hour (start),Hour (end),Stop duration,Stop duration (hours),Stop duration (minutes),Distance to next trajectory,max_SPEED,median_SPEED,Clusters (Route similarity; 1km/5)\n", "");
        csvData = csvData.split("\n");

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
            if(data[j][data[j].length-1].speed!=null)
                speeds.push(data[j][data[j].length - 1].speed);
            if(data[j][data[j].length-1].accelerationC!=null)
                accelerations.push(data[j][data[j].length-1].accelerationC);
        }

        for(i = 0; i < csvData.length; i++){
            point = csvData[i].split(",");
            for(j = 0; j < data[i].length; j++){
                if(data[i][j].trID == point[0]){
                    data[i][j].name =                       point[1]!="" ? point[1] : null;
                    data[i][j].entityID =                   point[4]!="" ? point[4] : null;
                    data[i][j].numberOfPositions =          point[5]!="" ? Number(point[5]) : null;
                    data[i][j].trackLength =                point[6]!="" ? Number(point[6]) : null;
                    data[i][j].startDateTime =              point[7]!="" ? point[7] : null;
                    data[i][j].endDateTime =                point[8]!="" ? point[8] : null;
                    data[i][j].startDate =                  point[9]!="" ? point[9] : null;
                    data[i][j].endDate =                    point[10]!="" ? point[10] : null;
                    data[i][j].startTime =                  point[11]!="" ? point[11] : null;
                    data[i][j].endTime =                    point[12]!="" ? point[12] : null;
                    data[i][j].durationSeconds =            point[13]!="" ? Number(point[13]) : null;
                    data[i][j].durationMinutes =            point[14]!="" ? Number(point[14]) : null;
                    data[i][j].durationHours =              point[15]!="" ? Number(point[15]) : null;
                    data[i][j].startYear =                  point[16]!="" ? Number(point[16]) : null;
                    data[i][j].endYear =                    point[17]!="" ? Number(point[17]) : null;
                    data[i][j].startMonth =                 point[18]!="" ? Number(point[18]) : null;
                    data[i][j].endMonth =                   point[19]!="" ? Number(point[19]) : null;
                    data[i][j].startDayOfWeek =             point[20]!="" ? Number(point[20]) : null;
                    data[i][j].endDayOfWeek =               point[21]!="" ? Number(point[21]) : null;
                    data[i][j].startHour =                  point[22]!="" ? Number(point[22]) : null;
                    data[i][j].endHour =                    point[23]!="" ? Number(point[23]) : null;
                    data[i][j].stopDuration =               point[24]!="" ? Number(point[24]) : null;
                    data[i][j].stopDurationHours =          point[25]!="" ? Number(point[25]) : null;
                    data[i][j].stopDurationMinutes =        point[26]!="" ? Number(point[26]) : null;
                    data[i][j].distanceToNextTrajectory =   point[27]!="" ? Number(point[27]) : null;
                    data[i][j].maxSpeed =                   point[28]!="" ? Number(point[28]) : null;
                    data[i][j].medianSpeed =                point[29]!="" ? Number(point[29]) : null;
                    data[i][j].clusters =                   point[30]!="" ? Number(point[30]) : null;
                }
            }
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
        for(i = 0; i < data.length; i++) {
            for(j = 0; j < data[i].length; j++) {
                if(data[i][j].x){
                    offsetX += data[i][j].x;
                    if(maxX)
                        maxX = Math.max(maxX, data[i][j].x);
                    else
                        maxX = data[i][j].x;

                    if(maxY)
                        maxY = Math.max(maxY, data[i][j].y);
                    else
                        maxY = data[i][j].y;

                    if(minX)
                        minX = Math.min(minX, data[i][j].x);
                    else
                        minX = data[i][j].x;

                    if(minY)
                        minY = Math.min(minY, data[i][j].y);
                    else
                        minY = data[i][j].y;
                }
                if(data[i][j].y){
                    offsetY += data[i][j].y;
                }
                numberOfPoints++;
            }
        }
        offsetX /= numberOfPoints;
        offsetY /= numberOfPoints;
        var scalingFactor = boundarySize/Math.max(maxX-minX, maxY-minY);

        for(i = 0; i < data.length; i++){
            var object = new Ayce.Object3D();
            object.visualization = {            // TODO: grab data from data file
                id: data[i][0].trID
            };
            colors.reset();
            object.vertices = [];
            object.indices = [];
            object.colors = [];
            for(j = 0; j < data[i].length; j++) {
                object.vertices.push(
                    scalingFactor*(data[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(data[i][j].y-offsetY),    // foreign front bottom
                    scalingFactor*(data[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(data[i][j].y-offsetY),    // foreign front top
                    scalingFactor*(data[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(data[i][j].y-offsetY),    // foreign back bottom
                    scalingFactor*(data[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(data[i][j].y-offsetY),    // foreign back top
                    scalingFactor*(data[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(data[i][j].y-offsetY),    // front bottom
                    scalingFactor*(data[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(data[i][j].y-offsetY),    // front top
                    scalingFactor*(data[i][j].x-offsetX),   i*trajectoryHeight,                 scalingFactor*(data[i][j].y-offsetY),    // back bottom
                    scalingFactor*(data[i][j].x-offsetX),   i*trajectoryHeight+trajectoryHeight,scalingFactor*(data[i][j].y-offsetY)     // back top
                );

                var color = speedScale(data[i][j].speed).rgb();

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

                color = accelerationScale(data[i][j].acceleration).rgb();

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
            if(csvObjects.length == 0) csvObjects.push(new EmptyObject());
            else {
                object.parent = csvObjects[0];
                object.colors = colors.speed;
                object.visualization.speedColors = colors.speed;
                object.visualization.accelerationColors = colors.acceleration;
                csvObjects.push(object);
            }
        }

        return csvObjects;
    };
};