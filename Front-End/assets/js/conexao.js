document.getElementById("fdados").addEventListener("submit", function(event) {
    event.preventDefault(); 
    cadastrarPessoas();
});

function cadastrarPessoas() {
    const URL = "http://localhost:8080/apis/security/cadastrar-usuario";
    var fdados = document.getElementById("fdados");
    var formData = new FormData(fdados); 

    fetch(URL, {
        method: 'POST', 
        body: formData
    })
    .then(resp => {
        return resp.text();
    })
    .then(text => {
        alert("Cadastro realizado!"); 
    })
    .catch(error => {
        console.error(error);
    });
}

async function login() {
    
    event.preventDefault();

    
    const email = document.querySelector('input[name="email"]').value;
    const senha = document.querySelector('input[name="senha"]').value;

    
    const loginData = {
        email: email,
        senha: senha
    };

    try {
        
        const response = await fetch('http://localhost:8080/apis/security/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        if (response.ok) {
            const data = await response.json();
            
            const token = data.token;
            const id = data.id;
            const admin = data.admin;

            
            localStorage.setItem('authToken', token);
            localStorage.setItem('id', id);
            localStorage.setItem('admin',admin);

            
            if(admin==true)
                window.location.href = '../html/administrador.html';
            else
                window.location.href = '../html/perfil.html'

        } else {
            
            const errorData = await response.json();
            alert('Erro: ' + errorData.message);
        }
    } catch (error) {
        
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
        if(localStorage.admin)
            window.location.href = '../html/administrador.html';
        else
            window.location.href = '../html/perfil.html';
    } else {
        console.log('Nenhum token encontrado');
    }
}