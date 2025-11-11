/* public/js/main.js */

// HTMLの読み込みが終わったら実行
document.addEventListener('DOMContentLoaded', () => {
  
  // --- 調整可能な設定 ---
  
  // スライド全体のアニメーション時間 (秒)
  const TOTAL_DURATIO_SECONDS = 10; 
  
  // 各スライドでの「停止時間」の割合 (0.1〜0.9)
  // 0.8 = 80%停止し、20%の時間で次のスライドへ移動する
  const STOP_RATIO = 0.4; 

  // ----------------------

  const track = document.querySelector('.slider-track');
  if (!track) {
    console.log('スライダーが見つかりません。');
    return; // スライダーがこのページになければ終了
  }

  // 1. スライド枚数を計算
  // (HTMLには2セット入っているので、子の総数を2で割る)
  const totalElements = track.children.length;
  if (totalElements === 0) return;
  
  const slideCount = totalElements / 2; // ユニークなスライド枚数 (例: 3)

  // 2. 幅を計算
  // トラック幅 (例: 3枚 x 2セット = 600%)
  const trackWidth = slideCount * 2 * 100; 
  // 各スライド幅 (例: 100% / 6 = 16.666...%)
  const slideWidth = 100 / (slideCount * 2); 

  // 3. @keyframes の文字列を動的に生成
  let keyframes = '';
  const timePerSlide = 100 / slideCount; // 1スライドあたりの時間 (パーセント)
  const stopTime = timePerSlide * STOP_RATIO;
  const moveTime = timePerSlide - stopTime;

  let currentTime = 0; // 0% から 100% までの進捗

  // 最初のスライド (0%)
  keyframes += `0% { transform: translateX(0%); }\n`;
  currentTime += stopTime;
  keyframes += `${currentTime}% { transform: translateX(0%); }\n`;

  // 2枚目以降のスライド
  for (let i = 1; i < slideCount; i++) {
    // 移動
    currentTime += moveTime;
    const transformValue = -(i * slideWidth);
    keyframes += `${currentTime}% { transform: translateX(${transformValue.toFixed(8)}%); }\n`;

    // 停止
    currentTime += stopTime;
    keyframes += `${currentTime}% { transform: translateX(${transformValue.toFixed(8)}%); }\n`;
  }

  // 最後のスライドからループ位置 (1セット目の先頭) への移動
  // transform: -50% は、トラック幅のちょうど半分 (1セット分)
  keyframes += `100% { transform: translateX(-50%); }\n`;

  // 4. <style> タグを生成して <head> に挿入
  const styleTag = document.createElement('style');
  styleTag.id = 'slider-dynamic-styles';
  
  // CSSのルールを文字列として作成
  styleTag.innerHTML = `
    .slider-track {
      width: ${trackWidth}%;
      /* このJSで計算したアニメーションを適用 */
      animation: scroll ${TOTAL_DURATIO_SECONDS}s ease-in-out infinite;
    }

    .slide {
      width: ${slideWidth.toFixed(8)}%;
    }

    /* このJSで生成したキーフレームを定義 */
    @keyframes scroll {
      ${keyframes}
    }
  `;

  // <head> の末尾に <style> タグを追加
  document.head.appendChild(styleTag);
  
  console.log(`スライダーを ${slideCount} 枚で初期化しました。`);
});