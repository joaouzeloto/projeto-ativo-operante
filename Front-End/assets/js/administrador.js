document.addEventListener('DOMContentLoaded', function () {
    const btnOrgaosCompetentes = document.getElementById('btnOrgaosCompetentes');
    const btnTiposProblemas = document.getElementById('btnTiposProblemas');
    const btnListarDenuncias = document.getElementById('btnListarDenuncias');

    // Templates
    const templateOrgaosCompetentes = document.getElementById('templateOrgaosCompetentes').content;
    const templateTiposProblemas = document.getElementById('templateTiposProblemas').content;
    const templateListarDenuncias = document.getElementById('templateListarDenuncias').content;
    const templateFeedbackModal = document.getElementById('templateFeedbackModal').content;
    const templateAlterarModal = document.getElementById('templateAlterarModal').content;

    // Adicionar o template dos modais ao body
    document.body.appendChild(document.importNode(templateFeedbackModal, true));
    document.body.appendChild(document.importNode(templateAlterarModal, true));

    // Event listeners
    btnOrgaosCompetentes.addEventListener('click', showOrgaosCompetentes);
    btnTiposProblemas.addEventListener('click', showListarTipos);
    btnListarDenuncias.addEventListener('click', showListarDenuncias);

    // Initial display
    showListarDenuncias();
});

document.getElementById('content').addEventListener('submit', function (event) {
    event.preventDefault();
    if (event.target.id === 'formOrgaos') {
        const orgao = {
            nome: document.getElementById('inputOrgao').value
        };
        adicionarOrgao(orgao);
    } else if (event.target.id === 'formTiposProblemas') {
        const tipo = {
            nome: document.getElementById('inputTipoProblema').value
        };
        adicionarTipo(tipo);
    }
});

document.getElementById('feedbackForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const feedback = document.getElementById('feedbackInput').value;
    const denunciaId = event.target.dataset.denunciaId;  // Obtém o ID da denúncia do dataset do formulário
    const token = localStorage.getItem('authToken');  // Obtém o token do localStorage

    // Enviar o feedback via API
    fetch('http://localhost:8080/apis/adm/cadastra-feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ texto: feedback, denuncia: denunciaId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao enviar feedback');
        }
        return response.json();
    })
    .then(data => {
        // Trate a resposta da API aqui
        console.log(data);
        // Fechar o modal após enviar o feedback
        const feedbackModal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
        feedbackModal.hide();
        // Atualizar a página ou fazer algo após o feedback ser enviado com sucesso
        alert('Feedback enviado com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao enviar feedback:', error);
        alert('Erro ao enviar feedback. Por favor, tente novamente.');
    });
});

document.getElementById('alterarForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const novoNome = document.getElementById('alterarInput').value;
    const id = event.target.dataset.id;  // Obtém o ID do dataset do formulário
    const tipo = event.target.dataset.tipo;  // Obtém o tipo (orgao ou problema) do dataset do formulário
    const token = localStorage.getItem('authToken');  // Obtém o token do localStorage

    console.log(`Alterando ${tipo} com ID ${id} para o novo nome: ${novoNome}`);

    // URL da API com base no tipo
    const url = tipo === 'orgao' ? 'http://localhost:8080/apis/adm/update-orgao' : 'http://localhost:8080/apis/adm/update-tipo';

    // Enviar o novo nome via API
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: id, nome: novoNome })
    })
    .then(response => {
        console.log('Resposta da API recebida:', response);
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message || 'Falha ao atualizar nome'); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados recebidos da API:', data);
        // Fechar o modal após atualizar o nome
        const alterarModal = bootstrap.Modal.getInstance(document.getElementById('alterarModal'));
        alterarModal.hide();
        alert('Nome atualizado com sucesso!');
        // Atualizar a lista após a alteração
        tipo === 'orgao' ? showOrgaosCompetentes() : showListarTipos();
    })
    .catch(error => {
        console.error('Erro ao atualizar nome:', error);
        alert('Erro ao atualizar nome. Por favor, tente novamente.');
    });
});



async function adicionarTipo(tipo) {
    try {
        const token = localStorage.getItem('authToken');  // Obtém o token do localStorage
        const response = await fetch('http://localhost:8080/apis/adm/add-tipo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tipo)
        });
        if (!response.ok) throw new Error('Falha ao adicionar tipo');
        const novoTipo = await response.json();
        console.log('Tipo adicionado com sucesso:', novoTipo);
        showListarTipos();  // Atualiza a lista de tipos
    } catch (error) {
        console.error('Erro ao adicionar tipo:', error);
    }
}

async function adicionarOrgao(orgao) {
    try {
        const token = localStorage.getItem('authToken');  // Obtém o token do localStorage
        const response = await fetch('http://localhost:8080/apis/adm/add-orgao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orgao)
        });
        if (!response.ok) throw new Error('Falha ao adicionar órgão');
        const novoOrgao = await response.json();
        console.log('Órgão adicionado com sucesso:', novoOrgao);
        showOrgaosCompetentes();  // Atualiza a lista de órgãos
    } catch (error) {
        console.error('Erro ao adicionar órgão:', error);
    }
}

async function carregarDenuncias() {
    try {
        const token = localStorage.getItem('authToken');  // Obtém o token do localStorage
        const response = await fetch('http://localhost:8080/apis/adm/get-all-denuncias', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Falha ao carregar denúncias');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar denúncias:', error);
        return [];
    }
}

async function carregarTipos() {
    try {
        const token = localStorage.getItem('authToken');  // Obtém o token do localStorage
        const response = await fetch('http://localhost:8080/apis/adm/get-all-tipos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Falha ao carregar tipos de problemas');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar tipos:', error);
        return [];
    }
}

async function carregarOrgaos() {
    try {
        const token = localStorage.getItem('authToken');  // Obtém o token do localStorage
        const response = await fetch('http://localhost:8080/apis/adm/get-all-orgaos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Falha ao carregar órgãos');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar órgãos:', error);
        return [];
    }
}

async function showListarTipos() {
    const tipos = await carregarTipos();
    const content = document.getElementById('content');
    content.innerHTML = '';
    const clone = document.importNode(document.getElementById('templateTiposProblemas').content, true);
    content.appendChild(clone);
    await new Promise(resolve => requestAnimationFrame(resolve));

    const tbody = document.getElementById('listaTiposProblemas');
    if (!tbody) {
        console.error('Elemento "listaTiposProblemas" não encontrado');
        return;
    }

    tipos.forEach((tipo, index) => {
        const tr = createTipoTableRow(tipo, index);
        tbody.appendChild(tr);
    });
}

function createTipoTableRow(tipo, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${tipo.id}</td>
        <td style="max-width: 80%; overflow: hidden; text-overflow: ellipsis;">${tipo.nome}</td>
        <td>
            <div style="display: inline-block; vertical-align: middle;">
                <button onclick="apagarTipo(${tipo.id})">Apagar</button>
                <button onclick="abrirModalAlterar(${tipo.id}, '${tipo.nome}', 'tipo')" data-bs-toggle="modal" data-bs-target="#alterarModal">Alterar</button>
            </div>
        </td>
    `;
    return tr;
}

async function showListarDenuncias() {
    const denuncias = await carregarDenuncias();
    const content = document.getElementById('content');
    content.innerHTML = '';
    const clone = document.importNode(document.getElementById('templateListarDenuncias').content, true);
    content.appendChild(clone);
    await new Promise(resolve => requestAnimationFrame(resolve));

    const tbody = document.getElementById('listaDenuncias');
    if (!tbody) {
        console.error('Elemento "listaDenuncias" não encontrado');
        return;
    }

    denuncias.forEach((denuncia, index) => {
        const tr = createDenunciaTableRow(denuncia, index);
        tbody.appendChild(tr);
    });
}

function createDenunciaTableRow(denuncia, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${denuncia.id}</td>
        <td style="max-width: 20%; overflow: hidden; text-overflow: ellipsis;">${denuncia.titulo}</td>
        <td style="max-width: 30%; overflow: hidden; text-overflow: ellipsis;">${denuncia.texto}</td>
        <td>
            <div style="display: inline-block; vertical-align: middle;">
                <button onclick="apagarDenuncia(${denuncia.id})">Apagar</button>
                <button onclick="abrirModalFeedback(${denuncia.id})" data-bs-toggle="modal" data-bs-target="#feedbackModal">Feedback</button>
            </div>
        </td>
    `;
    return tr;
}

async function showOrgaosCompetentes() {
    const orgaos = await carregarOrgaos();
    const content = document.getElementById('content');
    content.innerHTML = '';
    const clone = document.importNode(document.getElementById('templateOrgaosCompetentes').content, true);
    content.appendChild(clone);
    await new Promise(resolve => requestAnimationFrame(resolve));

    const tbody = document.getElementById('listaOrgaos');
    if (!tbody) {
        console.error('Elemento "listaOrgaos" não encontrado');
        return;
    }

    orgaos.forEach((orgao, index) => {
        const tr = createOrgaoTableRow(orgao, index);
        tbody.appendChild(tr);
    });
}

function createOrgaoTableRow(orgao, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${orgao.id}</td>
        <td style="max-width: 80%; overflow: hidden; text-overflow: ellipsis;">${orgao.nome}</td>
        <td>
            <div style="display: inline-block; vertical-align: middle;">
                <button onclick="apagarOrgao(${orgao.id})">Apagar</button>
                <button onclick="abrirModalAlterar(${orgao.id}, '${orgao.nome}', 'orgao')" data-bs-toggle="modal" data-bs-target="#alterarModal">Alterar</button>
            </div>
        </td>
    `;
    return tr;
}

// Funções de exclusão
async function apagarTipo(id) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/apis/adm/delete-tipo?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Falha ao apagar tipo');
        console.log('Tipo apagado com sucesso');
        showListarTipos();  // Atualiza a lista de tipos
    } catch (error) {
        console.error('Erro ao apagar tipo:', error);
    }
}

async function apagarDenuncia(id) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/apis/adm/delete-denuncia?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Falha ao apagar denúncia');
        console.log('Denúncia apagada com sucesso');
        showListarDenuncias();  // Atualiza a lista de denúncias
    } catch (error) {
        console.error('Erro ao apagar denúncia:', error);
    }
}

async function apagarOrgao(id) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/apis/adm/delete-orgao?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Falha ao apagar órgão');
        console.log('Órgão apagado com sucesso');
        showOrgaosCompetentes();  // Atualiza a lista de órgãos
    } catch (error) {
        console.error('Erro ao apagar órgão:', error);
    }
}

function logout() {
    localStorage.clear("authToken");
    window.location.href = '../../index.html';
}

function abrirModalFeedback(denunciaId) {
    document.getElementById('feedbackInput').value = '';  // Limpa o feedback anterior
    document.getElementById('feedbackForm').dataset.denunciaId = denunciaId;  // Armazena o ID da denúncia no formulário
}

function abrirModalAlterar(id, nome, tipo) {
    document.getElementById('alterarInput').value = nome;  // Preenche o campo com o nome atual
    document.getElementById('alterarForm').dataset.id = id;  // Armazena o ID no formulário
    document.getElementById('alterarForm').dataset.tipo = tipo;  // Armazena o tipo (orgao ou problema) no formulário
}
