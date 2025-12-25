/**
 * TreasureHunt Action Panel (Player Screen)
 */

import { useState, useEffect } from 'react';
import { RenderProps } from '../../../NerfGameApps/src/core/types';
import { TreasureHuntState, TreasureHuntAction, Team } from '../types';

export default function ActionPanel({ state, executeAction }: RenderProps<TreasureHuntState>) {
  const [deviceId, setDeviceId] = useState<string>('');
  const [team, setTeam] = useState<Team | null>(null);
  const [qrId, setQrId] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let storedDeviceId = localStorage.getItem('treasurehunt_deviceId');
    if (!storedDeviceId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 11);
      storedDeviceId = `dev_${timestamp}_${random}`;
      localStorage.setItem('treasurehunt_deviceId', storedDeviceId);
    }
    setDeviceId(storedDeviceId);

    const storedTeam = localStorage.getItem('treasurehunt_team') as Team | null;
    if (storedTeam) {
      setTeam(storedTeam);
    }
  }, []);

  const handleTeamSelect = (selectedTeam: Team) => {
    setTeam(selectedTeam);
    localStorage.setItem('treasurehunt_team', selectedTeam);
    setMessage({ type: 'success', text: `${selectedTeam === 'red' ? '赤チーム' : '黄チーム'}を選択しました！` });
  };

  const handleQRAccess = async () => {
    if (!state.gameActive) {
      setMessage({ type: 'error', text: 'ゲームが開始されていません' });
      return;
    }

    if (!team) {
      setMessage({ type: 'error', text: 'チームを選択してください' });
      return;
    }

    if (!qrId.trim()) {
      setMessage({ type: 'error', text: 'QRコードIDを入力してください' });
      return;
    }

    if (!state.qrCodes[qrId]) {
      setMessage({ type: 'error', text: 'QRコードが見つかりません' });
      return;
    }

    const device = state.devices[deviceId];
    if (device && device.qrAccesses.includes(qrId)) {
      setMessage({ type: 'error', text: 'このQRコードは既に取得済みです' });
      return;
    }

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
      setMessage({ type: 'success', text: `🎉 ${point}ポイント獲得！` });
      setQrId('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'エラーが発生しました' });
    }
  };

  if (!team) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: '#1a1a2e',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '2rem',
            textAlign: 'center',
            color: '#fff',
            fontWeight: '700',
          }}>
            🎯 チーム選択
          </h2>
          <p style={{
            color: '#9ca3af',
            textAlign: 'center',
            marginBottom: '3rem',
            fontSize: '1.1rem',
            lineHeight: '1.8',
          }}>
            どちらのチームに参加しますか？
            <br />
            一度選択すると変更できません
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            <button
              onClick={() => handleTeamSelect('red')}
              style={{
                padding: '2rem',
                fontSize: '1.5rem',
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '700',
                boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🔴 赤チーム
            </button>

            <button
              onClick={() => handleTeamSelect('yellow')}
              style={{
                padding: '2rem',
                fontSize: '1.5rem',
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '700',
                boxShadow: '0 6px 20px rgba(234, 179, 8, 0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🟡 黄チーム
            </button>
          </div>

          {message && (
            <div
              style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444',
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '1.1rem',
              }}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentTeamData = state.teams[team as Team];
  const deviceData = state.devices[deviceId];
  const qrCodesFound = deviceData?.qrAccesses.length || 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        {/* ヘッダー */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            color: '#fff',
            fontWeight: '800',
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}>
            🎯 TreasureHunt
          </h2>
          <div style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: team === 'red'
              ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
              : 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
            borderRadius: '50px',
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            {team === 'red' ? '🔴 赤チーム' : '🟡 黄チーム'}
          </div>
        </div>

        {/* ステータスカード */}
        <div style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}>
            <div>
              <p style={{
                margin: '0',
                fontSize: '0.9rem',
                color: '#9ca3af',
                fontWeight: '500',
              }}>
                チームスコア
              </p>
              <p style={{
                margin: '0.5rem 0 0 0',
                fontSize: '2.5rem',
                fontWeight: '800',
                color: team === 'red' ? '#ef4444' : '#eab308',
              }}>
                {currentTeamData.score}
              </p>
            </div>
            <div>
              <p style={{
                margin: '0',
                fontSize: '0.9rem',
                color: '#9ca3af',
                fontWeight: '500',
              }}>
                あなたの取得数
              </p>
              <p style={{
                margin: '0.5rem 0 0 0',
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#60a5fa',
              }}>
                {qrCodesFound}
              </p>
            </div>
          </div>

          {!state.gameActive && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#16213e',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #ef4444',
            }}>
              <p style={{
                margin: 0,
                color: '#ef4444',
                fontWeight: '700',
                fontSize: '1.1rem',
              }}>
                🔴 ゲームが開始されていません
              </p>
            </div>
          )}

          {state.gameActive && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#16213e',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #10b981',
            }}>
              <p style={{
                margin: 0,
                color: '#10b981',
                fontWeight: '700',
                fontSize: '1.1rem',
              }}>
                🟢 ゲーム進行中
              </p>
            </div>
          )}
        </div>

        {/* QR入力フォーム */}
        <div style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.5rem',
            color: '#fff',
            fontWeight: '700',
          }}>
            QRコードを入力
          </h3>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#9ca3af',
              fontSize: '1rem',
              fontWeight: '500',
            }}>
              QRコードID
            </label>
            <input
              type="text"
              value={qrId}
              onChange={(e) => setQrId(e.target.value.toUpperCase())}
              placeholder="例: A001"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.2rem',
                backgroundColor: '#16213e',
                color: '#fff',
                border: '2px solid #0f3460',
                borderRadius: '12px',
                outline: 'none',
                fontWeight: '600',
                textAlign: 'center',
                letterSpacing: '2px',
              }}
            />
          </div>

          <button
            onClick={handleQRAccess}
            disabled={!state.gameActive}
            style={{
              width: '100%',
              padding: '1.25rem',
              fontSize: '1.3rem',
              backgroundColor: state.gameActive ? '#10b981' : '#555',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: state.gameActive ? 'pointer' : 'not-allowed',
              fontWeight: '700',
              transition: 'all 0.3s',
              boxShadow: state.gameActive ? '0 6px 20px rgba(16, 185, 129, 0.4)' : 'none',
            }}
          >
            ✨ 取得する
          </button>
        </div>

        {/* メッセージ表示 */}
        {message && (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444',
              color: 'white',
              borderRadius: '16px',
              textAlign: 'center',
              fontWeight: '700',
              fontSize: '1.3rem',
              marginBottom: '2rem',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            {message.text}
          </div>
        )}

        {/* 取得済みQRコード */}
        {qrCodesFound > 0 && (
          <div style={{
            backgroundColor: '#1a1a2e',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.3rem',
              color: '#fff',
              fontWeight: '700',
            }}>
              📋 取得済みQRコード
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              {deviceData?.qrAccesses.map((id) => (
                <span
                  key={id}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#16213e',
                    color: '#60a5fa',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    fontFamily: 'monospace',
                  }}
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
