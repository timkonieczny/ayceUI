attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;
uniform vec3 uAmbientColor;
uniform vec3 uPointLightingLocations[1];
uniform vec3 uPointLightingColors[1];
const int cLightCount = 1;
varying vec4 vColor;
varying vec3 vLightWeighting;
void main(void) {
    vec4 position = uMVMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * position;                          // TODO: add uniforms for color mode selection
    vColor = aVertexColor;
    vLightWeighting = uAmbientColor;
    vec3 transformedNormal = uNMatrix * aVertexNormal;
    vec3 normal = normalize(transformedNormal);
    vec3 eyeDirection = normalize(-position.xyz);
    for(int i = 0; i < cLightCount; i++){
        vec3 lightDirection = normalize(uPointLightingLocations[i] - position.xyz);
        vec3 reflectionDirection = reflect(-lightDirection, normal);
        float diffuseLightWeighting = max(dot(normalize(transformedNormal), lightDirection), 0.0);
        vLightWeighting += uPointLightingColors[i] * diffuseLightWeighting;
    }
}