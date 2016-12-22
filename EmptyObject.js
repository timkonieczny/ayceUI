EmptyObject = function(){
    this.position = new Ayce.Vector3();
    this.rotation = new Ayce.Quaternion();
    this.getGlobalRotation = function() { return this.rotation };
    this.getGlobalPosition = function() { return this.position };
    this.script = function () {};
    this.ayceUI = {
        id: objects.length-1,
        screenName: "empty object",
        runScriptInPreview: false,
        runInitScript: false
    };
};