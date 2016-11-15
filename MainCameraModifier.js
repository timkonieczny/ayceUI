MainCameraModifier = function (canvas) {

    var mouse = {
        isLeftDown: false,
        isRightDown: false,
        isMiddleDown: false,
        position: new Ayce.Vector2(0, 0),
        lastPosition: new Ayce.Vector2(0, 0),
        isInitialized: false
    };

    var moveSpeed = 0.01;
    var position = new Ayce.Vector3();
    var rotation = new Ayce.Quaternion();

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
        if(mouse.isLeftDown){
            mouse.position.x = e.x;
            mouse.position.y = e.y;
        }
    });

    this.update = function(orientation){
        if(mouse.isLeftDown){
            if(mouse.isInitialized){
                position.add(
                    (-mouse.position.x+mouse.lastPosition.x)*moveSpeed,
                    (mouse.position.y-mouse.lastPosition.y)*moveSpeed,
                    0
                );
            }else{
                mouse.isInitialized = true;
            }
            mouse.lastPosition.x = mouse.position.x;
            mouse.lastPosition.y = mouse.position.y;
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