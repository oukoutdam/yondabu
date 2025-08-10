// src/pages/SettingPage.jsx
import React, { useMemo, useState, useCallback, useRef } from "react";
import "./SettingPage.css";
import { Link } from "react-router"
import { useEffect } from "react";




const LANG_DATA = {
  ja: {
    default: ["いつ", "どこで", "だれが", "なにをした"],
    placeholders: {
      "いつ": "きのう",
      "どこで": "宇宙で",
      "だれが": "ねこが",
      "なにをした": "ゲームをした",
    },
    ui: {
      title: "設定画面",
      palette: "要素パレット",
      example: "例文作成",
      reset: "デフォルト文にリセット",
      addCustom: "＋ カスタム要素追加",
      clear: "🗑 クリア",
      langBtn: "English",
      save: "保存＆次へ",
      roomCreate: "部屋作成",
      roomJoin: "部屋に入る",
    },
  },
  en: {
    default: ["Who", "What doing", "Where", "When"],
    placeholders: {
      "Who": "a cat",
      "What doing": "playing a game",
      "Where": "in space",
      "When": "yesterday",
    },
    ui: {
      title: "Setting",
      palette: "Element Palette",
      example: "Sentence Builder",
      reset: "Reset to default",
      addCustom: "＋ Add custom element",
      clear: "🗑 Clear",
      langBtn: "日本語",
      save: "Save & Next",
      roomCreate: "Create Room",
      roomJoin: "Join Room",
    },
  },
};

// かんたんID
const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function SettingPage() {
  useEffect(() => {
    document.body.classList.add("setting-body");
    return () => document.body.classList.remove("setting-body"); // 離脱時に解除
  }, []);

  const [lang, setLang] = useState("ja");
  const [paletteMode, setPaletteMode] = useState("flat"); // デフォルトはフラット
  const t = LANG_DATA[lang];
  const ui = t.ui;

  // パレット
  const [extraElements, setExtraElements] = useState([]);
  const defaultElements = useMemo(() => [...t.default], [t.default]);
  const paletteItems = useMemo(
    () => [...defaultElements, ...extraElements],
    [defaultElements, extraElements]
  );

  // 文エリア（chipsは {id,text}）
  const toChipObjs = useCallback(
    (labels) => labels.map((x) => ({ id: genId(), text: x })), []
  );
  const [chips, setChips] = useState(() => toChipObjs(defaultElements));

  const sentenceRef = useRef(null);

  const onReset = useCallback(() => {
    setExtraElements([]);
    setChips((_) => toChipObjs(LANG_DATA[lang].default));
  }, [lang, toChipObjs]);

  const onAddCustom = useCallback(() => {
    const label =
      lang === "ja" ? window.prompt("新しい要素名を入力") : window.prompt("Enter new element name");
    if (label && label.trim())
      setExtraElements((prev) => [...prev, label.trim()]);
  }, [lang]);

  const onClearPalette = useCallback(() => {
    setExtraElements([]);
  }, []);

  const onToggleLang = useCallback(() => {
    const next = lang === "ja" ? "en" : "ja";
    setLang(next);
    setExtraElements([]);
    setChips(toChipObjs(LANG_DATA[next].default));
  }, [lang, toChipObjs]);

  const onRemoveChip = (id) => {
    setChips((prev) => prev.filter((c) => c.id !== id));
  };

  // パレットのドラッグ
  const onDragStartElement = (e, text) => {
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.setData("text/plain", text);
    e.dataTransfer.effectAllowed = "copy";
  };
  const onDragEndElement = (e) => {
    e.currentTarget.classList.remove("dragging");
  };

  // 既存チップ：移動開始/終了
  const onDragStartChip = (e) => {
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.setData("text/drag-id", e.currentTarget.dataset.id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragEndChip = (e) => {
    e.currentTarget.classList.remove("dragging");
    const els = sentenceRef.current?.querySelectorAll(".chip");
    if (!els) return;
    const idOrder = Array.from(els).map((el) => el.getAttribute("data-id"));
    setChips((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      return idOrder.map((id) => map.get(id)).filter(Boolean);
    });
  };

  // 並べ替えプレビュー
  const getAfter = (container, x) => {
    const els = Array.from(container.querySelectorAll(".chip:not(.dragging)"));
    let best = { off: -Infinity, el: null };
    for (const child of els) {
      const box = child.getBoundingClientRect();
      const off = x - box.left - box.width / 2;
      if (off < 0 && off > best.off) best = { off, el: child };
    }
    return best.el;
  };

  const sentenceOnDragOver = (e) => {
    e.preventDefault();
    const container = sentenceRef.current;
    if (!container) return;

    const dragging = container.querySelector(".chip.dragging");
    if (!dragging) return;

    const after = getAfter(container, e.clientX);
    if (after) container.insertBefore(dragging, after);
    else container.appendChild(dragging);
  };

  const sentenceOnDrop = (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    if (text) {
      setChips((prev) => [...prev, { id: genId(), text }]);
    }
  };

  const placeholders = t.placeholders;
  const exampleInputs = chips.map((c) => placeholders[c.text] || "");

  const onClickSave = () => {

  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header className="page-subheader" role="banner">
        <div className="page-subheader__inner">
          <span className="gear" aria-hidden>⚙️</span>
          <h1>設定</h1>
          <p className="desc">文の要素を並べ替えたり、例文を作成できます。</p>
          <div className="toggle">
            <span>パレット表示</span>
            <button
              className={paletteMode === "flat" ? "active" : ""}
              onClick={() => setPaletteMode("flat")}
              title="フラット（背景#f7f7f7・右ボーダーなし）"
            >フラット</button>
            <button
              className={paletteMode === "soft" ? "active" : ""}
              onClick={() => setPaletteMode("soft")}
              title="カード寄り（白背景＋薄枠＋影）"
            >カード</button>
          </div>
        </div>
      </header>

      <div className="workspace">
        <aside className={`palette ${paletteMode === "soft" ? "softcard" : ""}`}>
          <h3 id="palette-title">{ui.palette}</h3>
          <div id="elements-list">
            {paletteItems.map((txt, i) => (
              <div
                key={`${txt}-${i}`}
                className="element"
                draggable
                onDragStart={(e) => onDragStartElement(e, txt)}
                onDragEnd={onDragEndElement}
                title="ドラッグして文エリアへ"
              >
                {txt}
              </div>
            ))}
          </div>
          <button id="add-custom-btn" style={{ marginTop: "1rem" }} onClick={onAddCustom}>
            {ui.addCustom}
          </button>
          <button id="clear-btn" style={{ marginTop: ".1rem" }} onClick={onClearPalette}>
            {ui.clear}
          </button>
        </aside>

        <section className="editor">
          <div
            id="sentence-area"
            ref={sentenceRef}
            onDragOver={sentenceOnDragOver}
            onDrop={sentenceOnDrop}
          >
            {chips.map((chip) => (
              <div
                key={chip.id}
                data-id={chip.id}
                className="chip"
                draggable
                onDragStart={onDragStartChip}
                onDragEnd={onDragEndChip}
                title="ドラッグで並び替え"
              >
                <span className="txt">{chip.text}</span>
                <span className="del" onClick={() => onRemoveChip(chip.id)}>×</span>
              </div>
            ))}
          </div>

          <h3 className="example-title" id="example-title">
            {ui.example}
          </h3>
          <div className="example-row" id="example-row">
            {exampleInputs.map((ph, i) => (
              <input key={i} placeholder={ph} />
            ))}
          </div>

          <div className="controls-panel">
            <button id="reset-btn" onClick={onReset}>
              {ui.reset}
            </button>
          </div>
        </section>
      </div>

      <footer>
        <Link to="/toukou">
          <button id="save-btn" onClick={onClickSave}>
            {ui.save}
          </button>
        </Link>

      </footer>
    </div>
  );
}
