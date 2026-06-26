// API
const URL_BASE = "https://www.freetogame.com/api/games";

// Seleção dos elementos da página

const campoBusca = document.getElementById("campoBusca");
const btnBuscar = document.getElementById("btnBuscar");
const mensagemErro = document.getElementById("mensagemErro");
const resultados = document.getElementById("resultados");
const favoritos = document.getElementById("favoritos");
let jogosAtuais = [];

btnBuscar.addEventListener("click", buscarJogos);
campoBusca.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    evento.preventDefault();
    buscarJogos();
  }
});

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
      return jogo.title.toLowerCase().includes(nomeJogo.toLowerCase());
    });

    jogosAtuais = jogosFiltrados;
    mostrarResultados(jogosAtuais);
  } catch (erro) {
    mensagemErro.textContent = "Não foi possível consultar a API.";

    console.error(erro);
  }
}

// Mostrar resultados da busca

function mostrarResultados(jogos) {
  resultados.innerHTML = "";
  mensagemErro.textContent = "";

  if (jogos.length === 0) {
    resultados.innerHTML = "<p>Nenhum jogo encontrado.</p>";

    return;
  }

  jogos.forEach(function (jogo) {
    const card = document.createElement("div");
    card.className = "card-jogos";
    card.innerHTML = `
            <img src="${jogo.thumbnail}" alt="${jogo.title}">
            <h3>${jogo.title}</h3>
            <p>Gênero: ${jogo.genre}</p>
            <p>Plataforma: ${jogo.platform}</p>
        `;

    const botaoFavoritar = document.createElement("button");
    botaoFavoritar.innerHTML = '<i class="fa-regular fa-heart"></i> Favoritar';
    botaoFavoritar.addEventListener("click", function () {
      favoritarJogo(jogo);
    });

    card.appendChild(botaoFavoritar);
    resultados.appendChild(card);
  });
}

function carregarFavoritos() {
  const dados = localStorage.getItem("favoritosJogos");
  return dados ? JSON.parse(dados) : [];
}

function salvarFavoritos(lista) {
  localStorage.setItem("favoritosJogos", JSON.stringify(lista));
}

function favoritarJogo(jogo) {
  const lista = carregarFavoritos();

  const jaExiste = lista.some(function (item) {
    return item.id === jogo.id;
  });

  if (jaExiste) {
    mensagemErro.textContent = "Este jogo já está na lista de favoritos!";
    return;
  }

  lista.push(jogo);
  salvarFavoritos(lista);
  mostrarFavoritos();
}

function removerFavorito(id) {
  const lista = carregarFavoritos();

  const novaLista = lista.filter(function (item) {
    return item.id !== id;
  });

  salvarFavoritos(novaLista);
  mostrarFavoritos();
}

function mostrarFavoritos() {
  const lista = carregarFavoritos();
  favoritos.innerHTML = "";

  if (lista.length === 0) {
    favoritos.innerHTML = `
            <div class="card-jogos vazio-favoritos">
                <p>Você ainda não adicionou nenhum favorito.</p>
            </div>
        `;
    return;
  }

  lista.forEach(function (jogo) {
    favoritos.innerHTML += `
            <div class="card-jogos">
                <img src="${jogo.thumbnail}" alt="${jogo.title}">
                <h3>${jogo.title}</h3>
                <p>Gênero: ${jogo.genre}</p>
                <p>Plataforma: ${jogo.platform}</p>
                <button onclick="removerFavorito(${jogo.id})">
                    Remover
                </button>
            </div>
        `;
  });
}

mostrarFavoritos();
