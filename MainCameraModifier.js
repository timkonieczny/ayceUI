MainCameraModifier = function (canvas) {

    var mouse = {                               // TODO: add alias with keyboard+mouse
        isLeftDown: false,
        isRightDown: false,
        isMiddleDown: false,
        isWheelMoved: false,
        position: new Ayce.Vector2(0, 0),
        lastPosition: new Ayce.Vector2(0, 0),
        isInitialized: false,
        movement: new Ayce.Vector2(0, 0),
        wheel: 0
    };

    var moveSpeed = 0.01;
    var rotSpeed = 0.2;
    var position = new Ayce.Vector3();
    var rotation = new Ayce.Quaternion();
    var rotX = 0;
    var rotY = 0;
    var xAxis = new Ayce.Quaternion();
    var yAxis = new Ayce.Quaternion();
    var trivialX = new Ayce.Vector3(1,0,0);
    var trivialY = new Ayce.Vector3(0,1,0);
    var rotatedTranslation = new Ayce.Vector3(0, 0, 0);

    canvas.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });

    canvas.addEventListener("mousedown", function(e){
        e.preventDefault();
        switch(e.button){
            case 0:
                mouse.isLeftDown = true;
                break;
            case 1:
                mouse.isMiddleDown = true;
                break;
            case 2:
                mouse.isRightDown = true;
        }

        mouse.position.x = e.x;
        mouse.position.y = e.y;

        return false;
    });

    canvas.addEventListener("mouseup", function(e){
        e.preventDefault();
        switch(e.button){
            case 0:
                mouse.isLeftDown = false;
                break;
            case 1:
                mouse.isMiddleDown = false;
                break;
            case 2:
                mouse.isRightDown = false;
        }
        mouse.isInitialized = false;
        return false;
    });

    canvas.addEventListener("mousemove", function (e) {
        if(mouse.isLeftDown||mouse.isMiddleDown||mouse.isRightDown){
            mouse.position.x = e.x;
            mouse.position.y = e.y;
        }
    });

    canvas.addEventListener("wheel", function (e){
        mouse.wheel = e.deltaY;
        mouse.isWheelMoved = true;
    });

    this.update = function(orientation){
        if(mouse.isLeftDown||mouse.isRightDown||mouse.isMiddleDown){
            if(mouse.isInitialized){
                mouse.movement.x = (-mouse.position.x + mouse.lastPosition.x);
                mouse.movement.y = (mouse.position.y - mouse.lastPosition.y);
                if(mouse.isLeftDown) {
                    rotatedTranslation.x = mouse.movement.x;
                    rotatedTranslation.y = mouse.movement.y;
                    rotatedTranslation.z = 0;
                    rotatedTranslation = orientation.getRotatedPoint(rotatedTranslation);
                    position.add(
                        rotatedTranslation.x * moveSpeed,
                        rotatedTranslation.y * moveSpeed,
                        rotatedTranslation.z * moveSpeed
                    );
                }else if(mouse.isRightDown){
                    rotX += mouse.movement.x;       // mouse movement in x direction
                    rotY += -mouse.movement.y;      // mouse movement in y direction
                    //Cap rotation around x axis
                    if (rotY * rotSpeed > 90)
                        rotY = 90 / rotSpeed;
                    else if (rotY * rotSpeed < -90)
                        rotY = -90 / rotSpeed;

                    //Rotation around y axis from x mouse movment
                    yAxis.reset();
                    yAxis.fromAxisAngle(trivialY, rotX * rotSpeed * Math.PI / 180);
                    //Rotation around x axis from y mouse movment
                    xAxis.reset();
                    xAxis.fromAxisAngle(trivialX, rotY * rotSpeed * Math.PI / 180);

                    xAxis.multiply(xAxis, yAxis);
                    rotation = xAxis;
                }
            }else{
                mouse.isInitialized = true;
            }
            mouse.lastPosition.x = mouse.position.x;
            mouse.lastPosition.y = mouse.position.y;
        }
        if(mouse.isWheelMoved){
            rotatedTranslation.x = 0;
            rotatedTranslation.y = 0;
            rotatedTranslation.z = mouse.wheel;
            rotatedTranslation = orientation.getRotatedPoint(rotatedTranslation);
            position.add(
                rotatedTranslation.x * moveSpeed,
                rotatedTranslation.y * moveSpeed,
                rotatedTranslation.z * moveSpeed
            );
            mouse.isWheelMoved = false;
        }
    };

    this.getPosition = function(){
        return position;
    };

    this.getOrientation = function(){
        return rotation;
    };
};

MainCameraModifier.prototype = new Ayce.CameraModifier();