/**
 * TreasureHunt Action Panel (QR Access Screen)
 */

import { useState, useEffect } from 'react';
import { RenderProps } from '../../../NerfGameApps/src/core/types';
import { TreasureHuntState, TreasureHuntAction, Team } from '../types';

export default function ActionPanel({ state, executeAction }: RenderProps<TreasureHuntState>) {
  const [deviceId, setDeviceId] = useState<string>('');
  const [team, setTeam] = useState<Team | null>(null);
  const [qrId, setQrId] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // デバイスIDとチームをlocalStorageから取得
    let storedDeviceId = localStorage.getItem('treasurehunt_deviceId');
    if (!storedDeviceId) {
      // 新規デバイスID生成
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 11);
      storedDeviceId = `dev_${timestamp}_${random}`;
      localStorage.setItem('treasurehunt_deviceId', storedDeviceId);
    }
    setDeviceId(storedDeviceId);

    const storedTeam = localStorage.getItem('treasurehunt_team') as Team | null;
    setTeam(storedTeam);

    // URLパラメータからQRコードIDを取得
    const params = new URLSearchParams(window.location.search);
    const qr = params.get('qr');
    if (qr) {
      setQrId(qr);
    }
  }, []);

  const handleTeamSelect = (selectedTeam: Team) => {
    setTeam(selectedTeam);
    localStorage.setItem('treasurehunt_team', selectedTeam);
    setMessage({ type: 'success', text: `${selectedTeam === 'red' ? '赤' : '黄'}チームに参加しました！` });
  };

  const handleQRAccess = async () => {
    if (!team || !qrId) {
      setMessage({ type: 'error', text: 'チームを選択してQRコードをスキャンしてください' });
      return;
    }

    if (!state.gameActive) {
      setMessage({ type: 'error', text: 'ゲームは現在停止中です' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const action: TreasureHuntAction = {
        type: 'QR_ACCESS',
        payload: {
          deviceId,
          team,
          qrId,
        },
      };

      await executeAction(action);

      const point = state.qrCodes[qrId]?.point || 0;
      setMessage({
        type: 'success',
        text: `🎉 ${point}ポイント獲得！`,
      });
      setQrId('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'エラーが発生しました',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!team) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>チームを選択してください</h2>

        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <button
            onClick={() => handleTeamSelect('red')}
            style={{
              padding: '2rem',
              fontSize: '1.5rem',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
            }}
          >
            🔴 赤チーム
          </button>

          <button
            onClick={() => handleTeamSelect('yellow')}
            style={{
              padding: '2rem',
              fontSize: '1.5rem',
              backgroundColor: '#FFC107',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
            }}
          >
            🟡 黄チーム
          </button>
        </div>

        {message && (
          <div
            style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
              borderRadius: '8px',
            }}
          >
            {message.text}
          </div>
        )}
      </div>
    );
  }

  const currentTeamData = state.teams[team as Team];
  const deviceData = state.devices[deviceId];
  const qrCodesFound = deviceData?.qrAccesses.length || 0;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯 TreasureHunt</h2>
        <div
          style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            backgroundColor: team === 'red' ? '#ffebee' : '#fff9c4',
            color: team === 'red' ? '#c62828' : '#f57f17',
            borderRadius: '20px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          {team === 'red' ? '🔴 赤チーム' : '🟡 黄チーム'}
        </div>
      </div>

      {!state.gameActive && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fff3cd',
            color: '#856404',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          ⚠️ ゲームは現在停止中です
        </div>
      )}

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>あなたの成績</h3>
        <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
          発見したQRコード: <strong>{qrCodesFound}個</strong>
        </p>
        <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
          チーム合計スコア: <strong>{currentTeamData.score}ポイント</strong>
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>QRコード入力</h3>
        <input
          type="text"
          value={qrId}
          onChange={(e) => setQrId(e.target.value.toUpperCase())}
          placeholder="例: A001"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.2rem',
            border: '2px solid #ddd',
            borderRadius: '8px',
            marginBottom: '1rem',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleQRAccess}
          disabled={!qrId || isProcessing || !state.gameActive}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.2rem',
            backgroundColor: !qrId || isProcessing || !state.gameActive ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: !qrId || isProcessing || !state.gameActive ? 'not-allowed' : 'pointer',
          }}
        >
          {isProcessing ? '処理中...' : '✓ 取得する'}
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: '1rem',
            backgroundColor:
              message.type === 'success' ? '#d4edda' : message.type === 'error' ? '#f8d7da' : '#d1ecf1',
            color:
              message.type === 'success' ? '#155724' : message.type === 'error' ? '#721c24' : '#0c5460',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center',
            fontSize: '1.2rem',
          }}
        >
          {message.text}
        </div>
      )}

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '0.9rem',
        }}
      >
        <p style={{ margin: '0 0 0.5rem 0' }}>💡 ヒント:</p>
        <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
          <li>QRコードをスキャンすると自動的にコードが入力されます</li>
          <li>同じQRコードは1回しか取得できません</li>
          <li>ゲーム進行中のみポイント獲得できます</li>
        </ul>
      </div>
    </div>
  );
}
