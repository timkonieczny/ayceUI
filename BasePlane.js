BasePlane = function (a, b, xSubdivisions, zSubdivisions) {
    Ayce.Geometry.call(this);

    this.a = a || 0;
    this.b = b || 0;
    this.xVertices = xSubdivisions || 2;
    this.zVertices = zSubdivisions || 2;
};
BasePlane.prototype = new Ayce.Geometry();
BasePlane.prototype.getO3D = function () {

    var o3D = new Ayce.Object3D();

    var subX = this.xVertices;
    var subZ = this.zVertices;
    var width = this.a;
    var height = this.b;
    var offsetX = width/(subX-1);
    var offsetZ = height/(subZ-1);
    var startX = -width/2;
    var startZ = -height/2;

    o3D.vertices = [];
    o3D.indices = [];
    o3D.colors = [];

    for(var i = 0; i < subZ; i++){
        o3D.vertices.push(
            startX, 0, startZ+i*offsetZ,
            -startX, 0, startZ+i*offsetZ
        );

        if(i == Math.floor(subZ/2)){
            o3D.colors.push(
                1.0, 0.5, 0.5, 1.0,
                1.0, 0.5, 0.5, 1.0
            );
        }else {
            o3D.colors.push(
                0.5, 0.5, 0.5, 1.0,
                0.5, 0.5, 0.5, 1.0
            );
        }
    }

    for(i = 0; i < subX; i++){
        o3D.vertices.push(
            startX+i*offsetX, 0, startZ,
            startX+i*offsetX, 0, -startZ
        );

        if(i == Math.floor(subX/2)){
            o3D.colors.push(
                0.5, 0.5, 1.0, 1.0,
                0.5, 0.5, 1.0, 1.0
            );
        }else {
            o3D.colors.push(
                0.5, 0.5, 0.5, 1.0,
                0.5, 0.5, 0.5, 1.0
            );
        }
    }

    o3D.vertices.push(
        0, height/2, 0,
        0, -height/2, 0
    );
    o3D.colors.push(
        0.5, 1.0, 0.5, 1.0,
        0.5, 1.0, 0.5, 1.0
    );

    for(i = 0; i < o3D.vertices.length/3; i++){
        o3D.indices.push(i);
    }

    o3D.position = this.position;
    o3D.rotation = this.rotation;
    o3D.scale = this.scale;
    o3D.isWireframe = true;

    return o3D;
};