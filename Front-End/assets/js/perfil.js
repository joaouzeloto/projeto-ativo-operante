
const usuarioLogadoId = 0;

function mudarUsuario(numero){usuarioLogadoId = localStorage.getItem('id');}

function retornarNum(){return usuarioLogadoId;}

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
            const token = localStorage.getItem('authToken');  // Obtém o token do localStorage
            const response = await fetch(`http://localhost:8080/apis/cidadao/get-feedback-by-denuncia-id?id=${denunciaId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
  
      async function carregarDenuncias() {
        try {
            const token = localStorage.getItem('authToken');  // Obtém o token do localStorage
            const response = await fetch(`http://localhost:8080/apis/cidadao/get-all-denuncia-cidadao?id=${localStorage.getItem('id')}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
        const userId = localStorage.getItem('id');
        if (userId) {
            const denunciaUsuarioInput = document.getElementById('denunciaUsuario');
            if (denunciaUsuarioInput) {
                denunciaUsuarioInput.value = userId;
            }
        }
        const formDenuncia = document.getElementById('formDenuncia');
        formDenuncia.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(formDenuncia);
            
            const token = localStorage.getItem('authToken');
    
            // Debugging FormData
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
    
            fetch('http://localhost:8080/apis/cidadao/cadastrar-denuncia', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
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
            const token = localStorage.getItem('authToken');
            const responseOrgaos = await fetch('http://localhost:8080/apis/cidadao/get-all-orgaos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!responseOrgaos.ok) {
                throw new Error('Erro na requisição dos órgãos');
            }
    
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
            const token = localStorage.getItem('authToken');
            const responseTipos = await fetch('http://localhost:8080/apis/cidadao/get-all-tipos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!responseTipos.ok) {
                throw new Error('Erro na requisição dos tipos de problema');
            }
    
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
    window.location.href = '../../index.html';
}
