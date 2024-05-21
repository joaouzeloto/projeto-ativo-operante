document.getElementById("fdados").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o comportamento padrão de submit do formulário
    cadastrarPessoas();
});

function cadastrarPessoas() {
    const URL = "http://localhost:8080/apis/cidadao/cadastra-usuario";
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
