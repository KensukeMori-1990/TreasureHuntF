/**
 * TreasureHunt Admin Panel
 */

import { RenderProps } from '../core/types';
import { TreasureHuntState, TreasureHuntAction, DeviceData } from '../types';

export default function AdminPanel({
  state,
  executeAction,
  refreshState,
}: RenderProps<TreasureHuntState>) {
  const handleCopyUrl = (qrId: string) => {
    const url = `${window.location.origin}/action?qr=${qrId}`;
    navigator.clipboard.writeText(url).then(() => {
      alert(`URLをコピーしました: ${url}`);
    }).catch((err) => {
      console.error('コピーに失敗しました:', err);
      alert('コピーに失敗しました');
    });
  };

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
    if (!confirm('ゲームをリセットしますか？（スコアとQRアクセス履歴がクリアされます。チーム情報は維持されます）')) {
      return;
    }

    // デバイス情報を保持しつつqrAccessesのみクリア
    const resetDevices: { [deviceId: string]: DeviceData } = {};
    Object.entries(state.devices).forEach(([deviceId, deviceData]) => {
      resetDevices[deviceId] = {
        team: deviceData.team,
        qrAccesses: [],
        createdAt: deviceData.createdAt,
      };
    });

    const action: TreasureHuntAction = {
      type: 'RESET_GAME',
      payload: {
        teams: {
          red: { name: '赤チーム', score: 0, totalAccesses: 0, uniqueDevices: 0 },
          yellow: { name: '黄チーム', score: 0, totalAccesses: 0, uniqueDevices: 0 },
        },
        devices: resetDevices,
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#1a1a2e',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: '2.5rem',
          marginBottom: '2rem',
          textAlign: 'center',
          fontWeight: '700',
        }}>
          🎯 TreasureHunt 管理画面
        </h1>

        {/* コントロールボタン */}
        <div style={{
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <button
            onClick={handleStartGame}
            disabled={state.gameActive}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: state.gameActive ? '#555' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: state.gameActive ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: state.gameActive ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.4)',
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
              backgroundColor: !state.gameActive ? '#555' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: !state.gameActive ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: !state.gameActive ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.4)',
            }}
          >
            🔴 ゲーム停止
          </button>

          <button
            onClick={handleResetGame}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
            }}
          >
            🔄 ゲームリセット
          </button>

          <button
            onClick={handleResetDevices}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            }}
          >
            📱 デバイスリセット
          </button>

          <button
            onClick={refreshState}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
            }}
          >
            🔄 再読み込み
          </button>
        </div>

        {/* ゲーム状態 */}
        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#16213e',
          borderRadius: '12px',
          border: '2px solid #0f3460',
        }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontWeight: '600',
          }}>
            ゲーム状態
          </h2>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: state.gameActive ? '#10b981' : '#ef4444',
            margin: 0,
          }}>
            {state.gameActive ? '🟢 ゲーム進行中' : '🔴 ゲーム停止中'}
          </p>
        </div>

        {/* チームスコア */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontWeight: '600',
          }}>
            チームスコア
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '2rem',
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
              }}
            >
              <h3 style={{
                margin: '0 0 1rem 0',
                color: '#fff',
                fontSize: '1.3rem',
                fontWeight: '600',
              }}>
                🔴 {state.teams.red.name}
              </h3>
              <p style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                margin: '0',
                color: '#fff',
              }}>
                {state.teams.red.score}
              </p>
              <p style={{
                margin: '0.5rem 0 0 0',
                fontSize: '1rem',
                color: '#fecaca',
              }}>
                取得: {state.teams.red.totalAccesses} / 端末: {state.teams.red.uniqueDevices}
              </p>
            </div>

            <div
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '2rem',
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(234, 179, 8, 0.3)',
              }}
            >
              <h3 style={{
                margin: '0 0 1rem 0',
                color: '#fff',
                fontSize: '1.3rem',
                fontWeight: '600',
              }}>
                🟡 {state.teams.yellow.name}
              </h3>
              <p style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                margin: '0',
                color: '#fff',
              }}>
                {state.teams.yellow.score}
              </p>
              <p style={{
                margin: '0.5rem 0 0 0',
                fontSize: '1rem',
                color: '#fef3c7',
              }}>
                取得: {state.teams.yellow.totalAccesses} / 端末: {state.teams.yellow.uniqueDevices}
              </p>
            </div>
          </div>
        </div>

        {/* QRコード取得状況 */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontWeight: '600',
          }}>
            QRコード取得状況
          </h2>
          <div style={{
            overflowX: 'auto',
            backgroundColor: '#16213e',
            borderRadius: '12px',
            padding: '1rem',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#0f3460' }}>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    color: '#fff',
                    fontWeight: '600',
                    borderBottom: '2px solid #1a1a2e',
                  }}>
                    QRコードID
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    color: '#fff',
                    fontWeight: '600',
                    borderBottom: '2px solid #1a1a2e',
                  }}>
                    ポイント
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    color: '#fff',
                    fontWeight: '600',
                    borderBottom: '2px solid #1a1a2e',
                  }}>
                    発見者数
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    color: '#fff',
                    fontWeight: '600',
                    borderBottom: '2px solid #1a1a2e',
                  }}>
                    URL
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(state.qrCodes)
                  .sort(([aId], [bId]) => aId.localeCompare(bId))
                  .map(([qrId, data]) => (
                    <tr key={qrId} style={{ borderBottom: '1px solid #0f3460' }}>
                      <td style={{
                        padding: '0.75rem',
                        color: '#e0e0e0',
                        fontWeight: '500',
                      }}>
                        {qrId}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        color: '#10b981',
                        fontWeight: '600',
                      }}>
                        {data.point}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        color: '#60a5fa',
                        fontWeight: '600',
                      }}>
                        {data.foundBy.length}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                      }}>
                        <button
                          onClick={() => handleCopyUrl(qrId)}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s',
                            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#7c3aed';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#8b5cf6';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          📋 URLコピー
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* デバイス情報 */}
        <div>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontWeight: '600',
          }}>
            デバイス情報
          </h2>
          <p style={{
            color: '#9ca3af',
            marginBottom: '1rem',
            fontSize: '1.1rem',
          }}>
            登録デバイス数: {Object.keys(state.devices).length}
          </p>
          <div style={{
            overflowX: 'auto',
            backgroundColor: '#16213e',
            borderRadius: '12px',
            padding: '1rem',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#0f3460' }}>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    color: '#fff',
                    fontWeight: '600',
                    borderBottom: '2px solid #1a1a2e',
                  }}>
                    デバイスID
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    color: '#fff',
                    fontWeight: '600',
                    borderBottom: '2px solid #1a1a2e',
                  }}>
                    チーム
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    color: '#fff',
                    fontWeight: '600',
                    borderBottom: '2px solid #1a1a2e',
                  }}>
                    取得QR数
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(state.devices).map(([deviceId, data]) => (
                  <tr key={deviceId} style={{ borderBottom: '1px solid #0f3460' }}>
                    <td style={{
                      padding: '0.75rem',
                      fontSize: '0.9rem',
                      color: '#9ca3af',
                      fontFamily: 'monospace',
                    }}>
                      {deviceId}
                    </td>
                    <td style={{
                      padding: '0.75rem',
                      color: '#fff',
                      fontWeight: '600',
                    }}>
                      {data.team === 'red' ? '🔴 赤' : '🟡 黄'}
                    </td>
                    <td style={{
                      padding: '0.75rem',
                      color: '#60a5fa',
                      fontWeight: '600',
                    }}>
                      {data.qrAccesses.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
