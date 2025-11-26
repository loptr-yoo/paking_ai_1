export enum SemanticType {
  DrivingLane = 'Driving Lane',
  ParkingSpace = 'Parking Space',
  Pillar = 'Pillar',
  Wall = 'Wall',
  Entrance = 'Entrance',
  Exit = 'Exit',
  Staircase = 'Staircase',
  Elevator = 'Elevator',
  ChargingStation = 'Charging Station',
  PedestrianPath = 'Pedestrian Path',
  Ground = 'Ground',
  Slope = 'Slope',
  GuidanceSign = 'Guidance Sign',
  SafeExit = 'Safe Exit',
  DecelerationZone = 'Deceleration Zone',
  FireExtinguisher = 'Fire Extinguisher',
  GroundLine = 'Ground Line',
  ConvexMirror = 'Convex Mirror',
}

export interface LegendItem {
  type: SemanticType;
  color: string;
  description: string;
}

export const LEGEND_DATA: LegendItem[] = [
  { type: SemanticType.Ground, color: '#10B981', description: 'Ground (地面 - Green Area)' },
  { type: SemanticType.DrivingLane, color: '#374151', description: 'Driving Lane (行车道)' },
  { type: SemanticType.ParkingSpace, color: '#FBCFE8', description: 'Parking Space (停车位)' },
  { type: SemanticType.Wall, color: '#000000', description: 'Wall (墙)' },
  { type: SemanticType.Pillar, color: '#111827', description: 'Pillar (承重柱)' },
  { type: SemanticType.PedestrianPath, color: '#FFFFFF', description: 'Pedestrian Path (人行道)' },
  { type: SemanticType.Entrance, color: '#3B82F6', description: 'Entrance (入口)' },
  { type: SemanticType.Exit, color: '#EF4444', description: 'Exit (出口)' },
  { type: SemanticType.ChargingStation, color: '#34D399', description: 'Charging Station (充电桩)' },
  { type: SemanticType.Elevator, color: '#6366F1', description: 'Elevator (电梯井)' },
  { type: SemanticType.Staircase, color: '#8B5CF6', description: 'Staircase (楼梯间)' },
  { type: SemanticType.Slope, color: '#F59E0B', description: 'Slope (坡道)' },
  { type: SemanticType.FireExtinguisher, color: '#DC2626', description: 'Fire Extinguisher (消防设备)' },
  { type: SemanticType.SafeExit, color: '#22C55E', description: 'Safe Exit (安全出口)' },
  { type: SemanticType.GuidanceSign, color: '#60A5FA', description: 'Guidance Sign (导向牌)' },
  { type: SemanticType.DecelerationZone, color: '#FCD34D', description: 'Deceleration Zone (减速带)' },
  { type: SemanticType.ConvexMirror, color: '#F87171', description: 'Convex Mirror (凸面镜)' },
  { type: SemanticType.GroundLine, color: '#FFFFFF', description: 'Ground Line (地面线)' },
];