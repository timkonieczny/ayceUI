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

    o3D.indices = [];
    o3D.vertices = [];

    for(var i = 0; i < subX; i++){
        for(var j = 0; j < subZ; j++) {
            o3D.vertices.push(
                startX+i*offsetX, 0, startZ+j*offsetZ
            );
        }
    }
    for(i = 0; i < subZ; i++){
        for(j = 0; j < subX; j++) {
            o3D.indices.push(i + j*subZ);
            if(j>0 && j < subX-1)
                o3D.indices.push(i + j*subZ);
        }
    }
    for(i = 0; i < subX; i++){
        for(j = 0; j < subZ; j++){
            o3D.indices.push(i*subZ+j);
            if(j>0 && j < subZ-1)
                o3D.indices.push(i*subZ+j);
        }
    }

    o3D.position = this.position;
    o3D.rotation = this.rotation;
    o3D.scale = this.scale;
    o3D.isWireframe = true;

    return o3D;
};