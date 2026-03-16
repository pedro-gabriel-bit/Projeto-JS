//HELPERS

// essa funçao auxilia na seleçao de um elemento da DOM
// (equivalente a document.querySelector()).
function qs(selector, root = document) {
    // root permite limitar a busca dentro de um elemento especifico
    return root.querySelector(selector);
}

// funçao auxiliar que permite a seleçao de varios elementos 
// querySelectorAll = retorna a lista
// Array.from = transforma em array
function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}

// <--------------------| MEU HAMBURGUER |-------------------->

// selecionando o botao do menu (abre/fecha)
const menuBtn = qs("#menuBtn");

// seleciona o container do menu
const menu = qs("#menu");

// selecionando todas as navlinks dentro do menu
const navlinks = qsa(".nav__link");

// funçao responsavel por abrir ou fechar o menu
function setMenuOpen(isOpen) {

    // adiciona e remove a classe 'ls-open'
    menu.classList.toggle("ls-open", isOpen);

    // informa se o menu esta expandido
    menuBtn.setAttribute("aria-expanded", String(isOpen));

    // atualiza o texto acessivel do botao do menu
    menuBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

// adicionando o evento de click no botao do menu
menuBtn.addEventListener("click", () => {

    // verifica se o menu esta aberto ou fechado
    const isOpen = menu.classList.contains("ls-open");

    // chama a funçao para abrir ou fechar o menu
    setMenuOpen(!isOpen);
});

navlinks.forEach(link => {
    link.addEventListener("click", () => setMenuOpen(false));
});

// <--------------------| MOSTRAR/OCULTAR DETALHES |-------------------->

// controla a visibilidade
const toggleinfoBtn = qs("#toggleInfoBtn");

// area de detalhes que sera exibida e ocultada
const infoBox = qs("#infoBox");

function setinfoOpen(isOpen) {
    // hidden = true (oculta)
    // hidden = false (exibe) 
    infoBox.hidden = !isOpen;

    // altera o atributo de acessibilidade do botao
    toggleinfoBtn.setAttribute("aria-expanded", String(isOpen));

    // atualiza o texto do botao
    toggleinfoBtn.textContent = isOpen ? "Ocultar detalhes" : "Mostrar detalhes";
}

// evento de click para mostrar ou ocultar os detalhes
toggleinfoBtn.addEventListener("click", () => {
    // se estava oculto, passa a ser exibido, e vice versa
    setinfoOpen(infoBox.hidden);
});

// <--------------------| TROCAR DE TEXTO |-------------------->

const changeTextBtn = qs("#changeTextBtn");
const changeTextTarget = qs("#changeTextTarget");

let change = false;

changeTextBtn.addEventListener("click", () => {

    // inverte o valor da propria variavel
    change = !change;

    // se for verdadeiro, a primeira opcao e chamada
    // se for false, a segunda opcao e chamada
    changeTextTarget.textContent = change ? "Texto alterado via JavaScript" : "Texto original do card.";
});

// <--------------------| AREA EM DESTAQUE COM CLICK |-------------------->

// botao que ativa a area de destaque
const highlightBtn = qs("#highlightBtn");

// elemento que recebera o destaque
const highlightBox = qs("#highlightBox");

// evento de click
highlightBtn.addEventListener("click", () => {

    // altera a classe CSS
    const isHighlighted = highlightBox.classList.toggle("is-highlighted");

    // atualiza o atributo de acessibilidade
    highlightBtn.setAttribute("aria-pressed", String(isHighlighted));
});

// <--------------------| MODAL |-------------------->

// botoes e elementos do modal
const openModalBtn = qs("#openModalBtn");
const modalOverlay = qs("#modalOverlay");
const modal = qs("#modal");
const closeModalBtn = qs("#closeModalBtn");
const confirmBtn = qs("#confirmBtn");
const cancelBtn = qs("#cancelBtn");

// guardar o elemento que estava em foco
let lastFocusedElement = null;

// funçao para encontrar elementos focaveis
function getFocusableElements(container) {
    const selectors = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
    ];

    // filtro corrigido: !el.hidden para retornar elementos visiveis
    return qsa(selectors.join(","), container).filter((el) => !el.hidden);
}

// funçao para abrir o modal
function openModal() {

    // salvar o elemento que tinha foco antes de abrir o modal
    lastFocusedElement = document.activeElement;

    // mostrar o overlay (fundo escuro atras do modal)
    // hidden = false torna o elemento visivel
    modalOverlay.hidden = false;

    // move o foco do teclado para o modal
    // isso garante que o foco esteja dentro do modal para navegaçao com o tab
    modal.focus();

    // adiciona um listener global para o evento "keydown"
    // este listener vai "prender" o foco dentro do modal
    // quando usuario aperta o tab, o foco nao sai do modal
    document.addEventListener("keydown", trapFocusHandler);
}

function closeModal() {

    // esconder o overlay (fundo escuro atras do modal)
    // hidden = true torna o elemento invisivel
    modalOverlay.hidden = true;

    // remove o evento global do "keydown" 
    // para que o focus trapping pare de funcionar quando o modal esta fechado
    document.removeEventListener("keydown", trapFocusHandler);

    // retorna o foco para o elemento que estava focado antes de abrir o modal
    // verificando se ainda tem o metodo focus()
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    }
}

// funçao para prender o foco dentro do modal (focus trapping)
// impede que o foco saia do modal quando o usuario navega com o tab
// o parametro "e" e um objeto dentro do evento de keydown
function trapFocusHandler(e) {

    // se o usuario apertar a tecla "ESC", fecha o modal imediatamente
    if (e.key === "Escape") {
        closeModal();
        return;
    }

    // so nos interessamos pela tecla tab (para navegaçao)
    // ignora outras teclas para nao interferir com a navegaçao normal
    if (e.key !== "Tab") return;

    // obtem a lista de elementos focaveis dentro do modal
    const focusableElements = getFocusableElements(modal);

    // se nao houver elementos focaveis, nao faz nada
    if (focusableElements.length === 0) return;

    // identifica o primeiro e o ultimo elemento focaveis 
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    // se estiver no primeiro elemento e pressionar shift + Tab (navegaçao reversa)
    // move o foco para o ultimo elemento
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); // impede comportamento padrao
        last.focus(); // move para o ultimo elemento
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); // impede comportamento padrao
        first.focus(); // move o foco para o primeiro elemento
    }
}

// evento de clicar o botao para abrir o modal
openModalBtn.addEventListener("click", openModal);

// evento de ao clicar no botao fecha o modal
closeModalBtn.addEventListener("click", closeModal);

// evento de ao clicar no cancelar dentro do modal, ele fecha o modal
cancelBtn.addEventListener("click", closeModal);

// evento de clique no botao confirma dentro do modal
// mostra o alerta de confirmaçao e depois fecha o modal
confirmBtn.addEventListener("click", () => {
    alert("Confirmado! (exemplo de açao do modal)");
    closeModal();
});

// evento de clique no Overlay (fundo escuro atras do modal)
// permite fechar o modal clicando fora dele
modalOverlay.addEventListener("click", (e) => {
    // verifica se o clique foi exatamente no overlay e nao em elementos internos
    // e.target e o elemento clicado
    // se for igual a modalOverlay, ele fecha o modal
    if (e.target === modalOverlay) closeModal();
});

// <--------------------| TAB |-------------------->

// selecionar o container das tabs usando o atributo data-tabs
// permitir identificar sem depender de classes especificas
// ex: <div class="tabs" data-tabs>...</div>
const tabsRoot = qs("[data-tabs]");

// so executa se o container existir (evitar erros caso removam do html)
if (tabsRoot) {

    // seleciona todos os botoes de tab (pelo role="tab" para acessibilidade)
    const tabs = qsa("[role='tab']", tabsRoot);

    // seleciona todos os paineis de conteudo (role="tabpanel")
    const panels = qsa("[role='tabpanel']", tabsRoot);

    // funçao principal: ativa uma aba especifica e desativa as outras
    // parametro 'tabToActivate': elemento button da aba a ser ativada
    function activateTab(tabToActivate) {
        tabs.forEach((tab) => {

            // verifica se este botao e o que queremos ativar
            const isActive = tab === tabToActivate;

            // muda a classe css para destacar visualmente a aba ativa
            tab.classList.toggle("is-active", isActive);

            // atributo ARIA para acessibilidade: indica qual aba esta selecionada
            // aria-selected = "true" na aba ativa, "false" nas outras
            tab.setAttribute("aria-selected", String(isActive));
        });

        panels.forEach((panel) => {
            // cada aba aponta para o seu painel via atributo aria-controls
            // ex: aria-controls="panel-2" significa que controla o elemento com id="panel-2"
            const idDoPainel = tabToActivate.getAttribute("aria-controls");

            // mostrar apenas o painel cujo ID corresponde ao aria-controls da aba ativa
            // hidden=true esconde, hidden=false mostra
            panel.hidden = panel.id !== idDoPainel;
        });
    }

    // adiciona o evento de clique em cada aba
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            activateTab(tab);
        });
    });

    tabsRoot.addEventListener("keydown", (e) => {
        // ignora se nao forem setas
        if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;

        // encontrando o indice da aba ativa
        const activeIndex = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");

        const direction = e.key === "ArrowRight" ? 1 : -1;

        // calcula o proximo indice
        let nextIndex = activeIndex + direction;

        // se passar do inicio, volta para a ultima aba
        if (nextIndex < 0) nextIndex = tabs.length - 1;

        // se passar do final, volta para a primeira aba
        if (nextIndex >= tabs.length) nextIndex = 0;

        // move o foco do teclado para a proxima aba
        tabs[nextIndex].focus();

        // ativa a proxima aba (e troca o painel)
        activateTab(tabs[nextIndex]);
    });
}

// <--------------------| CARROSSEL |-------------------->

// seleciona o container do carrossel usando o atributo data-carousel
const carouselRoot = qs("[data-carousel]");

// se existir o carrossel
if (carouselRoot) {

    const slides = qsa(".slide", carouselRoot);
    const prevBtn = qs("[data-prev]", carouselRoot);
    const nextBtn = qs("[data-next]", carouselRoot);
    const dots = qsa("[data-dot]", carouselRoot);
    const currentEl = qs("[data-current]", carouselRoot);
    const totalEl = qs("[data-total]", carouselRoot);

    let index = 0;

    totalEl.textContent = String(slides.length);

    // funçao para renderizar o carrossel
    function renderCarousel() {

        // mostra apenas o slide do indice, escondendo os outros
        slides.forEach((slide, i) => {
            // sera true apenas para o slide ativo
            const isActive = i === index;

            // serve para esconder e mostrar os slides
            slide.hidden = !isActive;

            // classe CSS para destacar o slide ativo
            slide.classList.toggle("is-active", isActive);
        });

        // atualizar as bolinhas do carrossel
        dots.forEach((dot, i) => {

            // ativa apenas a bolinha do slide atual
            const isActive = i === index;

            // classe do CSS para mostrar a bolinha ativa
            dot.classList.toggle("is-active", isActive);

            // acessibilidade
            dot.setAttribute("aria-pressed", String(isActive));
        });

        // atualizando o contador de slides
        currentEl.textContent = String(index + 1);
    }

    // funçao para exibir o proximo slide
    function next() {
        // soma 1 e utiliza o modulo (%) para voltar ao 0
        index = (index + 1) % slides.length;
        renderCarousel();
    }

    function prev() {
        index = (index - 1 + slides.length) % slides.length;
        renderCarousel();
    }

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    // clique nas bolinhas do carrossel
    dots.forEach((dot) => {
        dot.addEventListener("click", () => {

            const target = Number(dot.getAttribute("data-dot"));

            if (!Number.isNaN(target)) {
                index = target;
                renderCarousel();
            }
        });
    });

    // render inicial: garante que so 1 slide apareça ao carregar
    renderCarousel();
}

// <--------------------| REQUISICAO + RENDERIZACAO |-------------------->

const loadUsersBtn = qs("#loadUsersBtn");
const clearUsersBtn = qs("#clearUsersBtn");
const apiStatus = qs("#apiStatus");
const usersList = qs("#usersList");

function clearUsersUI() {
    usersList.innerHTML = "";
    apiStatus.textContent = "";
}

function renderUsers(users) {
    usersList.innerHTML = "";
    // para cada usuario, cria um <li> e coloca na lista
    users.forEach((user) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${user.name}</strong><br>
            <span class="muted">${user.email}</span>
        `;

        usersList.appendChild(li);
    });
}

async function loadUsers() {
    try {
        // resposta rapida pro usuario
        apiStatus.textContent = "Carregando usuários...";
        loadUsersBtn.disabled = true;

        // requisiçao de api
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
            throw new Error("Erro na requisiçao: " + response.status);
        }

        // conversao para JSON (array de usuarios)
        const users = await response.json();

        // renderiza na tela
        renderUsers(users);

        // mensagem final
        apiStatus.textContent = `Carregado com sucesso: ${users.length} usuários`;

    } catch (error) {
        apiStatus.textContent = "Falha ao carregar os usuários. Tente novamente.";
        console.error(error);
    } finally {
        // reabilitar o botao
        loadUsersBtn.disabled = false;
    }
}

loadUsersBtn.addEventListener("click", loadUsers);
clearUsersBtn.addEventListener("click", clearUsersUI);

// <--------------------| VOLTAR AO TOPO |-------------------->

const backToTopBtn = qs("#backToTopBtn");

// ao clicar faz a rolagem da pagina ate o topo
backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0, // posiçao do topo da pagina
        behavior: "smooth" // animaçao suave
    });
});