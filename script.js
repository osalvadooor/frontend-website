// API 
const URL_BASE = "https://www.freetogame.com/api/games";

// Seleção dos elementos da página

const campoBusca = document.getElementById("campoBusca");
const btnBuscar = document.getElementById("btnBuscar");
const mensagemErro = document.getElementById("mensagemErro");
const resultados = document.getElementById("resultados");
const favoritos = document.getElementById("favoritos");

btnBuscar.addEventListener("click", buscarJogos);


// Implementação da lógica da função de busca

async function buscarJogos() {

    const nomeJogo = campoBusca.value.trim();

    mensagemErro.textContent = "";
    resultados.innerHTML = "";

    if (nomeJogo === "") {
        mensagemErro.textContent = "Digite o nome de um jogo.";
        return;
    }

    if (nomeJogo.length < 3) {
        mensagemErro.textContent = "Digite pelo menos 3 caracteres.";
        return;
    }

    try {

        const resposta = await fetch(URL_BASE);

        if (!resposta.ok) {
            throw new Error("Erro ao consultar a API.");
        }

        const jogos = await resposta.json();

        const jogosFiltrados = jogos.filter(function (jogo) {

            return jogo.title
                .toLowerCase()
                .includes(nomeJogo.toLowerCase());

        });

        mostrarResultados(jogosFiltrados);

    }

    catch (erro) {

        mensagemErro.textContent =
            "Não foi possível consultar a API.";

        console.error(erro);

    }

}
