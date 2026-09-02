const R=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const V=[1,2,3,4,5,6,7,8,9,0,0,0,0];
function sum(a){return a.reduce((x,y)=>x+y,0)}
function total(a){return a.reduce((x,r)=>x+V[r],0)%10}
function bankerDraw(bt,p3,playerDrew){
 if(!playerDrew)return bt<=5;
 return bt<=2||(bt===3&&p3!==8)||(bt===4&&p3>=2&&p3<=7)||(bt===5&&p3>=4&&p3<=7)||(bt===6&&(p3===6||p3===7));
}
function enumerate(C0, wantStates=false){
 const C=C0.slice(), out={P:0,B:0,T:0,PPair:0,BPair:0,S6:0,B6:0,S7:0,B7:0,U22:0,U23:0,U32:0,U33:0};
 const states=wantStates?new Map():null;
 function finish(P,B,pr){
  const pt=total(P),bt=total(B),pc=P.length,bc=B.length;
  if(pt>bt)out.P+=pr; else if(bt>pt)out.B+=pr; else out.T+=pr;
  const pp=P[0]===P[1],bp=B[0]===B[1];
  if(pp)out.PPair+=pr;if(bp)out.BPair+=pr;
  const s6=bc===2&&bt===6&&bt>pt,b6=bc===3&&bt===6&&bt>pt,s7=pc===2&&pt===7&&pt>bt,b7=pc===3&&pt===7&&pt>bt;
  if(s6)out.S6+=pr;if(b6)out.B6+=pr;if(s7)out.S7+=pr;if(b7)out.B7+=pr;
  const u22=pc===2&&pt===7&&bc===2&&bt===6,u23=pc===2&&pt===7&&bc===3&&bt===6,u32=pc===3&&pt===7&&bc===2&&bt===6,u33=pc===3&&pt===7&&bc===3&&bt===6;
  if(u22)out.U22+=pr;if(u23)out.U23+=pr;if(u32)out.U32+=pr;if(u33)out.U33+=pr;
  if(states){
   // Full final outcome signature. Main bet categories are mutually exclusive; side events can overlap.
   const key=[pt,bt,pc,bc,pp?1:0,bp?1:0,s6?1:0,b6?1:0,s7?1:0,b7?1:0,u22?1:0,u23?1:0,u32?1:0,u33?1:0].join(',');
   states.set(key,(states.get(key)||0)+pr);
  }
 }
 function walk(P,B,pr,step){
  const N=sum(C);
  if(step<4){
   for(let r=0;r<13;r++)if(C[r]){const q=pr*C[r]/N;C[r]--; if(step===0)walk([r],B,q,1);else if(step===1)walk(P,[r],q,2);else if(step===2)walk(P.concat(r),B,q,3);else walk(P,B.concat(r),q,4);C[r]++;}return;
  }
  const pt=total(P),bt=total(B);
  if(pt>=8||bt>=8){finish(P,B,pr);return}
  if(pt<=5){
   const N1=sum(C);
   for(let p3=0;p3<13;p3++)if(C[p3]){const q=pr*C[p3]/N1;C[p3]--; if(bankerDraw(bt,V[p3],true)){const N2=sum(C);for(let b3=0;b3<13;b3++)if(C[b3]){const q2=q*C[b3]/N2;C[b3]--;finish(P.concat(p3),B.concat(b3),q2);C[b3]++;}}else finish(P.concat(p3),B,q);C[p3]++;}
  } else if(bankerDraw(bt,null,false)){const N1=sum(C);for(let b3=0;b3<13;b3++)if(C[b3]){const q=pr*C[b3]/N1;C[b3]--;finish(P,B.concat(b3),q);C[b3]++;}}
  else finish(P,B,pr);
 }
 walk([],[],1,0);return {out,states};
}
function statsFromStates(states,mode){
 const list=[...states.entries()];
 const rows=['Banker','Player','Tie','Banker Pair','Player Pair','Lucky 6','Small 6','Big 6','Lucky 7','Small 7','Big 7','Super 7 2v2','Super 7 mixed','Super 7 3v3'];
 const acc={};rows.forEach(n=>acc[n]={ev:0,second:0,hit:0});
 for(const [key,p] of list){const a=key.split(',').map(Number);const [pt,bt,pc,bc,pp,bp,s6,b6,s7,b7,u22,u23,u32,u33]=a;
  const hits={Banker:bt>pt&&bt<10,Player:pt>bt&&pt<10,Tie:pt===bt,BankerPair:!!bp,PlayerPair:!!pp,Lucky6:!!(s6||b6),Small6:!!s6,Big6:!!b6,Lucky7:!!(s7||b7),Small7:!!s7,Big7:!!b7,U22:!!u22,Ux:!!(u23||u32),U33:!!u33};
  const wins={Banker:(hits.Banker?(mode==='commission'?0.95:(bt===6?0.5:1)):hits.Tie?0:-1),Player:hits.Player?1:(hits.Tie?0:-1),Tie:hits.Tie?8:-1,BankerPair:hits.BankerPair?11:-1,PlayerPair:hits.PlayerPair?11:-1,Lucky6:s6?12:(b6?20:-1),Small6:hits.Small6?22:-1,Big6:hits.Big6?50:-1,Lucky7:s7?6:(b7?15:-1),Small7:hits.Small7?15:-1,Big7:hits.Big7?30:-1,U22:hits.U22?30:-1,Ux:hits.Ux?40:-1,U33:hits.U33?100:-1};
  for(const n of rows){const k={ 'Banker Pair':'BankerPair','Player Pair':'PlayerPair','Lucky 6':'Lucky6','Small 6':'Small6','Big 6':'Big6','Lucky 7':'Lucky7','Small 7':'Small7','Big 7':'Big7','Super 7 2v2':'U22','Super 7 mixed':'Ux','Super 7 3v3':'U33'}[n]||n;const x=wins[k];acc[n].ev+=p*x;acc[n].second+=p*x*x;if(x>0)acc[n].hit+=p;}
 }
 for(const n of rows){acc[n].var=Math.max(0,acc[n].second-acc[n].ev*acc[n].ev);acc[n].sd=Math.sqrt(acc[n].var)}
 return acc;
}
function keyCounts(C){return C.join(',')}
if(typeof module!=='undefined')module.exports={R,V,sum,total,bankerDraw,enumerate,statsFromStates,keyCounts};
