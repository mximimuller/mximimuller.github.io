export function startShader(canvas) {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  if (!gl) return;

  const vertexSource = `
    attribute vec2 position;

    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    uniform vec2 resolution;

    float glow(vec2 uv, vec2 center, vec2 stretch) {
      vec2 offset = (uv - center) * stretch;
      return exp(-dot(offset, offset));
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      vec3 color = vec3(0.996, 0.991, 0.979);

      color = mix(color, vec3(0.79, 0.86, 0.99),
        0.86 * glow(uv, vec2(0.92, 0.93), vec2(1.9, 2.8)));
      color = mix(color, vec3(0.96, 0.80, 0.74),
        0.77 * glow(uv, vec2(0.06, 0.04), vec2(2.4, 2.7)));
      color = mix(color, vec3(0.87, 0.81, 0.96),
        0.66 * glow(uv, vec2(0.85, 0.07), vec2(2.5, 3.1)));
      color = mix(color, vec3(0.83, 0.92, 0.91),
        0.56 * glow(uv, vec2(0.17, 0.97), vec2(2.8, 3.2)));

      float bend = uv.y + uv.x * 0.37
        + 0.12 * sin(uv.x * 5.4)
        + 0.05 * sin(uv.y * 8.0);
      float band = 1.0 - smoothstep(0.0, 0.14, abs(bend - 0.83));
      color = mix(color, vec3(1.0, 0.998, 0.988), 0.43 * band);

      float grain = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
      gl_FragColor = vec4(color + 0.012 * (grain - 0.5), 1.0);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  function prepareScene() {
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    return {
      program,
      buffer,
      resolution: gl.getUniformLocation(program, "resolution"),
    };
  }

  let scene = prepareScene();

  function refresh() {
    if (!scene) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const scale = Math.min(0.85, 1280 / Math.max(width, height));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(scene.resolution, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function onContextLost(event) {
    event.preventDefault();
    scene = null;
  }

  function onContextRestored() {
    scene = prepareScene();
    refresh();
  }

  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  window.addEventListener("resize", refresh);
  refresh();

  return () => {
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    window.removeEventListener("resize", refresh);
    if (scene) {
      gl.deleteBuffer(scene.buffer);
      gl.useProgram(null);
      gl.deleteProgram(scene.program);
    }
  };
}
