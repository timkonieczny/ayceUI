EmptyObject = function(){
    this.position = new Ayce.Vector3();
    this.rotation = new Ayce.Quaternion();
    this.getGlobalRotation = function() { return this.rotation };
    this.getGlobalPosition = function() { return this.position };
    this.updateScript = function () {};
    this.ayceUI = new AyceUIMetaObject("empty object");
};