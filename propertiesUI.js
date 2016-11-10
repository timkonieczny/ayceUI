var uiFactory = new UIFactory();

var showProperties = function(e) {
    document.getElementById("sidebar_right").style.display = "block";
    addClass(this, "button_dark_active");
    currentObjectId = this.dataset.id;
    uiFactory.resetAttributes();
    if (e.srcElement.dataset.type == "plane"||
        e.srcElement.dataset.type == "cube"||
        e.srcElement.dataset.type == "sphere"||
        e.srcElement.dataset.type == "icosahedron"||
        e.srcElement.dataset.type == "obj"){
        uiFactory.parent = true;
        uiFactory.position = true;
        uiFactory.rotation = true;
        uiFactory.scale = true;
        uiFactory.color = true;
        uiFactory.twoFaceTransparency = true;
        uiFactory.lighting = true;
        uiFactory.visibility = true;
        uiFactory.editScript = true;
    }else if(e.srcElement.dataset.type == "light"){
        uiFactory.position = true;
        uiFactory.lightColor = true;
        uiFactory.lightSpecularColor = true;
        uiFactory.editScript = true;
    }else if(e.srcElement.dataset.type == "camera"){
        uiFactory.camera = true;
        uiFactory.parent = true;
        // TODO: add editScript
    }
    uiFactory.inflatePropertiesUI(document.getElementById("properties_list"));

    this.removeEventListener("click", showProperties);
    this.addEventListener("click", hideProperties, false);
    if(activeElement!=null && activeElement != this){
        activeElement.removeEventListener("click", hideProperties);
        activeElement.addEventListener("click", showProperties, false);
        removeClass(activeElement, "button_dark_active");
    }
    activeElement = this;
};

var hideProperties = function(){
    document.getElementById("sidebar_right").style.display = "none";
    this.removeEventListener("click", hideProperties);
    this.addEventListener("click", showProperties, false);
    removeClass(activeElement, "button_dark_active");
};