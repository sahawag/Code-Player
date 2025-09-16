$(function(){
  const $html = $('#html'), $css = $('#css'), $js = $('#js'), $iframe = $('#output');
  const STORAGE_KEY = 'codeplayer_v1';
  let timeout = null;

  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    $html.val(saved.html || '<div class="card">\n  <h2>Hello</h2>\n  <button id="btn">Click</button>\n</div>');
    $css.val(saved.css || '.card{padding:18px;border-radius:10px;background:#f3f7fb;color:#0b1220}');
    $js.val(saved.js || "document.getElementById('btn')?.addEventListener('click',()=>alert('Hi'))");
  }catch(e){}

  function build(){
    return `<!doctype html><html><head><meta charset='utf-8'><style>${$css.val()}</style></head><body>${$html.val()}<script>${$js.val()}<\\/script></body></html>`;
  }

  function update(){
    const doc = $iframe[0].contentDocument;
    doc.open();
    doc.write(build());
    doc.close();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({html:$html.val(), css:$css.val(), js:$js.val()}));
  }

  function schedule(){
    clearTimeout(timeout);
    timeout = setTimeout(update, 400);
  }

  $html.on('input', schedule);
  $css.on('input', schedule);
  $js.on('input', schedule);

  $('#runBtn').on('click', update);
  $('#resetBtn').on('click', ()=>{if(confirm('Reset?')){localStorage.removeItem(STORAGE_KEY);location.reload();}});
  $('#clearBtn').on('click', ()=>{if(confirm('Clear all?')){$html.val('');$css.val('');$js.val('');update();}});

  $(window).on('keydown', e=>{if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();update();}});

  update();
});


