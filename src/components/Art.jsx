import React from 'react';
export function AnubisArt({stage=9,mini=false,showGuides=false}){
 const s=Math.max(0,Math.min(9,stage));
 return <svg className={'anubis-art '+(mini?'mini-art':'')} viewBox="0 0 370 470" fill="none" role="img" aria-label="ภาพวาดเวกเตอร์เทพ Anubis โทนดำทองแดง">
  <defs>
   <linearGradient id="a-body" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#292f39"/><stop offset=".42" stopColor="#07080d"/><stop offset=".75" stopColor="#17141b"/><stop offset="1" stopColor="#040508"/></linearGradient>
   <linearGradient id="a-face" x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#2d303b"/><stop offset=".28" stopColor="#111117"/><stop offset=".63" stopColor="#080a0d"/><stop offset="1" stopColor="#30232a"/></linearGradient>
   <linearGradient id="a-gold" x1="0" y1="0" x2=".9" y2="1"><stop stopColor="#54311a"/><stop offset=".18" stopColor="#fce1a4"/><stop offset=".33" stopColor="#a16b2d"/><stop offset=".51" stopColor="#fbd389"/><stop offset=".73" stopColor="#80501e"/><stop offset=".88" stopColor="#f8d78c"/><stop offset="1" stopColor="#432919"/></linearGradient>
   <linearGradient id="a-ear" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b23139"/><stop offset=".45" stopColor="#451c23"/><stop offset="1" stopColor="#101015"/></linearGradient>
   <linearGradient id="a-red" x1="0" x2="1"><stop stopColor="#7b0c1f"/><stop offset=".52" stopColor="#f15a5b"/><stop offset="1" stopColor="#a51f2b"/></linearGradient>
   <filter id="a-glow"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>
  {s>=7&&<><circle cx="186" cy="223" r="142" stroke="#ac2533" strokeWidth="2" opacity=".45"/><circle cx="186" cy="223" r="133" stroke="#b62c38" strokeWidth=".55" opacity=".33"/><circle cx="186" cy="223" r="106" stroke="#9c2935" strokeDasharray="2 12" opacity=".32"/><path d="M50 223h272 M186 85v277" stroke="#8d1e2a" strokeWidth=".7" opacity=".3"/></>}
  {s===0&&<g stroke="#b3a2a2" strokeWidth="1.35" opacity=".8"><path d="M142 180L122 29L183 150L215 42L235 178L284 225L330 258L315 282L265 295L218 316L227 398L95 398L133 290Z"/><ellipse cx="210" cy="234" rx="91" ry="89"/><path d="M111 295L268 295M100 400l155-1M144 240l145 12M141 200l100-35"/></g>}
  {s>=1&&<g stroke="#c5acac" strokeWidth={s>=2?1.2:2} opacity={s>=2?.1:1}><path d="M126 177L115 26L178 137L213 42L241 175L286 225L335 255L327 273L294 287L275 306L239 317L241 408H90L130 298Z"/></g>}
  {s>=2&&<>
   <path d="M87 426C86 382 111 352 133 327L136 286L222 275L248 322C286 340 299 370 316 426Z" fill="url(#a-body)" stroke="#30303a" strokeWidth="3"/>
   <path d="M151 197L115 27L179 140L212 44L242 188C260 213 281 219 289 234L335 256Q340 266 329 271L293 282Q282 293 269 305L252 318L216 322Q170 332 146 301L128 262Q119 228 151 197Z" fill="url(#a-face)" stroke="#5d5355" strokeWidth="2.2"/>
   <path d="M133 55L162 165L144 186L129 110ZM216 82L226 174L200 155Z" fill="url(#a-ear)" opacity=".88"/>
   <path d="M145 206Q176 185 217 200L238 216L208 238Q166 231 145 261Z" fill="#25252b" opacity=".55"/>
   <path d="M218 281Q256 283 291 282L278 303Q251 320 217 312L186 298Z" fill="#09090c" stroke="#48404a" strokeWidth="1.5"/>
   <path d="M309 251l27 6q4 7-6 14l-19-5q5-7-2-15" fill="#050509"/>
  </>}
  {s>=3&&<>
   <path d="M143 210Q183 187 215 199L187 219L159 225Z" fill="#3a3640" opacity=".45"/>
   <path d="M147 279q27 22 58 27l-14-23Z" fill="#09080c"/>
   <path d="M151 236q14 18 37 21l-22 20-23-20Z" fill="#0d0d12"/>
   <path d="M227 291Q259 290 279 283L258 303L229 306Z" fill="#29212a"/>
   <path d="M108 374L157 327L175 419H95Z" fill="#0b0b10"/>
  </>}
  {s>=4&&<>
   <path d="M145 198Q166 173 187 162M166 216Q187 196 209 196M156 249L179 266M177 280Q192 299 213 299M229 306l24-5" stroke="#8e8290" strokeWidth="2" opacity=".5" strokeLinecap="round"/>
   <path d="M120 361q16-16 38-33m-29 50q16-20 32-30" stroke="#72656b" strokeWidth="1" opacity=".5"/>
   <path d="M191 231q12-11 34-11l-9 13q-12 5-25-2Z" fill="#07080a" stroke="#86766a" strokeWidth="2"/>
   <path d="M206 227l9-3-3 7-7 1Z" fill="#d54349"/>
   <circle cx="211" cy="227" r="7" fill="#ce2a39" opacity=".17" filter="url(#a-glow)"/>
  </>}
  {s>=5&&<>
   <path d="M114 160L131 172L156 218L146 277L128 306L110 282L121 232Z" fill="url(#a-gold)" stroke="#54331e" strokeWidth="2"/>
   <path d="M128 180L144 218L136 274L126 292L120 280L132 222Z" fill="#131216" opacity=".8"/>
   <path d="M169 323Q214 339 249 316L270 342Q239 383 184 370L151 346Z" fill="url(#a-gold)" stroke="#4b321e" strokeWidth="2"/>
   <path d="M102 387Q140 345 179 371Q228 396 267 355L291 383Q248 428 190 412L154 390L131 423H92Z" fill="url(#a-gold)" stroke="#50351e" strokeWidth="3"/>
   <path d="M117 382Q147 362 170 380Q211 408 260 373" stroke="#231818" strokeWidth="7" opacity=".55"/>
   <path d="M121 159L116 97 M135 172l-4-38M166 333l14 28M202 352l4 28M241 339l6 23" stroke="#fff1be" strokeWidth="2" opacity=".5"/>
  </>}
  {s>=6&&<>
   {Array.from({length:5},(_,i)=><path key={i} d={'M'+(118+i*5)+' '+(195+i*11)+'l-6 21'} stroke="#e9be6a" strokeWidth="1.5" opacity=".8"/>)}
   <path d="M145 342q42 33 91 10M107 401q29-24 48-18M181 397q43 21 81-18" stroke="#ffdc8d" strokeWidth="1.5"/>
   <path d="M146 384l19 17M209 415l-5-16M251 402l-14-14" stroke="#4c2d16" strokeWidth="3"/>
   <path d="M191 361l13-12 13 12-13 13Z" fill="#272129" stroke="#e5b65f" strokeWidth="2"/>
   <path d="M130 303l21-32" stroke="#e6bd7a" strokeWidth="1.2"/>
  </>}
  {s>=7&&<>
   <path d="M203 350l15 13-15 16-15-16Z" fill="url(#a-red)" stroke="#ffd078" strokeWidth="2"/>
   <path d="M102 425l-10-23 4-10M280 389l15 15M305 405l13 12" stroke="#ca323d" strokeWidth="3" opacity=".8"/>
   <path d="M73 258l16-5-8 15M315 161l14-12" stroke="#b72b39" strokeWidth="2" opacity=".75"/>
  </>}
  {s>=8&&<>
   <path d="M126 160l4 22M165 330l17 12M217 353l18-9M267 374l10-10" stroke="#fff2b2" strokeWidth="2.4" strokeLinecap="round"/>
   <path d="M199 226l14-5" stroke="#ff9d96" strokeWidth="1"/>
   <circle cx="204" cy="360" r="4" fill="#fff1b2"/>
  </>}
  {showGuides&&<g stroke="#ff5966" strokeDasharray="4 8" strokeWidth="1" opacity=".4"><path d="M82 231h268M183 15v425"/><circle cx="185" cy="245" r="130"/></g>}
  </svg>
}
export function GoldPlate({stage=8,metal='gold'}){
 const silver=metal==='silver',s=Math.max(0,Math.min(8,stage));
 return <svg viewBox="0 0 410 275" role="img" aria-label={'ภาพเกราะ '+(silver?'เงิน':'ทอง')+' แสดงขั้น '+s}>
  <defs>
   <linearGradient id="gold-plate-body" x1="0" y1="0" x2="1" y2=".8"><stop stopColor={silver?'#20232c':'#21120d'}/><stop offset=".27" stopColor={silver?'#676a75':'#68321d'}/><stop offset=".56" stopColor={silver?'#d4d5dc':'#c9852f'}/><stop offset=".83" stopColor={silver?'#666977':'#7b391f'}/><stop offset="1" stopColor={silver?'#11141c':'#2c1812'}/></linearGradient>
   <linearGradient id="gold-highlight" x1="0" y1="0" x2="1" y2="0"><stop stopColor={silver?'#20242d':'#5f321e'}/><stop offset=".34" stopColor={silver?'#9297a7':'#b3652c'}/><stop offset=".47" stopColor={silver?'#e6e8f2':'#f1bc5a'}/><stop offset=".59" stopColor={silver?'#fff':'#fff0ac'}/><stop offset=".72" stopColor={silver?'#777d91':'#a05b24'}/><stop offset="1" stopColor={silver?'#343a44':'#43271a'}/></linearGradient>
  </defs>
  <g transform="translate(20 16)">
   {s===0&&<g fill="none" stroke="#aba6ad" strokeWidth="1.8"><path d="M40 76L93 37Q190-12 292 35L344 76Q331 174 259 223H124Q51 178 40 76Z"/><path d="M62 83L104 60Q197 18 279 58L320 85Q306 162 251 199H133Q74 164 62 83Z"/></g>}
   {s>0&&<path d="M40 76L93 37Q190-12 292 35L344 76Q331 174 259 223H124Q51 178 40 76Z" fill={s>=3?'#09090c':'#181920'} stroke={s>=5?'#c88b49':'#9d8580'} strokeWidth="5"/>}
   {s>=2&&<path d="M57 83L99 49Q191 10 284 49L326 82Q310 173 256 206H126Q72 171 57 83Z" fill={s>=5?'url(#gold-plate-body)':'#17171b'}/>}
   {s>=3&&<path d="M66 91L113 67Q188 38 266 61L316 89L298 120Q196 66 74 136Z" fill="#08080d" opacity=".86"/>}
   {s>=4&&<path d="M85 136Q200 78 307 124L278 177Q185 122 102 182Z" fill={silver?'#757782':'#4b2c23'} opacity=".85"/>}
   {s>=5&&<path d="M64 84L106 58Q190 17 278 55L320 83Q300 170 253 201H130Q82 170 64 84Z" fill={silver?'#a1a5b1':'#7e401e'} opacity=".45"/>}
   {s>=6&&<path d="M85 119Q188 65 304 106L284 144Q182 106 98 157Z" fill={silver?'#c2c5d0':'#da8a33'} opacity=".75"/>}
   {s>=7&&<path d="M114 83Q205 44 279 79L271 100Q194 76 119 111Z" fill="url(#gold-highlight)" opacity=".9"/>}
   {s>=8&&<><path d="M124 82Q196 46 266 80" fill="none" stroke={silver?'#fff':'#fff4d4'} strokeWidth="5" strokeLinecap="round"/><path d="M271 111Q283 151 251 184" fill="none" stroke={silver?'#eff4ff':'#ffe6a6'} strokeWidth="2" strokeLinecap="round"/><circle cx="267" cy="81" r="4" fill="#fff"/></>}
   {s>=2&&<><path d="M64 82Q194 6 318 80M127 210Q193 235 253 209" fill="none" stroke={s>=5?silver?'#e3e7ed':'#b57939':'#48434a'} strokeWidth="3"/><circle cx="95" cy="102" r="7" fill={s>=5?silver?'#bdc3cf':'#be7c36':'#444047'} stroke="#2c2223" strokeWidth="2"/><circle cx="290" cy="103" r="7" fill={s>=5?silver?'#bdc3cf':'#be7c36':'#444047'} stroke="#2c2223" strokeWidth="2"/></>}
  </g>
 </svg>
}
