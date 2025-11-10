const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameMessage = document.getElementById('gameMessage');

const salarioImg = new Image();
salarioImg.src = 'salario.png'; 

let jogo = {
    running: false,
    saldo: 1500,
    score: 0,
    level: 1,
    emprestimoDisponivel: true, 
    emprestimoAtivo: false,   
    intervaloEmprestimo: null 
};

class Jogador {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 70;
        this.speed = 5;
    }

    desenha() {
        if (salarioImg.complete) {
            ctx.drawImage(salarioImg, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    move(direction) {
        this.x += (direction === 'left' ? -this.speed : this.speed);
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }
}

class Objeto {
    constructor(isDebit) {
        this.type = isDebit ? 'debit' : 'credit';
        this.width = 60;
        this.height = 60;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = 0;
        this.speed = 1.5 + (jogo.level * 0.6); 
        this.color = isDebit ? 'red' : 'blue';

        const data = this.pegaDados(isDebit);
        this.value = data.value;
        this.label = data.label;
    }
    
    pegaDados(isDebit) {
        if (isDebit) {
            const debits = ['Aluguel', 'Combustível', 'Mercado', 'Ifood', 'Hortifruti', 'Apostou no tigrinho', 'gás', 'remédio'];
            return {
                label: debits[Math.floor(Math.random() * debits.length)],
                value: -(Math.floor(Math.random() * 150) + 70) 
            };
        } else {
            const credits = ['Bico FDS', '13º Salário', '2º Emprego', 'Reembolso'];
            return {
                label: credits[Math.floor(Math.random() * credits.length)],
                value: (Math.floor(Math.random() * 100) + 30)
            };
        }
    }

    atualiza() { this.y += this.speed; }

    desenha() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.label, this.x + this.width/2, this.y + 20);
        ctx.fillText(`R$ ${this.value}`, this.x + this.width/2, this.y + 45);
    }
}

let objetos = [];
let jogador = new Jogador(canvas.width / 2 - 35, canvas.height - 70);
let teclasPressionadas = {}; 

function verificaColisao(r1, r2) {
    return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x &&
           r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
}

function processaMovimentoJogador() {
    if (teclasPressionadas['ArrowLeft'] || teclasPressionadas['a']) { jogador.move('left'); }
    if (teclasPressionadas['ArrowRight'] || teclasPressionadas['d']) { jogador.move('right'); }
}

function usaEmprestimo() {
    if (jogo.emprestimoDisponivel && jogo.running) {
        jogo.saldo += 1000;
        jogo.emprestimoDisponivel = false;
        jogo.emprestimoAtivo = true;
        gameMessage.textContent = 'EMPRÉSTIMO NUBANK DE R$1000 APROVADO!';
        
        jogo.intervaloEmprestimo = setInterval(() => {
            if (!jogo.running) { return clearInterval(jogo.intervaloEmprestimo); }
            
            jogo.saldo -= 100;
            gameMessage.textContent = 'Juros do Empréstimo: -R$100. Saldo em risco!';
            
            if (jogo.saldo <= 0) { finalizaJogo(); }
        }, 10000); 

        setTimeout(() => { if (jogo.running) gameMessage.textContent = 'Cuidado com os Juros e os Boletos!'; }, 3000);
    } 
    else if (jogo.running) {
        gameMessage.textContent = 'Empréstimo já foi usado nesta partida!';
    }
}

let contadorCriacao = 0;
const taxaCriacaoBase = 60; 

function atualizaJogo() {
    processaMovimentoJogador();

    contadorCriacao++;
    const taxaCriacaoAtual = Math.max(10, taxaCriacaoBase - (jogo.level * 10)); 

    if (contadorCriacao % taxaCriacaoAtual === 0) {
        const isDebit = Math.random() < 0.7; 
        objetos.push(new Objeto(isDebit));
    }
    
    objetos = objetos.filter(obj => {
        obj.atualiza();
        
        if (obj.y > canvas.height) { jogo.score++; return false; }
        
        if (verificaColisao(jogador, obj)) { 
            jogo.saldo += obj.value; 
            if (jogo.saldo <= 0) { finalizaJogo(); }
            return false;
        }
        return true; 
    });
}

function desenhaJogo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    jogador.desenha(); 
    objetos.forEach(obj => obj.desenha());

    ctx.fillStyle = 'black';
    ctx.font = '22px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`SALDO: R$ ${jogo.saldo.toFixed(2)}`, 15, 35);
    ctx.fillText(`TEMPO: ${jogo.score}s`, 15, 65);
    ctx.textAlign = 'right';
    ctx.fillText(`NÍVEL: ${jogo.level}`, canvas.width - 15, 35);

    ctx.textAlign = 'left';
    if (jogo.emprestimoDisponivel && jogo.running) {
        ctx.fillStyle = 'green';
        ctx.font = '14px Arial';
        ctx.fillText(`EMPRÉSTIMO DISPONÍVEL (ESPAÇO)`, 10, canvas.height - 10);
    } else if (jogo.emprestimoAtivo && jogo.running) {
        ctx.fillStyle = 'red';
        ctx.font = '14px Arial';
        ctx.fillText(`JUROS ATIVOS (-R$100/10s)`, 10, canvas.height - 10);
    }
}

let animationFrameId = null; 
let levelInterval = null;

function loopJogo() {
    if (!jogo.running) return;
    atualizaJogo();
    desenhaJogo();
    animationFrameId = requestAnimationFrame(loopJogo); 
}

function iniciaJogo() {
    jogo.saldo = 1500; jogo.score = 0; jogo.level = 1; objetos = [];
    jogador.x = canvas.width / 2 - 35; 
    jogo.running = true;
    jogo.emprestimoDisponivel = true;
    jogo.emprestimoAtivo = false;
    if (jogo.intervaloEmprestimo) clearInterval(jogo.intervaloEmprestimo);

    gameMessage.textContent = 'Use as setas para mover, ESPAÇO para o Empréstimo Nubank!';
    startButton.disabled = true;

    if (levelInterval) clearInterval(levelInterval);
    levelInterval = setInterval(() => { if (jogo.running) { jogo.level++; } }, 5000); 

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    requestAnimationFrame(loopJogo); 
}

function finalizaJogo() {
    jogo.running = false;
    clearInterval(levelInterval);
    if (jogo.intervaloEmprestimo) clearInterval(jogo.intervaloEmprestimo);
    cancelAnimationFrame(animationFrameId);
    gameMessage.textContent = `FIM DE JOGO! Saldo Zerado. Você durou ${jogo.score}s no Nível ${jogo.level}.`;
    startButton.textContent = 'Jogar Novamente';
    startButton.disabled = false;
}

startButton.addEventListener('click', iniciaJogo);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') { teclasPressionadas['ArrowLeft'] = true; }
    if (e.key === 'ArrowRight' || e.key === 'd') { teclasPressionadas['ArrowRight'] = true; }
    
    if (e.key === ' ' && jogo.running) {
        e.preventDefault(); 
        usaEmprestimo();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') { teclasPressionadas['ArrowLeft'] = false; }
    if (e.key === 'ArrowRight' || e.key === 'd') { teclasPressionadas['ArrowRight'] = false; }
});