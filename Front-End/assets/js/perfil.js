
const usuarioLogadoId = 0;

function mudarUsuario(numero){usuarioLogadoId = localStorage.getItem('id');}

document.addEventListener('DOMContentLoaded', function () {



    // Seleção dos botões
    const btnEnviarDenuncia = document.getElementById('btnEnviarDenuncia');
    const btnVisualizarDenuncias = document.getElementById('btnVisualizarDenuncias');
    const content = document.getElementById('content');

    // Templates
    const templateEnviarDenuncia = document.getElementById('templateEnviarDenuncia').content;
    const templateVisualizarDenuncias = document.getElementById('templateVisualizarDenuncias').content;

    function showEnviarDenuncia() {
        content.innerHTML = '';
        content.appendChild(document.importNode(templateEnviarDenuncia, true));
        carregarOrgaos();
        carregarTiposProblema();
        bindFormSubmit();
    }    
  
    async function showVisualizarDenuncias() {
        content.innerHTML = '';
        const denuncias = await carregarDenuncias(usuarioLogadoId);
        content.appendChild(document.importNode(templateVisualizarDenuncias, true));
        const listaDenuncias = document.getElementById('listaDenuncias');
        listaDenuncias.innerHTML = '';
    
        for (const denuncia of denuncias) {
            const feedback = await fetchFeedback(denuncia.id);
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>${denuncia.titulo}</strong><br>
                ${denuncia.texto}
              </div>
              <button style="color: black; margin-right: 5px;" class="btn-sm" onclick="toggleDetails(this)">Ver Mais</button>
            </div>
            <div class="denuncia-details" style="display:none;">
              <p>Data: ${denuncia.data}</p>
              <p>Urgência: ${denuncia.urgencia}</p>
              <p>Órgão: ${denuncia.orgao.nome}</p>
              <p>Tipo: ${denuncia.tipo.nome}</p>
              <h14>Feedback: ${feedback}</h14>
            </div>
          `;
            listaDenuncias.appendChild(li);
        }
    }
    
    async function fetchFeedback(denunciaId) {
        try {
            const response = await fetch(`http://localhost:8080/apis/cidadao/get-feedback-by-denuncia-id?id=${denunciaId}`);
            if (response.ok) {
                const data = await response.json();
                return data.texto || "Nenhum feedback cadastrado.";  // Se não tiver texto, mostra mensagem padrão.
            } else {
                return " "; // Mensagem de erro para problemas de resposta.
            }
        } catch (error) {
            console.error('Erro na rede ou ao buscar feedback:', error);
            return " "; // Mensagem de erro para exceções de rede ou outras.
        }
    }
    
    
  
      window.toggleDetails = function(button) {
        const detailsDiv = button.parentNode.nextElementSibling;
        if (detailsDiv.style.display === 'none') {
          detailsDiv.style.display = 'block';
          button.textContent = 'Ver Menos';
        } else {
          detailsDiv.style.display = 'none';
          button.textContent = 'Ver Mais';
        }
      };
  
      async function carregarDenuncias(userId) {
        try {
          const response = await fetch(`http://localhost:8080/apis/cidadao/get-all-denuncia-cidadao?id=${userId}`);
          if (!response.ok) {
            throw new Error('Falha ao carregar denúncias: ' + response.statusText);
          }
          return await response.json();
        } catch (error) {
          console.error('Erro ao carregar denúncias:', error);
          return []; 
        }
      }
  

      function bindFormSubmit() {
        const formDenuncia = document.getElementById('formDenuncia');
        formDenuncia.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(formDenuncia);
    
            // Debugging FormData
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
    
            fetch('http://localhost:8080/apis/cidadao/cadastrar-denuncia', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                alert('Denúncia cadastrada com sucesso!');
                console.log(data);
                formDenuncia.reset();
            })
            .catch(error => {
                console.error('Erro ao cadastrar denúncia:', error);
                alert('Erro ao cadastrar denúncia: ' + error.message);
            });
        });
    }    
    
    

    async function carregarOrgaos() {
        try {
            const responseOrgaos = await fetch('http://localhost:8080/apis/cidadao/get-all-orgaos');
            const orgaos = await responseOrgaos.json();
            const orgaoSelect = document.getElementById('denunciaOrgao');
            let options = `<option value="">Selecione um órgão</option>`;
            orgaos.forEach(orgao => {
                options += `<option value="${orgao.id}">${orgao.nome}</option>`;
            });
            orgaoSelect.innerHTML = options;
        } catch (error) {
            console.error('Erro ao carregar órgãos:', error);
        }
    }

    async function carregarTiposProblema() {
        try {
            const responseTipos = await fetch('http://localhost:8080/apis/cidadao/get-all-tipos');
            const tiposProblema = await responseTipos.json();
            const tipoProblemaSelect = document.getElementById('denunciaTipoProblema');
            let options = `<option value="">Selecione um tipo de problema</option>`;
            tiposProblema.forEach(tipo => {
                options += `<option value="${tipo.id}">${tipo.nome}</option>`;
            });
            tipoProblemaSelect.innerHTML = options;
        } catch (error) {
            console.error('Erro ao carregar tipos de problema:', error);
        }
    }

    // Inicialização
    btnEnviarDenuncia.addEventListener('click', showEnviarDenuncia);
    btnVisualizarDenuncias.addEventListener('click', showVisualizarDenuncias);
    showVisualizarDenuncias();

});

function logout(){
    localStorage.clear("authToken");
    window.location.href = '../index.html';
}
