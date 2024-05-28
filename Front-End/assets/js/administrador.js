document.addEventListener('DOMContentLoaded', function () {
    const btnOrgaosCompetentes = document.getElementById('btnOrgaosCompetentes');
    const btnTiposProblemas = document.getElementById('btnTiposProblemas');
    const btnListarDenuncias = document.getElementById('btnListarDenuncias');

    // Templates
    const templateOrgaosCompetentes = document.getElementById('templateOrgaosCompetentes').content;
    const templateTiposProblemas = document.getElementById('templateTiposProblemas').content;
    const templateListarDenuncias = document.getElementById('templateListarDenuncias').content;

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
                <button  onclick="apagarDenuncia(${denuncia.id})">Apagar</button>
                <button   onclick="criarFeedback(${index})">Feedback</button>
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
                <button  onclick="apagarOrgao(${orgao.id})">Apagar</button>
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

function logout(){
    localStorage.clear("authToken");
    window.location.href = '../../index.html';
}