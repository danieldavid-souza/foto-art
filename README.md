# 📸 Catálogo Digital - Foto ART Personalizados

Bem-vindo à documentação oficial do **Catálogo Foto ART**. Este é um projeto de **Catálogo Digital Estático (Serverless)**, desenvolvido para funcionar inteiramente no navegador do cliente, sem necessidade de banco de dados externo ou backend complexo (Node/PHP).

O sistema utiliza **HTML5, CSS3, JavaScript (Vanilla + Alpine.js)** e **IndexedDB** para persistência de dados local, com um fluxo inteligente de exportação para atualização do site.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (Variáveis CSS, Flexbox, Grid), JavaScript ES6+.
- **Frameworks Leves**: [Alpine.js](https://alpinejs.dev/) (para reatividade simples).
- **Ícones**: FontAwesome 6.
- **Banco de Dados**: IndexedDB (Nativo do navegador) via wrapper customizado.
- **Manipulação de Arquivos**: JSZip (para migração e backup).
- **Hospedagem Recomendada**: Netlify (Static Hosting).

---

## 📂 Estrutura do Projeto

```text
/
├── index.html          # O coração do sistema (Lógica, UI e Dados embutidos)
├── netlify.toml        # Configuração de headers e redirecionamentos para o Netlify
├── README.md           # Documentação do projeto
└── imagens/            # Pasta local de imagens (deve ser enviada no deploy)
    ├── sublimacao/
    ├── personalizados/
    └── ...
```

---

## 🛠️ Como Executar Localmente

1. **Clone ou Baixe** o repositório.
2. Abra o arquivo `index.html` diretamente no seu navegador (Chrome, Edge, Firefox).
3. **Importante**: Para que todas as funcionalidades de imagem e carregamento funcionem perfeitamente sem erros de CORS, recomenda-se usar uma extensão como "Live Server" no VS Code ou rodar um servidor local simples (ex: `python -m http.server`).

---

## 🔐 Painel Administrativo (CMS Embutido)

O sistema possui um CMS completo oculto dentro do próprio site.

### Como Acessar
1. No topo do site (Header), localize o **Logo** ou o nome "Foto ART Personalizados".
2. **Clique 3 vezes rapidamente** sobre o logo/nome.
3. Um modal de senha aparecerá.
4. **Senha Padrão**: `admin123` (Pode ser alterada nas configurações).

### Funcionalidades do Admin

#### 1. Gerenciar Produtos 📦
- **Adicionar/Editar**: Nome, Categoria, Preço, Estoque, Link de Download (Drive), Termos de Busca (para IA).
- **Imagens**: Upload de imagens locais. O sistema converte automaticamente para **Base64** ou mantém caminhos relativos, otimizando-as via Canvas antes de salvar.
- **Estoque**: Se o estoque for definido como `0`, o produto fica automaticamente com visual de "Esgotado" (desfocado e não clicável) na loja.
- **Lançamento**: Marque a opção "É Lançamento?" para destacar o produto no topo.

#### 2. Gerenciar Categorias 🏷️
- Crie categorias normais ou **Datas Comemorativas** (estas ganham destaque especial no menu e filtros).
- Reordene as categorias conforme a prioridade de exibição.

#### 3. Aparência e Configurações 🎨
- **Identidade Visual**: Altere Cores (Primária, Destaque, Fundo), Logo, Títulos e Redes Sociais.
- **Estilo dos Modais**: Configure a cor e transparência do efeito "Glassmorphism".
- **IA Prompt**: Ajuste o comportamento do chat inteligente.

#### 4. Banners e FAQ 🖼️❓
- Adicione banners rotativos no topo da loja.
- Crie perguntas e respostas frequentes para o Chat Inteligente.

---

## 💾 Fluxo de Atualização (Serverless)

Como não há um banco de dados na nuvem, o fluxo de atualização segue a lógica de **"Snapshot"**:

1. **Edite** o site através do Painel Admin no seu navegador.
2. As alterações são salvas no seu **IndexedDB** (localmente).
3. Vá na aba **Backup/Dados** no Admin.
4. Clique em **"Exportar Site Cliente"**.
   - Isso gera um novo arquivo `.html` com todos os seus produtos e configurações **embutidos** no código (`<script id="data-json">`).
5. **Faça o Deploy**: Substitua o `index.html` do seu repositório/Netlify por este novo arquivo gerado.

> **Nota**: Isso garante que o site carregue instantaneamente para o cliente, sem requisições de API lentas.

---

## 🤖 Funcionalidades Inteligentes (IA e Busca)

### Filtro Inteligente (Chat)
O botão "Filtro Inteligente" abre um chat simulado.
- **Busca Semântica**: O sistema analisa o texto digitado, remove "stop words" (de, para, com) e busca por palavras-chave, sinônimos e categorias associadas.
- **Respostas Automáticas**:
  - *Saudações*: "Oi", "Bom dia".
  - *FAQ*: Responde automaticamente perguntas cadastradas no Admin.
  - *Sugestões*: Se não encontrar o produto exato, sugere a categoria mais provável (ex: buscou "Homem Aranha" -> sugere "Infantil").

### Busca Rápida
A barra de pesquisa no topo filtra produtos em tempo real por:
- Nome do Produto
- Categoria
- Termos de Busca (Tags ocultas cadastradas no produto)
- Tipo de Item (Caneca, Azulejo, etc.)

---

## 🛒 Experiência do Cliente

### Modo Vitrine & Compartilhamento
O site funciona como um catálogo. Não há "Carrinho de Compras" tradicional com checkout, o foco é levar o cliente para o WhatsApp.

- **Botão WhatsApp**: Envia uma mensagem pré-formatada com o link do produto específico.
- **Seleção Múltipla**:
  1. O cliente clica em "Escolher" (Modo Seleção).
  2. Seleciona vários itens.
  3. Clica em "Enviar".
  4. O sistema gera um link único contendo os IDs selecionados para enviar ao vendedor.

### Produto Esgotado
- Se `estoque <= 0`:
  - O card do produto fica **desfocado (blur)**.
  - O clique é desabilitado.
  - Uma faixa "ESGOTADO - Fazemos sob encomenda" aparece sobre o produto.

### Palavra do Dia 📖
- Um recurso de engajamento que exibe um versículo bíblico e uma reflexão baseada no dia do ano (1-366).
- Configurável via Admin ou usa um banco de dados padrão de fallback.

---

## ☁️ Backup e Migração

### Backup JSON
- **Baixar Backup**: Gera um arquivo `.json` com todos os dados.
- **Restaurar Backup**: Lê um arquivo `.json` e popula o banco de dados local. Útil para trocar de computador.

### Gerar Versão Servidor (Migração)
- Cria um arquivo `.zip` contendo o HTML atualizado e uma pasta de imagens otimizada.
- Altera o ID interno do banco de dados para evitar conflitos de cache em novas versões grandes.

---

## 📱 Responsividade

O layout é **Mobile-First**, otimizado para toque:
- Menus com scroll horizontal (`snap-scroll`).
- Modais que ocupam a tela inteira em celulares.
- Botões grandes para facilitar o toque.
- Carrossel de imagens com suporte a gestos (swipe).

---

## 🚀 Deploy no Netlify

Este projeto já contém um `netlify.toml` configurado.

1. Crie uma conta no Netlify.
2. Arraste a pasta do projeto (contendo `index.html` e a pasta `imagens`) para a área de deploy.
3. **Pronto!** Seu catálogo está online.

Para atualizar:
1. Faça as alterações no Admin local ou online.
2. Exporte o "Site Cliente".
3. Faça o upload do novo `index.html` no Netlify.

---

## 📝 Exemplo de Estrutura de Dados (JSON)

Os dados são armazenados internamente neste formato:

```json
{
  "produtos": [
    {
      "id": 1766433388001,
      "nome": "Caneca de Natal",
      "categoria": "Sublimação",
      "imgs": ["data:image/jpeg;base64,..."],
      "preco": "35.00",
      "estoque": 10
    }
  ],
  "config": { ... }
}
```