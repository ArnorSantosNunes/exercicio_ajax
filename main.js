document.addEventListener('DOMContentLoaded', function() {
    const avatarElement = document.getElementById('avatar');
    const nameElement = document.getElementById('name');
    const usernameElement = document.getElementById('username');
    const reposElement = document.getElementById('repos');
    const followersElement = document.getElementById('followers');
    const followingElement = document.getElementById('following');
    const linkElement = document.getElementById('link');
    const botaoCarregar = document.getElementById('btn-carregar');
    const nomeDoPerfilInput = document.getElementById('nomedoperfil');

    botaoCarregar.addEventListener('click', async function() {
        const nomeDoPerfil = nomeDoPerfilInput.value.trim();

        // Validação inicial com throw new Error()
        if (!nomeDoPerfil) {
            throw new Error("Por favor, insira um nome de usuário do GitHub.");
            return;
        }

    try {
            botaoCarregar.disabled = true;
            botaoCarregar.textContent = "Carregando...";

    const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
                throw new Error("Tempo limite excedido. A requisição demorou mais de 10 segundos.");
            }, 10000);

            const response = await fetch(`https://api.github.com/users/${nomeDoPerfil}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

    if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 404) {
                    throw new Error(`Usuário "${nomeDoPerfil}" não encontrado no GitHub.`);
                } else if (response.status === 403) {
                    throw new Error("Limite de requisições à API excedido. Tente novamente mais tarde.");
                } else {
                    throw new Error(errorData.message || `Erro HTTP ${response.status} ao acessar a API`);
                }
            }

    const json = await response.json();
            
            // Validação dos dados recebidos
            if (!json.login) {
                throw new Error("Dados do usuário inválidos recebidos da API");
            }
            avatarElement.src = json.avatar_url;
            nameElement.innerText = json.name || "Nome não disponível";
            usernameElement.innerText = `@${json.login}`;
            reposElement.innerText = json.public_repos;
            followersElement.innerText = json.followers;
            followingElement.innerText = json.following;
            linkElement.href = json.html_url;

        } catch (erro) {
            console.error("Erro detalhado:", erro);
            // Tratamento específico para diferentes tipos de erro
            if (erro.name === 'AbortError') {
                alert("A requisição demorou muito. Verifique sua conexão e tente novamente.");
            } else if (erro.message.includes("Failed to fetch") || 
                    erro.message.includes("NetworkError")) {
                throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
            } else {
                alert(erro.message);
            }
            // Reset dos elementos em caso de erro
            avatarElement.src = "https://via.placeholder.com/180x180";
            nameElement.innerText = "";
            usernameElement.innerText = "";
            reposElement.innerText = "...";
            followersElement.innerText = "...";
            followingElement.innerText = "...";
            linkElement.href = "#";
    } finally {
            botaoCarregar.disabled = false;
            botaoCarregar.textContent = "Carregar";
        }
    });
});