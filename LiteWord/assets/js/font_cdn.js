// フォントのCDNマッピング
const LW_fontCDNs = {
  // 日本語
  "mincho": "",
  "gothic": "",
  "Noto Sans JP": "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap",
  "Noto Serif JP": "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@100..900&display=swap",
  "Zen Kaku Gothic New": "https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400;500;700;900&display=swap",
  "M PLUS Rounded 1c": "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap",
  "Kosugi Maru": "https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap",
  "Sawarabi Mincho": "https://fonts.googleapis.com/css2?family=Sawarabi+Mincho&display=swap",
  "Sawarabi Gothic": "https://fonts.googleapis.com/css2?family=Sawarabi+Gothic&display=swap",
  "Murecho": "https://fonts.googleapis.com/css2?family=Murecho:wght@100..900&display=swap",
  "IBM Plex Sans JP": "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@100;200;300;400;500;600;700&display=swap",
  "BIZ UDPGothic": "https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&display=swap",
  
  // 日本語（プレミアム）
  "Zen Maru Gothic": "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic&display=swap",
  "Dela Gothic One": "https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap",
  "Shippori Mincho": "https://fonts.googleapis.com/css2?family=Shippori+Mincho&display=swap",
  "Zen Old Mincho": "https://fonts.googleapis.com/css2?family=Zen+Old+Mincho&display=swap",
  "WDXL Lubrifont JP N": "https://fonts.googleapis.com/css2?family=WDXL+Lubrifont+JP+N&display=swap",
  "Shippori Mincho B1": "https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1&display=swap",
  "Kaisei Decol": "https://fonts.googleapis.com/css2?family=Kaisei+Decol&display=swap",
  "Potta One": "https://fonts.googleapis.com/css2?family=Potta+One&display=swap",
  "Zen Kaku Gothic Antique": "https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+Antique&display=swap",
  "Hachi Maru Pop": "https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap",
  "Yuji Mai": "https://fonts.googleapis.com/css2?family=Yuji+Mai&display=swap",
  "Rampart One": "https://fonts.googleapis.com/css2?family=Rampart+One&display=swap",
  "Klee One": "https://fonts.googleapis.com/css2?family=Klee+One&display=swap",
  "DotGothic16": "https://fonts.googleapis.com/css2?family=DotGothic16&display=swap",
  "RocknRoll One": "https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap",
  "Zen Kurenaido": "https://fonts.googleapis.com/css2?family=Zen+Kurenaido&display=swap",
  "Zen Antique": "https://fonts.googleapis.com/css2?family=Zen+Antique&display=swap",
  "Mochiy Pop P One": "https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&display=swap",
  "Yuji Syuku": "https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap",
  "Stick": "https://fonts.googleapis.com/css2?family=Stick&display=swap",
  "Hina Mincho": "https://fonts.googleapis.com/css2?family=Hina+Mincho&display=swap",
  "Yusei Magic": "https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap",
  "New Tegomin": "https://fonts.googleapis.com/css2?family=New+Tegomin&display=swap",

  // 英語
  "Roboto": "https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap",
  "Lato": "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
  "Montserrat": "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
  "sora": "https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap",
  "Josefin Sans": "https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap",
  "Open Sans": "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap",
  "Coming Soon": "https://fonts.googleapis.com/css2?family=Coming+Soon&display=swap",
  "Raleway": "https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap",
  "Lacquer": "https://fonts.googleapis.com/css2?family=Lacquer&display=swap",
  "Abril Fatface": "https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap",
  "Lavishly Yours": "https://fonts.googleapis.com/css2?family=Lavishly+Yours&display=swap",
  "Sacramento": "https://fonts.googleapis.com/css2?family=Sacramento&display=swap",
  "Hurricane": "https://fonts.googleapis.com/css2?family=Hurricane&display=swap",
  "Dancing Script": "https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap",
};
// console.log(LW_fontCDNs);
if (!window.LW_loadedFonts) {
  window.LW_loadedFonts = new Set();
}
if (typeof window.LW_preconnectLoaded === 'undefined') {
  window.LW_preconnectLoaded = false;
}



