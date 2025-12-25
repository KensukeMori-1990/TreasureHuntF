/**
 * TreasureHunt Game Rule Types
 */

export type Team = 'red' | 'yellow';

export interface TeamData {
  name: string;
  score: number;
  totalAccesses: number;
  uniqueDevices: number;
}

export interface QRCodeData {
  point: number;
  foundBy: string[]; // deviceId[]
}

export interface DeviceData {
  team: Team;
  qrAccesses: string[]; // qrId[]
  createdAt: string;
}

export interface TreasureHuntState {
  gameActive: boolean;
  teams: {
    red: TeamData;
    yellow: TeamData;
  };
  qrCodes: {
    [qrId: string]: QRCodeData;
  };
  devices: {
    [deviceId: string]: DeviceData;
  };
}

export type TreasureHuntActionType =
  | 'START_GAME'
  | 'STOP_GAME'
  | 'RESET_GAME'
  | 'RESET_DEVICES'
  | 'QR_ACCESS';

export interface TreasureHuntAction {
  type: TreasureHuntActionType;
  payload?: any;
}
