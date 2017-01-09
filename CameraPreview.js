CameraPreview = function() {

    var scope = this;
    this.canvas = document.getElementById("camera_preview");
    this.scene = new Ayce.Scene(this.canvas);
    this.modifier = new Ayce.CameraModifier();
    this.modifier.script = function(){};
    this.modifier.initScript = function(){
        var MainCameraModifier2 = function (canvas) {

            var mouse = {
                isLeftDown: false,
                isRightDown: false,
                isMiddleDown: false,
                isWheelMoved: false,
                position: new Ayce.Vector2(0, 0),
                lastPosition: new Ayce.Vector2(0, 0),
                isInitialized: false,
                movement: new Ayce.Vector2(0, 0),
                wheel: 0,
                alias: {
                    isLeftDown: false,
                    isMiddleDown: false,
                    isRightDown: false,
                    wasLeftDown: false,
                    wasMiddleDown: false,
                    wasRightDown: false
                }
            };

            var moveSpeed = 0.01;
            var rotSpeed = 0.2;
            this.position = new Ayce.Vector3();
            this.rotation = new Ayce.Quaternion();
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
                mouse.alias.wasMiddleDown = mouse.alias.isMiddleDown;
                mouse.alias.wasRightDown = mouse.alias.isRightDown;
                mouse.alias.isMiddleDown = Ayce.KeyboardHandler.isKeyDown("ctrl");
                mouse.alias.isRightDown = Ayce.KeyboardHandler.isKeyDown("shift");
                if(mouse.alias.wasMiddleDown!=mouse.alias.isMiddleDown || mouse.alias.wasRightDown!=mouse.alias.isRightDown)
                    mouse.isInitialized = false;
                if(mouse.isMiddleDown||mouse.isRightDown||mouse.alias.isMiddleDown||mouse.alias.isRightDown){
                    mouse.position.x = e.x;
                    mouse.position.y = e.y;
                }
            });

            canvas.addEventListener("wheel", function (e){
                mouse.wheel = e.deltaY;
                mouse.isWheelMoved = true;
            });

            this.update = function(orientation){
                if(mouse.isMiddleDown||mouse.isRightDown||mouse.alias.isMiddleDown||mouse.alias.isRightDown){
                    if(mouse.isInitialized){
                        mouse.movement.x = (-mouse.position.x + mouse.lastPosition.x);
                        mouse.movement.y = (mouse.position.y - mouse.lastPosition.y);
                        if(mouse.isMiddleDown||mouse.alias.isMiddleDown) {
                            rotatedTranslation.x = mouse.movement.x;
                            rotatedTranslation.y = mouse.movement.y;
                            rotatedTranslation.z = 0;
                            rotatedTranslation = orientation.getRotatedPoint(rotatedTranslation);
                            this.position.add(
                                rotatedTranslation.x * moveSpeed,
                                rotatedTranslation.y * moveSpeed,
                                rotatedTranslation.z * moveSpeed
                            );
                        }else if(mouse.isRightDown||mouse.alias.isRightDown){
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
                            this.rotation = xAxis;
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
                    this.position.add(
                        rotatedTranslation.x * moveSpeed,
                        rotatedTranslation.y * moveSpeed,
                        rotatedTranslation.z * moveSpeed
                    );
                    mouse.isWheelMoved = false;
                }
            };

            this.getPosition = function(){
                return this.position;
            };

            this.getOrientation = function(){
                return this.rotation;
            };
        };

        MainCameraModifier2.prototype = new Ayce.CameraModifier();
        var mainModifier = new MainCameraModifier2(document.getElementById('ayce_canvas'));
        var oldModifier = scene.getCamera().getManager().modifiers[0];
        mainModifier.position.x = oldModifier.position.x;
        mainModifier.position.y = oldModifier.position.y;
        mainModifier.position.z = oldModifier.position.z;
        mainModifier.orientation.x = oldModifier.orientation.x;
        mainModifier.orientation.y = oldModifier.orientation.y;
        mainModifier.orientation.z = oldModifier.orientation.z;
        mainModifier.orientation.w = oldModifier.orientation.w;
        scene.getCamera().getManager().modifiers.push(mainModifier);
        scene.getCamera().getManager().modifiers.splice(0,1);
    };
    this.modifier.runScriptInPreview = false;   //TODO: is this in exported code?
    this.modifier.runInitScript = false;
    this.modifier.ayceUI = new AyceUIMetaObject("camera");
    this.modifier.ayceUI.id = null;
    this.objects = [];
    this.modifier.position.y = .5;
    this.scene.getCamera().getManager().modifiers.push(this.modifier);
    //this.scene.getCamera().getManager().cameraProperties.eyeTranslationL = -0.5;
    //this.scene.getCamera().getManager().cameraProperties.eyeTranslationR = 0.5;
    this.renderer = new StereoProjectorRenderer(scope.canvas);

    this.ayceUI = new AyceUIMetaObject("camera");
    this.ayceUI.id = null;
    this.renderPreview = false;

    this.update = function() {

        for(var i=0; i < this.objects.length; i++) if(this.objects[i]) this.objects[i].script();

        this.scene.updateScene();
        this.scene.drawScene();
    };

    this.expand = function(){
        setId(document.getElementById("camera_preview_wrapper"), "camera_preview_expanded");
        document.getElementById("camera_preview_expand").style.display = "none";
        document.getElementById("camera_preview_expanded_controls").style.display = "inline-block";
        scope.scene.resize();
    };

    this.compress = function(){
        setId(document.getElementById("camera_preview_expanded"), "camera_preview_wrapper");
        document.getElementById("camera_preview_expand").style.display = "inline-block";
        document.getElementById("camera_preview_expanded_controls").style.display = "none";
        document.getElementById("camera_preview_view_desktop").style.display = "none";
        document.getElementById("camera_preview_view_vr").style.display = "block";
        document.getElementById("camera_preview_view_stereo").style.display = "block";
        scope.scene.setRendererDesktop();
        scope.scene.resize();
    };

    document.getElementById("camera_preview_view_vr").addEventListener("click", function(){
        scope.scene.setRendererVR(false);
        document.getElementById("camera_preview_view_stereo").style.display = "block";
        document.getElementById("camera_preview_view_desktop").style.display = "block";
        document.getElementById("camera_preview_view_vr").style.display = "none";
    });

    document.getElementById("camera_preview_view_desktop").addEventListener("click", function(){
        scope.scene.setRendererDesktop();
        document.getElementById("camera_preview_view_stereo").style.display = "block";
        document.getElementById("camera_preview_view_desktop").style.display = "none";
        document.getElementById("camera_preview_view_vr").style.display = "block";
    });

    document.getElementById("camera_preview_view_stereo").addEventListener("click", function(){
        scope.scene.setRenderer(scope.renderer);
        scope.scene.getCamera().useVR = true;
        document.getElementById("camera_preview_view_stereo").style.display = "none";
        document.getElementById("camera_preview_view_desktop").style.display = "block";
        document.getElementById("camera_preview_view_vr").style.display = "block";
    });
};