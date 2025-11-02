const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

const defaultSize = 40; 
const hoverSize = 65;   
let imgSize = defaultSize; 
let isImageLoaded = false; // Novo: Flag para garantir que a imagem está pronta

// 1. Carregar a imagem: Doces.jpg
const img = new Image();
img.src = 'Doces.jpg'; 

// Adiciona um evento para saber quando a imagem carregou com sucesso
img.onload = function() {
    isImageLoaded = true;
    draw(); // Inicia o desenho somente após o carregamento
};

// Adiciona um evento para detectar se a imagem falhou ao carregar
img.onerror = function() {
    console.error("Erro ao carregar a imagem Doces.jpg. Verifique o nome do arquivo e o caminho.");
    // Desenha um quadrado vermelho no centro para indicar a falha
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width / 2 - 10, canvas.height / 2 - 10, 20, 20);
};


// Função para desenhar a imagem (ou o aviso de erro)
function draw() {
    // Apenas desenha se a imagem tiver carregado
    if (isImageLoaded) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Ajustes de Centralização
        let drawX = mouseX - imgSize / 2;
        let drawY = mouseY - imgSize / 2;
    
        // Limitação de Posição
        if (drawX < 0) drawX = 0;
        if (drawX + imgSize > canvas.width) drawX = canvas.width - imgSize;
        if (drawY < 0) drawY = 0;
        if (drawY + imgSize > canvas.height) drawY = canvas.height - imgSize;
    
        // Desenha a imagem
        ctx.drawImage(img, drawX, drawY, imgSize, imgSize);
    }

    requestAnimationFrame(draw);
}

// 3. Capturar a posição do mouse (mousemove)
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// 4. Implementar o EFEITO HOVER
canvas.addEventListener('mouseenter', () => {
    imgSize = hoverSize;
});

canvas.addEventListener('mouseleave', () => {
    imgSize = defaultSize;
});

// Nota: O loop de animação só é iniciado dentro de img.onload