/**
 * TreasureHunt Game Rule Implementation
 */

import { GameRule, RenderProps } from '../../NerfGameApps/src/core/types';
import { TreasureHuntState, TreasureHuntAction, Team } from './types';
import AdminPanel from './components/AdminPanel';
import ViewPanel from './components/ViewPanel';
import ActionPanel from './components/ActionPanel';

export class TreasureHuntRule implements GameRule<TreasureHuntState, TreasureHuntAction> {
  id = 'treasurehunt';
  name = 'TreasureHunt';

  init(): void {
    console.log('✅ TreasureHunt Rule initialized');
  }

  renderAdmin(props: RenderProps<TreasureHuntState>): JSX.Element {
    return <AdminPanel {...props} />;
  }

  renderView(props: RenderProps<TreasureHuntState>): JSX.Element {
    return <ViewPanel {...props} />;
  }

  renderAction(props: RenderProps<TreasureHuntState>): JSX.Element {
    return <ActionPanel {...props} />;
  }

  async onAction(action: TreasureHuntAction, state: TreasureHuntState): Promise<void> {
    // クライアント側バリデーションと状態計算
    switch (action.type) {
      case 'QR_ACCESS': {
        const { deviceId, team, qrId } = action.payload || {};

        if (!deviceId || !team || !qrId) {
          throw new Error('QR_ACCESS requires deviceId, team, and qrId');
        }
        if (!state.qrCodes[qrId]) {
          throw new Error(`QR code ${qrId} does not exist`);
        }
        if (!state.gameActive) {
          throw new Error('Game is not active');
        }

        // 重複チェック
        const device = state.devices[deviceId];
        if (device && device.qrAccesses.includes(qrId)) {
          throw new Error('QR code already accessed by this device');
        }

        // 状態更新を計算してpayloadに設定
        const point = state.qrCodes[qrId].point;
        const isNewDevice = !device;

        // デバイス情報更新
        const updatedDevice = device
          ? { ...device, qrAccesses: [...device.qrAccesses, qrId] }
          : { team, qrAccesses: [qrId], createdAt: new Date().toISOString() };

        // チーム情報更新
        const teamData = state.teams[team as Team];
        const updatedTeam = {
          ...teamData,
          score: teamData.score + point,
          totalAccesses: teamData.totalAccesses + 1,
          uniqueDevices: teamData.uniqueDevices + (isNewDevice ? 1 : 0),
        };

        // QRコード情報更新
        const updatedQRCode = {
          ...state.qrCodes[qrId],
          foundBy: [...state.qrCodes[qrId].foundBy, deviceId],
        };

        // payloadに計算済み状態を設定
        action.payload = {
          devices: {
            ...state.devices,
            [deviceId]: updatedDevice,
          },
          teams: {
            ...state.teams,
            [team]: updatedTeam,
          },
          qrCodes: {
            ...state.qrCodes,
            [qrId]: updatedQRCode,
          },
        };
        break;
      }

      case 'START_GAME':
      case 'STOP_GAME':
      case 'RESET_GAME':
      case 'RESET_DEVICES':
        // 管理者アクション - payloadはコンポーネントで設定済み
        break;

      default:
        throw new Error(`Unknown action type: ${(action as any).type}`);
    }
  }
}

export const treasureHuntRule = new TreasureHuntRule();
