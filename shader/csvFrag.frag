precision mediump float;
varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying vec4 vColor;
uniform vec3 uAmbientColor;
uniform vec3 uPointLightingLocations[1];
uniform vec3 uPointLightingColors[1];
const int cLightCount = 1;
void main(void) {
    vec4 fragmentColor;
    vec3 lightWeighting = uAmbientColor;
    vec3 normal = normalize(vTransformedNormal);
    vec3 eyeDirection = normalize(-vPosition.xyz);
    for(int i = 0; i < cLightCount; i++){
        vec3 lightDirection = normalize(uPointLightingLocations[i] - vPosition.xyz);
        vec3 reflectionDirection = reflect(-lightDirection, normal);
        float diffuseLightWeighting = max(dot(normalize(vTransformedNormal), lightDirection), 0.0);
        lightWeighting += uPointLightingColors[i] * diffuseLightWeighting;
    }
    fragmentColor = vColor;
    gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
}