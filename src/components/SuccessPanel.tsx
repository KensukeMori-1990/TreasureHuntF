/**
 * TreasureHunt Success Panel (Point Acquisition Success Screen)
 */

import { useEffect } from 'react';

interface SuccessPanelProps {
  point: number;
  team: 'red' | 'yellow';
  qrId: string;
  navigate?: (path: string) => void;
}

export default function SuccessPanel({ point, team, qrId, navigate }: SuccessPanelProps) {
  const teamName = team === 'red' ? '赤チーム' : '黄チーム';

  useEffect(() => {
    // 紙吹雪エフェクトを生成
    createConfetti();
  }, []);

  const createConfetti = () => {
    const colors = ['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = 'confetti-fall 3s linear';
        confetti.style.animationDelay = Math.random() * 1 + 's';
        document.body.appendChild(confetti);

        // アニメーション終了後に削除
        setTimeout(() => {
          confetti.remove();
        }, 3000);
      }, i * 30);
    }
  };

  const handleView = () => {
    if (navigate) {
      navigate('/treasurehunt/view');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <style>
        {`
          @keyframes confetti-fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }

          .team-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            margin: 10px 0;
          }

          .team-badge-red {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          }

          .team-badge-yellow {
            background: linear-gradient(135deg, #f39c12 0%, #d68910 100%);
          }
        `}
      </style>

      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#1a1a2e',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
      }}>
        {/* 成功アイコン */}
        <div style={{
          fontSize: '5rem',
          marginBottom: '1rem',
        }}>
          ✓
        </div>

        {/* タイトル */}
        <div style={{
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          color: '#fff',
          fontWeight: '800',
        }}>
          ポイント獲得！
        </div>

        {/* チームバッジ */}
        <div className={`team-badge team-badge-${team}`}>
          {teamName}
        </div>

        {/* ポイント表示 */}
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          borderRadius: '15px',
          padding: '30px',
          margin: '20px 0',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        }}>
          <div style={{
            fontSize: '16px',
            marginBottom: '10px',
            opacity: 0.9,
          }}>
            獲得ポイント
          </div>
          <div style={{
            fontSize: '64px',
            fontWeight: 'bold',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          }}>
            {point}
          </div>
        </div>

        {/* メッセージ */}
        <div style={{
          backgroundColor: '#16213e',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '2px solid #0f3460',
        }}>
          <div style={{
            color: '#e0e0e0',
            fontSize: '1.1rem',
            lineHeight: '1.8',
          }}>
            このQRコードのポイントを<br />
            <strong>{teamName}</strong> に加算しました！
          </div>
        </div>

        {/* QR情報 */}
        <div style={{
          fontSize: '14px',
          color: '#999',
          marginBottom: '2rem',
        }}>
          QRコード: {qrId}
        </div>

        {/* ViewPanelに遷移するボタン */}
        <button
          onClick={handleView}
          style={{
            width: '100%',
            padding: '1.25rem',
            fontSize: '1.3rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🎯 現在の獲得ポイントを確認する
        </button>
      </div>
    </div>
  );
}
