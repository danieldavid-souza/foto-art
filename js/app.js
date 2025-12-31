// === BLOCO 1: DADOS, CONFIGURAÇÕES E BANCO DE DADOS ===
const versiculosAutomaticos = [
    { v: "O Senhor é o meu pastor, nada me faltará.", r: "Salmos 23:1", m: "Confie na provisão e no cuidado de Deus para o seu dia." },
    { v: "Tudo posso naquele que me fortalece.", r: "Filipenses 4:13", m: "Sua força vem do alto, não desista dos seus objetivos." },
    { v: "Mil cairão ao teu lado, e dez mil à tua direita, mas tu não serás atingido.", r: "Salmos 91:7", m: "A proteção divina está sobre você e sua família." },
    { v: "Entregue o seu caminho ao Senhor; confie nele, e ele o fará.", r: "Salmos 37:5", m: "Deixe Deus guiar seus passos e acalmar seu coração." },
    { v: "A alegria do Senhor é a vossa força.", r: "Neemias 8:10", m: "Sorria! Deus cuida de cada detalhe da sua vida." },
    { v: "Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor.", r: "Jeremias 29:11", m: "O futuro que Deus tem preparado é de paz e esperança." },
    { v: "Se Deus é por nós, quem será contra nós?", r: "Romanos 8:31", m: "Você tem o maior aliado do universo ao seu lado." },
    { v: "Elevo os meus olhos para os montes; de onde me vem o socorro? O meu socorro vem do Senhor.", r: "Salmos 121:1-2", m: "Nos momentos difíceis, olhe para o alto." },
    { v: "Espera no Senhor, anima-te, e ele fortalecerá o teu coração.", r: "Salmos 27:14", m: "A paciência traz bênçãos que a pressa destrói." },
    { v: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", r: "Mateus 11:28", m: "Encontre descanso nos braços do Pai hoje." }
];

let defaultFaq = [{q: "Como recebo?", a: "Envio por e-mail."},{"q": "Formato?","a": "CDR e PNG."}];

let configPadrao = { 
    nomeEmpresa:"Foto ART Personalizados", zap:"553299199657472", pixKey:"", pixName:"", 
    colorPri:"#f97316", colorAcc:"#312e81", colorBg:"#f8fafc", banners:[], logo:"imagens/logo/Foto-ART-Logo.png", 
    heroTitle: "Catálogo", heroSub: "Bem-vindo.", faq: defaultFaq, plans: {}, 
    social: { instagram: "", facebook: "", tiktok: "", whatsappGroup: "" },
    cartStyle: { color: "#1e293b", opacity: 60, textColor: "#ffffff" },
    iaPrompt: "Você é um assistente de busca inteligente...",
    grupoOrdem: "CANECA, AZULEJO, CAMISETA, LANCAMENTO, GERAL" 
};

let dbState = { produtos: [], vendas: [], config: JSON.parse(JSON.stringify(configPadrao)), categorias: [] };

// Helper Profissional
window.formatMoney = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
window.debounce = (func, wait) => { let timeout; return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); }; };
window.debouncedFiltrar = window.debounce(() => window.filtrarGeral(), 300);

let imgsTemp=[], newBannerTemp="", logoTemp="", currentProduto=null, currentImgIndex=0, categoriaAtual='lancamentos', touchStartX=0, touchEndX=0, adminClickCount = 0, adminClickTimer = null;

// Estado da Seleção Múltipla
let isSelectionMode = false;
let shareSelectedIds = new Set();
let currentSelectionCategory = '';

// Detecção de Parâmetros de URL (Modo Vitrine)
const urlParams = new URLSearchParams(window.location.search);
const isVitrineMode = urlParams.get('mode') === 'vitrine';
const vitrineId = urlParams.get('id');
const vitrineCat = urlParams.get('categoria');
const vitrineIdsParam = urlParams.get('ids'); 

// Mapas de Busca e IA
const searchMap = { 'ANIVERSARIO': 'ANIVERSARIO', 'FESTA': 'ANIVERSARIO', 'NOVO': 'LANCAMENTO', 'LANCAMENTO': 'LANCAMENTO', 'FLAMENGO': 'FUTEBOL', 'CORINTHIANS': 'FUTEBOL', 'CRISTO': 'RELIGIOSO', 'DEUS': 'RELIGIOSO', 'DIAS': 'DIAS DAS MAES', 'MAES': 'DIAS DAS MAES', 'PASCOA': 'PASCOA', 'STITCH': 'STITCH' };
const stopWordsExpanded = new Set(['A', 'O', 'AS', 'OS', 'UM', 'UMA', 'DE', 'DO', 'DA', 'EM', 'NO', 'NA', 'PARA', 'COM', 'QUE', 'SE', 'COMO', 'EU', 'VOCE', 'QUERO', 'GOSTARIA', 'TEM', 'PRECISO', 'OLHA', 'VER']);
const sinonimosMap = { 'HOMEN': 'HOMEM', 'HOMEM-ARANHA': 'ARANHA', 'MIRANHA': 'ARANHA', 'NIVER': 'ANIVERSARIO', 'BDAY': 'ANIVERSARIO', 'PARABENS': 'ANIVERSARIO', 'CANACAO': 'CANECA', 'XICARA': 'CANECA', 'CAMISA': 'CAMISETA', 'BLUSA': 'CAMISETA', 'ZAP': 'WHATSAPP', 'FALAR': 'WHATSAPP', 'PRECO': 'VALOR', 'CUSTA': 'VALOR', 'MMAE': 'DIAS DAS MAES', 'MAE': 'DIAS DAS MAES', 'MAMAE': 'DIAS DAS MAES', 'PAI': 'DIAS DOS PAIS', 'PAPAI': 'DIAS DOS PAIS', 'AMOR': 'NAMORADOS', 'CASAL': 'NAMORADOS', 'NOEL': 'NATAL', 'FIM DE ANO': 'NATAL', 'NOVIDADE': 'LANCAMENTO', 'NOVO': 'LANCAMENTO' };
const associacoesMap = { 'FLAMENGO': 'FUTEBOL', 'VASCO': 'FUTEBOL', 'CORINTHIANS': 'FUTEBOL', 'PALMEIRAS': 'FUTEBOL', 'GREMIO': 'FUTEBOL', 'INTER': 'FUTEBOL', 'SAO PAULO': 'FUTEBOL', 'SANTOS': 'FUTEBOL', 'BOTAFOGO': 'FUTEBOL', 'FLUMINENSE': 'FUTEBOL', 'CRUZEIRO': 'FUTEBOL', 'ATLETICO': 'FUTEBOL', 'BOLA': 'FUTEBOL', 'JOGO': 'FUTEBOL', 'TIME': 'FUTEBOL', 'ARANHA': 'INFANTIL', 'HEROI': 'INFANTIL', 'VINGADORES': 'INFANTIL', 'MARVEL': 'INFANTIL', 'DC': 'INFANTIL', 'BATMAN': 'INFANTIL', 'SUPER': 'INFANTIL', 'HULK': 'INFANTIL', 'PRINCESA': 'INFANTIL', 'DISNEY': 'INFANTIL', 'MICKEY': 'INFANTIL', 'MINNIE': 'INFANTIL', 'DESENHO': 'INFANTIL', 'CRIANCA': 'INFANTIL', 'BABY': 'INFANTIL', 'PATRULHA': 'INFANTIL', 'JESUS': 'RELIGIOSO', 'DEUS': 'RELIGIOSO', 'GOSPEL': 'RELIGIOSO', 'CRISTAO': 'RELIGIOSO', 'COELHO': 'PASCOA', 'CHOCOLATE': 'PASCOA', 'OVO': 'PASCOA', 'IRMAO': 'FAMILIA', 'TIA': 'FAMILIA', 'TIO': 'FAMILIA', 'AVO': 'FAMILIA' };
const chatResponses = { 'OI': 'Olá! Tudo bem? Como posso te ajudar a encontrar a arte perfeita hoje?', 'OLA': 'Opa! Seja bem-vindo(a). O que você procura?', 'BOM DIA': 'Bom dia! Vamos criar algo incrível hoje? O que você precisa?', 'BOA TARDE': 'Boa tarde! Em que posso ajudar?', 'BOA NOITE': 'Boa noite! Procurando algum tema específico?', 'OBRIGADO': 'Imagina! Estou aqui para isso. 👊', 'VALEU': 'Tamo junto! Se precisar de mais algo, só chamar.' };

const idb={db:null,init(){return new Promise((r,j)=>{const q=indexedDB.open("FotoART_DB",1);q.onupgradeneeded=e=>{e.target.result.createObjectStore("store_data")};q.onsuccess=e=>{this.db=e.target.result;r(this.db)};q.onerror=e=>{console.error("Erro IDB",e);j(e)}})},async get(k){if(!this.db)await this.init();return new Promise((r,j)=>{const t=this.db.transaction("store_data","readonly").objectStore("store_data").get(k);t.onsuccess=()=>r(t.result);t.onerror=()=>j(t.error)})},async put(k,v){if(!this.db)await this.init();return new Promise((r,j)=>{const t=this.db.transaction("store_data","readwrite").objectStore("store_data").put(v,k);t.onsuccess=()=>r(!0);t.onerror=()=>j(t.error)})}};

// === BLOCO 2: INICIALIZAÇÃO E MODO VITRINE ===
document.addEventListener('alpine:init', () => { Alpine.store('config', dbState.config); });
const lazyObserver = new IntersectionObserver((entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { const img = entry.target; if (img.dataset.src) { img.src = img.dataset.src; img.onload = () => { img.classList.remove('lazy-blur'); img.classList.remove('img-placeholder-spin'); }; observer.unobserve(img); } } }); }, { rootMargin: '200px 0px', threshold: 0.01 });

document.addEventListener('DOMContentLoaded', async () => {
    // MODIFICAÇÃO: Carregar dados da variável global em vez do script tag
    if (window.INITIAL_DB_DATA) {
        dbState = JSON.parse(JSON.stringify(window.INITIAL_DB_DATA));
    }
    
    let dataFromDB = {};
    try {
        dataFromDB = await idb.get("main_data") || {};
    } catch (e) {
        console.error("Erro ao carregar do IndexedDB", e);
    }

    // Lógica de merge robusta
    const produtosIniciais = dbState.produtos || [];
    const categoriasIniciais = dbState.categorias || [];
    const finalConfig = { ...configPadrao, ...(dbState.config || {}), ...(dataFromDB.config || {}) };
    dbState.produtos = (dataFromDB.produtos && dataFromDB.produtos.length > 0) ? dataFromDB.produtos : produtosIniciais;
    
    // Lógica de Merge para Categorias: Junta as categorias do arquivo com as salvas no navegador.
    const categoriasDB = (dataFromDB.categorias && dataFromDB.categorias.length > 0) ? dataFromDB.categorias : [];
    const mergedCatsMap = new Map();
    [...categoriasIniciais, ...categoriasDB].forEach(cat => {
        const catObj = typeof cat === 'string' ? { nome: cat, isDate: false } : cat;
        if (catObj && catObj.nome && !mergedCatsMap.has(catObj.nome)) {
            mergedCatsMap.set(catObj.nome, catObj);
        }
    });
    dbState.categorias = Array.from(mergedCatsMap.values());

    dbState.config = finalConfig;

    window.limparDadosFantasmas();
    if(!dbState.categorias) dbState.categorias = [];
    if (dbState.categorias.length > 0 && typeof dbState.categorias[0] === 'string') { dbState.categorias = dbState.categorias.map(nome => ({ nome, isDate: false })); }
    
    // Lógica Modo Vitrine
    if (isVitrineMode) {
        let cssToHide = "header, footer, .category-menu, .search-wrapper, .floating-actions-container, #store-banner";
        if (!vitrineCat) cssToHide += ", #products-container"; 

        const style = document.createElement('style');
        style.innerHTML = `${cssToHide} { display: none !important; } .modal-overlay#modal-details { display: flex !important; opacity: 1 !important; background: #ffffff !important; } .modal-content { max-width: 100% !important; height: 100vh !important; border-radius: 0 !important; border: none !important; background: #ffffff !important; flex-direction: column !important; box-shadow: none !important; } .modal-media { height: 60vh !important; width: 100% !important; background: #f8fafc !important; position: relative; } .carousel-img { object-fit: contain !important; mix-blend-mode: multiply; } .modal-info { height: 40vh !important; width: 100% !important; padding: 20px !important; justify-content: center !important; display: flex !important; flex-direction: column !important; background: #ffffff !important; border-top: 1px solid #e2e8f0; } .close-modal { display: none !important; } .carousel-btn { background: rgba(255,255,255,0.9) !important; color: #1e293b !important; box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important; }`;
        document.head.appendChild(style);

        if(vitrineId) {
            setTimeout(() => {
                const produto = dbState.produtos.find(p => p.id == vitrineId);
                if(produto) window.abrirDetalhes(produto.id);
                else document.body.innerHTML = '<div style="display:flex; height:100vh; justify-content:center; align-items:center; background:white; color:#333;"><h2>Pacote não encontrado.</h2></div>';
            }, 500);
        } else if (vitrineCat) {
            const styleFix = document.createElement('style');
            styleFix.innerHTML = `.modal-overlay#modal-details { display: none !important; } .modal-overlay#modal-details.active { display: flex !important; }`;
            document.head.appendChild(styleFix);

            const catNome = decodeURIComponent(vitrineCat);
            categoriaAtual = catNome;
            
            if (vitrineIdsParam) {
                const allowedIds = new Set(vitrineIdsParam.split(',').map(id => parseInt(id)));
                dbState.produtos = dbState.produtos.filter(p => allowedIds.has(p.id));
            }

            document.querySelector('.container').insertAdjacentHTML('afterbegin', `<div style="text-align:center; padding:30px 20px 10px 20px;"><h3 style="color:var(--primary); margin:0;">Tema: ${catNome}</h3><p style="color:var(--text-muted); font-size:0.9rem;">Toque na imagem para ver detalhes.</p></div>`);
        }
    }

    window.aplicarConfiguracoes(); 
    window.determinarCategoriaInicial();
    window.renderCategories(); 
    window.renderStore(); 
    window.setupSwipe(); 
    window.setupScrollListener();
    window.renderAdminPanel();
    Alpine.store('config', dbState.config);
    document.addEventListener('click', (e) => { if (!e.target.closest('.cat-btn') && !e.target.closest('.cat-dropdown-content')) { const drop = document.getElementById('datas-dropdown'); if(drop) drop.classList.remove('show'); } });
    document.getElementById('category-menu').addEventListener('scroll', () => { const drop = document.getElementById('datas-dropdown'); if(drop) drop.classList.remove('show'); });
});

/* ... RESTANTE DO CÓDIGO JAVASCRIPT ORIGINAL (Funções window.renderStore, window.abrirDetalhes, etc) ... */
/* Copie todo o restante do script original para cá */