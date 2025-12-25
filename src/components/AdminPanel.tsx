/**
 * TreasureHunt Admin Panel
 */

import { RenderProps } from '../../../NerfGameApps/src/core/types';
import { TreasureHuntState, TreasureHuntAction } from '../types';

export default function AdminPanel({
  state,
  executeAction,
  refreshState,
}: RenderProps<TreasureHuntState>) {
  const handleStartGame = async () => {
    const action: TreasureHuntAction = {
      type: 'START_GAME',
      payload: {
        gameActive: true,
      },
    };
    await executeAction(action);
    alert('ゲームを開始しました');
  };

  const handleStopGame = async () => {
    const action: TreasureHuntAction = {
      type: 'STOP_GAME',
      payload: {
        gameActive: false,
      },
    };
    await executeAction(action);
    alert('ゲームを停止しました');
  };

  const handleResetGame = async () => {
    if (!confirm('ゲームをリセットしますか？（スコアとデバイスがすべてクリアされます）')) {
      return;
    }
    const action: TreasureHuntAction = {
      type: 'RESET_GAME',
      payload: {
        teams: {
          red: { name: '赤チーム', score: 0, totalAccesses: 0, uniqueDevices: 0 },
          yellow: { name: '黄チーム', score: 0, totalAccesses: 0, uniqueDevices: 0 },
        },
        devices: {},
        qrCodes: Object.keys(state.qrCodes).reduce((acc, qrId) => {
          acc[qrId] = { ...state.qrCodes[qrId], foundBy: [] };
          return acc;
        }, {} as any),
      },
    };
    await executeAction(action);
    alert('ゲームをリセットしました');
  };

  const handleResetDevices = async () => {
    if (!confirm('デバイス情報をリセットしますか？（スコアは維持されます）')) {
      return;
    }
    const action: TreasureHuntAction = {
      type: 'RESET_DEVICES',
      payload: {
        devices: {},
      },
    };
    await executeAction(action);
    alert('デバイス情報をリセットしました');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleStartGame}
          disabled={state.gameActive}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: state.gameActive ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: state.gameActive ? 'not-allowed' : 'pointer',
          }}
        >
          🟢 ゲーム開始
        </button>

        <button
          onClick={handleStopGame}
          disabled={!state.gameActive}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: !state.gameActive ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !state.gameActive ? 'not-allowed' : 'pointer',
          }}
        >
          🔴 ゲーム停止
        </button>

        <button
          onClick={handleResetGame}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🔄 ゲームリセット
        </button>

        <button
          onClick={handleResetDevices}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          📱 デバイスリセット
        </button>

        <button
          onClick={refreshState}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🔄 再読み込み
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>ゲーム状態</h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {state.gameActive ? '🟢 ゲーム進行中' : '🔴 ゲーム停止中'}
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>チームスコア</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffebee',
              borderRadius: '8px',
              flex: '1',
              minWidth: '200px',
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#c62828' }}>🔴 {state.teams.red.name}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{state.teams.red.score} pt</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              取得回数: {state.teams.red.totalAccesses} / デバイス数: {state.teams.red.uniqueDevices}
            </p>
          </div>

          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#fff9c4',
              borderRadius: '8px',
              flex: '1',
              minWidth: '200px',
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#f57f17' }}>🟡 {state.teams.yellow.name}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{state.teams.yellow.score} pt</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              取得回数: {state.teams.yellow.totalAccesses} / デバイス数: {state.teams.yellow.uniqueDevices}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>QRコード取得状況</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>QRコードID</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>ポイント</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>発見者数</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(state.qrCodes).map(([qrId, data]) => (
                <tr key={qrId}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{qrId}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{data.point}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{data.foundBy.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2>デバイス情報</h2>
        <p>登録デバイス数: {Object.keys(state.devices).length}</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>デバイスID</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>チーム</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>取得QR数</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(state.devices).map(([deviceId, data]) => (
                <tr key={deviceId}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.8rem' }}>{deviceId}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {data.team === 'red' ? '🔴 赤' : '🟡 黄'}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{data.qrAccesses.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
