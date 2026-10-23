'use strict';
const K='mexac_v1',$=id=>document.getElementById(id);
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>iso(new Date());
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>{if(v===''||v==null)return null;const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:null};
const fmt=(n,d=1)=>n==null||!isFinite(n)?'—':n.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
const DIAS=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;

/* ---------- Dados iniciais (boletins 20/10/26 + grade 2QPD de 17/08/26) ---------- */
/* [id, nome, setor, [aulas,faltas] 1º sem, [aulas,faltas] 2º sem, avaliações 1º sem, avaliações 2º sem]  — nome:peso:nota:data */
const SUBS=[
['lp','Língua Portuguesa','M',[36,3],[27,3],'P1:3:6.5;P2:4:8;P3:3:3.5','P1:3:4:2026-09-11;P2:4::2026-10-02;P3:3::2026-11-13'],
['lit','Literatura','M',[38,4],[24,0],'Questões:3:8;Peça visual:3:7;Pitch criativo:4:5','Questões A Causa Secreta:2:10:2026-08-28;Análise literária em grupo:3::2026-10-05;Apresentação de trend:5::2026-11-16'],
['mat','Matemática','M',[53,8],[34,6],'Avaliação 1:3:4.5;Avaliação 2:3:5.5;Avaliação Global:4:8','Avaliação 1:3:2:2026-09-20;Avaliação 2:3::2026-11-27;Avaliação Global:4::2026-11-28'],
['bio','Biologia','M',[37,5],[24,5],'Avaliação 1:4:7.7;Avaliação 2:2:8;Avaliação 3:4:6','Avaliação 1:4:5:2026-09-08;Avaliação 2:3::2026-10-13;Avaliação 3:3::2026-11-24'],
['fis','Física','M',[38,7],[24,4],'Teste Semestral:2:3.8;Experimento:1:9;Prova Semestral:4:3.8;Nota das Listas:2:8.6;Participação Global:1:10','Experimento:1:10:2026-08-25;Teste Semestral:2:10:2026-09-01;Prova Semestral:4::2026-10-20;Nota das Listas:2::2026-11-17;Participação Global:1::2026-11-24'],
['qui','Química','M',[38,4],[26,3],'Avaliação até sais:4:8;Exercícios em sala:4:9;Lista de exercícios:2:10','Avaliação sobre gases:4::2026-10-02;Exercícios em sala:4::2026-11-13;Lista de exercícios:2::2026-11-19'],
['fil','Filosofia','M',[38,2],[23,0],'Nota 1:4:6.5;Nota 2:3:6.5;Nota 3:3:9','Nota 1:4:8:2026-09-20;Nota 2:3::2026-10-20;Nota 3:3::2026-11-15'],
['geo','Geografia','M',[38,2],[24,6],'Avaliação:4:5.5;Trabalho:3:7;Atividade:3:7','Avaliação:4::2026-09-29;Trabalho:3::2026-10-30;Atividades:3::2026-11-19'],
['his','História','M',[34,4],[25,3],'Bloco 1:1:5.5;Bloco 2:1:5;Projeto Outras Antiguidades:4:10;Bloco 3:1:5;Bloco 4:1:6;Cumprimento e Participação:2:8.4','Jogo Educativo:4::2026-11-02;Atividade Complementar:2::2026-11-02;Verificação de Aprendizagem:4::2026-11-20'],
['soc','Sociologia','M',[38,1],[22,3],'Avaliação 1:4:8;Avaliação 2:4:8;Exercícios:2:5','Avaliação 1:5:8.5:2026-08-29;Avaliação 2:3::2026-10-19;Avaliação 3:2::2026-11-16'],
['ing','Inglês','M',[38,8],[24,6],'English Test:4:7.5;English Activity 1:3:5;English Activity 2:3:9.5','English Test:4:0:2026-08-28;TV Newscast:3::2026-10-30;English Activities:3::2026-11-28'],
['cep','Controle Estatístico do Processo','T',[38,4],[24,2],'Prova P1:4:3.8;Prova P2:3:4.1;Atividade 01:3:2','Prova P3:4:8:2026-08-26;Prova P4:3::2026-10-28;Exerc E2:3::2026-11-18'],
['gq','Gestão da Qualidade ISO 9000','T',[37,4],[25,2],'Prova P1:4:5.5;Prova P2:3:4;Atividade 01:3:4.7','Manual Pt2:4:0.8:2026-09-09;Manual Pt3:3::2026-11-18;Exerc 2:3::2026-11-18'],
['gp','Gestão de Pessoas','T',[38,8],[20,2],'Individual 1:3:9;Grupo:3:10;Grupo:4:9.5','Individual 2:3:1:2026-08-24;Grupo 2:3::2026-10-26;Prova:4::2026-11-16'],
['gof','Gestão Operacional e Financeira','T',[38,10],[20,2],'Avaliação 1:4:8;Avaliação 2:4:5;Exercícios Totais:1:4;Participação:1:10','Avaliação 1:4:5:2026-09-21;Avaliação 2:4::2026-10-21;Avaliação Global:2::2026-11-16'],
['dp','Desenvolvimento de Projetos','T',[36,6],[0,0],'Tema:3:7.3;Oficina de Prototipação:1:7;Introdução Contextualização:1:8;Introdução:2:8;Canvas e RCC:3:8.3',''],
['sig','Sistemas Integrados de Gestão','T',[38,4],[0,0],'Avaliação 1:2:10;Avaliação 2:4:3;Avaliação 3:3:5;Exercícios:1:10','']
];
/* grade 2QPD: 10 posições por dia (manhã 1ª–5ª, tarde 1ª–5ª); "." = sem aula/disponível */
const GRADE={1:'soc fil mat mat . . gp gp gof gof',2:'geo geo fis fis bio . lit ing ing .',3:'gq sig sig cep cep fil his soc bio lit',4:'dp dp gq qui . . . . . .',5:'qui lp his mat lp . . . . .'};
const evs=t=>t?t.split(';').map(x=>{const[n,p,v,d]=x.split(':');return{n,p:+p,x:v===''||v==null?null:+v,m:10,d:d||''}}):[];
function seed(){
  const subs=SUBS.map(([id,nome,setor,a,b,e1,e2])=>({id,nome,setor,ev:{1:evs(e1),2:evs(e2)},base:{1:{a:a[0],f:a[1]},2:{a:b[0],f:b[1]}}}));
  const grade=[];for(const d in GRADE)GRADE[d].split(' ').forEach((s,i)=>{if(s!=='.')grade.push({id:'g'+d+i,d:+d,i,s})});
  return{v:1,cfg:{s2:'2026-08-01',fim:'',min:6,fq:75,att:80,fer:[]},subs,grade,reg:{}};
}

/* ---------- Persistência ---------- */
const idok=s=>typeof s==='string'&&/^[\w-]+$/.test(s);
function valid(r){
  const ok=x=>typeof x==='number'&&isFinite(x)&&x>=0,c=r&&r.cfg;
  try{return r.v===1&&c&&/^\d{4}-\d{2}-\d{2}$/.test(c.s2)&&(c.fim===''||/^\d{4}-\d{2}-\d{2}$/.test(c.fim))&&ok(c.min)&&ok(c.fq)&&ok(c.att)&&Array.isArray(c.fer)&&Array.isArray(r.subs)&&Array.isArray(r.grade)&&r.reg&&typeof r.reg==='object'
  &&r.subs.every(s=>idok(s.id)&&typeof s.nome==='string'&&(s.setor==='M'||s.setor==='T')&&[1,2].every(k=>Array.isArray(s.ev[k])&&s.ev[k].every(e=>ok(e.p)&&e.m>0&&(e.x===null||ok(e.x)))&&ok(s.base[k].a)&&ok(s.base[k].f)&&s.base[k].f<=s.base[k].a))
  &&r.grade.every(g=>idok(g.id)&&g.d>=1&&g.d<=5&&typeof g.s==='string')
  &&Object.values(r.reg).every(v=>['p','f','c'].includes(v.v)&&typeof v.s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v.date))}catch(e){return false}
}
function load(){try{const r=JSON.parse(localStorage.getItem(K));if(r&&valid(r))return r}catch(e){}return seed()}
function save(){try{localStorage.setItem(K,JSON.stringify(D))}catch(e){alert('Não foi possível salvar: o armazenamento do navegador está indisponível.')}}
let D=load(),V='home',CUR=null,Q='',DT=today();
if(!localStorage.getItem(K))save();

/* ---------- Cálculos centralizados ---------- */
const semOf=d=>d>=D.cfg.s2?2:1;
function media(s,k){const e=s.ev[k].filter(x=>x.x!=null&&x.p>0),P=e.reduce((a,x)=>a+x.p,0);return P?e.reduce((a,x)=>a+x.x/x.m*10*x.p,0)/P:null}
function counts(s,k){let a=s.base[k].a,f=s.base[k].f;for(const r of Object.values(D.reg))if(r.s===s.id&&semOf(r.date)===k&&r.v!=='c'){a++;if(r.v==='f')f++}return{a,f}}
function freq(s,k){const c=counts(s,k);return c.a?(c.a-c.f)/c.a*100:null}
function need(s,m1,pend){
  if(m1==null)return null;const e=s.ev[2];if(!e.length)return{t:'none'};if(!pend)return{t:'done'};
  const d=e.filter(x=>x.x!=null),pd=d.reduce((a,x)=>a+x.p,0),sd=d.reduce((a,x)=>a+x.x/x.m*10*x.p,0),pp=e.filter(x=>x.x==null&&x.p>0).reduce((a,x)=>a+x.p,0);
  if(!pp)return{t:'done'};const t=2*D.cfg.min-m1;
  return{t:'calc',x:(t*(pd+pp)-sd)/pp,pp,pd,sd,m1,max:(sd+10*pp)/(pd+pp)};
}
function faltasDisp(s){
  const f1=freq(s,1),t0=today();if(f1==null||!D.cfg.fim||t0<D.cfg.s2||t0>D.cfg.fim)return null;
  const c=counts(s,2);let rem=0;
  for(const d=new Date(t0+'T12:00');iso(d)<=D.cfg.fim;d.setDate(d.getDate()+1)){const ds=iso(d);if(D.cfg.fer.includes(ds))continue;
    for(const g of D.grade)if(g.s===s.id&&g.d===d.getDay()&&!D.reg[ds+'|'+g.id])rem++}
  const T=c.a+rem,F=Math.floor(T*(f1-(2*D.cfg.fq-100))/100+1e-9);
  return{disp:F-c.f,T,rem};
}
function info(s){
  const m1=media(s,1),m2=media(s,2),ma=avg([m1,m2].filter(x=>x!=null)),pend=s.ev[2].filter(e=>e.x==null&&e.p>0).length;
  const f1=freq(s,1),f2=freq(s,2),fa=avg([f1,f2].filter(x=>x!=null)),fd=faltasDisp(s),nd=need(s,m1,pend);
  let fr=['n','Sem dados'];
  if(fa!=null)fr=(fa<D.cfg.fq||(fd&&fd.disp<0))?['bad','Crítico']:(fa<D.cfg.att||(fd&&fd.disp<=3))?['warn','Atenção']:['ok','Normal'];
  const mr=ma==null?['n','Sem dados']:ma>=D.cfg.min?['ok','Média anual ≥ '+fmt(D.cfg.min,2)]:['warn','Média anual < '+fmt(D.cfg.min,2)];
  return{m1,m2,ma,par:m1==null||m2==null||pend>0,pend,f1,f2,fa,fd,nd,fr,mr};
}
function needTxt(i){const n=i.nd;if(!n)return 'Sem média do 1º semestre para calcular.';
  if(n.t==='none')return 'Cadastre as avaliações do 2º semestre para calcular a nota necessária.';
  if(n.t==='done')return 'Sem avaliações pendentes no 2º semestre.';
  if(n.x>10)return `Meta anual inalcançável: mesmo com 10 em tudo que falta, a média anual máxima é ${fmt((n.m1+n.max)/2,2)}.`;
  if(n.x<=0)return 'Meta anual já atingida mesmo com 0 nas pendentes (não é garantia definitiva).';
  return `Precisa de média ${fmt(n.x,2)} nas avaliações pendentes do 2º semestre (peso total ${n.pp}).`}
const sub=id=>D.subs.find(s=>s.id===id);
const nomeS=id=>{const s=sub(id);return s?s.nome:'(matéria removida)'};

/* ---------- Registro diário ---------- */
function day(ds){
  const wd=new Date(ds+'T12:00').getDay(),fer=D.cfg.fer.includes(ds),fut=ds>today();
  const sl=D.grade.filter(g=>g.d===wd).sort((a,b)=>a.i-b.i),dis=fer||fut;
  const nav=`<div class="row"><button onclick="dnav(-1)" aria-label="Dia anterior">‹</button><input type="date" value="${ds}" onchange="dset(this.value)" aria-label="Data"><button onclick="dnav(1)" aria-label="Próximo dia">›</button><button onclick="dset(today())">Hoje</button><b>${DIAS[wd]}</b> <span class="tag n">${semOf(ds)}º semestre</span></div>`;
  if(!sl.length)return nav+`<p class="mu">${wd===0||wd===6?'Fim de semana: sem aulas na grade.':'Nenhuma aula na grade para este dia.'}</p>`;
  const rows=sl.map(g=>{const r=D.reg[ds+'|'+g.id],v=r&&r.v,nm=esc(nomeS(r?r.s:g.s));
    const b=(k,t)=>`<button class="sel ${v===k?k:''}" ${dis?'disabled':''} aria-pressed="${v===k}" onclick="mark('${ds}','${g.id}','${k}')">${t}</button>`;
    return `<div class="aula"><span><b class="${v?'':'pen'}">${nm}</b> <span class="mu">${g.i<5?'manhã':'tarde'} · ${g.i%5+1}ª aula · ${v==='p'?'presença':v==='f'?'falta':v==='c'?'sem aula':'pendente'}</span></span><span>${b('p','Fui à aula')} ${b('f','Faltei à aula')} ${b('c','Não teve aula')}</span></div>`}).join('');
  const msg=fer?'<p class="tag warn">Feriado/dia sem aula configurado: registros bloqueados.</p>':fut?'<p class="tag n">Data futura: apenas previsão, nada é contabilizado.</p>':`<button onclick="noClass('${ds}')">Marcar dia inteiro como sem aula</button>`;
  return nav+rows+'<div style="margin-top:10px">'+msg+'</div>';
}
function mark(ds,gid,v){const k=ds+'|'+gid,g=D.grade.find(x=>x.id===gid);if(!g||ds>today()||D.cfg.fer.includes(ds))return;
  if(D.reg[k]&&D.reg[k].v===v)delete D.reg[k];else D.reg[k]={s:D.reg[k]?D.reg[k].s:g.s,v,date:ds};save();render()}
function noClass(ds){const wd=new Date(ds+'T12:00').getDay();if(!confirm('Marcar todas as aulas deste dia como "não teve aula"?'))return;
  D.grade.filter(g=>g.d===wd).forEach(g=>{D.reg[ds+'|'+g.id]={s:(D.reg[ds+'|'+g.id]||g).s,v:'c',date:ds}});save();render()}
function dset(v){if(/^\d{4}-\d{2}-\d{2}$/.test(v)){DT=v;render()}}
function dnav(n){const d=new Date(DT+'T12:00');d.setDate(d.getDate()+n);DT=iso(d);render()}

/* ---------- Telas ---------- */
function chips(i){return `<span class="tag ${i.mr[0]}">${i.mr[1]}${i.par&&i.ma!=null?' (parcial)':''}</span><span class="tag ${i.fr[0]}">Frequência: ${i.fr[1]}</span>`}
function card(s){const i=info(s);
  return `<div class="card link" tabindex="0" role="button" onclick="openS('${s.id}')" onkeydown="if(event.key==='Enter')openS('${s.id}')"><h2>${esc(s.nome)}</h2><span class="tag n">${s.setor==='M'?'Ensino Médio':'Curso Técnico'}</span>
  <div class="two"><div><div class="big">${fmt(i.ma,2)}</div><div class="mu">média anual${i.par&&i.ma!=null?' parcial':''}<br>1º ${fmt(i.m1,2)} · 2º ${fmt(i.m2,2)}</div></div><div><div class="big">${fmt(i.fa,1)}%</div><div class="mu">frequência anual<br>1º ${fmt(i.f1,1)}% · 2º ${fmt(i.f2,1)}%</div></div></div>${chips(i)}</div>`}
function list(k){
  const t=k==='M'?'Ensino Médio':k==='T'?'Curso Técnico':'Todas as matérias',q=Q.toLowerCase();
  const l=D.subs.filter(s=>(k==='all'||s.setor===k)&&s.nome.toLowerCase().includes(q));
  return `<h1>${t}</h1><div class="row"><input type="search" placeholder="Pesquisar matéria" value="${esc(Q)}" oninput="Q=this.value;render(true)" aria-label="Pesquisar matéria"><button class="pri" onclick="addSub('${k}')">Adicionar matéria</button></div>
  <div class="grid">${l.map(card).join('')||'<p class="mu">Nenhuma matéria encontrada. Use "Adicionar matéria".</p>'}</div>`}
function resolver(){
  const out=[];
  for(const s of D.subs){const i=info(s),n=esc(s.nome);
    if(i.fa!=null&&i.fa<D.cfg.fq)out.push([0,`${n}: frequência anual atual ${fmt(i.fa,1)}%, abaixo de ${D.cfg.fq}%.`]);
    if(i.fd&&i.fd.disp<0)out.push([0,`${n}: limite estimado de faltas do 2º semestre ultrapassado em ${-i.fd.disp}.`]);
    else if(i.fd&&i.fd.disp<=3)out.push([1,`${n}: restam cerca de ${i.fd.disp} faltas disponíveis (estimativa com ${i.fd.rem} aulas previstas).`]);
    if(i.nd&&i.nd.t==='calc'){if(i.nd.x>10)out.push([0,`${n}: meta anual de média inalcançável com as avaliações cadastradas.`]);else if(i.nd.x>0)out.push([1,`${n}: precisa de média ${fmt(i.nd.x,2)} nas avaliações pendentes do 2º semestre.`])}
    if(i.nd&&i.nd.t==='none')out.push([2,`${n}: cadastre as avaliações do 2º semestre para calcular uma projeção confiável.`]);
    const lo=[i.m1!=null&&i.m1<D.cfg.min?'1º':'',i.m2!=null&&i.m2<D.cfg.min?'2º':''].filter(Boolean);
    if(lo.length&&i.ma!=null&&i.ma<D.cfg.min&&!i.par)out.push([0,`${n}: média anual abaixo de ${fmt(D.cfg.min,2)} (semestres abaixo: ${lo.join(' e ')}).`]);
    else if(lo.length)out.push([2,`${n}: média abaixo de ${fmt(D.cfg.min,2)} no ${lo.join(' e ')} semestre.`]);
  }
  if(!D.cfg.fim)out.push([2,'Defina o fim do ano letivo em Configurações para projetar as faltas disponíveis.']);
  return out.sort((a,b)=>a[0]-b[0]);
}
function home(){
  const inf=D.subs.map(info),ok=inf.filter(i=>i.ma!=null&&i.ma>=D.cfg.min).length,low=inf.filter(i=>i.ma!=null&&i.ma<D.cfg.min).length,risk=inf.filter(i=>i.fr[0]==='bad').length;
  const ma=avg(inf.map(i=>i.ma).filter(x=>x!=null));
  let A=0,F=0;for(const s of D.subs)for(const k of[1,2]){const c=counts(s,k);A+=c.a;F+=c.f}
  const setor=(k,t)=>{const l=D.subs.filter(s=>s.setor===k).map(info);return `<div class="card"><h3>${t}</h3><div class="big">${fmt(avg(l.map(i=>i.ma).filter(x=>x!=null)),2)}</div><div class="mu">média anual · ${l.length} matérias · ${l.filter(i=>i.fr[0]==='bad').length} em risco de frequência</div></div>`};
  const prox=[];D.subs.forEach(s=>s.ev[2].forEach(e=>{if(e.x==null&&e.d&&e.d>=today())prox.push([e.d,s.nome,e.n,e.p])}));prox.sort();
  const res=resolver();
  return `<h1>Visão geral</h1><div class="card"><h2>Registro de aulas</h2>${day(DT)}</div>
  <div class="grid"><div class="card"><h3>Matérias</h3><div class="big">${D.subs.length}</div></div><div class="card"><h3>Média atual geral</h3><div class="big">${fmt(ma,2)}</div><div class="mu">${ok} com média ≥ ${fmt(D.cfg.min,2)} · ${low} abaixo</div></div>
  <div class="card"><h3>Risco de faltas</h3><div class="big">${risk}</div><div class="mu">matérias em nível crítico</div></div><div class="card"><h3>Aulas · faltas</h3><div class="big">${A} · ${F}</div><div class="mu">frequência geral (por aula) ${fmt(A?(A-F)/A*100:null,1)}%</div></div></div>
  <div class="grid">${setor('M','Ensino Médio')}${setor('T','Curso Técnico')}</div>
  <div class="card"><h2>Preciso resolver</h2>${res.length?'<ul>'+res.map(r=>`<li><span class="tag ${['bad','warn','n'][r[0]]}">${['Crítico','Atenção','Info'][r[0]]}</span> ${r[1]}</li>`).join('')+'</ul>':'<p class="mu">Nada urgente com os dados atuais.</p>'}</div>
  <div class="card"><h2>Próximas avaliações</h2>${prox.length?'<ul>'+prox.slice(0,8).map(p=>`<li>${p[0].split('-').reverse().join('/')} — ${esc(p[1])}: ${esc(p[2])} (peso ${p[3]})</li>`).join('')+'</ul>':'<p class="mu">Nenhuma avaliação futura cadastrada.</p>'}</div>`}
function panel(s,k){
  const m=media(s,k),c=counts(s,k),f=freq(s,k),pend=s.ev[k].filter(e=>e.x==null&&e.p>0).length;
  const rows=s.ev[k].map((e,j)=>{const f=(c,v,t='')=>`<input ${t} value="${esc(v)}" onchange="ed('${s.id}',${k},${j},'${c}',this.value)" aria-label="${c}">`;
    return `<tr><td>${f('n',e.n)}</td><td>${f('d',e.d,'type="date"')}</td><td>${f('p',e.p)}</td><td>${f('x',e.x==null?'':String(e.x).replace('.',','))}</td><td>${f('m',e.m)}</td><td><button onclick="delEv('${s.id}',${k},${j})" aria-label="Excluir avaliação">✕</button></td></tr>`}).join('');
  return `<div class="card"><h2>${k}º semestre</h2><p>Média: <b>${fmt(m,2)}</b>${pend?` <span class="tag n">parcial: ${pend} pendente(s)</span>`:''} · Frequência: <b>${fmt(f,1)}%</b> (${c.a-c.f} presenças, ${c.f} faltas, ${c.a} aulas)</p>
  <div class="tw"><table><tr><th>Avaliação</th><th>Data</th><th>Peso</th><th>Nota (vazio = pendente)</th><th>Máx.</th><th></th></tr>${rows}</table></div>
  <div class="row" style="margin-top:8px"><button onclick="addEv('${s.id}',${k})">Adicionar avaliação</button></div>
  <h3>Ajuste manual de aulas (total do boletim, somado aos registros diários)</h3><div class="row"><label>Aulas <input type="number" min="0" value="${s.base[k].a}" onchange="bas('${s.id}',${k},'a',this.value)"></label><label>Faltas <input type="number" min="0" value="${s.base[k].f}" onchange="bas('${s.id}',${k},'f',this.value)"></label></div></div>`}
function detail(){
  const s=sub(CUR);if(!s){V='home';return home()}const i=info(s);
  return `<div class="row"><button onclick="go('${s.setor}')">‹ Voltar</button></div><h1>${esc(s.nome)}</h1>
  <div class="card"><div class="row"><span class="tag n">${s.setor==='M'?'Ensino Médio':'Curso Técnico'}</span>${chips(i)}</div>
  <p>Média anual: <b>${fmt(i.ma,2)}</b>${i.par?' (parcial)':''} · Frequência anual: <b>${fmt(i.fa,1)}%</b> (média das frequências semestrais)</p>
  <p>${needTxt(i)}</p><p class="mu">${i.fd?`Faltas ainda disponíveis no 2º semestre: <b>${i.fd.disp}</b> (estimativa: ${i.fd.T} aulas no semestre, ${i.fd.rem} ainda previstas).`:'Faltas disponíveis: defina o fim do ano letivo em Configurações (e o 2º semestre precisa ter começado).'}</p>
  ${i.nd&&i.nd.t==='calc'?`<div class="row"><label>Simulação: nota nas pendentes <input class="s" id="sim" placeholder="ex.: 7,5" oninput="sim('${s.id}')"></label><span id="simo" class="mu">Não altera seus registros.</span></div>`:''}
  <div class="row"><button onclick="renSub('${s.id}')">Renomear</button><button onclick="togSetor('${s.id}')">Mover para ${s.setor==='M'?'Curso Técnico':'Ensino Médio'}</button><button onclick="delSub('${s.id}')">Excluir matéria</button></div></div>
  ${panel(s,1)}${panel(s,2)}`}
function gradeV(){
  const opt=sel=>D.subs.map(s=>`<option value="${s.id}" ${s.id===sel?'selected':''}>${esc(s.nome)}</option>`).join('');
  const dias=[1,2,3,4,5].map(d=>{const sl=D.grade.filter(g=>g.d===d).sort((a,b)=>a.i-b.i);
    return `<div class="card"><h2>${DIAS[d]} <span class="mu">${sl.length} aulas</span></h2>${sl.map(g=>`<div class="row"><span class="mu">${g.i<5?'M':'T'}${g.i%5+1}</span><select onchange="gset('${g.id}',this.value)" aria-label="Matéria da aula">${opt(g.s)}</select><button onclick="gdel('${g.id}')" aria-label="Remover aula">✕</button></div>`).join('')}<button onclick="gadd(${d})">Adicionar aula</button></div>`}).join('');
  return `<h1>Calendário e grade</h1><div class="card"><h2>Registro por data</h2>${day(DT)}</div><h2>Grade semanal (2QPD)</h2><p class="mu">Horários não constam na grade fornecida e ficam pendentes de confirmação. Alterar a grade afeta só o planejamento; registros já feitos são preservados.</p><div class="grid">${dias}</div>`}
function cfgV(){const c=D.cfg;
  return `<h1>Configurações e backup</h1><div class="card"><h2>Ano letivo e critérios</h2>
  <div class="row"><label>Início do 2º semestre <input type="date" value="${c.s2}" onchange="cfg('s2',this.value)"></label><label>Fim do ano letivo <input type="date" value="${c.fim}" onchange="cfg('fim',this.value)"></label></div>
  <p class="mu">O início do 2º semestre (01/08/2026) é um valor provisório: confirme com a escola. Sem o fim do ano letivo, as faltas disponíveis não são projetadas.</p>
  <div class="row"><label>Média mínima <input class="s" value="${fmt(c.min,2)}" onchange="cfg('min',this.value)"></label><label>Frequência mínima (%) <input class="s" value="${c.fq}" onchange="cfg('fq',this.value)"></label><label>Alerta de atenção abaixo de (%) <input class="s" value="${c.att}" onchange="cfg('att',this.value)"></label></div>
  <label>Feriados, recessos e dias sem aula (AAAA-MM-DD, separados por vírgula)<br><textarea rows="3" style="width:100%" onchange="cfg('fer',this.value)">${esc(c.fer.join(', '))}</textarea></label></div>
  <div class="card"><h2>Backup</h2><p class="mu">Os dados ficam no LocalStorage deste navegador e desta origem. Se os dados do navegador forem apagados ou o arquivo for aberto em outro local, eles não estarão disponíveis. Exporte backups com frequência.</p>
  <div class="row"><button class="pri" onclick="exp()">Exportar JSON</button><label>Importar JSON <input type="file" accept="application/json,.json" onchange="imp(this)"></label><button onclick="wipe()">Apagar todos os dados</button></div></div>`}
function go(k){V=k;CUR=null;render()}
function openS(id){CUR=id;V='sub';render()}
function render(keep){
  const t=[['home','Visão geral'],['M','Ensino Médio'],['T','Curso Técnico'],['all','Todas as matérias'],['grade','Calendário e grade'],['cfg','Configurações']];
  $('nav').innerHTML=t.map(([k,n])=>`<button class="${V===k||(V==='sub'&&sub(CUR)&&sub(CUR).setor===k)?'on':''}" onclick="go('${k}')">${n}</button>`).join('');
  const f=document.activeElement,pos=f&&f.selectionStart;
  $('app').innerHTML=V==='home'?home():V==='sub'?detail():V==='grade'?gradeV():V==='cfg'?cfgV():list(V);
  if(keep){const q=document.querySelector('input[type=search]');if(q){q.focus();q.setSelectionRange(pos,pos)}}
}

/* ---------- Ações ---------- */
function ed(id,k,j,c,v){const s=sub(id),e=s.ev[k][j];
  if(c==='n'||c==='d')e[c]=v.trim();
  else{const n=num(v);
    if(c==='x'){if(v.trim()===''){e.x=null}else if(n==null||n<0||n>e.m){alert(`Nota inválida: use um número entre 0 e ${fmt(e.m,1)}.`)}else e.x=n}
    else if(c==='p'){if(n==null||n<0)alert('Peso inválido: use um número maior ou igual a 0.');else e.p=n}
    else if(c==='m'){if(n==null||n<=0||(e.x!=null&&e.x>n))alert('Nota máxima inválida: precisa ser maior que 0 e não menor que a nota obtida.');else e.m=n}}
  save();render()}
function addEv(id,k){sub(id).ev[k].push({n:'Nova avaliação',p:1,x:null,m:10,d:''});save();render()}
function delEv(id,k,j){if(confirm('Excluir esta avaliação?')){sub(id).ev[k].splice(j,1);save();render()}}
function bas(id,k,c,v){const b=sub(id).base[k],n=num(v);
  if(n==null||n<0||n!==Math.floor(n))alert('Use um número inteiro maior ou igual a 0.');
  else if(c==='f'&&n>b.a||c==='a'&&n<b.f)alert('As faltas não podem ser maiores que o total de aulas.');else b[c]=n;save();render()}
function sim(id){const s=sub(id),i=info(s),n=i.nd,v=num($('sim').value),o=$('simo');
  if(v==null||v<0||v>10){o.textContent='Informe uma nota entre 0 e 10.';return}
  const m2=(n.sd+v*n.pp)/(n.pd+n.pp);o.textContent=`Simulação: média do 2º sem. ${fmt(m2,2)} → média anual ${fmt((n.m1+m2)/2,2)}.`}
function addSub(k){const nome=(prompt('Nome da matéria:')||'').trim();if(!nome)return;
  const setor=k==='M'||k==='T'?k:(confirm('OK = Ensino Médio\nCancelar = Curso Técnico')?'M':'T');
  const id='s'+Date.now();D.subs.push({id,nome,setor,ev:{1:[],2:[]},base:{1:{a:0,f:0},2:{a:0,f:0}}});save();openS(id)}
function renSub(id){const n=(prompt('Novo nome:',sub(id).nome)||'').trim();if(n){sub(id).nome=n;save();render()}}
function togSetor(id){const s=sub(id);s.setor=s.setor==='M'?'T':'M';save();render()}
function delSub(id){if(!confirm('Excluir esta matéria, suas avaliações e registros de frequência? Não dá para desfazer.'))return;
  D.subs=D.subs.filter(s=>s.id!==id);D.grade=D.grade.filter(g=>g.s!==id);for(const k in D.reg)if(D.reg[k].s===id)delete D.reg[k];save();go('all')}
function gset(gid,s){D.grade.find(g=>g.id===gid).s=s;save();render()}
function gdel(gid){if(confirm('Remover esta aula da grade? Registros passados são mantidos.')){D.grade=D.grade.filter(g=>g.id!==gid);save();render()}}
function gadd(d){if(!D.subs.length)return alert('Cadastre uma matéria primeiro.');const sl=D.grade.filter(g=>g.d===d);D.grade.push({id:'g'+Date.now(),d,i:sl.length?Math.max(...sl.map(g=>g.i))+1:0,s:D.subs[0].id});save();render()}
function cfg(k,v){const c=D.cfg;
  if(k==='s2'||k==='fim'){if(v===''&&k==='fim')c.fim='';else if(/^\d{4}-\d{2}-\d{2}$/.test(v))c[k]=v;else alert('Data inválida.')}
  else if(k==='fer'){const l=v.split(/[\s,;]+/).filter(Boolean);if(l.every(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)))c.fer=l;else alert('Use datas no formato AAAA-MM-DD.')}
  else{const n=num(v);if(n==null||n<0||(k!=='min'&&n>100)||(k==='min'&&n>10))alert('Valor inválido.');else c[k]=n}
  save();render()}
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(D,null,1)],{type:'application/json'}));a.download='mex-academico-backup-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function imp(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const j=JSON.parse(r.result);if(!valid(j))throw 0;if(confirm('Substituir TODOS os dados atuais pelo backup selecionado?')){D=j;save();render();alert('Backup importado.')}}catch(e){alert('Importação falhou: o arquivo não é um backup válido do MEX Acadêmico. Nada foi alterado.')}inp.value=''};
  r.onerror=()=>alert('Não foi possível ler o arquivo.');r.readAsText(f)}
function wipe(){if(confirm('Apagar TODOS os dados? Exporte um backup antes. Não dá para desfazer.')&&confirm('Confirma novamente: apagar tudo e restaurar os dados iniciais?')){D=seed();save();go('home')}}
render();