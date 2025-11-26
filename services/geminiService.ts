import { GoogleGenAI, Type } from "@google/genai";
import { LEGEND_DATA, SemanticType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateParkingLotSVG = async (
  referenceImageBase64: string | null,
  promptText: string
): Promise<string> => {
  // Use gemini-3-pro-preview ("nanoPro" equivalent for complex reasoning)
  const modelId = 'gemini-3-pro-preview';
  
  const semanticDefinitions = `
    1. Driving Lane (行车道) - Color: #374151. Main dark gray paths for cars.
    2. Parking Space (停车位) - Color: #FBCFE8. Pink rectangles with white strokes.
    3. Pillar (承重柱) - Color: #111827. Black squares/rectangles in a grid.
    4. Wall (墙) - Color: #000000. Thick black boundary lines.
    5. Entrance (入口) - Color: #3B82F6. Blue entry zones/arrows.
    6. Exit (出口) - Color: #EF4444. Red exit zones/arrows.
    7. Staircase (楼梯间) - Color: #8B5CF6. Purple rectangular areas.
    8. Elevator (电梯井) - Color: #6366F1. Indigo boxes.
    9. Charging Station (充电桩) - Color: #34D399. Green spots or icons for EVs.
    10. Pedestrian Path (人行道) - Color: #FFFFFF. White walkways running PARALLEL to the driving lanes/ground lines.
    11. Ground (地面) - Color: #10B981. Green background area (Islands/Plazas) where cars DON'T drive.
    12. Slope (坡道) - Color: #F59E0B. Yellow hatched areas. MUST OVERLAP with Driving Lanes (they are sloped lanes).
    13. Guidance Sign (导向牌) - Color: #60A5FA. Small blue rectangles overhead.
    14. Safe Exit (安全出口) - Color: #22C55E. Green emergency exit markers.
    15. Deceleration Zone (减速带) - Color: #FCD34D. Yellow stripes running PERPENDICULAR (across) to the driving lane.
    16. Fire Extinguisher (消防设备) - Color: #DC2626. Small red boxes.
    17. Ground Line (地面线) - Color: #FFFFFF. White lane dividers, arrows, parking lines.
    18. Convex Mirror (凸面镜) - Color: #F87171. Small red circles.
  `;
  
  const systemInstruction = `
    You are an expert architectural engineer and SVG coding specialist. 
    Your task is to generate a HIGHLY COMPLEX, DETAILED, and SEMANTICALLY ACCURATE SVG map of an underground parking lot.
    
    The output must be raw SVG code.
    
    **CRITICAL SEMANTIC REQUIREMENTS**:
    You MUST include elements representing the following 18 semantics. Use the specific colors defined below:
    ${semanticDefinitions}

    **1. GEOMETRY & VISUAL RULES**:
    - **Pedestrian Paths**: Must be **WHITE (#FFFFFF)** and run **PARALLEL** to the Driving Lane / Ground Line direction (e.g., walkways flanking the lanes).
    - **Deceleration Zones**: Must be **YELLOW (#FCD34D)** stripes that run **PERPENDICULAR** to the Driving Lane / Ground Line direction (crossing the path of the car).
    - **Ground**: The **Green (#10B981)** area represents the "Floor" or "Islands" where buildings and parking spaces sit.
    - **Driving Lanes**: Dark Grey (#374151) lanes cut through the Green Ground.
    - **Slope**: Ramps (#F59E0B) are part of the Driving Lane, so they MUST **OVERLAP/COINCIDE** spatially with a Driving Lane segment.
    
    **2. SPATIAL CONSTRAINT MODULE (Strict Enforcement)**:
    - **Non-Overlap Rule**: Parking Spaces, Stairs, Elevators, Pillars, and Walls MUST be placed inside the Ground (Green) areas but MUST NOT overlap with the Driving Lanes (Dark Grey).
    - **Boundary Rule**: All architectural elements (Parking, Stairs, etc.) must be contained within the Ground boundary. Do not place items in the void outside the map.
    - **Lane Accessories**: Safe Exit, Guidance Sign, Deceleration Zone, and Convex Mirror MUST be placed ON or IMMEDIATELY ADJACENT to Driving Lanes.
    
    **3. DENSITY**:
    - Maximize the use of Ground space for Parking Spaces. Minimize empty green space.
    
    **Output Format**: 
    - Return ONLY the SVG string. 
    - Use viewBox="0 0 1000 800" (or similar). 
    - Ensure code is clean.
  `;

  // Dynamic Prompt Construction based on whether image is provided
  let taskDescription = "";
  if (referenceImageBase64) {
    taskDescription = `
      **TASK**: Analyze the structure and topology of the provided REFERENCE IMAGE. 
      Generate a NEW SVG layout that **MIMICS** the reference image's driving loop, building placement, and general shape. 
      However, you must RE-RENDER it using the strict semantic colors and rules defined above (Green Ground, White Paths, etc.).
      
      Apply the following specific modifications to the reference layout:
      "${promptText || "Recreate the reference layout with high semantic fidelity."}"
    `;
  } else {
    taskDescription = `
      **TASK**: Generate a high-density underground parking lot map from scratch.
      Description: "${promptText || "Complex commercial underground parking lot."}"
    `;
  }

  const userPrompt = `
    ${taskDescription}
    
    **Recall Visual Constraints**:
    1. **Pedestrian Paths**: WHITE, running PARALLEL to the lanes.
    2. **Deceleration Zones**: YELLOW, running PERPENDICULAR to the lanes.
    3. **Ground**: GREEN background.
    4. **Slope**: Must overlap with Driving Lanes.
    
    **Recall Spatial Constraints**:
    - Parking spaces, Buildings, and Pillars must NOT overlap with Driving Lanes.
    - Parking spaces and Buildings must NOT go outside the Ground area.
    - Parking spaces should fill the available Ground area.
  `;

  try {
    const parts: any[] = [{ text: userPrompt }];
    
    if (referenceImageBase64) {
      const base64Data = referenceImageBase64.split(',')[1] || referenceImageBase64;
      parts.unshift({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 16000 },
      }
    });

    let text = response.text || "";
    
    text = text.replace(/```svg/g, '').replace(/```/g, '').trim();
    
    if (!text.includes('<svg')) {
       throw new Error("Model failed to generate valid SVG");
    }

    return text;
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};