
function desenhar_quadrado(ctx, x, y, w, h, cor){
  ctx.fillStyle = cor;
  ctx.fillRect(x, y, w, h);
}
function desenhar_linha(ctx, x1, y1, x2, y2, cor, esp=2){
  ctx.strokeStyle = cor;
  ctx.lineWidth = esp;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
function desenhar_arco(ctx, x, y, r, a0, a1, fill=null, fillMode=true, borda=null, espB=2){
  ctx.beginPath();
  ctx.arc(x, y, r, a0, a1);
  if (fill){
    if (fillMode){ ctx.fillStyle = fill; ctx.fill(); }
    else { ctx.strokeStyle = fill; ctx.stroke(); }
  }
  if (borda){
    ctx.lineWidth = espB;
    ctx.strokeStyle = borda;
    ctx.stroke();
  }
}
function escrever(ctx, txt, x, y, cor="#000", font="18px Arial"){
  ctx.fillStyle = cor;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(txt, x, y);
}

/*************************** CANVAS 1 — CASINHA **************************/
const c1 = document.getElementById("canvas1");
const g1 = c1.getContext("2d");

// Céu e chão
desenhar_quadrado(g1, 0, 0, 300, 200, "#aaffdd");
desenhar_quadrado(g1, 0, 200, 300, 100, "grey");

// Casa
desenhar_quadrado(g1, 110, 110, 95, 90, "#8B4513");

// Telhado
g1.beginPath();
g1.fillStyle = "red";
g1.moveTo(110, 110);
g1.lineTo(155, 60);
g1.lineTo(205, 110);
g1.fill();

// Janelas
desenhar_quadrado(g1, 115, 130, 25, 30, "deepskyblue");
desenhar_quadrado(g1, 175, 130, 25, 30, "deepskyblue");

// Porta
desenhar_quadrado(g1, 145, 160, 25, 40, "#5a3310");

// Sol
desenhar_arco(g1, 250, 60, 40, 0, 2*Math.PI, "yellow");

// Árvores
desenhar_quadrado(g1, 35, 145, 25, 55, "#8B4513");
desenhar_quadrado(g1, 245, 185, 25, 55, "#8B4513");
desenhar_arco(g1, 45, 145, 30, 0, 2*Math.PI, "green");
desenhar_arco(g1, 255, 175, 30, 0, 2*Math.PI, "green");

// Rio
g1.fillStyle = "dodgerblue";
g1.beginPath(); g1.arc(0, 200, 30, Math.PI, 2*Math.PI); g1.fill();
g1.beginPath(); g1.arc(150, 300, 30, Math.PI, 2*Math.PI); g1.fill();
g1.fillRect(0,195,30,160);
g1.fillRect(0,270,155,100);


/********* CANVAS 2 — GEOMÉTRICO (CORREÇÃO FINAL DO MODELO VISUAL) *********/
const c2 = document.getElementById("canvas2");
const g2 = c2.getContext("2d");

// --- CONSTANTES ---
const LARGURA_CANVAS = 300;
const ALTURA_CANVAS = 300;
const centroX = 150; 
const centroY = 150;  
const TAMANHO_CANTO = 40; 
const TAMANHO_CENTRAL = 40; 
const ESPESSURA = 2; 
const RAIO_INFERIOR_LATERAL = 100;

// --- CORES ---
const AZUL_FORTE   = "#0000FF";
const VERM_FORTE   = "#FF0000";
const CIANO_FORTE  = "#00FFFF";
const VERDE_LINHAS = "#81C081";
const AMARELO_PADRAO = "#FFFF00";
const PRETO_FORTE  = "#000000";
const CINZA_LINHA  = "#888888"; 



desenhar_quadrado(g2, 0, 0, LARGURA_CANVAS, ALTURA_CANVAS, "#FFFFFF"); 

//LINHAS DIAGONAIS
desenhar_linha(g2, 40, 40, centroX, centroY, AZUL_FORTE, ESPESSURA); 
desenhar_linha(g2, 260, 40, centroX, centroY, VERM_FORTE, ESPESSURA); 

//QUADRADOS CIANO LATERAIS (30x30, Centrado em Y=150)
const Y_LATERAL_30 = 135; 
desenhar_quadrado(g2, 0, 120, 30, 60, CIANO_FORTE); 
desenhar_quadrado(g2, 270, Y_LATERAL_30, 30, 30, CIANO_FORTE); 

//QUADRADOS DE CANTO E LINHA HORIZONTAL
desenhar_quadrado(g2, 0, 0, TAMANHO_CANTO, TAMANHO_CANTO, AZUL_FORTE); 
desenhar_quadrado(g2, 260, 0, TAMANHO_CANTO, TAMANHO_CANTO, VERM_FORTE); 
desenhar_linha(g2, 0, centroY, LARGURA_CANVAS, centroY, VERDE_LINHAS, ESPESSURA); 

const raioArcoExt = 85; 
const raioArcoInt = 65; 


// Desenhar os arcos COMPLETO (Eles serão cortados a seguir)
desenhar_arco(g2, centroX, centroY, raioArcoExt, Math.PI, 0, null, false, VERDE_LINHAS, ESPESSURA); // Raio Ext

// --- 5.1. TRIÂNGULO BRANCO DE CORTE (SIMULANDO O CORTE DAS LINHAS DIAGONALS) ---
// O triângulo deve cobrir a área de interseção, com vértices:
// 1. Canto interno esquerdo (40, 40)
// 2. Canto interno direito (260, 40)
// 3. Centro (150, 150)

g2.fillStyle = "#FFFFFF"; // Cor de fundo
g2.beginPath();
g2.moveTo(40, 40);         // Ponto 1: Canto interno azul
g2.lineTo(260, 40);        // Ponto 2: Canto interno vermelho
g2.lineTo(centroX, centroY); // Ponto 3: Centro do Canvas
g2.closePath();
g2.fill(); // Preenche o triângulo de branco, cobrindo os arcos.

desenhar_arco(g2, centroX, centroY, raioArcoInt, Math.PI, 0, null, false, VERDE_LINHAS, ESPESSURA); // Raio Int

// --- 6. REDESENHAR LINHAS E QUADRADO CENTRAL (para ficarem visíveis SOBRE o branco) ---
// Linhas Diagonais (Redesenhadas por cima do corte branco)
desenhar_linha(g2, 40, 40, centroX, centroY, "#0000FF", ESPESSURA); 
desenhar_linha(g2, 260, 40, centroX, centroY, "#FF0000", ESPESSURA);

// 6. BLOCO VERMELHO CENTRAL (30x30, ALINHANDO A PARTE SUPERIOR NA LINHA VERDE Y=150)
// Ajuste: A base do quadrado está em 180, o topo está em 150.
desenhar_quadrado(g2, 110, centroY, TAMANHO_CENTRAL, TAMANHO_CENTRAL, VERM_FORTE); 


desenhar_arco(g2, centroX, ALTURA_CANVAS, 80, Math.PI, 1.5 * Math.PI, null, false, VERDE_LINHAS, ESPESSURA);
desenhar_arco(g2, centroX, ALTURA_CANVAS, 58, 1.5 * Math.PI, 2 * Math.PI, null, false, VERDE_LINHAS, ESPESSURA);


// 8. CÍRCULOS AMARELOS (Raio 18, ajustado visualmente)
const RAIO_AMARELO = 18;
desenhar_arco(g2, 80, 215, RAIO_AMARELO, 0, 2 * Math.PI, AMARELO_PADRAO, true); // Y um pouco mais baixo (215)
desenhar_arco(g2, 220, 215, RAIO_AMARELO, 0, 2 * Math.PI, AMARELO_PADRAO, true); 

// Argumentos: ctx, x, y, r, a0, a1, corFill, preencher, corBorda, espBorda
desenhar_arco(g2, 80, 215, RAIO_AMARELO, 0, 2 * Math.PI, AMARELO_PADRAO, true, VERDE_LINHAS, ESPESSURA); 

// Círculo Direito: (220, 215)
desenhar_arco(g2, 220, 215, RAIO_AMARELO, 0, 2 * Math.PI, AMARELO_PADRAO, true, VERDE_LINHAS, ESPESSURA);



// 10. DEGRAUS (AGORA COM DIMENSÕES VISUAIS DO MODELO)
const TAM_BLOCO_GRANDE = 60;
const TAM_BLOCO_PEQUENO = 30;

// Degraus Pretos (Direito - O Degrau "L" invertido)
desenhar_quadrado(g2, 270, 270, TAM_BLOCO_PEQUENO, TAM_BLOCO_PEQUENO, PRETO_FORTE); // 30x30 no canto (270, 270)
desenhar_quadrado(g2, 240, 270, TAM_BLOCO_PEQUENO, TAM_BLOCO_PEQUENO, PRETO_FORTE); // 30x30 ao lado (240, 270)
desenhar_quadrado(g2, 270, 240, TAM_BLOCO_PEQUENO, TAM_BLOCO_PEQUENO, PRETO_FORTE); // 30x30 acima (270, 240)


// Degraus Amarelos (Esquerdo - O "L" normal, invertido no canto)
desenhar_quadrado(g2, 0, 270, TAM_BLOCO_PEQUENO, TAM_BLOCO_PEQUENO, AMARELO_PADRAO); // 30x30 no canto (0, 270)
desenhar_quadrado(g2, 30, 270, TAM_BLOCO_PEQUENO, TAM_BLOCO_PEQUENO, AMARELO_PADRAO); // 30x30 ao lado (30, 270)
desenhar_quadrado(g2, 0, 240, TAM_BLOCO_PEQUENO, TAM_BLOCO_PEQUENO, AMARELO_PADRAO); // 30x30 acima (0, 240)


// 11. CÍRCULO CIANO SUPERIOR (Com contorno azul)
desenhar_arco(g2, centroX, 110, 18, 0, 2 * Math.PI, CIANO_FORTE, true, AZUL_FORTE, ESPESSURA); 


// 12. TEXTO
escrever(g2, "Canvas", centroX, 35, PRETO_FORTE, "22px Arial");

// 7. LINHA VERTICAL CINZA (Desenhada APÓS o quadrado vermelho para cortá-lo visualmente)
desenhar_linha(g2, centroX, centroY , centroX, ALTURA_CANVAS, CINZA_LINHA, 2);

desenhar_arco(g2, centroX, 300, 40 - 2, Math.PI, 0, CIANO_FORTE, true, null, ESPESSURA);
desenhar_arco(g2, centroX, 300, 40, Math.PI, 0, null, false, VERDE_LINHAS, ESPESSURA);


