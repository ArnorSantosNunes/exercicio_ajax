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

        
        if (!nomeDoPerfil) {
            alert("Por favor, insira um nome de usuário do GitHub.");
            return;
        }

        try {
            
            botaoCarregar.disabled = true;
            botaoCarregar.textContent = "Carregando...";

            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

            const response = await fetch(`https://api.github.com/users/${nomeDoPerfil}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
            }

            
            const json = await response.json();
            
            avatarElement.src = json.avatar_url;
            nameElement.innerText = json.name || "Nome não disponível";
            usernameElement.innerText = `@${json.login}`;
            reposElement.innerText = json.public_repos;
            followersElement.innerText = json.followers;
            followingElement.innerText = json.following;
            linkElement.href = json.html_url;

        } catch (erro) {
            console.error("Erro detalhado:", erro);
            
            // Tratamento específico para erros de comunicação
            if (erro.name === 'AbortError') {
                alert("A requisição demorou muito. Verifique sua conexão e tente novamente.");
            } else if (erro.message.includes("Failed to fetch") || 
                    erro.message.includes("NetworkError") || 
                    erro.message.includes("ERR_INTERNET_DISCONNECTED")) {
                alert("Erro de comunicação com o servidor. Verifique sua conexão com a internet.");
            } else if (erro.message.includes("Not Found")) {
                alert("Usuário não encontrado no GitHub. Verifique o nome digitado.");
            } else if (erro.message.includes("API rate limit exceeded")) {
                alert("Limite de requisições excedido. Tente novamente mais tarde.");
            } else {
                alert(`Erro ao acessar a API: ${erro.message}`);
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
            // Restaura o botão 
            botaoCarregar.disabled = false;
            botaoCarregar.textContent = "Carregar";
        }
    });
});