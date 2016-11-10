var uiFactory = new UIFactory();
var activeElement = null;

var showProperties = function(e) {
    document.getElementById("sidebar_right").style.display = "block";
    addClass(e, "button_dark_active");
    currentObjectId = e.dataset.id;
    uiFactory.resetAttributes();
    if (e.dataset.type == "plane"||
        e.dataset.type == "cube"||
        e.dataset.type == "sphere"||
        e.dataset.type == "icosahedron"||
        e.dataset.type == "csv"||
        e.dataset.type == "obj"){
        uiFactory.parent = true;
        uiFactory.position = true;
        uiFactory.rotation = true;
        uiFactory.scale = true;
        uiFactory.color = true;
        uiFactory.twoFaceTransparency = true;
        uiFactory.lighting = true;
        uiFactory.visibility = true;
        uiFactory.editScript = true;
    }else if(e.dataset.type == "light"){
        uiFactory.position = true;
        uiFactory.lightColor = true;
        uiFactory.lightSpecularColor = true;
        uiFactory.editScript = true;
    }else if(e.dataset.type == "camera"){
        uiFactory.camera = true;
        uiFactory.parent = true;
        // TODO: add editScript
    }
    uiFactory.inflatePropertiesUI(document.getElementById("properties_list"));

    e.removeEventListener("click", handleClickOnObject);
    e.addEventListener("click", hideProperties, false);
    if(activeElement!=null && activeElement != e){
        activeElement.removeEventListener("click", hideProperties);
        activeElement.addEventListener("click", handleClickOnObject);
        removeClass(activeElement, "button_dark_active");
    }
    activeElement = e;
};

var hideProperties = function(){
    document.getElementById("sidebar_right").style.display = "none";
    activeElement.removeEventListener("click", hideProperties);
    activeElement.addEventListener("click", handleClickOnObject);
    removeClass(activeElement, "button_dark_active");
};