/**
 * TreasureHunt View Panel (Navigation Screen)
 */

import { RenderProps } from '../../../NerfGameApps/src/core/types';
import { TreasureHuntState } from '../types';

export default function ViewPanel({ state }: RenderProps<TreasureHuntState>) {
  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯 TreasureHunt</h1>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {state.gameActive ? '🟢 ゲーム進行中' : '🔴 ゲーム停止中'}
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>現在のスコア</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1',
              minWidth: '250px',
              padding: '2rem',
              backgroundColor: '#ffebee',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#c62828' }}>
              🔴 {state.teams.red.name}
            </h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0', color: '#c62828' }}>
              {state.teams.red.score}
            </p>
            <p style={{ fontSize: '1rem', color: '#666', margin: '0.5rem 0 0 0' }}>ポイント</p>
          </div>

          <div
            style={{
              flex: '1',
              minWidth: '250px',
              padding: '2rem',
              backgroundColor: '#fff9c4',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#f57f17' }}>
              🟡 {state.teams.yellow.name}
            </h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0', color: '#f57f17' }}>
              {state.teams.yellow.score}
            </p>
            <p style={{ fontSize: '1rem', color: '#666', margin: '0.5rem 0 0 0' }}>ポイント</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>統計情報</h2>
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1', minWidth: '150px' }}>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>赤チーム参加者</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {state.teams.red.uniqueDevices}
            </p>
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>黄チーム参加者</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {state.teams.yellow.uniqueDevices}
            </p>
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>総QRコード数</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {Object.keys(state.qrCodes).length}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>📱 ゲームの遊び方</h3>
        <ol style={{ margin: '0', paddingLeft: '1.5rem' }}>
          <li>QRコードを探して、スマートフォンでスキャンします</li>
          <li>チームを選択（初回のみ）</li>
          <li>QRコードを読み取るとポイント獲得！</li>
          <li>チーム全体で合計ポイントを競います</li>
        </ol>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          ※ この画面はリアルタイムで更新されます
        </p>
      </div>
    </div>
  );
}
