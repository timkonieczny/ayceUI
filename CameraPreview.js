CameraPreview = function() {

    var scope = this;
    this.canvas = document.getElementById("ayce_canvas");
    this.scene = new Ayce.Scene(scope.canvas);
    this.modifier = new Ayce.CameraModifier();
    this.modifier.updateScript = function(){};
    this.modifier.initScript = function(){};
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

        for(var i=0; i < this.objects.length; i++) if(this.objects[i]) {
            this.objects[i].updateScript();
        }

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