import React, { useState, useEffect, useRef } from 'react';
// 画像を `src/assets/` に置いてモジュールとしてインポートします
import backgroundImage from './assets/wallpaper.jpg';
import subscKunImage from './assets/subsc-kun.png';
// ロゴ候補（ローカルに置いたロゴが `hero.png` の場合に使います）
// Use the actual logo file in assets (logo.png)
import logoImage from './assets/logo.png';

// アニメーションスタイルの注入（よりリッチな演出を追加）
const injectStyles = () => {
  if (typeof document === 'undefined') return;
  const id = 'subsc-ikusei-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.innerHTML = `
    @keyframes pulse-slow { 
      0%, 100% { transform: scale(1); } 
      50% { transform: scale(1.06); } 
    }
    @keyframes shake-monster { 
      0%, 100% { transform: rotate(0deg) scale(1); } 
      20% { transform: rotate(-3deg) scale(1.03); } 
      40% { transform: rotate(3deg) scale(0.97); } 
      60% { transform: rotate(-2deg) scale(1.02); } 
      80% { transform: rotate(2deg) scale(0.98); } 
    }
    @keyframes float-slow {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
    .animate-shake { animation: shake-monster 0.5s infinite ease-in-out; }
    .animate-float { animation: float-slow 4s infinite ease-in-out; }
    
    /* スマホ画面風に見せるためのスクロールバー非表示設定 */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* ボタンのタップ効果 */
    .clickable:active { transform: scale(0.95); transition: transform 0.1s; }
  `;
  document.head.appendChild(style);
};
injectStyles();

export default function App() {
  const [stage, setStage] = useState<'widget' | 'monsters' | 'cleared'>('widget');
  
  // あぶり出し（スクラッチ）の進捗状況を数値で管理（0: 未あぶり ~ 4: 完了）
  const [rubCount, setRubCount] = useState<number>(0);
  const [isClearedAnimation, setIsClearedAnimation] = useState<boolean>(false);

  // ステラ（AI）からの全肯定メッセージ
  const praiseMessages = [
    "「自動引き落としの1,480円、ついにバイバイできたね！」",
    "「後回しにしちゃうのは、毎日お仕事を頑張って疲れてる証拠。」",
    "「誇れ、お前は強い」",
    "「一歩進めた自分を、今日はいっぱい褒めてあげよう✨」"
  ];

  // 最終表示用のランダムなメッセージ（スクラッチ完了時に一度だけセット）
  const [finalPraise, setFinalPraise] = useState<string | null>(null);
  const [logoAvailable, setLogoAvailable] = useState<boolean>(true);
  const [wallpaperAvailable, setWallpaperAvailable] = useState<boolean>(true);

  // すべてあぶり出したら自動的にクリア画面へ遷移する演出
  useEffect(() => {
    if (rubCount === 4) {
      const timer = setTimeout(() => {
        setIsClearedAnimation(true);
        setTimeout(() => {
          setStage('cleared');
        }, 600); // フェードアウトの時間
      }, 1500); // メッセージを読み終えるための余韻
      return () => clearTimeout(timer);
    }
  }, [rubCount]);

  // ポインタ操作でのスクラッチ改善（ドラッグでこすれるように）
  const isPointerDownRef = useRef(false);
  const lastIncrementRef = useRef<number>(0);

  const tryIncrementRub = () => {
    const now = Date.now();
    // インクリメントは最低100msの間隔を空ける
    if (now - lastIncrementRef.current < 120) return;
    lastIncrementRef.current = now;
    setRubCount(prev => Math.min(prev + 1, 4));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    tryIncrementRub();
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch (err) {
      // ignore
    }
  };

  const handlePointerMove = () => {
    if (!isPointerDownRef.current) return;
    tryIncrementRub();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    try {
      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    } catch (err) {
      // ignore
    }
  };

  const handlePointerCancel = () => {
    isPointerDownRef.current = false;
  };

  // rubCount が 4 になったら一度だけランダムなメッセージを選ぶ
  useEffect(() => {
    if (rubCount === 4 && finalPraise == null) {
      const available = praiseMessages.filter(m => m && m.trim() !== '');
      if (available.length === 0) return;
      const idx = Math.floor(Math.random() * available.length);
      const t = setTimeout(() => setFinalPraise(available[idx]), 450);
      return () => clearTimeout(t);
    }
  }, [rubCount, finalPraise]);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#ffffff',
        fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", sans-serif',
        padding: '20px',
      }}
    >
      {/* スマートフォン型コンテナ */}
      <div
        className="no-scrollbar"
        style={{
          width: '375px',
          height: '712px',
          backgroundColor: '#1e1e1e',
          borderRadius: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          border: '8px solid #2a2a2a',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.5s ease',
        }}
      >
        {/* ステータスバー（スマホらしさの演出） */}
        <div
          style={{
            height: '34px',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            fontSize: '12px',
            color: '#888',
            fontWeight: '500',
          }}
        >
          <span>12:34</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span>📶</span>
            <span>🔋 85%</span>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div
          className="no-scrollbar"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            position: 'relative',
            opacity: isClearedAnimation ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}
        >
          {/* ==================== 1. WIDGET STAGE (初期状態) ==================== */}
          {stage === 'widget' && (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative', backgroundImage: wallpaperAvailable ? `url(${backgroundImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: wallpaperAvailable ? undefined : '#121212' }}>
              {/* invisible detector: if wallpaper asset missing, onError will flip flag */}
              <img src={backgroundImage} alt="" style={{ display: 'none' }} onError={() => setWallpaperAvailable(false)} onLoad={() => setWallpaperAvailable(true)} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  {logoAvailable ? (
                    <img src={logoImage} alt="ロゴ" style={{ width: '100%', maxWidth: '240px', height: 'auto', display: 'block', margin: '0 auto 8px', objectFit: 'contain', background: 'transparent' }} onError={() => setLogoAvailable(false)} onLoad={() => setLogoAvailable(true)} />
                  ) : (
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ddd', marginBottom: '8px' }}>炸裂！ サブスク育成図鑑</h1>
                  )}
                  <p style={{ fontSize: '13px', color: '#ddd', marginTop: '6px' }}>（サブスクを放置して3ヶ月目の現実）</p>
                </div>

                {/* やばいウィジェット */}
              <div
                className="animate-pulse-slow clickable"
                onClick={() => setStage('monsters')}
                style={{
                  width: '90%',
                  backgroundColor: '#2d1f1f',
                  border: '2px solid #ff4a4a',
                  borderRadius: '20px',
                  padding: '20px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(255, 74, 74, 0.15)',
                  transition: 'transform 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>🚨</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#ff6b6b', fontWeight: 'bold' }}>サブスク警告</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#bbb' }}>未利用のサービスが肥大化中</p>
                  </div>
                </div>
                <div style={{ backgroundColor: '#1a1212', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#ffb3b3', lineHeight: '1.4', textAlign: 'center' }}>
                  ⚠️ <b>動画配信プレミアム</b> が<br />
                  あなたの財布を圧迫しています！
                </div>
                <button
                  className="clickable"
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    backgroundColor: '#ff4a4a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  現実と向き合う（警告を解く）
                </button>
              </div>
            </div>
          </div>
          )}

          {/* ==================== 2. MONSTERS STAGE (メイン機能) ==================== */}
          {stage === 'monsters' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* ヘッダー */}
              <div style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1a1a1a' }}>
                <span style={{ fontSize: '14px', color: '#aaa', fontWeight: 'bold' }}>⚔️ サブスク清算クエスト</span>
                <span style={{ fontSize: '12px', backgroundColor: '#333', padding: '4px 8px', borderRadius: '12px', color: '#ffb3b3' }}>難易度: 易しい</span>
              </div>

              {/* クエスト提示エリア */}
              <div style={{ padding: '16px 20px 0', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', backgroundColor: '#2a2415', border: '1px solid #d4af37', borderRadius: '12px', padding: '10px 16px', maxWidth: '90%' }}>
                  <span style={{ color: '#d4af37', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>MISSION</span>
                  <span style={{ fontSize: '14px', color: '#fff', fontWeight: '500' }}>「今週は、この1個だけ解約する？」</span>
                </div>
              </div>

              {/* モンスター表示エリア */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '10px' }}>
                
                {/* あぶり出しの進捗度に応じたモンスターの見た目の変化 */}
                <div 
                  className={rubCount === 0 ? "animate-shake animate-pulse-slow" : "animate-float"}
                  style={{ 
                    position: 'relative',
                    width: '180px',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.5s ease'
                  }}
                >
                  {/* 風船ガム型モンスターの本体イメージ */}
                  <div
                    style={{
                      width: rubCount === 0 ? '160px' : `${160 - rubCount * 25}px`,
                      height: rubCount === 0 ? '160px' : `${160 - rubCount * 25}px`,
                      backgroundColor: rubCount === 0 ? '#ff66a3' : '#b3b3b3',
                      borderRadius: '50%',
                      boxShadow: rubCount === 0 ? '0 0 30px rgba(255,102,163,0.6)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      position: 'relative',
                      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    {rubCount === 0 ? '🤬' : rubCount < 4 ? '😰' : '🏳️‍🌈'}
                    
                    {/* サブスク金額タグ */}
                    {rubCount === 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        backgroundColor: '#ff4a4a',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        whiteSpace: 'nowrap'
                      }}>
                        月額 1,480円
                      </div>
                    )}
                  </div>
                </div>

                {/* モンスター名とステータス */}
                <div style={{ textAlign: 'center', marginTop: '16px', height: '45px' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: rubCount === 0 ? '#ff66a3' : '#aaa' }}>
                    {rubCount === 0 ? 'ガム・フウセン（動画サブスクの化身）' : rubCount < 4 ? '萎みかけたガム' : '清算された魂'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#777' }}>
                    {rubCount === 0 ? '放置されてパンパンに肥大化している！' : rubCount < 4 ? '解約されてパワーを失っている…' : 'ただのガムに戻った。'}
                  </p>
                </div>
              </div>

              {/* あぶり出し（スクラッチ）操作エリア */}
              <div 
                style={{ 
                  backgroundColor: '#161616', 
                  borderTop: '1px solid #2a2a2a', 
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {rubCount < 4 ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#aaa', padding: '0 4px' }}>
                      <span>👋 指で画面をこすって労う</span>
                      <span>あぶり出し: {rubCount * 25}%</span>
                    </div>
                    
                    {/* スクラッチエリア（ここにマウスを乗せる/スマホで触ると進行） */}
                    <div
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerCancel}
                      onPointerLeave={handlePointerUp}
                      className="clickable"
                      style={{
                        height: '90px',
                        backgroundColor: '#262626',
                        border: '2px dashed #444',
                        borderRadius: '16px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        transition: 'border-color 0.3s'
                      }}
                    >
                      {/* もや（あぶり出し前のマスク） */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: '#403035',
                        opacity: 1 - rubCount * 0.25, // こするたびに透明になっていく
                        transition: 'opacity 0.4s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ff99bb',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        pointerEvents: 'none'
                      }}>
                        {rubCount === 0 ? '▼ ここを何度もこすって「あぶり出す」' : 'もっとこすって…！'}
                      </div>

                      {/* あぶり出されるメッセージ */}
                      {rubCount === 0 ? (
                        <div style={{ 
                          padding: '12px', 
                          textAlign: 'center', 
                          color: '#00ffcc', 
                          fontSize: '13px', 
                          lineHeight: '1.5',
                          fontWeight: '500'
                        }}>
                          {praiseMessages[0]}
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : (
                    <div style={{ 
                      height: '140px', 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#00ffcc',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      animation: 'pulse-slow 2s infinite'
                    }}>
                      <div>✨ 魂の清算完了！ ✨</div>
                      {finalPraise ? (
                        <div style={{
                          marginTop: '8px',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '600',
                          lineHeight: '1.6',
                          maxWidth: '92%',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          textAlign: 'center',
                          zIndex: 30,
                        }}>{finalPraise}</div>
                      ) : (
                        <div style={{ marginTop: '8px', color: '#aaa', fontSize: '12px' }}>しばらくお待ちください…</div>
                      )}
                      <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 'normal', display: 'block', marginTop: '8px' }}>
                        図鑑へ転送しています...
                      </span>
                    </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== 3. CLEARED STAGE (図鑑・達成感) ==================== */}
          {stage === 'cleared' && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ textShadow: '0 0 20px rgba(0,255,204,0.3)', textAlign: 'center', width: '100%', marginTop: '20px' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>🏆</span>
                <h2 style={{ color: '#00ffcc', margin: '0 0 8px 0', fontSize: '22px', fontWeight: 'bold' }}>クエスト達成！</h2>
                <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>思考停止のまま、自信を取り戻した！</p>
              </div>

              {/* コレクション図鑑風カード */}
              <div style={{
                width: '100%',
                backgroundColor: '#252525',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                border: '1px solid #333',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '11px', color: '#00ffcc', border: '1px solid #00ffcc', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                  モンスター図鑑 #01
                </span>
                <div style={{ fontSize: '48px', margin: '16px 0 8px' }}>🎈</div>
                <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '15px' }}>しぼんだガム・フウセン</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#999', lineHeight: '1.5' }}>
                  3ヶ月放置され、4,440円を吸い上げていたモンスター。あなたの「あぶり出し」の労いによって大人しくなり、ただのゴムに戻った。
                </p>
              </div>

              {/* 次のステップ */}
              <button
                className="clickable"
                onClick={() => {
                  setStage('widget');
                  setRubCount(0);
                  setFinalPraise(null);
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '12px',
                  padding: '14px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                }}
              >
                ホーム画面に戻る（次の冒険へ）
              </button>
            </div>
          )}
        </div>

        {/* 下部ナビゲーションバー（スマホらしさの演出） */}
        <div
          style={{
            height: '50px',
            display: 'flex',
            justifyContent: 'space-around',
            backgroundColor: '#1a1a1a',
            borderTop: '1px solid #2a2a2a',
            paddingBottom: '4px'
          }}
        >
          <button className="clickable" style={{ background: 'none', border: 'none', color: stage === 'widget' ? '#00ffcc' : '#666', fontSize: '18px', cursor: 'pointer' }} onClick={() => { setStage('widget'); setRubCount(0); setFinalPraise(null); }}>
            🏠
          </button>
          <button className="clickable" style={{ background: 'none', border: 'none', color: stage === 'monsters' ? '#00ffcc' : '#666', fontSize: '18px', cursor: 'pointer' }} onClick={() => setStage('monsters')}>
            ⚔️
          </button>
          <button className="clickable" style={{ background: 'none', border: 'none', color: stage === 'cleared' ? '#00ffcc' : '#666', fontSize: '18px', cursor: 'pointer' }} onClick={() => setStage('cleared')}>
            📖
          </button>
        </div>
      </div>
    </div>
  );
}