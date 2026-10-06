# BRAPEX — Landing page institucional

Landing page responsiva da Associação Brasileira dos Produtores e Exportadores de Papaya, construída com HTML, CSS e JavaScript puros.

## Estrutura

- `index.html`: página inicial
- `pages/associados.html`: página de associados
- `pages/diretoria.html`: diretoria e conselho fiscal da gestão 2025–2027
- `pages/politica-de-privacidade.html`: política de privacidade
- `pages/termos-de-uso.html`: termos de uso
- `styles/main.css`: estilos compartilhados
- `styles/diretoria.css`: página da diretoria e navegação ampliada
- `styles/legal.css`: apresentação e leitura dos documentos legais
- `scripts/main.js`: interações e filtros
- `assets/images/`: imagens otimizadas em WebP

## Execução local

Abra `index.html` diretamente ou use um servidor local:

```bash
npx serve .
```

A cotação de Mamão - Ceasas é carregada automaticamente pelo widget oficial do Notícias Agrícolas.

## Diretoria: apresentação para avaliação

Os 12 nomes e cargos seguem a relação enviada em `CHAPA NOVA DIRETORIA 25-27.pdf`.
A presidência usa a foto fornecida. Os demais retratos são ilustrações de pessoas
fictícias, identificadas nos cards, e devem ser substituídos pelas fotos oficiais.
As descrições apresentam a atuação dos cargos e aguardam validação; não são
biografias pessoais nem transcrições do estatuto.

Para trocar uma foto, substitua o WebP correspondente em `assets/images/diretoria/`
ou atualize o `src` do card em `pages/diretoria.html`. Remova o selo “Imagem
ilustrativa”, ajuste o texto alternativo e atualize as dimensões da imagem.
Após a aprovação dos textos e a troca de todas as imagens, remova o aviso de avaliação.

O atlas `assets/images/diretoria/retratos-ilustrativos.png` reúne os retratos para
avaliação. A geração usou a ferramenta integrada de imagens, com o briefing:
“Prancha de 12 retratos editoriais ilustrados de profissionais fictícios, em grade
de 4 colunas e 3 linhas, fundo claro em tom de sálvia, roupas sociais em verde e
azul, sem texto, bordas ou marcas; rostos distintos e enquadramento do peito para cima.”
O prompt completo está em `assets/images/diretoria/geracao-retratos.txt`.

## Política de Privacidade e Termos de Uso

As duas páginas possuem links no rodapé de todas as páginas e um índice de seções.
Os textos seguem o conteúdo fornecido em 06/10/2026. O início da política, que
veio cortado na mensagem, foi recuperado do texto da BRAPEX já gerado na aba
aberta de `https://politicaprivacidade.com/`, com a mesma data de vigência.
Para editar o conteúdo, altere as seções em `pages/politica-de-privacidade.html`
e `pages/termos-de-uso.html` e mantenha os links dos respectivos índices.
