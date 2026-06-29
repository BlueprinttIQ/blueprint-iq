import { useState, useRef } from "react";

const QUESTION_BANK = [
  { id: 1, category: "Drawing Types", question: "What does a section view in a blueprint represent?", options: ["A top-down view of the entire structure", "A cut-through view revealing interior details", "An elevation showing the front face only", "A 3D isometric projection"], answer: 1, explanation: "A section view shows what a structure looks like if sliced at a specific plane, revealing interior components not visible in plan or elevation views." },
  { id: 2, category: "Symbols", question: "On a floor plan, what does a dashed line typically indicate?", options: ["A load-bearing wall", "An overhead feature or hidden element", "A property boundary", "An electrical circuit"], answer: 1, explanation: "Dashed lines represent elements above the cut plane, such as overhead beams, upper cabinets, or skylights — things not directly visible but affecting the space." },
  { id: 3, category: "Dimensions", question: "What does the scale '1/4\" = 1'-0\"' mean on an architectural drawing?", options: ["Every 1 foot on paper equals 4 feet in real life", "Every quarter inch on paper equals one foot in real life", "The drawing is 25% of actual size", "Dimensions are in metric units"], answer: 1, explanation: "At 1/4\" = 1'-0\" scale, every quarter inch drawn represents one real foot. This is one of the most common architectural drawing scales." },
  { id: 4, category: "Electrical", question: "In an electrical plan, what symbol typically represents a duplex outlet?", options: ["A circle with two lines", "A rectangle with an X through it", "A circle with parallel lines resembling two slots", "A triangle pointing up"], answer: 2, explanation: "Duplex outlets are drawn as a circle with two parallel lines (the two receptacles), often with a letter or number indicating amperage or circuit." },
  { id: 5, category: "Drawing Types", question: "What is the purpose of a 'title block' on a blueprint sheet?", options: ["To show the north arrow direction", "To contain project info, sheet number, scale, and revision history", "To display the legend for all symbols used", "To indicate the drawing's copyright"], answer: 1, explanation: "The title block (usually bottom-right) identifies the project, drawing title, sheet number, scale, date, revision history, and architect/engineer name." },
  { id: 6, category: "Site Plans", question: "What do contour lines on a site/grading plan represent?", options: ["Property lines and setbacks", "Underground utility locations", "Lines connecting points of equal elevation", "Proposed landscaping zones"], answer: 2, explanation: "Contour lines connect all points at the same elevation. Closely spaced contours indicate steep slopes; widely spaced contours indicate gentle grades." },
  { id: 7, category: "Plumbing", question: "On plumbing plans, what does a solid thick line vs. a dashed line typically differentiate?", options: ["Hot water vs. cold water supply lines", "Above-grade vs. below-grade piping", "Supply vs. drain lines", "Copper vs. PVC pipe material"], answer: 1, explanation: "Solid lines often indicate above-slab piping while dashed lines indicate below-slab (underground) piping, though conventions vary by firm." },
  { id: 8, category: "Structural", question: "What does 'W12x26' indicate on a structural steel beam callout?", options: ["A wide-flange beam, 12 inches deep, weighing 26 lbs per linear foot", "A beam 12 feet long weighing 26 pounds total", "A wide-flange beam with 12-inch flanges and 26-inch web", "Grade 26 steel with 12-ksi yield strength"], answer: 0, explanation: "Wide-flange sections use W[depth]x[weight]. W12x26 is nominally 12 inches deep, weighing 26 pounds per linear foot." },
  { id: 9, category: "Drawing Types", question: "What is the difference between a reflected ceiling plan (RCP) and a regular floor plan?", options: ["RCPs show exterior features; floor plans show interiors", "RCPs show the ceiling mirrored onto the floor, showing lights and ceiling elements", "RCPs are drawn at a larger scale", "RCPs only apply to commercial projects"], answer: 1, explanation: "An RCP shows ceiling elements — lighting, HVAC diffusers, soffits, beams — as if reflected down onto the floor plane, maintaining correct orientation." },
  { id: 10, category: "Abbreviations", question: "What does 'VIF' stand for on a construction drawing?", options: ["Verify In Field", "Vertical Interior Framing", "Variable Insulation Factor", "View from Inside Frame"], answer: 0, explanation: "'VIF' — Verify In Field — instructs the contractor to measure or confirm on site rather than relying solely on drawn dimensions." },
  { id: 11, category: "Dimensions", question: "When a dimension string shows '4'-6\"', what is the total measurement?", options: ["4.6 feet", "4 feet 6 inches (54 inches)", "46 inches", "4 feet"], answer: 1, explanation: "Architectural dimensions use feet-inches notation. 4'-6\" means 4 feet and 6 inches, which equals 54 inches or 4.5 feet total." },
  { id: 12, category: "Structural", question: "On a foundation plan, what does a 'footing' represent?", options: ["The finished floor surface material", "The widened base of a foundation that distributes load to the soil", "The connection detail between walls and roof", "A measurement reference point"], answer: 1, explanation: "Footings are widened concrete bases at the bottom of foundations or columns that spread structural loads over a larger soil area to prevent settlement." },
];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0c0e0f;--surf:#13161a;--surf2:#1a1e24;--brd:#252b33;--acc:#e8c84a;--acc2:#4ae8c8;--danger:#e84a4a;--txt:#e8e8e0;--mute:#666e7a;--grid:rgba(232,200,74,0.04)}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--txt);min-height:100vh}
.app{min-height:100vh;background:linear-gradient(0deg,var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px),var(--bg);background-size:40px 40px}
.hdr{border-bottom:1px solid var(--brd);padding:0 2rem;background:rgba(12,14,15,.92);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:3px;color:var(--acc);display:flex;align-items:center;gap:10px}
.logo span{color:var(--txt)}
.logo-box{width:32px;height:32px;border:2px solid var(--acc);display:grid;place-items:center;font-size:.65rem;color:var(--acc);font-family:'DM Mono',monospace;font-weight:500}
.hdr-badge{font-family:'DM Mono',monospace;font-size:.65rem;color:var(--mute);border:1px solid var(--brd);padding:4px 10px;letter-spacing:1px}
.tabs{display:flex;padding:2rem 2rem 0;border-bottom:1px solid var(--brd);margin-bottom:2rem}
.tab{font-family:'DM Mono',monospace;font-size:.72rem;letter-spacing:1.5px;text-transform:uppercase;padding:10px 24px;border:1px solid transparent;border-bottom:none;background:transparent;color:var(--mute);cursor:pointer;transition:all .2s;position:relative;bottom:-1px}
.tab:hover{color:var(--txt);border-color:var(--brd)}
.tab.on{color:var(--acc);background:var(--surf);border-color:var(--brd);border-bottom-color:var(--surf)}
.main{max-width:900px;margin:0 auto;padding:0 2rem 4rem}
.panel{background:var(--surf);border:1px solid var(--brd);padding:2rem;margin-bottom:1.5rem}
.plabel{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:3px;text-transform:uppercase;color:var(--mute);margin-bottom:1rem;display:flex;align-items:center;gap:8px}
.plabel::before{content:'';width:20px;height:1px;background:var(--acc)}
.stitle{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:3px;color:var(--txt);margin-bottom:.5rem}
input[type=password],input[type=text],select{width:100%;background:var(--bg);border:1px solid var(--brd);color:var(--txt);padding:10px 14px;font-family:'DM Mono',monospace;font-size:.8rem;outline:none;transition:border-color .2s}
input:focus,select:focus{border-color:var(--acc)}
select option{background:var(--surf)}
.btn{font-family:'DM Mono',monospace;font-size:.75rem;letter-spacing:1.5px;text-transform:uppercase;padding:11px 28px;border:1px solid var(--acc);background:transparent;color:var(--acc);cursor:pointer;transition:all .2s}
.btn:hover{background:var(--acc);color:var(--bg)}
.btn:disabled{opacity:.3;cursor:not-allowed}
.btns{background:var(--acc);color:var(--bg)}
.btns:hover{background:transparent;color:var(--acc)}
.btnd{border-color:var(--danger);color:var(--danger)}
.btnd:hover{background:var(--danger);color:var(--bg)}
.dz{border:1px dashed var(--brd);padding:3rem 2rem;text-align:center;cursor:pointer;transition:all .2s;position:relative}
.dz:hover,.dz.ov{border-color:var(--acc);background:rgba(232,200,74,.03)}
.dz-icon{font-size:2.5rem;margin-bottom:1rem;filter:grayscale(1) brightness(.5)}
.dz-txt{font-family:'DM Mono',monospace;font-size:.75rem;color:var(--mute);letter-spacing:1px;line-height:1.8}
.dz-txt strong{color:var(--acc)}
.fprev{display:flex;align-items:center;justify-content:space-between;background:var(--surf2);border:1px solid var(--brd);padding:12px 16px;margin-top:1rem}
.fname{font-family:'DM Mono',monospace;font-size:.75rem;color:var(--acc2)}
.lbar{height:2px;background:var(--brd);margin:1rem 0;overflow:hidden}
.lbar-fill{height:100%;background:var(--acc);animation:ld 1.5s ease-in-out infinite}
@keyframes ld{0%{width:0%;margin-left:0}50%{width:70%;margin-left:15%}100%{width:0%;margin-left:100%}}
.ltxt{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--mute);letter-spacing:1px;text-align:center;padding:.5rem 0}
.qhdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem}
.qprog{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--mute);letter-spacing:1px}
.qcat{display:inline-block;font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:2px;text-transform:uppercase;color:var(--bg);background:var(--acc);padding:3px 10px;margin-bottom:1rem}
.qq{font-size:1.15rem;font-weight:500;line-height:1.6;margin-bottom:2rem}
.ptrack{height:2px;background:var(--brd);margin-bottom:2rem}
.pfill{height:100%;background:var(--acc);transition:width .4s ease}
.opts{display:flex;flex-direction:column;gap:10px}
.opt{display:flex;align-items:flex-start;gap:14px;padding:14px 16px;border:1px solid var(--brd);background:transparent;color:var(--txt);text-align:left;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.9rem;line-height:1.5;transition:all .15s;width:100%}
.opt:hover:not(:disabled){border-color:var(--acc);background:rgba(232,200,74,.04)}
.opt.ok{border-color:var(--acc2);background:rgba(74,232,200,.06);color:var(--acc2)}
.opt.no{border-color:var(--danger);background:rgba(232,74,74,.06);color:var(--danger)}
.oltr{font-family:'DM Mono',monospace;font-size:.7rem;min-width:22px;height:22px;border:1px solid currentColor;display:grid;place-items:center;flex-shrink:0;margin-top:1px}
.expl{background:var(--surf2);border-left:3px solid var(--acc2);padding:14px 16px;margin-top:1.5rem;font-size:.85rem;line-height:1.6;color:var(--mute)}
.expl strong{color:var(--acc2);font-size:.65rem;letter-spacing:2px;text-transform:uppercase;display:block;margin-bottom:6px;font-family:'DM Mono',monospace}
.sc-wrap{text-align:center;padding:3rem 2rem}
.sc-num{font-family:'Bebas Neue',sans-serif;font-size:5rem;line-height:1;color:var(--acc);letter-spacing:4px}
.sc-lbl{font-family:'DM Mono',monospace;font-size:.7rem;letter-spacing:3px;color:var(--mute);text-transform:uppercase;margin-top:.5rem;margin-bottom:2rem}
.sc-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:var(--brd);border:1px solid var(--brd);margin-bottom:2rem}
.sc-stat{background:var(--surf);padding:1.5rem 1rem;text-align:center}
.sc-val{font-family:'Bebas Neue',sans-serif;font-size:2.2rem;letter-spacing:2px}
.sc-key{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:2px;color:var(--mute);text-transform:uppercase;margin-top:4px}
.qcard{background:var(--surf2);border:1px solid var(--brd);padding:1.5rem;margin-bottom:1rem}
.qcnum{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:2px;color:var(--acc);text-transform:uppercase;margin-bottom:8px}
.qctxt{font-size:.95rem;line-height:1.6;margin-bottom:1rem}
.qcans{display:flex;flex-direction:column;gap:6px}
.qca{display:flex;gap:10px;align-items:flex-start;font-size:.85rem;color:var(--mute);padding:8px 12px;border:1px solid var(--brd)}
.qca.iscor{color:var(--acc2);border-color:var(--acc2);background:rgba(74,232,200,.05)}
.qatag{font-family:'DM Mono',monospace;font-size:.65rem;min-width:18px;flex-shrink:0;margin-top:2px}
.row{display:flex;gap:12px;align-items:center}
.mt1{margin-top:1rem} .mt2{margin-top:2rem}
.muted{color:var(--mute);font-size:.85rem}
.err{border:1px solid var(--danger);background:rgba(232,74,74,.06);padding:12px 16px;font-family:'DM Mono',monospace;font-size:.75rem;color:var(--danger);margin-top:1rem}
.chip{display:inline-block;font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:1px;padding:3px 8px;border:1px solid var(--brd);color:var(--mute);margin-right:6px}
.imgprev{max-width:100%;max-height:240px;border:1px solid var(--brd);object-fit:contain;margin-top:1rem;display:block}
`;

const L = ["A","B","C","D"];
const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]} return b; };

function InlineQuiz({ questions, onBack }) {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[cur];
  const ans = sel !== null;

  const pick = i => {
    if (ans) return;
    setSel(i);
    if (i === q.answer) setScore(s => s+1);
  };
  const next = () => {
    if (cur+1 >= questions.length) setDone(true);
    else { setCur(c=>c+1); setSel(null); }
  };

  if (done) {
    const pct = Math.round((score/questions.length)*100);
    const grade = pct>=90?"EXPERT":pct>=70?"PROFICIENT":pct>=50?"DEVELOPING":"NEEDS WORK";
    const gc = pct>=90?"var(--acc2)":pct>=70?"var(--acc)":pct>=50?"#e8a44a":"var(--danger)";
    return (
      <div className="panel">
        <div className="sc-wrap">
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:".65rem",letterSpacing:"3px",color:"var(--mute)",marginBottom:"1rem"}}>QUIZ COMPLETE</div>
          <div className="sc-num">{pct}%</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.2rem",letterSpacing:"4px",color:gc,marginBottom:".5rem"}}>{grade}</div>
          <div className="sc-lbl">{score} of {questions.length} correct</div>
          <div className="sc-grid">
            <div className="sc-stat"><div className="sc-val" style={{color:"var(--acc2)"}}>{score}</div><div className="sc-key">Correct</div></div>
            <div className="sc-stat"><div className="sc-val" style={{color:"var(--danger)"}}>{questions.length-score}</div><div className="sc-key">Wrong</div></div>
            <div className="sc-stat"><div className="sc-val">{questions.length}</div><div className="sc-key">Total</div></div>
          </div>
          <div className="row" style={{justifyContent:"center",gap:"12px"}}>
            <button className="btn" onClick={onBack}>← BACK</button>
            <button className="btn btns" onClick={()=>{setCur(0);setSel(null);setScore(0);setDone(false);}}>RETRY</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="qhdr">
        <div><div className="qcat">{q.category}</div></div>
        <div className="qprog">{cur+1} / {questions.length}</div>
      </div>
      <div className="ptrack"><div className="pfill" style={{width:`${(cur/questions.length)*100}%`}} /></div>
      <div className="qq">{q.question}</div>
      <div className="opts">
        {q.options.map((opt,i) => {
          let cls = "opt";
          if (ans) { if(i===q.answer) cls+=" ok"; else if(i===sel) cls+=" no"; }
          return (
            <button key={i} className={cls} onClick={()=>pick(i)} disabled={ans}>
              <span className="oltr">{L[i]}</span><span>{opt}</span>
            </button>
          );
        })}
      </div>
      {ans && q.explanation && <div className="expl"><strong>Explanation</strong>{q.explanation}</div>}
      {ans && (
        <div className="mt2 row" style={{justifyContent:"space-between"}}>
          <button className="btn" onClick={onBack}>← EXIT</button>
          <button className="btn btns" onClick={next}>{cur+1>=questions.length?"SEE RESULTS →":"NEXT →"}</button>
        </div>
      )}
    </div>
  );
}

function UploadTab() {
  const [key, setKey] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [numQ, setNumQ] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState(null);
  const [over, setOver] = useState(false);
  const [quiz, setQuiz] = useState(false);
  const ref = useRef();

  const handleFile = f => {
    if (!f) return;
    setFile(f); setError(""); setQuestions(null);
    if (f.type.startsWith("image/")) setPreview({type:"image",url:URL.createObjectURL(f)});
    else setPreview({type:"pdf",name:f.name});
  };

  const toB64 = f => new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});

  const generate = async () => {
    if (!key.trim()) return setError("Please enter your Anthropic API key.");
    if (!file) return setError("Please upload a blueprint file first.");
    setError(""); setLoading(true); setQuestions(null);
    try {
      const b64 = await toB64(file);
      const isImg = file.type.startsWith("image/");
      const cb = isImg
        ? {type:"image",source:{type:"base64",media_type:file.type,data:b64}}
        : {type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}};
      const prompt = `You are an expert blueprint analyst. Analyze this drawing and generate exactly ${numQ} multiple-choice quiz questions testing understanding of what is shown. Cover dimensions, symbols, annotations, drawing types, materials, and specific visible details.\n\nRespond ONLY with a valid JSON array (no markdown, no extra text):\n[\n  {\n    "question": "...",\n    "category": "short label",\n    "options": ["A","B","C","D"],\n    "answer": 0,\n    "explanation": "..."\n  }\n]\nThe "answer" field is the zero-based index of the correct option. Generate exactly ${numQ} questions.`;
      const res = await fetch("/api/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:2000,messages:[{role:"user",content:[cb,{type:"text",text:prompt}]}]})
      });
      if (!res.ok) { const e=await res.json(); throw new Error(e?.error?.message||`API error ${res.status}`); }
      const data = await res.json();
      const text = data.content.map(b=>b.type==="text"?b.text:"").join("");
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setQuestions(parsed);
    } catch(e) { setError(e.message||"Something went wrong."); }
    finally { setLoading(false); }
  };

  if (quiz && questions) return <InlineQuiz questions={questions} onBack={()=>setQuiz(false)} />;

  return (
    <div>
      <div className="panel">
        <div className="plabel">API Configuration</div>
        <div className="stitle">Blueprint Analyzer</div>
        <p className="muted mt1" style={{marginBottom:"1.5rem"}}>Upload a blueprint PDF or image, enter your Anthropic API key, and let Claude generate quiz questions from your actual drawing.</p>
        <label style={{display:"block",fontFamily:"'DM Mono',monospace",fontSize:".7rem",letterSpacing:"1px",color:"var(--mute)",marginBottom:"6px"}}>ANTHROPIC API KEY</label>
        <input type="password" placeholder="sk-ant-api03-..." value={key} onChange={e=>setKey(e.target.value)} />
        <p className="muted mt1" style={{fontSize:".75rem"}}>Your key is used only for this session and never stored.</p>
      </div>

      <div className="panel">
        <div className="plabel">Blueprint Upload</div>
        <div className={`dz ${over?"ov":""}`}
          onDragOver={e=>{e.preventDefault();setOver(true)}}
          onDragLeave={()=>setOver(false)}
          onDrop={e=>{e.preventDefault();setOver(false);handleFile(e.dataTransfer.files[0])}}
          onClick={()=>ref.current?.click()}
        >
          <input ref={ref} type="file" accept="image/*,.pdf" onChange={e=>handleFile(e.target.files[0])} style={{display:"none"}} />
          <div className="dz-icon">📐</div>
          <div className="dz-txt"><strong>Drop blueprint here</strong> or click to browse<br/>PDF, PNG, JPG, WEBP supported</div>
        </div>
        {preview && (
          <div className="fprev">
            <div><span className="chip">{file.type.startsWith("image/")?"IMAGE":"PDF"}</span><span className="fname">{file.name}</span></div>
            <button className="btn btnd" style={{padding:"6px 14px",fontSize:".65rem"}} onClick={()=>{setFile(null);setPreview(null);setQuestions(null);}}>REMOVE</button>
          </div>
        )}
        {preview?.type==="image" && <img className="imgprev" src={preview.url} alt="Blueprint preview" />}
      </div>

      <div className="panel">
        <div className="plabel">Generation Settings</div>
        <label style={{display:"block",fontFamily:"'DM Mono',monospace",fontSize:".7rem",letterSpacing:"1px",color:"var(--mute)",marginBottom:"6px"}}>NUMBER OF QUESTIONS</label>
        <select value={numQ} onChange={e=>setNumQ(Number(e.target.value))}>
          {[3,5,8,10].map(n=><option key={n} value={n}>{n} questions</option>)}
        </select>
        <div className="mt2 row">
          <button className="btn btns" onClick={generate} disabled={loading}>{loading?"ANALYZING...":"GENERATE QUESTIONS"}</button>
        </div>
        {loading && <div><div className="lbar"><div className="lbar-fill"/></div><div className="ltxt">Claude is reading your blueprint…</div></div>}
        {error && <div className="err">⚠ {error}</div>}
      </div>

      {questions && (
        <div className="panel">
          <div className="plabel">Generated Questions</div>
          <div className="row" style={{marginBottom:"1.5rem",justifyContent:"space-between",flexWrap:"wrap",gap:"10px"}}>
            <div><div className="stitle">{questions.length} Questions Ready</div><p className="muted">Review below or launch interactive quiz.</p></div>
            <button className="btn btns" onClick={()=>setQuiz(true)}>TAKE QUIZ →</button>
          </div>
          {questions.map((q,i)=>(
            <div className="qcard" key={i}>
              <div className="qcnum">Q{String(i+1).padStart(2,"0")} · {q.category}</div>
              <div className="qctxt">{q.question}</div>
              <div className="qcans">
                {q.options.map((opt,j)=>(
                  <div key={j} className={`qca ${j===q.answer?"iscor":""}`}>
                    <span className="qatag">{L[j]}</span><span>{opt}</span>
                    {j===q.answer && <span style={{marginLeft:"auto",fontFamily:"'DM Mono',monospace",fontSize:".6rem",color:"var(--acc2)"}}>✓</span>}
                  </div>
                ))}
              </div>
              {q.explanation && <div className="expl"><strong>Explanation</strong>{q.explanation}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PracticeTab() {
  const [filter, setFilter] = useState("All");
  const [quizQ, setQuizQ] = useState(null);
  const cats = ["All",...Array.from(new Set(QUESTION_BANK.map(q=>q.category)))];
  const filtered = filter==="All"?QUESTION_BANK:QUESTION_BANK.filter(q=>q.category===filter);
  if (quizQ) return <InlineQuiz questions={quizQ} onBack={()=>setQuizQ(null)} />;
  return (
    <div>
      <div className="panel">
        <div className="plabel">Offline Question Bank</div>
        <div className="stitle">Blueprint Fundamentals</div>
        <p className="muted mt1" style={{marginBottom:"1.5rem"}}>{QUESTION_BANK.length} curated questions covering drawing types, symbols, dimensions, structural, MEP, and more. No API key required.</p>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"1.5rem"}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} style={{fontFamily:"'DM Mono',monospace",fontSize:".65rem",letterSpacing:"1px",padding:"5px 12px",border:`1px solid ${filter===c?"var(--acc)":"var(--brd)"}`,background:filter===c?"var(--acc)":"transparent",color:filter===c?"var(--bg)":"var(--mute)",cursor:"pointer",textTransform:"uppercase"}}>{c}</button>
          ))}
        </div>
        <div className="row">
          <button className="btn btns" onClick={()=>setQuizQ(shuffle(filtered))}>START QUIZ ({filtered.length} Q)</button>
          <span className="muted" style={{fontSize:".75rem"}}>Questions shuffled randomly</span>
        </div>
      </div>
      <div style={{display:"grid",gap:"10px"}}>
        {filtered.map((q,i)=>(
          <div className="qcard" key={q.id}>
            <div className="qcnum">Q{String(i+1).padStart(2,"0")} · {q.category}</div>
            <div className="qctxt">{q.question}</div>
            <div className="qcans">
              {q.options.map((opt,j)=>(
                <div key={j} className={`qca ${j===q.answer?"iscor":""}`}>
                  <span className="qatag">{L[j]}</span><span>{opt}</span>
                  {j===q.answer && <span style={{marginLeft:"auto",fontFamily:"'DM Mono',monospace",fontSize:".6rem",color:"var(--acc2)"}}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("upload");
  return (
    <>
      <style>{S}</style>
      <div className="app">
        <header className="hdr">
          <div className="logo">
            <div className="logo-box">BP</div>
            BLUEPRINT <span>IQ</span>
          </div>
          <div className="hdr-badge">v1.0 · AI-POWERED</div>
        </header>
        <div className="tabs">
          <button className={`tab ${tab==="upload"?"on":""}`} onClick={()=>setTab("upload")}>AI Blueprint Analysis</button>
          <button className={`tab ${tab==="practice"?"on":""}`} onClick={()=>setTab("practice")}>Practice Bank</button>
        </div>
        <div className="main">
          {tab==="upload" ? <UploadTab/> : <PracticeTab/>}
        </div>
      </div>
    </>
  );
}

