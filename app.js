// 1. SELEÇÃO DE ELEMENTOS (Capturando o HTML no JavaScript)
const usernameInput = document.getElementById('username-input');
const searchBtn = document.getElementById('search-btn');
const profileContainer = document.getElementById('profile-container');

// 2. EVENTO DE CLIQUE E TECLADO (Monitorar interações do usuário)
searchBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();

    if (username !== "") {
        buscarUsuarioGitHub(username);
    } else {
        alert("Por favor, digite um nome de usuário!");
    }
});

// Permite buscar apertando a tecla "Enter" no teclado
usernameInput.addEventListener('keyup', (evento) => {
    if (evento.key === 'Enter') {
        searchBtn.click();
    }
});

// 3. FUNÇÃO PRINCIPAL (Parte 3.1: Conexão e Download dos Dados)
async function buscarUsuarioGitHub(usuario) {
    try {
        // URL da API oficial do GitHub usando crase e template string padrão
       const respostaPerfil = await fetch(`https://api.github.com/users/${usuario}`);

        
        // Se o usuário não existir (Erro 404), para o código aqui
        if (respostaPerfil.status === 404) {
            alert("Usuário não encontrado no GitHub! Verifique a grafia.");
            profileContainer.classList.add('hidden');
            return;
        }

        // Se atingir o limite de buscas por hora da API
        if (respostaPerfil.status === 403) {
            alert("Limite de buscas do GitHub atingido para o seu IP. Aguarde alguns minutos.");
            return;
        }

        // URL oficial para buscar os repositórios do usuário
        const respostaRepos = await fetch(`https://api.github.com/users/${usuario}/repos?sort=created&per_page=5`);

        // Converte as respostas de texto para Objetos JavaScript (JSON)
        const dadosPerfil = await respostaPerfil.json();
        const dadosRepos = await respostaRepos.json();

        const listaReposHTML = dadosRepos.map(repo => `
    <li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>
`).join('');

profileContainer.innerHTML = `
    <img src="${dadosPerfil.avatar_url}" alt="Foto de ${dadosPerfil.name}" class="avatar">
    <h2>${dadosPerfil.name || dadosPerfil.login}</h2>
    <p class="bio">${dadosPerfil.bio || "Sem biografia disponível."}</p>
    <div class="stats">
        <span><strong>${dadosPerfil.followers}</strong> Seguidores</span>
        <span><strong>${dadosPerfil.following}</strong> Seguindo</span>
    </div>
    <div class="repos">
        <h3>Últimos Repositórios:</h3>
        <ul>${listaReposHTML}</ul>
    </div>
`;

profileContainer.classList.remove('hidden');

        // [A PRÓXIMA SEÇÃO VAI ENTRAR EXATAMENTE AQUI]

    } catch (erro) {
        console.error("Erro detalhado da requisição:", erro);
        alert("Ocorreu um erro ao tentar conectar com o servidor do GitHub.");
    }
}
