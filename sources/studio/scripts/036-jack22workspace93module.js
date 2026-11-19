
(()=>{'use strict';
const $=id=>document.getElementById(id),stage=$('dockStage'),P=window.JACK22_PRO,D=window.JACK22_DOCK;
if(!stage||!P||!D)return;
const nav=document.createElement('nav');nav.id='j93Nav';nav.setAttribute('aria-label','Espaces organisés');
const mk=(text,fn,parent=nav)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);parent.append(b);return b};
let on=false,group='compose',view='roll',homes=[],stateBefore=[],libraryOpen=false,inspectorOpen=false;
mk('Studio',()=>choose('compose','arrange'));const groups=document.createElement('div');groups.className='j93Groups';nav.append(groups);
const gb=new Map();for(const[k,t]of [['compose','Composer'],['voice','Voix & paroles'],['mix','Mixage']])gb.set(k,mk(t,()=>choose(k),groups));
const tools=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Outils ▾';tools.append(summary);const menu=document.createElement('div');menu.className='j93Menu';tools.append(menu);nav.append(tools);
const subs=document.createElement('div');subs.className='j93Subs';nav.append(subs);$('dockMessages').after(nav);
function tool(t,fn){mk(t,()=>{tools.open=false;fn()},menu)}
tool('Samples et instruments',()=>{libraryOpen=!libraryOpen;render()});tool('Inspecteur',()=>{inspectorOpen=!inspectorOpen;render()});
tool('Bibliothèque complète…',()=>window.JACK22_WORKFLOW?.library());
tool('Édition & historique',()=>legacy('dockTools','edit'));tool('Sons & sampler',()=>legacy('dockTools','sounds'));
tool('Exporter WAV',()=>legacy('dockExport'));tool('Versions du projet…',()=>window.JACK22_WORKFLOW?.versions());
tool('Diagnostic & installation',()=>legacy('dockMore'));tool('Fenêtres libres (9.2)',()=>{exit();P.enter()});
const lib=document.createElement('aside');lib.id='j93Library';lib.className='panel';lib.setAttribute('aria-label','Bibliothèque');
const title=document.createElement('h2');title.textContent='Samples et instruments';const search=document.createElement('input');search.type='search';search.placeholder='Rechercher un instrument';search.setAttribute('aria-label','Rechercher un instrument');const list=document.createElement('div');list.className='j93LibraryList';lib.append(title,search,list);
function fillLibrary(){list.replaceChildren();const q=search.value.toLocaleLowerCase('fr');for(const o of $('preset').options){if(!o.textContent.toLocaleLowerCase('fr').includes(q))continue;const b=mk('◉ '+o.textContent,()=>{$('preset').value=o.value;$('preset').dispatchEvent(new Event('change',{bubbles:true}))},list);b.setAttribute('aria-label','Choisir le son '+o.textContent)}mk('Sons & prises du projet…',()=>window.JACK22_WORKFLOW?.library(),list)}search.addEventListener('input',fillLibrary);
function height(){if(on)document.body.style.setProperty('--j93Top',Math.ceil(nav.getBoundingClientRect().bottom+6)+'px')}
function move(id){const e=$(id);if(!e)return;const mark=document.createComment('j93:'+id);e.before(mark);homes.push([e,mark]);stage.append(e)}
function start(){if(on)return;if(P.on)P.exit();P.enter();on=true;
 stateBefore=[];for(const id of ['cWords','v8Mix']){const e=$(id);if(!e)continue;stateBefore.push([e,e.hidden,e.className]);move(id);e.hidden=false;e.classList.remove('compact88Folded','compact88Focused')}
 stage.append(lib);document.body.classList.add('j93Workspace');fillLibrary();height();}
const defs={compose:[['arrange','Arrangement'],['beat','Batterie'],['roll','Piano Roll']],voice:[['record','Enregistrer'],['fx','Effets voix'],['words','Paroles'],['prompt','Prompteur']],mix:[['mixer','Mixeur & effets'],['auto','Automation']]};
function choose(g,v){start();group=g;view=v||(g==='compose'?'beat':defs[g][0][0]);render()}
function show(id,area){const e=$(id);if(!e)return;e.dataset.j93Visible='true';e.dataset.j93Area=area;e.hidden=false;e.classList.remove('compact88Folded','compact88Focused')}
function render(){if(!on)return;
 stage.classList.toggle('j93Voice',group==='voice');stage.classList.toggle('j93Mix',group==='mix');stage.classList.toggle('j93Writing',group==='voice'&&view==='words');stage.classList.toggle('j93Prompt',group==='voice'&&view==='prompt');
 for(const e of stage.querySelectorAll(':scope>.panel')){delete e.dataset.j93Visible;delete e.dataset.j93Area}
 for(const[k,b]of gb)b.setAttribute('aria-pressed',String(k===group));subs.replaceChildren();
 for(const[k,t]of defs[group]){const b=mk(t,()=>{view=k;render()},subs);b.setAttribute('aria-pressed',String(view===k))}
 if(group==='compose'){
  if(libraryOpen)show('j93Library','library');if(inspectorOpen)show('c92Inspector','inspector');if(view==='arrange')show('timeline','timeline');show({roll:'roll',beat:'dockBeat',patterns:'patterns'}[view],'editor');if(view==='roll')show('synth','synth');
 }else if(group==='voice'){
  if(view==='record'){show('cVoices','left');show('cWords','right')}
  else if(view==='fx')show('l3Editor','full');else show('cWords','full');
 }else if(view==='auto')show('v8Mix','full');else{show('mixer','left');show('fx','right')}
 height();document.dispatchEvent(new CustomEvent('j105view',{detail:{group,view}}));requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
}
function exit(){if(!on)return;on=false;tools.open=false;document.body.classList.remove('j93Workspace');document.body.style.removeProperty('--j93Top');
 for(const e of stage.querySelectorAll(':scope>.panel')){delete e.dataset.j93Visible;delete e.dataset.j93Area}
 for(const[e,mark]of homes)mark.replaceWith(e);homes=[];for(const[e,h,c]of stateBefore){e.hidden=h;e.className=c}stateBefore=[];lib.remove();stage.classList.remove('j93Voice','j93Mix','j93Writing','j93Prompt');P.exit();D.showPane('studio');}
function legacy(pane,key){exit();D.showPane(pane);if(key)window.JACK22_COMPACT?.choose($(pane),key)}
// Navigation d'accueil inchangée : les entrées existantes ouvrent les outils regroupés.
$('dockNav').addEventListener('click',e=>{const b=e.target.closest('[data-dock-pane]');if(!b)return;const p=b.dataset.dockPane;if(!['dockComposer','dockVoices','dockWords'].includes(p))return;e.preventDefault();e.stopImmediatePropagation();choose(p==='dockComposer'?'compose':'voice',p==='dockWords'?'words':undefined)},true);
const projectMenu=document.querySelector('.dockProject .dockPopupBody');if(projectMenu){const b=mk('Espace organisé (9.3)…',()=>{projectMenu.closest('details').open=false;choose('compose')},projectMenu);b.id='j93Enter'}
// Les liens internes qui ouvrent un autre espace retrouvent leurs panneaux avant navigation.
const originalShow=D.showPane;D.showPane=function(id,...rest){if(on){if(id==='studio')return;if(id==='dockComposer'){choose('compose');return}if(id==='dockVoices'||id==='dockWords'){choose('voice',id==='dockWords'?'words':'record');return}exit()}return originalShow.call(D,id,...rest)};
const oldEnter=P.enter;P.enter=function(...a){if(on)exit();return oldEnter.apply(P,a)};
window.addEventListener('resize',height);new ResizeObserver(height).observe(nav);
window.JACK22_WORKSPACE={version:'9.3-candidate',enter:()=>choose('compose','arrange'),exit,choose,get on(){return on},get group(){return group},get view(){return view}};
})();
