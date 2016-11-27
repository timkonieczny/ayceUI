CSVLoader = function(){

    var factor = 10;
    var subtractX = 7;  // TODO: calculate dynamically based on statistic of whole data set
    var subtractY = 50;
    var offsetX = -2;
    var offsetY = -7.5;
    var yHeight = 0.02;

    var colors = {
        speed: [],
        acceleration: [],
        reset: function(){
            this.speed = [];
            this.acceleration = []
        }
    };

    this.getO3Ds = function(e){
        var data = [];
        var csv = e.currentTarget.result;
        csv = csv.replace(/^\s+|\s+$/g, "");    // remove \n from start and end of string
        csv = csv.replace("trID,trN,pIdx,X,Y,time,SPEED,COURSE,SPEED_C,ACCELERATION_C,COURSE_C,TURN_C\n", "");
        csv = csv.split("\n");
        var point;
        var prevTrID = null;
        var j = -1;

        var maxSpeed = 0;
        var maxAcceleration = 0;

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
            if(data[j][data[j].length-1].accelerationC!=null)
                maxAcceleration = Math.max(maxAcceleration, data[j][data[j].length-1].accelerationC);
        }

        console.log("done (" + (Date.now()-csvTimer) + "ms)");

        var csvObjects = [];

        csvTimer = Date.now();
        console.log("building Ayce.Object3Ds");

        for(i = 0; i < data.length; i++){
            var object = new Ayce.Object3D();
            object.visualization = {            // TODO: grab data from data file
                id: data[i][0].trID
            };
            colors.reset();
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

                colors.speed.push(
                    data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                    data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                    data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                    data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                    data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                    data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                    data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0,
                    data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, data[i][j].speed/maxSpeed, 1.0
                );

                colors.acceleration.push(
                    data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, 1.0,
                    data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, 1.0,
                    data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, 1.0,
                    data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, 1.0,
                    data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, 1.0,
                    data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, 1.0,
                    data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, 1.0,
                    data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, data[i][j].accelerationC/maxAcceleration, 1.0
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
            if(csvObjects[0]!=undefined) object.parent = csvObjects[0];
            object.colors = colors.acceleration;

            object.visualization.speedColors = colors.speed;
            object.visualization.accelerationColors = colors.speed;

            object.visualization.vertexLightingShader = "shader/csvVert";   // Vertex lighting shader
            object.visualization.fragmentLightingShader = "shader/csvFrag";   // Fragment lighting shader

            object.shader = object.visualization.vertexLightingShader;

            csvObjects.push(object);
        }

        return csvObjects;
    };
};