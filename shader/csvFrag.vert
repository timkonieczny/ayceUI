attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;
varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying vec4 vColor;
void main(void) {
    vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    vec4 position = vPosition;
    gl_Position = uPMatrix * position;
    vColor = aVertexColor;
    vTransformedNormal = uNMatrix * aVertexNormal;
}