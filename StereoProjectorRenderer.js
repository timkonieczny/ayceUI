/**
 * jslint browser: true
 */

/**
 * Creates renderer for use with stereo projector
 * @param {Canvas} canvas
 * @class
 * @constructor
 */
StereoProjectorRenderer = function (canvas) {

    Ayce.Renderer.call(this, canvas);

    var i = 0;

    this.update = function(camera, objects, transparentObjects){
        for(i=0; i < objects.length; i++){
            objects[i].buffer.updateVR(camera);
        }
        for(i=0; i < transparentObjects.length; i++){
            transparentObjects[i].buffer.updateVR(camera);
        }
    };

    /**
     * Renders objects
     * @param {Camera} camera
     * @param {Ayce.Object3D[]} objects
     * @param {Ayce.Object3D[]} transparentObjects
     */
    this.render = function (camera, objects, transparentObjects) {

        this.setViewportAndScissor(0, 0, canvas.width/2, canvas.height);

        var buffer;
        // Render opaque objects
        for (i=0; i<objects.length; i++) {
            buffer = objects[i].buffer;
            buffer.renderVR("left");
        }

        // Render transparent objects
        for (i=0; i<transparentObjects.length; i++) {
            buffer = transparentObjects[i].buffer;      // TODO: Do textured objects show up? With alpha too?
            console.log(transparentObjects[i]);
            buffer.renderVR("left");
        }

        this.setViewportAndScissor(canvas.width/2, 0, canvas.width/2, canvas.height);

        // Render opaque objects
        for (i=0; i<objects.length; i++) {
            buffer = objects[i].buffer;
            buffer.renderVR("right");
        }

        // Render transparent objects
        for (i=0; i<transparentObjects.length; i++) {
            buffer = transparentObjects[i].buffer;
            buffer.renderVR("right");
        }
    };
};

StereoProjectorRenderer.prototype = new Ayce.Renderer();