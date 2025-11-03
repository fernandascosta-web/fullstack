// Geração do número aleatório entre 0 e 99 (inclusos)
const randomNumber = Math.floor(Math.random() * 100); 

let attempts = 0;
const messageElement = document.getElementById('message');
const inputElement = document.getElementById('guessInput');
const resetButton = document.getElementById('resetButton');

/**
 * Função principal para verificar o palpite do usuário.
 */
function checkGuess() {
    const userGuess = parseInt(inputElement.value);

    // Reinicia a cor de fundo do elemento de mensagem
    messageElement.style.setProperty("background-color", "transparent");
    messageElement.style.setProperty("color", "#333");
    messageElement.style.removeProperty("padding"); 

    // Validação
    if (isNaN(userGuess) || userGuess < 0 || userGuess > 99) {
        messageElement.textContent = 'Por favor, digite um número válido entre 0 e 99.';
        // Aplica o estilo de erro usando setProperty, conforme requisito
        messageElement.style.setProperty("background-color", "red");
        messageElement.style.setProperty("color", "white");
        messageElement.style.setProperty("padding", "10px");
        return;
    }

    attempts++;

    // Estrutura de condição (if/else if/else)
    if (userGuess === randomNumber) {
        // Acertou
        messageElement.textContent = `Parabéns! Você acertou o número ${randomNumber} em ${attempts} tentativas!`;
        messageElement.style.setProperty("background-color", "#4CAF50");
        messageElement.style.setProperty("color", "white");
        messageElement.style.setProperty("padding", "10px");
        inputElement.disabled = true;
        document.querySelector('button[onclick="checkGuess()"]').disabled = true;
        resetButton.classList.remove('hidden');

    } else if (userGuess < randomNumber) {
        // Palpite menor
        messageElement.textContent = 'Seu palpite está muito baixo. Tente um número maior.';
        
        // Altera a cor de fundo para vermelho ao errar usando setProperty
        messageElement.style.setProperty("background-color", "red");
        messageElement.style.setProperty("color", "white");
        messageElement.style.setProperty("padding", "10px");
        
    } else {
        // Palpite maior
        messageElement.textContent = 'Seu palpite está muito alto. Tente um número menor.';
        
        // Altera a cor de fundo para vermelho ao errar usando setProperty
        messageElement.style.setProperty("background-color", "red");
        messageElement.style.setProperty("color", "white");
        messageElement.style.setProperty("padding", "10px");
    }

    // Limpa o campo de entrada para nova tentativa
    inputElement.value = '';
    inputElement.focus();
}

/**
 * Recarrega a página para iniciar um novo jogo.
 */
function resetGame() {
    window.location.reload();
}