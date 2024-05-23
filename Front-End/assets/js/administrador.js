document.addEventListener('DOMContentLoaded', function () {
    const btnOrgaosCompetentes = document.getElementById('btnOrgaosCompetentes');
    const btnTiposProblemas = document.getElementById('btnTiposProblemas');
    const btnListarDenuncias = document.getElementById('btnListarDenuncias');

    // Templates
    const templateOrgaosCompetentes = document.getElementById('templateOrgaosCompetentes').content;
    const templateTiposProblemas = document.getElementById('templateTiposProblemas').content;
    const templateListarDenuncias = document.getElementById('templateListarDenuncias').content;

    // Data arrays
    const orgaos = [{ nome: 'Órgão 1' }, { nome: 'Órgão 2' }, { nome: 'Órgão 3' }];
    const tiposProblemas = [{ nome: 'Tipo 1' }, { nome: 'Tipo 2' }, { nome: 'Tipo 3' }];

    // Event listeners
    btnOrgaosCompetentes.addEventListener('click', () => showOrgaosCompetentes(orgaos));
    btnTiposProblemas.addEventListener('click', () => showTiposProblemas(tiposProblemas));
    btnListarDenuncias.addEventListener('click', showListarDenuncias);

    // Initial display
    showListarDenuncias();
});

async function carregarDenuncias() {
    try {
        const response = await fetch('http://localhost:8080/apis/adm/get-all-denuncias');
        if (!response.ok) throw new Error('Falha ao carregar denúncias');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar denúncias:', error);
        return [];
    }
}

async function showListarDenuncias() {
    const denuncias = await carregarDenuncias();
    const content = document.getElementById('content');
    content.innerHTML = '';
    const clone = document.importNode(templateListarDenuncias, true);
    content.appendChild(clone);
    await new Promise(resolve => requestAnimationFrame(resolve));

    const listaDenuncias = document.getElementById('listaDenuncias');
    if (!listaDenuncias) {
        console.error('Elemento "listaDenuncias" não encontrado');
        return;
    }
    listaDenuncias.innerHTML = '';

    denuncias.forEach((denuncia, index) => {
        const li = createDenunciaListItem(denuncia, index);
        listaDenuncias.appendChild(li);
    });
}

function createDenunciaListItem(denuncia, index) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `<strong>${denuncia.titulo}</strong><br>${denuncia.descricao}`;
    addDenunciaListItemButtons(li, index);
    return li;
}

function addDenunciaListItemButtons(li, index) {
    const btnApagar = createButton('Apagar', 'btn-sm', () => apagarDenuncia(index));
    const btnFeedback = createButton('Feedback', 'btn-sm ml-10', () => criarFeedback(index));
    const divBotoes = document.createElement('div');
    divBotoes.appendChild(btnApagar);
    divBotoes.appendChild(btnFeedback);
    li.appendChild(divBotoes);
}

function createButton(text, className, onClickFunction) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.style.color = "black";
    button.style.marginRight = "5px";
    button.addEventListener('click', onClickFunction);
    return button;
}
