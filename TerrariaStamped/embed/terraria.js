(() => {
    if (window.location.href.indexOf("editor") > -1) {
        const wait = setInterval(() => {
            if (document.querySelector("div[class*=menu-bar_main-menu_]")) {
                if (ScratchBlocks) {
                    ScratchBlocks.Blocks['looks_changeeffectby'] = {
                        /**
                         * Block to change graphic effect.
                         * @this Blockly.Block
                         */
                        init: function() {
                          this.jsonInit({
                            "message0": ScratchBlocks.Msg.LOOKS_CHANGEEFFECTBY,
                            "args0": [
                              {
                                "type": "field_dropdown",
                                "name": "EFFECT",
                                "options": [
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_COLOR, 'COLOR'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_FISHEYE, 'FISHEYE'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_WHIRL, 'WHIRL'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_PIXELATE, 'PIXELATE'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_MOSAIC, 'MOSAIC'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_BRIGHTNESS, 'BRIGHTNESS'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_GHOST, 'GHOST'],
                                  ["shade", 'shade'],
                                  ["red", 'red']
                                ]
                              },
                              {
                                "type": "input_value",
                                "name": "CHANGE"
                              }
                            ],
                            "category": ScratchBlocks.Categories.looks,
                            "extensions": ["colours_looks", "shape_statement"]
                          });
                        }
                      };
                      
                      ScratchBlocks.Blocks['looks_seteffectto'] = {
                        /**
                         * Block to set graphic effect.
                         * @this Blockly.Block
                         */
                        init: function() {
                          this.jsonInit({
                            "message0": ScratchBlocks.Msg.LOOKS_SETEFFECTTO,
                            "args0": [
                              {
                                "type": "field_dropdown",
                                "name": "EFFECT",
                                "options": [
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_COLOR, 'COLOR'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_FISHEYE, 'FISHEYE'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_WHIRL, 'WHIRL'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_PIXELATE, 'PIXELATE'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_MOSAIC, 'MOSAIC'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_BRIGHTNESS, 'BRIGHTNESS'],
                                  [ScratchBlocks.Msg.LOOKS_EFFECT_GHOST, 'GHOST'],
                                  ["shade", 'shade'],
                                  ["red", 'red']
                                ]
                              },
                              {
                                "type": "input_value",
                                "name": "VALUE"
                              }
                            ],
                            "category": ScratchBlocks.Categories.looks,
                            "extensions": ["colours_looks", "shape_statement"]
                          });
                        }
                      };
                }
                clearInterval(wait);
            }
        });
    }
    (new MutationObserver(e => e.forEach(async (event) => {
        if (event.addedNodes.length && event.addedNodes[0].querySelector) {
            if (event.addedNodes[0].querySelector("div[class*=menu-bar_main-menu_]")) {
                if (window.location.href.indexOf("editor") > -1) {
                    if (ScratchBlocks) {
                        ScratchBlocks.Blocks['looks_changeeffectby'] = {
                            /**
                             * Block to change graphic effect.
                             * @this Blockly.Block
                             */
                            init: function() {
                              this.jsonInit({
                                "message0": ScratchBlocks.Msg.LOOKS_CHANGEEFFECTBY,
                                "args0": [
                                  {
                                    "type": "field_dropdown",
                                    "name": "EFFECT",
                                    "options": [
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_COLOR, 'COLOR'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_FISHEYE, 'FISHEYE'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_WHIRL, 'WHIRL'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_PIXELATE, 'PIXELATE'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_MOSAIC, 'MOSAIC'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_BRIGHTNESS, 'BRIGHTNESS'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_GHOST, 'GHOST'],
                                      ["shade", 'shade'],
                                      ["red", 'red']
                                    ]
                                  },
                                  {
                                    "type": "input_value",
                                    "name": "CHANGE"
                                  }
                                ],
                                "category": ScratchBlocks.Categories.looks,
                                "extensions": ["colours_looks", "shape_statement"]
                              });
                            }
                          };
                          
                          ScratchBlocks.Blocks['looks_seteffectto'] = {
                            /**
                             * Block to set graphic effect.
                             * @this Blockly.Block
                             */
                            init: function() {
                              this.jsonInit({
                                "message0": ScratchBlocks.Msg.LOOKS_SETEFFECTTO,
                                "args0": [
                                  {
                                    "type": "field_dropdown",
                                    "name": "EFFECT",
                                    "options": [
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_COLOR, 'COLOR'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_FISHEYE, 'FISHEYE'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_WHIRL, 'WHIRL'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_PIXELATE, 'PIXELATE'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_MOSAIC, 'MOSAIC'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_BRIGHTNESS, 'BRIGHTNESS'],
                                      [ScratchBlocks.Msg.LOOKS_EFFECT_GHOST, 'GHOST'],
                                      ["shade", 'shade'],
                                      ["red", 'red']
                                    ]
                                  },
                                  {
                                    "type": "input_value",
                                    "name": "VALUE"
                                  }
                                ],
                                "category": ScratchBlocks.Categories.looks,
                                "extensions": ["colours_looks", "shape_statement"]
                              });
                            }
                          };
                    }
                }
            }
        }
    }))).observe(document.querySelector("div#app"),
        {
            attributes: true,
            childList: true,
            subtree: true
        }
    );
})();

vm.runtime.on("PROJECT_LOADED", async () => {
    if (vm.runtime.ext_pen) {
        const Stage = vm.runtime.getTargetForStage();
        const _penDrawableId = (() => {
            let e = Stage.lookupVariableByNameAndType("_penDrawableId");
            if (!e) e = Stage.createVariable("_penDrawableId", "_penDrawableId", "", false);
            return Stage.lookupVariableByNameAndType("_penDrawableId");
        })();
        const _penSkinId = (() => {
            let e = Stage.lookupVariableByNameAndType("_penSkinId");
            if (!e) e = Stage.createVariable("_penSkinId", "_penSkinId", "", false);
            return Stage.lookupVariableByNameAndType("_penSkinId");
        })();
        const terrariaPenTools = (() => {
            let e = Stage.lookupVariableByNameAndType("terrariaPenTools");
            if (!e) e = Stage.createVariable("terrariaPenTools", "terrariaPenTools", "", false);
            return Stage.lookupVariableByNameAndType("terrariaPenTools");
        })();
        Object.defineProperty(_penDrawableId, "value", {
            get: () => vm.runtime.ext_pen._penDrawableId,
            set: e => vm.runtime.ext_pen._penDrawableId = e
        });
        Object.defineProperty(_penSkinId, "value", {
            get: () => vm.runtime.ext_pen._penSkinId,
            set: e => vm.runtime.ext_pen._penSkinId = e
        });
        Object.defineProperty(terrariaPenTools, "value", {
            get: () => true,
            set: e => {}
        });
        const _penDrawableIdList = (() => {
            let e = Stage.lookupVariableByNameAndType("_penDrawableId", "list");
            if (!e) e = Stage.createVariable("_penDrawableId-list", "_penDrawableId", "list", false);
            return Stage.lookupVariableByNameAndType("_penDrawableId", "list");
        })();
        const _penSkinIdList = (() => {
            let e = Stage.lookupVariableByNameAndType("_penSkinId", "list");
            if (!e) e = Stage.createVariable("_penSkinId-list", "_penSkinId", "list", false);
            return Stage.lookupVariableByNameAndType("_penSkinId", "list");
        })();
        const penDrawIDs = [];
        const penSkinIDs = [];
        if (vm.runtime.ext_pen._penDrawableId > -1) penDrawIDs.push(vm.runtime.ext_pen._penDrawableId);
        if (vm.runtime.ext_pen._penSkinId > -1) penDrawIDs.push(vm.runtime.ext_pen._penSkinId);
        _penDrawableIdList.value = penDrawIDs;
        _penSkinIdList.value = penSkinIDs;
        vm.addAddonBlock({
            procedureCode: "create new pen layer",
            arguments: [],
            color: "#0FBD8C",
            secondaryColor: "#0DA57A",
            callback: () => {
                vm.runtime.ext_pen._penSkinId = vm.runtime.renderer.createPenSkin();
                vm.runtime.ext_pen._penDrawableId = vm.runtime.renderer.createDrawable("pen");
                vm.runtime.renderer.updateDrawableSkinId(vm.runtime.ext_pen._penDrawableId, vm.runtime.ext_pen._penSkinId);
                penDrawIDs.push(vm.runtime.ext_pen._penDrawableId);
                penSkinIDs.push(vm.runtime.ext_pen._penSkinId);
                _penDrawableIdList.value = penDrawIDs;
                _penSkinIdList.value = penSkinIDs;
                return true;
            }
        });
        vm.addAddonBlock({
            procedureCode: "clear tile at %s %s",
            arguments: ["x", "y"],
            color: "#0FBD8C",
            secondaryColor: "#0DA57A",
            callback: (args) => {
                const gl = vm.renderer.gl;
                const penSkin = vm.renderer._allSkins[vm.runtime.ext_pen._penSkinId];
                const [skinWidth, skinHeight] = penSkin._size;
                const texWidth = penSkin._uniforms.u_skinSize[0];
                const scale = skinWidth/texWidth;
                const offsetX = (args.x+236)*scale;
                const offsetY = skinHeight-(args.y+184)*scale;
                const offset = (offsetY*texWidth+offsetX)*4;
                gl.bindTexture(gl.TEXTURE_2D, penSkin._texture);
                gl.texSubImage2D(
                    gl.TEXTURE_2D,
                    0,
                    offsetX,
                    offsetY,
                    8*scale,
                    8*scale,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    new Uint8Array(8*scale*8*scale*4),
                    offset
                );
                gl.bindTexture(gl.TEXTURE_2D, null);
                vm.renderer.skinWasAltered(penSkin);
                return true;
            }
        });
    }
const _shaderManager = vm.renderer._shaderManager
const ShaderManager = _shaderManager.constructor;
if (!ShaderManager.EFFECT_INFO.shade) ShaderManager.EFFECTS.push("shade");
if (!ShaderManager.EFFECT_INFO.red) ShaderManager.EFFECTS.push("red");
ShaderManager.EFFECT_INFO.shade = {
    uniformName: "u_shade",
    mask: 1 << 7,
    converter: x => 1 - (Math.max(0, Math.min(x, 100)) / 100),
    shapeChanges: false
};
ShaderManager.EFFECT_INFO.red = {
    uniformName: "u_red",
    mask: 1 << 8,
    converter: x => 1 - (Math.max(0, Math.min(x, 100)) / 100),
    shapeChanges: false
};
_shaderManager.__proto__.getShader = function (drawMode, effectBits) {
    const cache = this._shaderCache[drawMode];
    if (drawMode === ShaderManager.DRAW_MODE.silhouette) {
        // Silhouette mode isn't affected by these effects.
        effectBits &= ~(ShaderManager.EFFECT_INFO.color.mask | ShaderManager.EFFECT_INFO.brightness.mask | ShaderManager.EFFECT_INFO.shade.mask | ShaderManager.EFFECT_INFO.red.mask);
    }
    let shader = cache[effectBits];
    if (!shader) {
        shader = cache[effectBits] = this._buildShader(drawMode, effectBits);
    }
    return shader;
}
_shaderManager.__proto__._buildShader = function (drawMode, effectBits) {
    const numEffects = ShaderManager.EFFECTS.length;

    const defines = [
        `#define DRAW_MODE_${drawMode}`
    ];
    for (let index = 0; index < numEffects; ++index) {
        if ((effectBits & (1 << index)) !== 0) {
            defines.push(`#define ENABLE_${ShaderManager.EFFECTS[index]}`);
        }
    }

    const definesText = `${defines.join('\n')}\n`;

    /* eslint-disable global-require */
    const vsFullText = 
`${definesText}
precision mediump float;

#ifdef DRAW_MODE_line
uniform vec2 u_stageSize;
attribute vec2 a_lineThicknessAndLength;
attribute vec4 a_penPoints;
attribute vec4 a_lineColor;

varying vec4 v_lineColor;
varying float v_lineThickness;
varying float v_lineLength;
varying vec4 v_penPoints;

// Add this to divisors to prevent division by 0, which results in NaNs propagating through calculations.
// Smaller values can cause problems on some mobile devices.
const float epsilon = 1e-3;
#endif

#if !(defined(DRAW_MODE_line) || defined(DRAW_MODE_background))
uniform mat4 u_projectionMatrix;
uniform mat4 u_modelMatrix;
attribute vec2 a_texCoord;
#endif

attribute vec2 a_position;

varying vec2 v_texCoord;

void main() {
#ifdef DRAW_MODE_line
// Calculate a rotated ("tight") bounding box around the two pen points.
// Yes, we're doing this 6 times (once per vertex), but on actual GPU hardware,
// it's still faster than doing it in JS combined with the cost of uniformMatrix4fv.

// Expand line bounds by sqrt(2) / 2 each side-- this ensures that all antialiased pixels
// fall within the quad, even at a 45-degree diagonal
vec2 position = a_position;
float expandedRadius = (a_lineThicknessAndLength.x * 0.5) + 1.4142135623730951;

// The X coordinate increases along the length of the line. It's 0 at the center of the origin point
// and is in pixel-space (so at n pixels along the line, its value is n).
v_texCoord.x = mix(0.0, a_lineThicknessAndLength.y + (expandedRadius * 2.0), a_position.x) - expandedRadius;
// The Y coordinate is perpendicular to the line. It's also in pixel-space.
v_texCoord.y = ((a_position.y - 0.5) * expandedRadius) + 0.5;

position.x *= a_lineThicknessAndLength.y + (2.0 * expandedRadius);
position.y *= 2.0 * expandedRadius;

// 1. Center around first pen point
position -= expandedRadius;

// 2. Rotate quad to line angle
vec2 pointDiff = a_penPoints.zw;
// Ensure line has a nonzero length so it's rendered properly
// As long as either component is nonzero, the line length will be nonzero
// If the line is zero-length, give it a bit of horizontal length
pointDiff.x = (abs(pointDiff.x) < epsilon && abs(pointDiff.y) < epsilon) ? epsilon : pointDiff.x;
// The \`normalized\` vector holds rotational values equivalent to sine/cosine
// We're applying the standard rotation matrix formula to the position to rotate the quad to the line angle
// pointDiff can hold large values so we must divide by u_lineLength instead of calling GLSL's normalize function:
// https://asawicki.info/news_1596_watch_out_for_reduced_precision_normalizelength_in_opengl_es
vec2 normalized = pointDiff / max(a_lineThicknessAndLength.y, epsilon);
position = mat2(normalized.x, normalized.y, -normalized.y, normalized.x) * position;

// 3. Translate quad
position += a_penPoints.xy;

// 4. Apply view transform
position *= 2.0 / u_stageSize;
gl_Position = vec4(position, 0, 1);

v_lineColor = a_lineColor;
v_lineThickness = a_lineThicknessAndLength.x;
v_lineLength = a_lineThicknessAndLength.y;
v_penPoints = a_penPoints;
#elif defined(DRAW_MODE_background)
gl_Position = vec4(a_position * 2.0, 0, 1);
#else
gl_Position = u_projectionMatrix * u_modelMatrix * vec4(a_position, 0, 1);
v_texCoord = a_texCoord;
#endif
}`;
    const fsFullText = 
`${definesText}
precision mediump float;

#ifdef DRAW_MODE_silhouette
uniform vec4 u_silhouetteColor;
#else // DRAW_MODE_silhouette
# ifdef ENABLE_color
uniform float u_color;
# endif // ENABLE_color
# ifdef ENABLE_brightness
uniform float u_brightness;
# endif // ENABLE_brightness
# ifdef ENABLE_shade
uniform float u_shade;
# endif // ENABLE_shade
# ifdef ENABLE_red
uniform float u_red;
# endif // ENABLE_red
#endif // DRAW_MODE_silhouette

#ifdef DRAW_MODE_colorMask
uniform vec3 u_colorMask;
uniform float u_colorMaskTolerance;
#endif // DRAW_MODE_colorMask

#ifdef ENABLE_fisheye
uniform float u_fisheye;
#endif // ENABLE_fisheye
#ifdef ENABLE_whirl
uniform float u_whirl;
#endif // ENABLE_whirl
#ifdef ENABLE_pixelate
uniform float u_pixelate;
uniform vec2 u_skinSize;
#endif // ENABLE_pixelate
#ifdef ENABLE_mosaic
uniform float u_mosaic;
#endif // ENABLE_mosaic
#ifdef ENABLE_ghost
uniform float u_ghost;
#endif // ENABLE_ghost

#ifdef DRAW_MODE_line
varying vec4 v_lineColor;
varying float v_lineThickness;
varying float v_lineLength;
#endif // DRAW_MODE_line

#ifdef DRAW_MODE_background
uniform vec4 u_backgroundColor;
#endif // DRAW_MODE_background

uniform sampler2D u_skin;

#ifndef DRAW_MODE_background
varying vec2 v_texCoord;
#endif

// Add this to divisors to prevent division by 0, which results in NaNs propagating through calculations.
// Smaller values can cause problems on some mobile devices.
const float epsilon = 1e-3;

#if !defined(DRAW_MODE_silhouette) && (defined(ENABLE_color))
// Branchless color conversions based on code from:
// http://www.chilliant.com/rgb2hsv.html by Ian Taylor
// Based in part on work by Sam Hocevar and Emil Persson
// See also: https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation


// Convert an RGB color to Hue, Saturation, and Value.
// All components of input and output are expected to be in the [0,1] range.
vec3 convertRGB2HSV(vec3 rgb)
{
// Hue calculation has 3 cases, depending on which RGB component is largest, and one of those cases involves a "mod"
// operation. In order to avoid that "mod" we split the M==R case in two: one for G<B and one for B>G. The B>G case
// will be calculated in the negative and fed through abs() in the hue calculation at the end.
// See also: https://en.wikipedia.org/wiki/HSL_and_HSV#Hue_and_chroma
const vec4 hueOffsets = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);

// temp1.xy = sort B & G (largest first)
// temp1.z = the hue offset we'll use if it turns out that R is the largest component (M==R)
// temp1.w = the hue offset we'll use if it turns out that R is not the largest component (M==G or M==B)
vec4 temp1 = rgb.b > rgb.g ? vec4(rgb.bg, hueOffsets.wz) : vec4(rgb.gb, hueOffsets.xy);

// temp2.x = the largest component of RGB ("M" / "Max")
// temp2.yw = the smaller components of RGB, ordered for the hue calculation (not necessarily sorted by magnitude!)
// temp2.z = the hue offset we'll use in the hue calculation
vec4 temp2 = rgb.r > temp1.x ? vec4(rgb.r, temp1.yzx) : vec4(temp1.xyw, rgb.r);

// m = the smallest component of RGB ("min")
float m = min(temp2.y, temp2.w);

// Chroma = M - m
float C = temp2.x - m;

// Value = M
float V = temp2.x;

return vec3(
    abs(temp2.z + (temp2.w - temp2.y) / (6.0 * C + epsilon)), // Hue
    C / (temp2.x + epsilon), // Saturation
    V); // Value
}

vec3 convertHue2RGB(float hue)
{
float r = abs(hue * 6.0 - 3.0) - 1.0;
float g = 2.0 - abs(hue * 6.0 - 2.0);
float b = 2.0 - abs(hue * 6.0 - 4.0);
return clamp(vec3(r, g, b), 0.0, 1.0);
}

vec3 convertHSV2RGB(vec3 hsv)
{
vec3 rgb = convertHue2RGB(hsv.x);
float c = hsv.z * hsv.y;
return rgb * c + hsv.z - c;
}
#endif // !defined(DRAW_MODE_silhouette) && (defined(ENABLE_color))

const vec2 kCenter = vec2(0.5, 0.5);

void main()
{
#if !(defined(DRAW_MODE_line) || defined(DRAW_MODE_background))
vec2 texcoord0 = v_texCoord;

#ifdef ENABLE_mosaic
texcoord0 = fract(u_mosaic * texcoord0);
#endif // ENABLE_mosaic

#ifdef ENABLE_pixelate
{
    // TODO: clean up "pixel" edges
    vec2 pixelTexelSize = u_skinSize / u_pixelate;
    texcoord0 = (floor(texcoord0 * pixelTexelSize) + kCenter) / pixelTexelSize;
}
#endif // ENABLE_pixelate

#ifdef ENABLE_whirl
{
    const float kRadius = 0.5;
    vec2 offset = texcoord0 - kCenter;
    float offsetMagnitude = length(offset);
    float whirlFactor = max(1.0 - (offsetMagnitude / kRadius), 0.0);
    float whirlActual = u_whirl * whirlFactor * whirlFactor;
    float sinWhirl = sin(whirlActual);
    float cosWhirl = cos(whirlActual);
    mat2 rotationMatrix = mat2(
        cosWhirl, -sinWhirl,
        sinWhirl, cosWhirl
    );

    texcoord0 = rotationMatrix * offset + kCenter;
}
#endif // ENABLE_whirl

#ifdef ENABLE_fisheye
{
    vec2 vec = (texcoord0 - kCenter) / kCenter;
    float vecLength = length(vec);
    float r = pow(min(vecLength, 1.0), u_fisheye) * max(1.0, vecLength);
    vec2 unit = vec / vecLength;

    texcoord0 = kCenter + r * unit * kCenter;
}
#endif // ENABLE_fisheye

gl_FragColor = texture2D(u_skin, texcoord0);

#if defined(ENABLE_color) || defined(ENABLE_brightness) || defined(ENABLE_shade) || defined(ENABLE_red)
// Divide premultiplied alpha values for proper color processing
// Add epsilon to avoid dividing by 0 for fully transparent pixels
gl_FragColor.rgb = clamp(gl_FragColor.rgb / (gl_FragColor.a + epsilon), 0.0, 1.0);

#ifdef ENABLE_color
{
    vec3 hsv = convertRGB2HSV(gl_FragColor.xyz);

    // this code forces grayscale values to be slightly saturated
    // so that some slight change of hue will be visible
    const float minLightness = 0.11 / 2.0;
    const float minSaturation = 0.09;
    if (hsv.z < minLightness) hsv = vec3(0.0, 1.0, minLightness);
    else if (hsv.y < minSaturation) hsv = vec3(0.0, minSaturation, hsv.z);

    hsv.x = mod(hsv.x + u_color, 1.0);
    if (hsv.x < 0.0) hsv.x += 1.0;

    gl_FragColor.rgb = convertHSV2RGB(hsv);
}
#endif // ENABLE_color

#ifdef ENABLE_brightness
gl_FragColor.rgb = clamp(gl_FragColor.rgb + vec3(u_brightness), vec3(0), vec3(1));
#endif // ENABLE_brightness


//custom effect
#ifdef ENABLE_shade
gl_FragColor.rgb *= u_shade;
#endif // ENABLE_shade

#ifdef ENABLE_red
// gl_FragColor.r += (gl_FragColor.r * u_red) + (1.0 - u_red);
gl_FragColor.gb *= u_red;
#endif // ENABLE_red

// Re-multiply color values
gl_FragColor.rgb *= gl_FragColor.a + epsilon;

#endif // defined(ENABLE_color) || defined(ENABLE_brightness) || defined(ENABLE_shade) || defined(ENABLE_red)

#ifdef ENABLE_ghost
gl_FragColor *= u_ghost;
#endif // ENABLE_ghost

#ifdef DRAW_MODE_silhouette
// Discard fully transparent pixels for stencil test
if (gl_FragColor.a == 0.0) {
    discard;
}
// switch to u_silhouetteColor only AFTER the alpha test
gl_FragColor = u_silhouetteColor;
#else // DRAW_MODE_silhouette

#ifdef DRAW_MODE_colorMask
vec3 maskDistance = abs(gl_FragColor.rgb - u_colorMask);
vec3 colorMaskTolerance = vec3(u_colorMaskTolerance, u_colorMaskTolerance, u_colorMaskTolerance);
if (any(greaterThan(maskDistance, colorMaskTolerance)))
{
    discard;
}
#endif // DRAW_MODE_colorMask
#endif // DRAW_MODE_silhouette

#ifdef DRAW_MODE_straightAlpha
// Un-premultiply alpha.
gl_FragColor.rgb /= gl_FragColor.a + epsilon;
#endif

#endif // !(defined(DRAW_MODE_line) || defined(DRAW_MODE_background))

#ifdef DRAW_MODE_line
// Maaaaagic antialiased-line-with-round-caps shader.

// "along-the-lineness". This increases parallel to the line.
// It goes from negative before the start point, to 0.5 through the start to the end, then ramps up again
// past the end point.
float d = ((v_texCoord.x - clamp(v_texCoord.x, 0.0, v_lineLength)) * 0.5) + 0.5;

// Distance from (0.5, 0.5) to (d, the perpendicular coordinate). When we're in the middle of the line,
// d will be 0.5, so the distance will be 0 at points close to the line and will grow at points further from it.
// For the "caps", d will ramp down/up, giving us rounding.
// See https://www.youtube.com/watch?v=PMltMdi1Wzg for a rough outline of the technique used to round the lines.
float line = distance(vec2(0.5), vec2(d, v_texCoord.y)) * 2.0;
// Expand out the line by its thickness.
line -= ((v_lineThickness - 1.0) * 0.5);
// Because "distance to the center of the line" decreases the closer we get to the line, but we want more opacity
// the closer we are to the line, invert it.
gl_FragColor = v_lineColor * clamp(1.0 - line, 0.0, 1.0);
#endif // DRAW_MODE_line

#ifdef DRAW_MODE_background
gl_FragColor = u_backgroundColor;
#endif
}`;
    /* eslint-enable global-require */

    return vm.renderer.exports.twgl.createProgramInfo(this._gl, [vsFullText, fsFullText]);
}
vm.runtime.targets.forEach(e => e.effects.shade = 0);
vm.runtime.targets.forEach(e => e.effects.red = 0);
const Stage = vm.runtime.getTargetForStage();
const terrariaCustomEffects = (() => {
    let e = Stage.lookupVariableByNameAndType("terrariaCustomEffects");
    if (!e) e = Stage.createVariable("terrariaCustomEffects", "terrariaCustomEffects", "", false);
    return Stage.lookupVariableByNameAndType("terrariaCustomEffects");
})();
Object.defineProperty(terrariaCustomEffects, "value", {
    get: () => true,
    set: e => {}
});

const OreExtractor = (() => {
  let e = Stage.lookupVariableByNameAndType("mod-OreExcavator");
  if (!e) e = Stage.createVariable("mod-OreExcavator", "mod-OreExcavator", "", false);
  return Stage.lookupVariableByNameAndType("mod-OreExcavator");
})();
Object.defineProperty(OreExtractor, "value", {
    get: () => document.querySelector("#mods .OreExcavator").checked,
    set: e => {}
});

const Light = vm.runtime.getSpriteTargetByName("Light");
const digital = Light.lookupVariableByNameAndType("digital");
const PLAYER_DEFENSE = Stage.lookupVariableByNameAndType("PLAYER_DEFENSE");

const oldMonitorUpdate = vm._events.MONITORS_UPDATE;
vm._events.MONITORS_UPDATE = (monitors) => {
  const NewMonitors = [];
  const EditedMonitors = [];
  for (const monitorData of monitors.valueSeq()) {
      const id = monitorData.get('id');
      if (!scaffolding._monitors.has(id)) {
          const visible = monitorData.get('visible');
          if (visible) {
              NewMonitors.push(id);
          }
      } else {
          const visible = monitorData.get('visible');
          if (visible) {
              EditedMonitors.push(id);
          }
      }
  }
  oldMonitorUpdate(monitors);
  NewMonitors.forEach(id => {
    const monitor = scaffolding._monitors.get(id);
    if (monitor.params.VARIABLE == "digital" && monitor.spriteName == "Light") {
      monitor.root.style.borderColor = "transparent";
      monitor.root.style.backgroundColor = "transparent";
      monitor.root.style.flexDirection = "row";
      monitor.valueElement.style.backgroundColor = "transparent";
      monitor.valueElement.style.fontFamily = "Scratch";
      monitor.valueElement.style.textShadow = new Array(100).fill("0 0 1px #000").join();
      monitor.valueElement.style.display = "inline-block";
      monitor.valueElement.style.width = "fit-content";
      monitor.valueElement.style.padding = "0.1rem 2px 0.1rem 5px";
      monitor.valueElement.style.fontSize = "0.7rem";
      monitor.valueElement.style.textAlign = "left";
      const icon = new Image();
      icon.src = "./img/TimeIcon.png";
      icon.style.width = "14px";
      icon.style.height = "14px";
      icon.style.imageRendering = "pixelated";
      monitor.root.insertBefore(icon, monitor.valueElement);
    }
    if (monitor.params.VARIABLE == "PLAYER_DEFENSE" && monitor.spriteName == null) {
      monitor.root.style.borderColor = "transparent";
      monitor.root.style.backgroundColor = "transparent";
      monitor.root.style.backgroundImage = "url(./img/DefenseIcon.png)";
      monitor.root.style.imageRendering = "pixelated";
      monitor.root.style.backgroundSize = "contain";
      monitor.root.style.backgroundRepeat = "no-repeat";
      monitor.root.style.backgroundPosition = "center";
      monitor.valueElement.style.backgroundColor = "transparent";
      monitor.valueElement.style.fontFamily = "Scratch";
      monitor.valueElement.style.textShadow = new Array(100).fill("0 0 1px #000").join();
    }
  });
}
});