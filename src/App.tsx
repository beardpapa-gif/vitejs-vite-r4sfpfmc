import { useState, useEffect } from 'react';

// インタラインのスタイルを動的に注入（Tailwindのセットアップがなくても綺麗に表示するため）
const injectStyles = () => {
  if (typeof document === 'undefined') return;
  const id = 'subsc-ikusei-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.innerHTML = `
    @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.08); opacity: 0.4; } }
    @keyframes shake-monster { 0%, 100% { transform: rotate(0deg) scale(1); } 20% { transform: rotate(-3deg) scale(1.02); } 40% { transform: rotate(3deg) scale(0.98); } 60% { transform: rotate(-2deg) scale(1.01); } 80% { transform: rotate(2deg) scale(0.99); } }
    .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
    .animate-shake { animation: shake-monster 0.6s infinite ease-in-out; }
  `;
  document.head.appendChild(style);
};
injectStyles();

export default function App() {
  const [stage, setStage] = useState<'widget' | 'monsters' | 'cleared'>(
    'widget'
  );
  const [isScratched, setIsScratched] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // 現在時刻を取得して更新
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // 1分ごとに更新
    
    return () => clearInterval(interval);
  }, []);
  const [subscs, setSubscs] = useState([
    {
      id: 1,
      name: '謎の音楽雑誌アプリ',
      price: 300,
      company: 'XYZメディア',
      active: true,
    },
    {
      id: 2,
      name: '1回しか使ってない動画配信',
      price: 980,
      company: '合同会社クオリティ',
      active: true,
    },
    {
      id: 3,
      name: '期限切れ忘れた英会話ツール',
      price: 1480,
      company: 'GlobalEdu Inc.',
      active: true,
    },
  ]);

  const targetSubsc = subscs[0];
  const totalLossYearly =
    subscs.filter((s) => s.active).reduce((sum, s) => sum + s.price, 0) * 12;

  const handleDeclineQuest = () => {
    setSubscs(
      subscs.map((s) => (s.id === targetSubsc.id ? { ...s, active: false } : s))
    );
    setStage('cleared');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Android風のスマホ外枠 */}
      <div
        style={{
          width: '100%',
          maxWidth: '375px',
          height: '680px',
          backgroundColor: '#1a1a1a',
          borderRadius: '20px',
          border: '6px solid #2a2a2a',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Android風ステータスバー */}
        <div
          style={{
            height: '24px',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            fontSize: '10px',
            color: '#fff',
            paddingTop: '2px',
          }}
        >
          <span style={{ fontSize: '10px' }}>{currentTime || '--:--'}</span>
          <div style={{ display: 'flex', gap: '3px', fontSize: '9px' }}>📶 📡 🔋</div>
        </div>

        {/* メイン画面エリア */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
          }}
        >
          {/* 1. 通知・ウィジェット起動ステージ（3コマ目対応） */}
          {stage === 'widget' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#2d3748',
                  borderRadius: '20px',
                  padding: '16px',
                  border: '1px solid #ef4444',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                  marginBottom: '30px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#f87171',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  <span>⚠️</span> <span>CARD NOTIFICATION</span>
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#cbd5e1',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  【重要】引き落とし不能通知
                  <br />
                  アカウントの残高が不足しているため、今月の定期決済が完了できませんでした。明細をご確認ください。
                </p>
              </div>

              <p
                style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  marginBottom: '20px',
                  padding: '0 10px',
                  textAlign: 'center',
                }}
              >
                「また負の儀式が始まるのか…」と絶望する佐藤さんの画面に、怪しいボタンのウィジェットが浮かび上がる…
              </p>

              <button
                onClick={() => setStage('monsters')}
                style={{
                  width: '100%',
                  padding: '16px',
                  background:
                    'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                  transition: 'transform 0.2s',
                }}
              >
                🚨 思考停止のまま「やばいボタン」を叩く
              </button>
            </div>
          )}

          {/* 2. モンスター直視 ＆ 最小単位のクエスト提示ステージ（4〜6コマ目対応） */}
          {stage === 'monsters' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    backgroundColor: '#0f172a',
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}
                >
                  明細データは直感的に要約されました
                </span>
              </div>

              {/* 視覚化：放置金額に応じて巨大化し、震えるガム型モンスター */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '20px 0',
                  position: 'relative',
                }}
              >
                <div
                  className="animate-pulse-slow"
                  style={{
                    position: 'absolute',
                    width: '190px',
                    height: '190px',
                    borderRadius: '50%',
                    backgroundColor: '#f43f5e',
                    filter: 'blur(8px)',
                    opacity: 0.3,
                  }}
                ></div>
                <div
                  className="animate-shake"
                  style={{
                    width: '170px',
                    height: '170px',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(180deg, #f43f5e 0%, #ec4899 50%, #be123c 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5), inset -8px -8px 16px rgba(0,0,0,0.3)',
                    border: 'none',
                    position: 'relative',
                    zIndex: 10,
                  }}
                >
                  <span style={{ fontSize: '50px', marginBottom: '8px' }}>
                    👀
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#0f172a',
                      backgroundColor: '#fff',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      textTransform: 'uppercase',
                    }}
                  >
                    炸裂寸前
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 'black',
                      color: '#fff',
                      marginTop: '6px',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    年間損失: {totalLossYearly.toLocaleString()}円
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '16px',
                  padding: '14px',
                  border: '1px solid #ec4899',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(236, 72, 153, 0.2)',
                    color: '#f472b6',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginBottom: '6px',
                  }}
                >
                  今週の1個だけ解約クエスト
                </span>
                <h3
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {targetSubsc.name}
                </h3>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
                  請求会社名: {targetSubsc.company} / 月額 {targetSubsc.price}円
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* コンセプトテストの知見を反映：全自動ではなく、自分の指で意思決定させる最終確認ボタン */}
                <button
                  onClick={handleDeclineQuest}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#10b981',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#0f172a',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    marginBottom: '8px',
                  }}
                >
                  👍 承認：AIにこの1個だけ手続きを任せる
                </button>
                <button
                  onClick={() => setStage('widget')}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  あとでやる（画面を閉じて現実逃避する）
                </button>
              </div>
            </div>
          )}

          {/* 3. 解約完了 ＆ あぶり出し振り返りステージ（7〜9コマ目対応） */}
          {stage === 'cleared' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '10px',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    boxShadow: '0 4px 10px rgba(16,185,129,0.2)',
                  }}
                >
                  <span style={{ fontSize: '30px' }}>😊</span>
                </div>
                <h2
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#10b981',
                  }}
                >
                  清算完了！
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#94a3b8',
                    textAlign: 'center',
                  }}
                >
                  モンスターが萎み、実績が図鑑にコレクションされました。
                </p>
              </div>

              {/* こする体験を再現するインタラクティブな「あぶり出し」コンポーネント */}
              <div
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  padding: '20px',
                  position: 'relative',
                  minHeight: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #334155',
                  overflow: 'hidden',
                }}
              >
                {!isScratched ? (
                  <div
                    onMouseEnter={() => setIsScratched(true)}
                    onTouchStart={() => setIsScratched(true)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(135deg, #ef476f 0%, #f78c6b 50%, #ffd166 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: '15px',
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 1px, transparent 1px),
                        radial-gradient(circle at 70% 60%, rgba(255,255,255,0.2) 2px, transparent 2px),
                        radial-gradient(circle at 40% 80%, rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(135deg, #ef476f 0%, #f78c6b 50%, #ffd166 100%)
                      `,
                      backgroundSize: '100px 100px, 150px 150px, 120px 120px, 100% 100%',
                      boxShadow: 'inset -4px -4px 12px rgba(0,0,0,0.3), inset 4px 4px 12px rgba(255,255,255,0.2)',
                    }}
                  >
                    <span style={{ fontSize: '24px', marginBottom: '6px' }}>
                      🧼
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#fff',
                        textAlign: 'center',
                        animation: 'pulse-slow 2s infinite',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      月初のリラックスタイムです。
                      <br />
                      画面にへばりついたガムをこすってみましょう
                    </span>
                  </div>
                ) : null}

                {/* こするとあぶり出される、佐藤さんの見栄と孤独を癒やすAIの全肯定労いテキスト */}
                <div
                  style={{
                    textAlign: 'center',
                    opacity: isScratched ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#f59e0b',
                      fontWeight: 'bold',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    ✨ AIバディからの労いメッセージ
                  </span>
                  <p
                    style={{
                      margin: '0 0 10px 0',
                      fontSize: '13px',
                      color: '#fef08a',
                      fontStyle: 'italic',
                      lineHeight: '1.6',
                    }}
                  >
                    「毎月大した額じゃないと言い訳して逃げる自分に、今日しっかり向き合えたね。先延ばしにしない小さな決断、本当に偉いぞ健一！」
                  </p>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#34d399',
                      fontWeight: 'bold',
                    }}
                  >
                    固定費削減成功: ＋{targetSubsc.price}円 / 月
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setStage('widget');
                  setIsScratched(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#334155',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                🔄 シナリオをもう一度体験する
              </button>
            </div>
          )}
        </div>

        {/* Android風ナビゲーションバー */}
        <div
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: '#1a1a1a',
            borderTop: '1px solid #333',
          }}
        >
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ⬅️
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🏠
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ⋮
          </button>
        </div>
      </div>
    </div>
  );
}
