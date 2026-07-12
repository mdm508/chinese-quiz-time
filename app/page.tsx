"use client";

import { useMemo, useState } from "react";

type Gloss = { z: string; e: string };
type Token = string | { w: string; g: Gloss };
type Question = {
  group: string;
  tokens: Token[];
  answer: string;
  choices: string[];
  why: string;
  others: string;
};

const choiceGloss: Record<string, Gloss> = {
  愛護: { z: "ㄞˋ ㄏㄨˋ", e: "to care for; to protect from harm" },
  愛惜: { z: "ㄞˋ ㄒㄧˊ", e: "to cherish; to avoid wasting or spoiling" },
  吝惜: { z: "ㄌㄧㄣˋ ㄒㄧˊ", e: "to begrudge giving or using" },
  安頓: { z: "ㄢ ㄉㄨㄣˋ", e: "to settle; to make caring arrangements for" },
  安排: { z: "ㄢ ㄆㄞˊ", e: "to arrange; to schedule" },
  安置: { z: "ㄢ ㄓˋ", e: "to place someone or something properly" },
};

const W = (w: string, z: string, e: string): Token => ({ w, g: { z, e } });

const questions: Question[] = [
  { group: "愛護・愛惜・吝惜", tokens: [W("我們", "ㄨㄛˇ ˙ㄇㄣ", "we; us"), W("應該", "ㄧㄥ ㄍㄞ", "should"), "□", W("公共財物", "ㄍㄨㄥ ㄍㄨㄥˋ ㄘㄞˊ ㄨˋ", "public property"), "，不要", W("隨意", "ㄙㄨㄟˊ ㄧˋ", "at will; carelessly"), W("破壞", "ㄆㄛˋ ㄏㄨㄞˋ", "to damage; to destroy"), "。"], answer: "愛護", choices: ["愛惜", "吝惜", "愛護"], why: "公共財物需要受到保護、不被破壞，因此用「愛護」。", others: "「愛惜」偏重避免浪費或糟蹋；「吝惜」表示捨不得付出或使用。" },
  { group: "愛護・愛惜・吝惜", tokens: [W("學校", "ㄒㄩㄝˊ ㄒㄧㄠˋ", "school"), W("呼籲", "ㄏㄨ ㄩˋ", "to appeal; to call on"), "大家□", W("自然環境", "ㄗˋ ㄖㄢˊ ㄏㄨㄢˊ ㄐㄧㄥˋ", "natural environment"), "，一起", W("保護", "ㄅㄠˇ ㄏㄨˋ", "to protect"), W("地球", "ㄉㄧˋ ㄑㄧㄡˊ", "Earth; the globe"), "。"], answer: "愛護", choices: ["愛護", "愛惜", "吝惜"], why: "環境是需要保護、免受傷害的對象，所以「愛護」最合適。", others: "「愛惜」著重不浪費；「吝惜」帶有不願付出的意思。" },
  { group: "愛護・愛惜・吝惜", tokens: ["夜深了，別再", W("盯著", "ㄉㄧㄥ ㄓㄜ˙", "to stare at"), W("螢幕", "ㄧㄥˊ ㄇㄨˋ", "screen"), "，要好好□", W("眼睛", "ㄧㄢˇ ˙ㄐㄧㄥ", "eyes"), "。"], answer: "愛護", choices: ["吝惜", "愛護", "愛惜"], why: "眼睛是需要照顧、避免受傷的身體部位，因此用「愛護」。", others: "「愛惜眼睛」偶爾可見，但本句強調保護健康；「吝惜」不能表示照顧身體。" },
  { group: "愛護・愛惜・吝惜", tokens: [W("準備考試", "ㄓㄨㄣˇ ㄅㄟˋ ㄎㄠˇ ㄕˋ", "to prepare for an exam"), "時要□", W("光陰", "ㄍㄨㄤ ㄧㄣ", "time; the passing of time"), "，別一直", W("滑手機", "ㄏㄨㄚˊ ㄕㄡˇ ㄐㄧ", "to scroll on a phone"), "。"], answer: "愛惜", choices: ["愛護", "愛惜", "吝惜"], why: "光陰寶貴，應避免浪費，因此用「愛惜」。", others: "「愛護」著重保護；「吝惜」常含捨不得付出的意味。" },
  { group: "愛護・愛惜・吝惜", tokens: ["她一向不□自己的時間，常在下班後", W("義務", "ㄧˋ ㄨˋ", "voluntarily; without pay"), W("輔導", "ㄈㄨˇ ㄉㄠˇ", "to tutor; to counsel"), W("弱勢兒童", "ㄖㄨㄛˋ ㄕˋ ㄦˊ ㄊㄨㄥˊ", "disadvantaged children"), "。"], answer: "吝惜", choices: ["吝惜", "愛惜", "愛護"], why: "「不吝惜時間」表示願意付出時間，不覺得捨不得。", others: "「愛惜」是珍惜、不浪費；「愛護」用於保護人或事物。" },
  { group: "安頓・安排・安置", tokens: [W("抵達", "ㄉㄧˇ ㄉㄚˊ", "to arrive"), "新城市後，他先把", W("年邁", "ㄋㄧㄢˊ ㄇㄞˋ", "elderly; advanced in age"), "的母親□好，才去找工作。"], answer: "安頓", choices: ["安置", "安頓", "安排"], why: "母親需要生活上的照料與妥善照顧，所以用「安頓」。", others: "「安排」偏重計畫、組織；「安置」偏重放到適當的位置或處境。" },
  { group: "安頓・安排・安置", tokens: ["出國前，我們請鄰居幫忙餵貓，總算把", W("寵物", "ㄔㄨㄥˇ ㄨˋ", "pet"), "□妥當了。"], answer: "安頓", choices: ["安排", "安置", "安頓"], why: "寵物需要照顧，本句強調已把牠的生活照料妥當。", others: "「安排」通常接活動或工作；「安置」偏重放置或給予適當處所。" },
  { group: "安頓・安排・安置", tokens: ["老師已經□好", W("校外教學", "ㄒㄧㄠˋ ㄨㄞˋ ㄐㄧㄠˋ ㄒㄩㄝˊ", "school field trip"), "的", W("行程", "ㄒㄧㄥˊ ㄔㄥˊ", "itinerary; schedule"), "和", W("分組", "ㄈㄣ ㄗㄨˇ", "grouping; to divide into groups"), "。"], answer: "安排", choices: ["安頓", "安排", "安置"], why: "行程和分組都涉及計畫與組織，因此用「安排」。", others: "「安頓」著重照料；「安置」著重放到合適的位置或處境。" },
  { group: "安頓・安排・安置", tokens: ["旅行社替我們□了一位熟悉當地歷史的", W("導遊", "ㄉㄠˇ ㄧㄡˊ", "tour guide"), "。"], answer: "安排", choices: ["安排", "安置", "安頓"], why: "替旅客配置導遊屬於行程規劃，所以用「安排」。", others: "「安頓」指照顧妥當；「安置」是把人或物放到合適處所或位置。" },
  { group: "安頓・安排・安置", tokens: [W("撤離", "ㄔㄜˋ ㄌㄧˊ", "to evacuate"), "後，居民被暫時□在附近的", W("活動中心", "ㄏㄨㄛˊ ㄉㄨㄥˋ ㄓㄨㄥ ㄒㄧㄣ", "community activity center"), "。"], answer: "安置", choices: ["安頓", "安排", "安置"], why: "居民被放到適當的臨時處所，因此用「安置」。", others: "「安頓」較強調後續生活照料；「安排」著重規劃與組織。" },
];

const groups = ["愛護・愛惜・吝惜", "安頓・安排・安置"];

export default function Home() {
  const [group, setGroup] = useState<string | null>(null);
  const qs = useMemo(() => questions.filter(q => q.group === group), [group]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [pop, setPop] = useState<{ w: string; g: Gloss } | null>(null);

  const start = (g: string) => { setGroup(g); setIndex(0); setAnswers({}); setPop(null); };
  const restart = () => { setIndex(0); setAnswers({}); setPop(null); };
  const selected = answers[index];
  const q = qs[index];
  const score = qs.reduce((n, item, i) => n + (answers[i] === item.answer ? 1 : 0), 0);
  const done = q && index === qs.length - 1 && !!selected;
  const renderText = (text: string, key: number) => text.split("□").flatMap((part, j, all) => [
    <span key={`${key}-${j}`}>{part}</span>,
    ...(j < all.length - 1 ? [<span className="blank" key={`${key}-b-${j}`}>{selected || "（什麼什麼）"}</span>] : []),
  ]);

  if (!group) return (
    <main className="home-shell">
      <header className="hero">
        <div className="eyebrow">臺灣華語 · 互動練習</div>
        <h1>近義詞，用在<br/><em>剛剛好</em>的地方。</h1>
        <p>從真實詞典辨析出發，用情境句練習最自然的用法。點一下詞語，也能隨時查看注音與英文。</p>
      </header>
      <section className="topic-section">
        <div className="section-head"><h2>選一組開始</h2><span>共 2 組 · 10 題</span></div>
        <div className="topic-grid">
          {groups.map((g, i) => <button className="topic-card" onClick={() => start(g)} key={g}>
            <span className="topic-no">0{i + 1}</span><h3>{g}</h3>
            <p>{i === 0 ? "保護、珍惜，還是捨不得付出？" : "照料、規劃，還是放到適當位置？"}</p>
            <span className="begin">開始 5 題 <b>→</b></span>
          </button>)}
        </div>
      </section>
      <footer>內容依據《漢語近義詞用法詞典》· 鄧守信主編</footer>
    </main>
  );

  return <main className="quiz-shell">
    <nav><button className="text-btn" onClick={() => setGroup(null)}>← 所有主題</button><span className="nav-title">近義詞練習簿</span><button className="text-btn" onClick={restart}>重新開始</button></nav>
    <div className="progress"><i style={{ width: `${((index + (selected ? 1 : 0)) / qs.length) * 100}%` }} /></div>
    <section className="quiz-top"><div><span className="tag">{group}</span><h1>選出最合適的詞</h1></div><div className="stats"><span><b>{index + 1}</b> / {qs.length}</span><span>得分 <b>{score}</b></span></div></section>
    <article className="question-card">
      <div className="sentence">{q.tokens.map((t, i) => typeof t === "string" ? renderText(t, i) : <button key={i} className="vocab" onClick={() => setPop({ w: t.w, g: t.g })}>{t.w}</button>)}</div>
      <p className="hint">選擇一個答案填入空格 · 點詞語可看注音</p>
      <div className="choices">{q.choices.map((c, i) => {
        const state = selected ? (c === q.answer ? "correct" : c === selected ? "wrong" : "dim") : "";
        return <div className={`choice-wrap ${state}`} key={c}><button className="choice" disabled={!!selected} onClick={() => setAnswers(a => ({ ...a, [index]: c }))}><span>{String.fromCharCode(65 + i)}</span>{c}</button><button className="define" aria-label={`查看${c}的詞義`} onClick={() => setPop({ w: c, g: choiceGloss[c] })}>詞義</button></div>;
      })}</div>
      {selected && <div className={`feedback ${selected === q.answer ? "good" : "bad"}`}><h2>{selected === q.answer ? "答對了！" : `再想一想。正確答案是「${q.answer}」。`}</h2><p>{q.why}</p><p className="other"><b>其他選項：</b>{q.others}</p></div>}
    </article>
    <div className="controls"><button disabled={index === 0} onClick={() => { setIndex(index - 1); setPop(null); }}>← 上一題</button><button className="primary" disabled={!selected} onClick={() => { if (index < qs.length - 1) { setIndex(index + 1); setPop(null); } else setIndex(index); }}>{done ? "查看本組結果" : "下一題 →"}</button></div>
    {done && <section className="result"><span>本組完成</span><h2>{score} / {qs.length}</h2><p>{score === qs.length ? "太棒了，全部答對！" : `有 ${qs.length - score} 題值得再複習一次。`}</p><div>{qs.map((item, i) => answers[i] !== item.answer && <p key={i}><b>第 {i + 1} 題：</b>正確答案「{item.answer}」— {item.why}</p>)}</div><button onClick={restart}>再練一次</button></section>}
    {pop && <div className="popover" role="dialog"><button aria-label="關閉" onClick={() => setPop(null)}>×</button><strong>{pop.w}</strong><span>{pop.g.z}</span><p>{pop.g.e}</p></div>}
  </main>;
}
