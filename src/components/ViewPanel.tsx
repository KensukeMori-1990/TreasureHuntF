/**
 * TreasureHunt View Panel (Navigation Screen)
 */

import { RenderProps } from '../core/types';
import { TreasureHuntState } from '../types';

export default function ViewPanel({ state }: RenderProps<TreasureHuntState>) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {/* ヘッダー */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            color: '#fff',
            margin: '0 0 1rem 0',
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}>
            🎯 TreasureHunt
          </h1>
          <div style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            backgroundColor: state.gameActive
              ? 'rgba(16, 185, 129, 0.9)'
              : 'rgba(239, 68, 68, 0.9)',
            borderRadius: '50px',
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            {state.gameActive ? '🟢 ゲーム進行中' : '🔴 ゲーム停止中'}
          </div>
        </div>

        {/* スコア表示 */}
        <div style={{
          marginBottom: '2rem',
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '1.5rem',
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}>
            現在のスコア
          </h2>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div
              style={{
                flex: '1',
                minWidth: '280px',
                padding: '3rem 2rem',
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)',
                transform: 'scale(1)',
                transition: 'transform 0.3s',
              }}
            >
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.8rem',
                color: '#fff',
                fontWeight: '700',
              }}>
                🔴 {state.teams.red.name}
              </h3>
              <p style={{
                fontSize: '5rem',
                fontWeight: '900',
                margin: '0',
                color: '#fff',
                lineHeight: '1',
              }}>
                {state.teams.red.score}
              </p>
              <p style={{
                fontSize: '1.2rem',
                color: '#fecaca',
                margin: '1rem 0 0 0',
                fontWeight: '600',
              }}>
                ポイント
              </p>
            </div>

            <div
              style={{
                flex: '1',
                minWidth: '280px',
                padding: '3rem 2rem',
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(234, 179, 8, 0.4)',
                transform: 'scale(1)',
                transition: 'transform 0.3s',
              }}
            >
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.8rem',
                color: '#fff',
                fontWeight: '700',
              }}>
                🟡 {state.teams.yellow.name}
              </h3>
              <p style={{
                fontSize: '5rem',
                fontWeight: '900',
                margin: '0',
                color: '#fff',
                lineHeight: '1',
              }}>
                {state.teams.yellow.score}
              </p>
              <p style={{
                fontSize: '1.2rem',
                color: '#fef3c7',
                margin: '1rem 0 0 0',
                fontWeight: '600',
              }}>
                ポイント
              </p>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div style={{
          marginBottom: '2rem',
          backgroundColor: '#1a1a2e',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            統計情報
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div style={{
              flex: '1',
              minWidth: '150px',
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#16213e',
              borderRadius: '12px',
            }}>
              <p style={{
                margin: '0',
                fontSize: '1rem',
                color: '#9ca3af',
                fontWeight: '500',
              }}>
                赤チーム参加者
              </p>
              <p style={{
                margin: '0.75rem 0 0 0',
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#ef4444',
              }}>
                {state.teams.red.uniqueDevices}
              </p>
            </div>
            <div style={{
              flex: '1',
              minWidth: '150px',
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#16213e',
              borderRadius: '12px',
            }}>
              <p style={{
                margin: '0',
                fontSize: '1rem',
                color: '#9ca3af',
                fontWeight: '500',
              }}>
                黄チーム参加者
              </p>
              <p style={{
                margin: '0.75rem 0 0 0',
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#eab308',
              }}>
                {state.teams.yellow.uniqueDevices}
              </p>
            </div>
            <div style={{
              flex: '1',
              minWidth: '150px',
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#16213e',
              borderRadius: '12px',
            }}>
              <p style={{
                margin: '0',
                fontSize: '1rem',
                color: '#9ca3af',
                fontWeight: '500',
              }}>
                総QRコード数
              </p>
              <p style={{
                margin: '0.75rem 0 0 0',
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#60a5fa',
              }}>
                {Object.keys(state.qrCodes).length}
              </p>
            </div>
          </div>
        </div>

        {/* 遊び方 */}
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#1a1a2e',
            borderRadius: '16px',
            marginBottom: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h3 style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.5rem',
            color: '#fff',
            fontWeight: '700',
          }}>
            📱 ゲームの遊び方
          </h3>
          <ol style={{
            margin: '0',
            paddingLeft: '1.5rem',
            color: '#e0e0e0',
            fontSize: '1.1rem',
            lineHeight: '2',
          }}>
            <li>QRコードを探して、スマートフォンでスキャンします</li>
            <li>チームを選択（初回のみ）</li>
            <li>QRコードを読み取るとポイント獲得！</li>
            <li>チーム全体で合計ポイントを競います</li>
          </ol>
        </div>

        {/* フッター */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '1rem',
            color: '#e0e0e0',
            fontWeight: '500',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}>
            ✨ この画面はリアルタイムで更新されます
          </p>
        </div>
      </div>
    </div>
  );
}
