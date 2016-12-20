var uiFactory = new UIFactory();
var activeElement = null;

var showProperties = function(node) {
    document.getElementById("sidebar_right").style.display = "block";
    addClass(node, "button_dark_active");
    currentObjectId = node.dataset.id;
    uiFactory.resetAttributes();
    if (node.dataset.type == "plane"||
        node.dataset.type == "cube"||
        node.dataset.type == "sphere"||
        node.dataset.type == "icosahedron"||
        node.dataset.type == "obj"){
        uiFactory.parent = true;
        uiFactory.position = true;
        uiFactory.rotation = true;
        uiFactory.scale = true;
        uiFactory.color = true;
        uiFactory.twoFaceTransparency = true;
        uiFactory.lighting = true;
        uiFactory.visibility = true;
        uiFactory.editScript = true;
        if(objects[currentObjectId].textureCoords&&objects[currentObjectId].textureIndices){
            uiFactory.texture = true;
            uiFactory.numberOfTextures = getNumberOfUniqueElements(objects[currentObjectId].textureIndices);
        }
    }else if(node.dataset.type == "light"){
        uiFactory.position = true;
        uiFactory.lightColor = true;
        uiFactory.lightSpecularColor = true;
        uiFactory.editScript = true;
    }else if(node.dataset.type == "camera"){
        uiFactory.camera = true;
        //uiFactory.parent = true;
        // TODO: add editScript
    }else if(node.dataset.type == "skybox"){
        //uiFactory.editScript = true;      // TODO: editScript, visibility
        //uiFactory.visibility = true;
        uiFactory.skybox = true;
        uiFactory.numberOfTextures = getNumberOfUniqueElements(objects[currentObjectId].textureIndices);
    }else if(node.dataset.type == "csv"){
        uiFactory.csv = true;
        uiFactory.parent = true;
        uiFactory.position = true;
        uiFactory.rotation = true;
        uiFactory.scale = true;
        uiFactory.color = true;
        uiFactory.twoFaceTransparency = true;
        uiFactory.lighting = true;
        uiFactory.visibility = true;
        uiFactory.editScript = true;
    }else if(node.dataset.type == "empty"){
        uiFactory.parent = true;
        uiFactory.position = true;
        uiFactory.rotation = true;
        var nextSibling = document.getElementById(currentObjectId).nextElementSibling;
        while(nextSibling && nextSibling.dataset.type!="csv"){
            nextSibling = nextSibling.nextElementSibling;
        }
        if(nextSibling){
            uiFactory.sortData = objects[Number(nextSibling.id)].visualization;
        }else{
            uiFactory.sortData = false;
        }
        uiFactory.visualizationColors = true;
    }
    uiFactory.inflatePropertiesUI(document.getElementById("properties_list"));

    node.removeEventListener("click", handleClickOnObject);
    node.addEventListener("click", hideProperties, false);
    if(activeElement!=null && activeElement != node){
        activeElement.removeEventListener("click", hideProperties);
        activeElement.addEventListener("click", handleClickOnObject);
        removeClass(activeElement, "button_dark_active");
    }
    activeElement = node;
};

var hideProperties = function(){
    document.getElementById("sidebar_right").style.display = "none";
    activeElement.removeEventListener("click", hideProperties);
    activeElement.addEventListener("click", handleClickOnObject);
    removeClass(activeElement, "button_dark_active");
};