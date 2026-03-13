//HELPERS

// essa funçao auxilia na seleçao de um elemento da DOM
// (equivalente a document.querySelector()).
function qs(selector, root = document) {
  // root permite limitar a busca demtro de um elemento especifico
  return root.querySelector(selector);
}

// funçao auxiçiar que permite a seleçao de varios elementos 
// queryselectorAll = retornar a lista
// array.from = trasforme em lista
function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

// <--------------------| MEU HAMBURGUER |-------------------->

// selecionando o botao do menu (abre/fecha)
const menuBtn = qs("#menuBtn");

// seleciona o conteiner do menu
const menu = qs("#menu");

//selecionando todas as navlinks dentro do menu
const navlinks = qsa(".nav__link");

// funçao responsavel por abrir ou fechar o menu
function setMenuOpen(isOpen) {

  // adiciona e remove a classe 'ls-open
  menu.classList.toggle("ls-open", isOpen);

  //inicia o menu espandido
  menuBtn.setAttribute("aria-expanded", String(isOpen));

  // atualiza o texto acessivel do botao do menu
  menuBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
};

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

//<--------------------| MOSTRAR/OCULTAR DETALHES DO |-------------------->

//controle a visibiçidade
const toggleinfoBtn = qs("#toggleInfoBtn");

// area de detalhes que sera exibida e ocultada
const infoBox = qs("#infoBox");

function setinfoOpen(isOpen) {
  //hidden = true (oculta)
  //hidden = false (exibe) 
  infoBox.hidden = !isOpen;

  // altera o atributo de acessibilidade do botao
  toggleinfoBtn.setAttribute("aria-expanded", String(isOpen));

  // atualiza o texto do botao
  toggleinfoBtn.textContent = isOpen ? "Ocultar detalhes" : "Mostrar detalhes";
};
// evento de click para mostrar ou ocultar os detalhes
toggleinfoBtn.addEventListener("click", () => {
  // se estava ouculto, passa a ser exibido, e vice versa
  setinfoOpen(infoBox.hidden);
});

// <-------------------| TROCAR DE TEXTO |------------------->

const changeTextBtn = qs("#changeTextBtn");
const changeTextTarget = qs("#changeTextTarget");


let change = false;

changeTextBtn.addEventListener("click", () => {

  // inverte o valor da propria variavel
  change = !change;

  // se for verdadeiro, a primeira opcao e chamada
  // se for false, a segunda opcao e chamada
  changeTextTarget.textContent = change ? "texto alterado via JavaScript" : "texto original do card";

});

// <-------------------| AREA EM DESTAQUE COM CLICK |------------------->

// botao que ativa a area de destaque
const highlightBtn = qs("#highlightBtn");

// elemento que recbera o destaque
const highlightBox = qs("#highlightBox");

// evento de click
highlightBtn.addEventListener("click", () => {
  // altera a classe CSS
  const isHighlighted = highlightBox.classList.toggle("is-highlighted");
  // atualiza o atributo de acessibilidade
  highlightBtn.setAttribute("aria-pressed", String(isHighlighted));
});

// <-------------------| MODAL |------------------->

// botoes e elementos do modal
const openModalBtn = qs("#openModalBtn");
const modalOverlay = qs("#modalOverlay");
const modal = qs("#modal");
const closeModalBtn = qs("#closeModalBtn");
const confirmBtn = qs("#confirmBtn");
const cancelBtn = qs("#cancelBtn");

// gurdar o elemento que estava em foco
let lastFocusedElement = null;

// funçao para encontrar elementos focaveis
function getFocusableElements(container) {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ];

  return qsa(selectors.join(","), container).filter((el) => el.hidden)
}
// funçao para abrir o modal
function openModal() {

  // salvar o elemento tinha foco antes de abrir o modal
  // estamos guradndo na variavel o elemento que esta focado no momento
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
  document.addEventListener("keydown", trapFocushandler);
}
function closeModal() {

  // esconder o overlay (fundo escuro atras do modal)
  // hidden = true torna o elemento invisivel
  modalOverlay.hidden = true;

  // remove o evento global do "keydown" 
  // para que o focus trapping para de funcionar quando o modal esta fechado
  document.removeEventListener("keydown", trapFocushandler);

  // retorna o foco para o elemento que estava focado antes de abrir o modal
  // verificando se existe ainda tem o metodo focus()
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}
// funçao para prender o foco dentro do modal (focus trapping)
// impede que o foco saia do modal quando o usuario navega com o tab
// o paramentro "e" e um objeto dentro do evento de keydown
function trapFocushandler(e) {

  // se o usuario apertar a tecla "ESC", fecha o modal imediatamente
  if (e.key === "Escape") {
    closeModal();
    return;
  }

  // so nos interessamos pela tecla tab (para navegaçao)
  // ignora outras teclas para nao interferir com a navegaçao normal
  if (e.key === "Tab") return;

  // obtem a lista de elementos focaveis dentro do modal
  const focusableElements = getFocusableElements(modal);

  // se nao houver elementos focaveis, nao faz nada
  if (focusableElements.length === 0) return;

  // identifica o primeiro e o ultimo elemento focaveis 
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  // se esriver no priemiro elemento e precionar shift + Tab (navegaçao reversa)
  // move o focos para o ultimo elemento
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); // impede comportamento padrao
    last.focus(); // move para o ultimo elemento
  } else if (e.shiftKey && document.activeElement === last) {
    e.preventDefault(); // impede comportamento padrao
    first.focus(); // mover o focus para o primeiro elemento
  }

  // caso o contrario, permit navegar normal entre os elementos focaveis

}

//Eventos do modal
// tem um evento de clicar o botao para abrir o modal
openModalBtn.addEventListener("click", openModal);

// tem o evento de ao clicar no botao fecha o modla
closeModalBtn.addEventListener("click", closeModal);

//tem o evento de ao clicar no X (fechar) dentro do modal, ele fecha o modal
cancelBtn.addEventListener("click", closeModal);

//evento de clique no boatao confiirma dentro do modal
// mostra o alerta de confirmaçao e depois fecha o modal
confirmBtn.addEventListener("click", () => {
  alert("confirmando ! (exemplo de açao do modla)");
  closeModal();
});


//evento de clique no Overlay (fundo escuro atras do modal)
// permite fechar o modal clicando fora dele
modalOverlay.addEventListener("click", (e) => {
  // verifica se o clique foi exetamente no overlay e nao em elementos
  // e.target e o elemento clicado
  // se for igual modalOverlay, ele fecha o modal
  if (e.target === modalOverlay) closeModal();
});

// <-------------------| TAB |------------------->

// selecionar o contrainer das tbas uando o atributo data-tabs
// permitir indentificar sem depender de classes especificas
// ex: <div class = "tabs" data - tabs....<div>
const tabsRoot = qs("[data-tabs]")

// so executa se o container existir ( evitar erros de removeram do html)
if (tabsRoot) {

  // seleciona todos os botoes de tab ( pelo roles = "tab" para acessibilidade)
  const tabs = qsa("[role='tabs']", tabsRoot);

  // sleciona todos os paineis de conteudo (role="tabpanel")
  const panels = qsa("[role='tabpanel']", tabsRoot)

  // funçao prncipal : ativa uma aba especifica e dasativa as outras
  //parametro 'tabToActivate' : elemento button da aba a ser ativadaa
  function activeteTab(tabToActivate) {
    tabs.forEach((tab) => {

      // verifica se este botao e o queremos ativar
      const isActive = tab === tabToActivate;

      // muda a classe css para destacar visualmente a aba active 
      tab.classList.toggle("is-active", isActive);

      // atribute ARIA para acessibilidade: indice qual aba esta selecionada
      // aria-selected = "true" na aba ativa, "false" nas outras
      tab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) =>{
      //cada aba aponta para o seu painel via atributo aria-contols
      // ex: aria-controls = "panel-2" significa que controla o elemento co o id = "panel-2"
      const idDoPainel = tabToActivate.getAttribute("aria-controls");
      
      //mostrar apenas o painel cujo o ID correspondente ao aria-conrole da aba ativa
      // hidden-true esconde, hidden - false mostra
      panel.hidden = panel.id != idDoPainel;
    });

  }

  // adiciona o evento de clique em casa aba
  tabs.forEach((tab) => {
    tab,addEventListener("click", () =>{
      activeteTab(tab);
    });

  });

  tabsRoot.addEventListener("keydown", (e) => {
    // ignora se nao setas
    if (!["ArromLeft", "ArrowRight"].includes(e.key)) return

    //encontrando o indice da aba ativa
    const activeIndex = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
  })
}

// <-------------------| CARROSSEL |------------------->

// <-------------------| REQUISICAO + RENDERIZACAO |------------------->

// <-------------------| VOLTAR AO TOPO |------------------->

const backToTopBtn = qs("#backToTopBtn");

// ao clicar faz a escrolagem da pagina ate o topo
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0, //posiçao do topo da pagina
    behavior: "smooth"// animaçao suave
  });
});