import React, { useState, useRef, useLayoutEffect } from "react";

// 表示する文章の配列
const generatedSentences = [
  "友達が昨日に大阪でお笑いライブを見た",
  "家族が先週に北海道で旅行に行った",
  "会社の同僚が今朝に会議室で新しいプロジェクトの発表をした",
  "兄が先月に京都でお寺を訪れた",
  "先生が去年の夏に沖縄の海でスキューバダイビングを体験した",
  "知らない人がさっきに駅のホームで親切に道を教えてくれた",
  "ペットのポチが今日の午後に公園の芝生で元気に走り回っていた",
  "社長が一昨日にニューヨーク支社でオンライン会議をしていた",
  "妹が3日前に家で美味しいクッキーを焼いてくれた",
  "祖母が先週に庭で綺麗な花を植えた",
  "弟が昨夜に自分の部屋で熱心に勉強をしていた",
  "猫が今朝に窓際で気持ちよさそうに日向ぼっこをした",
  "クラスメイトが放課後に体育館でバスケットボールの練習をした",
  "部長が金曜日に会議室で来期の経営戦略について説明した",
  "彼女が誕生日にレストランで素敵なディナーを予約してくれた",
  "息子が日曜日に公園の砂場で大きな山を作って遊んだ",
  "隣の家の人が今朝に道で元気よく挨拶をしてくれた",
  "有名な俳優が先月の舞台で観客を魅了する演技をした",
  "祖父が若い頃にアメリカでジャズの演奏をしていた",
  "赤ちゃんが今日の午後にリビングでお気に入りのおもちゃで遊んだ",
  "警察官が昨日に交番で道に迷ったお年寄りに地図を説明した",
  "娘が週末にデパートで新しい洋服を買ってもらった",
  "シェフがテレビ番組で家庭でできる本格的なレシピを紹介した",
  "後輩が今日の研修で積極的に質問をしていた",
  "彼が去年のクリスマスに雪山でスノーボードを初体験した",
  "叔母が夏休みにハワイのホテルでフラダンスを習った",
  "農家の人が朝市で採れたての新鮮な野菜を販売した",
  "夫が昨日の夜にキッチンで得意なパスタ料理を披露した",
  "孫が運動会で一生懸命に走る姿を見せてくれた",
  "登山家が先月にヒマラヤで前人未到のルートの登頂に成功した",
  "弁護士が法廷で依頼人の無実を証明するために弁論した",
  "大学生が夏休みにボランティア活動で海外の村を訪れた",
  "運転手さんがバスの中で忘れ物をした乗客に親切に対応した",
  "姉が3日前に電話で来月の結婚式の招待をしてくれた",
  "清掃員の方が毎朝に駅の構内をピカピカに掃除してくれていた",
  "息子が先ほどに自分のベッドで静かに寝息をたてはじめた",
  "作家がインタビューで次回作の構想について少しだけ話した",
  "店員さんがお店で商品の詳しい使い方を実演してくれた",
  "鳥が早朝に森で美しいさえずりを聞かせてくれた",
  "課長が先日の出張で現地の工場を視察した",
  "消防士が訓練で高層ビルからの救助活動を実演した",
  "留学生がスピーチコンテストで流暢な日本語を披露した",
  "ピアニストがコンサートホールでショパンの名曲を演奏した",
  "夫が休日にリビングでソファの組み立てをしてくれた",
  "警備員が深夜にビルの廊下で異常がないか巡回していた",
  "コーチが試合後にグラウンドで選手たちに熱い言葉をかけた",
  "娘が学芸会で劇の主役を堂々と演じきった",
  "漁師が早朝の海で大きな網を使って漁をした",
  "私が今日の午後にカフェでこの記事を作成した",
];

/**
 * 2つの矩形が重なっているかチェックする関数
 * @param {object} rect1 - {top, left, bottom, right}
 * @param {object} rect2 - {top, left, bottom, right}
 * @param {number} padding - 要素間の最小の余白
 * @returns {boolean} - 重なっていればtrue
 */
function checkOverlap(rect1, rect2, padding = 15) {
  return !(
    rect1.right + padding < rect2.left ||
    rect1.left - padding > rect2.right ||
    rect1.bottom + padding < rect2.top ||
    rect1.top - padding > rect2.bottom
  );
}

// function Touhyou() {
//   const [positions, setPositions] = useState([]);
//   const sentenceRefs = useRef([]);
//   // Create a ref for the main container div
//   const containerRef = useRef(null);

//   useLayoutEffect(() => {
//     const calculatePositions = () => {
//       // Guard clause: if the container isn't rendered yet, do nothing.
//       if (!containerRef.current) return;

//       // Get dimensions FROM THE CONTAINER, not the window
//       const { clientWidth: containerWidth, clientHeight: containerHeight } =
//         containerRef.current;

//       const newPositions = [];
//       const placedRects = [];

//       sentenceRefs.current.forEach((el, index) => {
//         if (!el) return;

//         const { width, height } = el.getBoundingClientRect();

//         let isOverlapping = true;
//         let attempts = 0;
//         let potentialRect = {};

//         while (isOverlapping && attempts < 100) {
//           isOverlapping = false;
//           // Generate coordinates within the container's bounds
//           const x = Math.random() * (containerWidth - width);
//           const y = Math.random() * (containerHeight - height);

//           potentialRect = {
//             left: x,
//             top: y,
//             right: x + width,
//             bottom: y + height,
//           };

//           for (const placedRect of placedRects) {
//             if (checkOverlap(potentialRect, placedRect)) {
//               isOverlapping = true;
//               break;
//             }
//           }
//           attempts++;
//         }

//         placedRects.push(potentialRect);
//         newPositions[index] = {
//           left: potentialRect.left,
//           top: potentialRect.top,
//         };
//       });

//       setPositions(newPositions);
//     };

//     calculatePositions();

//     window.addEventListener("resize", calculatePositions);
//     return () => window.removeEventListener("resize", calculatePositions);
//   }, []);

//   return (
//     // Attach the ref here and change the height property
//     <div
//       ref={containerRef}
//       style={{
//         position: "relative",
//         width: "100%",
//         height: "100%", // Use 100% to fill the flex container space
//         overflow: "hidden",
//         backgroundColor: "#f0f0f0",
//       }}
//     >
//       {generatedSentences.map((sentence, index) => (
//         <p
//           key={sentence}
//           ref={(el) => (sentenceRefs.current[index] = el)}
//           style={{
//             position: "absolute",
//             left: positions[index] ? `${positions[index].left}px` : "-9999px",
//             top: positions[index] ? `${positions[index].top}px` : "-9999px",
//             margin: 0,
//             padding: "5px 10px",
//             backgroundColor: "white",
//             borderRadius: "8px",
//             boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//             visibility: positions.length > 0 ? "visible" : "hidden",
//             transition: "opacity 0.5s ease-in-out",
//             opacity: positions.length > 0 ? 1 : 0,
//           }}
//         >
//           {sentence}
//         </p>
//       ))}
//     </div>
//   );
// }

// export default Touhyou;

function Touhyou() {
  const [positions, setPositions] = useState([]);
  const sentenceRefs = useRef([]);
  const containerRef = useRef(null); // NEW: Ref for the parent container

  useLayoutEffect(() => {
    const calculatePositions = () => {
      if (!containerRef.current) return;

      // Use the parent container's size instead of the window
      const { width: containerWidth, height: containerHeight } =
        containerRef.current.getBoundingClientRect();

      const newPositions = [];
      const placedRects = [];

      sentenceRefs.current.forEach((el, index) => {
        if (!el) return;

        const { width, height } = el.getBoundingClientRect();

        let isOverlapping = true;
        let attempts = 0;
        let potentialRect = {};

        while (isOverlapping && attempts < 100) {
          isOverlapping = false;
          const x = Math.random() * (containerWidth - width);
          const y = Math.random() * (containerHeight - height);

          potentialRect = {
            left: x,
            top: y,
            right: x + width,
            bottom: y + height,
          };

          for (const placedRect of placedRects) {
            if (checkOverlap(potentialRect, placedRect)) {
              isOverlapping = true;
              break;
            }
          }
          attempts++;
        }

        placedRects.push(potentialRect);
        newPositions[index] = {
          left: potentialRect.left,
          top: potentialRect.top,
        };
      });

      setPositions(newPositions);
    };

    calculatePositions();
    window.addEventListener("resize", calculatePositions);

    return () => window.removeEventListener("resize", calculatePositions);
  }, []);

  return (
    <div
      ref={containerRef} // NEW: attach ref here
      style={{
        position: "relative",
        width: "100%", // Fills parent
        height: "100%", // Fills parent
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
      }}
    >
      {generatedSentences.map((sentence, index) => (
        <p
          key={sentence}
          ref={(el) => (sentenceRefs.current[index] = el)}
          style={{
            position: "absolute",
            left: positions[index] ? `${positions[index].left}px` : "-9999px",
            top: positions[index] ? `${positions[index].top}px` : "-9999px",
            margin: 0,
            padding: "5px 10px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            visibility: positions.length > 0 ? "visible" : "hidden",
            transition: "opacity 0.5s ease-in-out",
            opacity: positions.length > 0 ? 1 : 0,
          }}
        >
          {sentence}
        </p>
      ))}
    </div>
  );
}

// function Touhyou() {
//   // 各文章の位置情報を保持するState
//   const [positions, setPositions] = useState([]);
//   // 各<p>要素のDOMノードへの参照を配列として保持するRef
//   const sentenceRefs = useRef([]);

//   // DOMの計算とスタイルの適用を同期的（画面描画前）に行うためにuseLayoutEffectを使用
//   useLayoutEffect(() => {
//     const calculatePositions = () => {
//       // 画面サイズを取得
//       const screenWidth = window.innerWidth;
//       const screenHeight = window.innerHeight;

//       const newPositions = [];
//       const placedRects = [];

//       sentenceRefs.current.forEach((el, index) => {
//         // 要素が存在しない場合はスキップ
//         if (!el) return;

//         // 要素の実際の幅と高さを取得
//         const { width, height } = el.getBoundingClientRect();

//         let isOverlapping = true;
//         let attempts = 0; // 無限ループを避けるための試行回数カウンタ
//         let potentialRect = {};

//         // 重ならない位置が見つかるまで、または試行回数が上限に達するまで繰り返す
//         while (isOverlapping && attempts < 100) {
//           isOverlapping = false;
//           // ランダムな座標を生成（画面端にはみ出さないように）
//           const x = Math.random() * (screenWidth - width);
//           const y = Math.random() * (screenHeight - height);

//           potentialRect = {
//             left: x,
//             top: y,
//             right: x + width,
//             bottom: y + height,
//           };

//           // すでに配置済みの要素と重なっていないかチェック
//           for (const placedRect of placedRects) {
//             if (checkOverlap(potentialRect, placedRect)) {
//               isOverlapping = true;
//               break;
//             }
//           }
//           attempts++;
//         }

//         // 最終的に決まった位置とサイズを保存
//         placedRects.push(potentialRect);
//         newPositions[index] = {
//           left: potentialRect.left,
//           top: potentialRect.top,
//         };
//       });

//       // 計算したすべての位置情報でStateを更新
//       setPositions(newPositions);
//     };

//     calculatePositions(); // 初期表示時に位置を計算

//     // ウィンドウサイズが変更されたら位置を再計算
//     window.addEventListener("resize", calculatePositions);

//     // コンポーネントがアンマウントされる際にイベントリスナーを削除
//     return () => window.removeEventListener("resize", calculatePositions);
//   }, []); // 初回レンダリング後に一度だけ実行

//   return (
//     // 絶対配置の基準となる親要素
//     <div
//       style={{
//         position: "relative",
//         width: "100vw",
//         height: "100vh",
//         overflow: "hidden",
//         backgroundColor: "#f0f0f0",
//       }}
//     >
//       {generatedSentences.map((sentence, index) => (
//         <p
//           key={sentence}
//           // refを配列の対応するインデックスに格納
//           ref={(el) => (sentenceRefs.current[index] = el)}
//           style={{
//             position: "absolute",
//             // 位置情報が計算されるまでは画面外に、計算後はその位置に配置
//             left: positions[index] ? `${positions[index].left}px` : "-9999px",
//             top: positions[index] ? `${positions[index].top}px` : "-9999px",
//             margin: 0, // pタグのデフォルトマージンをリセット
//             padding: "5px 10px",
//             backgroundColor: "white",
//             borderRadius: "8px",
//             boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//             // 計算が終わってから表示することで、ちらつきを防ぐ
//             visibility: positions.length > 0 ? "visible" : "hidden",
//             transition: "opacity 0.5s ease-in-out", // フェードイン効果
//             opacity: positions.length > 0 ? 1 : 0,
//           }}
//         >
//           {sentence}
//         </p>
//       ))}
//     </div>
//   );
// }

export default Touhyou;
