var UIFactory = function(){
    this.position = false;
    this.rotation = false;
    this.scale = false;                     // TODO: move propertiesUI here. Set onwheel, onchange in buildUI
    this.color = false;
    this.twoFaceTransparency = false;
    this.lighting = false;
    this.visibility = false;
    this.camera = false;
    this.editScript = false;

    this.resetAttributes = function(){
        this.position = false;
        this.rotation = false;
        this.scale = false;
        this.color = false;
        this.twoFaceTransparency = false;
        this.lighting = false;
        this.visibility = false;
        this.camera = false;
        this.editScript = false;
    };

    this.buildUI = function(){
        var ui = "";
        if(this.position){
            ui+='<li>Position:<br>' +
                '<input class="property_input" id="position_x" title="position_x"/>' +
                '<input class="property_input" id="position_y" title="position_y"/>' +
                '<input class="property_input" id="position_z" title="position_z"/>' +
                '</li>';
        }
        if(this.rotation){
            ui+='<li>Rotation:<br>' +
                '<input class="property_input" id="rotation_x" title="rotation_x"/>' +
                '<input class="property_input" id="rotation_y" title="rotation_y"/>' +
                '<input class="property_input" id="rotation_z" title="rotation_z"/>' +
                '</li>';
        }
        if(this.scale){
            ui+='<li>Scale:<br>' +
                '<input class="property_input" id="scale_x" title="scale_x"/>' +
                '<input class="property_input" id="scale_y" title="scale_y"/>' +
                '<input class="property_input" id="scale_z" title="scale_z"/>' +
                '</li>';
        }
        if(this.color){
            ui+='<li>Color:<br>' +
                '<input class="property_input" id="colors_r" title="colors_r"/>' +
                '<input class="property_input" id="colors_g" title="colors_g"/>' +
                '<input class="property_input" id="colors_b" title="colors_b"/>' +
                '<input class="property_input" id="colors_a" title="colors_a"/>' +
                '</li>';
        }
        if(this.twoFaceTransparency){
            ui+='<li>Two-Face Transparency:<br>' +
                '<input class="property_input" id="two_face_transparency" type="checkbox" title="two_face_transparency"/>' +
                '</li>';
        }
        if(this.lighting){
            ui+='<li>Lighting:<br>' +
                '<input class="property_input" id="use_fragment_lighting" type="checkbox"/>' +
                '<label for="use_fragment_lighting">Fragment Lighting</label>' +
                '<input class="property_input" id="use_specular_lighting" type="checkbox"/>' +
                '<label for="use_specular_lighting">Specular Lighting</label>' +
                '</li>';
        }
        if(this.lighting){
            ui+='<li>Visible:<br>' +
                '<input class="property_input" id="visible" type="checkbox" title="visible"/>' +
                '</li>';
        }
        if(this.editScript){
            ui+='<li>Scripts:<br>' +
                '<a id="edit_script" class="button_dark"><i class="fa fa-code"></i>Edit script</a>' +
                '<input class="property_input" id="run_script_in_preview" type="checkbox"/>' +
                '<label for="run_script_in_preview">Run script in preview</label>' +
                '</li>';
        }
        if(this.camera){
            ui+='<li>Position:<br>' +
                '<input class="property_input" id="camera_position_x" title="camera_position_x"/>' +
                '<input class="property_input" id="camera_position_y" title="camera_position_y"/>' +
                '<input class="property_input" id="camera_position_z" title="camera_position_z"/>' +
                '</li>' +
                '<li>Rotation:<br>' +
                '<input class="property_input" id="camera_rotation_x" title="camera_rotation_x"/>' +
                '<input class="property_input" id="camera_rotation_y" title="camera_rotation_y"/>' +
                '<input class="property_input" id="camera_rotation_z" title="camera_rotation_z"/>' +
                '</li>';
        }
        return ui;
    }
};