// script.js - handles scoring and report rendering
function getScore(el, key){ return parseFloat(el.getAttribute('data-' + key) || 0) || 0 }

const form = document.getElementById('prakritiForm');
const reportBox = document.getElementById('report');
const resetBtn = document.getElementById('resetBtn');
const printBtn = document.getElementById('printBtn');

form.addEventListener('submit', function(e){
  e.preventDefault();
  const formData = new FormData(form);
  const inputs = form.querySelectorAll('input[type=radio]:checked');
  const totals = {v:0,p:0,k:0};
  inputs.forEach(inp => {
    totals.v += getScore(inp,'v');
    totals.p += getScore(inp,'p');
    totals.k += getScore(inp,'k');
  });

  const answered = inputs.length;
  const max = answered * 2 || 1;
  const pct = {
    v: Math.round((totals.v / max) * 100),
    p: Math.round((totals.p / max) * 100),
    k: Math.round((totals.k / max) * 100)
  };

  const sorted = Object.entries(totals).sort((a,b)=>b[1]-a[1]);
  const primary = sorted[0] ? sorted[0][0] : 'v';
  const secondary = sorted[1] ? sorted[1][0] : 'p';

  function doshaName(c){ return c==='v'?'Vata':c==='p'?'Pitta':'Kapha'; }
  function interpretation(primary, secondary){
    const map = {
      v: 'Predominant Vata qualities — quick, variable, thin, and dry. Recommend warm, grounding routine, regular meals, and calming practices.',
      p: 'Predominant Pitta qualities — intense, warm, sharp digestion, and irritability. Recommend cooling routines, avoid excess heat and spicy food.',
      k: 'Predominant Kapha qualities — steady, calm, with heavier build and mucus tendency. Recommend stimulating exercise, lighter foods, and reduce sweets.',
    };
    return map[primary] + ' Secondary tendency: ' + map[secondary];
  }

  const name = (formData.get('name') || '').trim();
  const fullName = name ? '<strong>' + escapeHtml(name) + '</strong>' : 'Participant';

  const html = `<div class="result-card">
    <div><strong>Report for</strong> ${fullName}</div>
    <div style="margin-top:10px">
      <div>Vata: ${totals.v} <div class="bar"><i class="vata" style="width:${pct.v}%"></i></div></div>
      <div style="margin-top:8px">Pitta: ${totals.p} <div class="bar"><i class="pitta" style="width:${pct.p}%"></i></div></div>
      <div style="margin-top:8px">Kapha: ${totals.k} <div class="bar"><i class="kapha" style="width:${pct.k}%"></i></div></div>
    </div>
    <div style="margin-top:12px"><strong>Conclusion</strong>
      <div style="margin-top:8px">Primary constitution: <em>${doshaName(primary)}</em></div>
      <div>Secondary tendency: <em>${doshaName(secondary)}</em></div>
    </div>
    <div style="margin-top:12px"><strong>Interpretation & Basic Advice</strong>
      <div style="margin-top:8px">${interpretation(primary, secondary)}</div>
    </div>
  </div>`;

  reportBox.innerHTML = html;
  reportBox.style.display = 'block';
  reportBox.scrollIntoView({behavior:'smooth'});
});

resetBtn.addEventListener('click', ()=>{
  form.reset();
  reportBox.style.display = 'none';
});

printBtn.addEventListener('click', ()=>{ window.print(); });

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
