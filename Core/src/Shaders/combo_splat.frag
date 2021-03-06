/*
 * This file is part of ElasticFusion.
 *
 * Copyright (C) 2015 Imperial College London
 * 
 * The use of the code within this file and all code within files that 
 * make up the software that is ElasticFusion is permitted for 
 * non-commercial purposes only.  The full terms and conditions that 
 * apply to the code within this file are detailed within the LICENSE.txt 
 * file and at <http://www.imperial.ac.uk/dyson-robotics-lab/downloads/elastic-fusion/elastic-fusion-license/> 
 * unless explicitly stated.  By downloading this file you agree to 
 * comply with these terms.
 *
 * If you wish to use any of this code for commercial purposes then 
 * please email researchcontracts.engineering@imperial.ac.uk.
 *
 */

#version 430 core

uniform vec4 cam; //cx, cy, fx, fy
uniform float maxDepth;

in vec4 position;
in vec4 normRad;
flat in uvec4 colTime;

layout(location = 0) out vec4 image;
layout(location = 1) out vec4 vertex;
layout(location = 2) out vec4 normal;
layout(location = 3) out uint time;
layout(location = 4) out uvec2 colorState;

#include "color.glsl"

void main()
{
    vec3 l = normalize(vec3((vec2(gl_FragCoord) - cam.xy) / cam.zw, 1.0f));
    
    vec3 corrected_pos = (dot(position.xyz, normRad.xyz) / dot(l, normRad.xyz)) * l; 

    //check if the intersection is inside the surfel
    float sqrRad = pow(normRad.w, 2);
    vec3 diff = corrected_pos - position.xyz;

    if(dot(diff, diff) > sqrRad)
    {
        discard;
    }

    // TODO: this does not make much sense.
    // At the moment compresses the entire range
    // Will be used for RGB alignment, but is not at scale with input color
    vec4 hdr = unpackHDRColorComplete(colTime.xy);
    if (hdr.w > 0)
      image = vec4(vec3(1.0) + log(hdr.xyz) / 7, 1);
      // image = vec4(hdr.xyz, 1);
    else
      image = vec4(0, 0, 0, 1);

    colorState = colTime.xy;
    
    float z = corrected_pos.z;
    
    vertex = vec4((gl_FragCoord.x - cam.x) * z * (1.f / cam.z), (gl_FragCoord.y - cam.y) * z * (1.f / cam.w), z, position.w);
    
    normal = normRad;
    
    time = colTime.z;
    
    gl_FragDepth = (corrected_pos.z / (2 * maxDepth)) + 0.5f;
}
