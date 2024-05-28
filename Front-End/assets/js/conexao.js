document.getElementById("fdados").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o comportamento padrão de submit do formulário
    cadastrarPessoas();
});

function cadastrarPessoas() {
    const URL = "http://localhost:8080/apis/security/cadastrar-usuario";
    var fdados = document.getElementById("fdados");
    var formData = new FormData(fdados); 
    alert("entrei");

    fetch(URL, {
        method: 'POST', // Método correto para envio de dados
        body: formData
    })
    .then(resp => {
        return resp.text();
    })
    .then(text => {
        alert(text); // Mostra a resposta do servidor
    })
    .catch(error => {
        console.error(error);
    });
}

async function login() {
    // Previne o envio padrão do formulário
    event.preventDefault();

    // Recupera os valores dos campos de email e senha
    const email = document.querySelector('input[name="email"]').value;
    const senha = document.querySelector('input[name="senha"]').value;

    // Cria o objeto com os dados do login
    const loginData = {
        email: email,
        senha: senha
    };

    try {
        // Envia a requisição para a API de login
        const response = await fetch('http://localhost:8080/apis/security/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        // Verifica se a resposta foi bem-sucedida
        if (response.ok) {
            const data = await response.json();
            // Assume que a resposta contém o token
            const token = data.token;
            const id = data.id;

            // Armazena o token no localStorage (ou sessionStorage)
            localStorage.setItem('authToken', token);
            localStorage.setItem('id', id);

            // Redireciona para a página desejada
            window.location.href = '../html/perfil.html';
        } else {
            // Trata erros de autenticação
            const errorData = await response.json();
            alert('Erro: ' + errorData.message);
        }
    } catch (error) {
        // Trata erros de rede ou outros
        console.error('Erro ao logar:', error);
        alert('Erro ao tentar logar. Por favor, tente novamente.');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    hasToken();
});

function hasToken() {
    const token = localStorage.getItem('authToken');

    if (token) {
        window.location.href = '../html/perfil.html';
    } else {
        console.log('Nenhum token encontrado');
    }
}