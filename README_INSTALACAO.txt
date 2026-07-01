# Checklist FV SENAI HUB com Google Sheets

Este pacote contém a versão do aplicativo HTML/PWA integrada com Google Sheets.

## Arquivos principais

- `index.html`: aplicativo do professor com checklist e envio para Google Sheets.
- `Code.gs`: código do Google Apps Script que recebe os dados e grava na planilha.
- `modelo_google_sheets_checklist_fv_senaihub.xlsx`: modelo de planilha com abas e cabeçalhos.

## Como configurar

### 1. Criar a planilha

Opção A — mais rápida:
1. Abra o arquivo `modelo_google_sheets_checklist_fv_senaihub.xlsx`.
2. Envie para o Google Drive.
3. Abra com Google Sheets.

Opção B — manual:
1. Acesse Google Sheets.
2. Crie uma planilha nova chamada `Checklist FV SENAI HUB`.
3. Não precisa criar as abas manualmente; o Apps Script fará isso.

### 2. Colar o Apps Script

1. Na planilha, vá em `Extensões > Apps Script`.
2. Apague qualquer código padrão.
3. Cole todo o conteúdo do arquivo `Code.gs`.
4. Salve o projeto.

### 3. Configurar as abas

1. No Apps Script, selecione a função `setupPlanilha`.
2. Clique em `Executar`.
3. Autorize as permissões solicitadas.
4. Volte para a planilha e confira se as abas foram criadas:
   - Dashboard_Coordenacao
   - Registros_Praticas
   - Professores
   - Turmas
   - Aulas_Praticas
   - Validacoes_Coordenador
   - Logs

### 4. Publicar como Web App

1. No Apps Script, clique em `Implantar > Nova implantação`.
2. Em tipo, escolha `Aplicativo da Web`.
3. Em `Executar como`, escolha `Eu`.
4. Em `Quem pode acessar`, escolha uma das opções:
   - `Qualquer pessoa com o link`, para teste rápido;
   - `Qualquer pessoa da organização`, se estiver usando conta institucional.
5. Clique em `Implantar`.
6. Copie a URL do Web App.

### 5. Conectar o aplicativo HTML

1. Abra o arquivo `index.html`.
2. Cole a URL do Web App no campo `Integração com Google Sheets`.
3. Clique em `Salvar URL`.
4. Clique em `Testar envio`.
5. Confira a aba `Logs` na planilha.
6. Depois marque uma aula e clique em `Salvar esta aula no Google Sheets`.

## Como o coordenador acompanha

O coordenador pode acompanhar pela própria planilha:

- `Dashboard_Coordenacao`: visão geral.
- `Registros_Praticas`: todos os registros enviados pelos professores.
- `Aulas_Praticas`: lista das aulas previstas.
- `Validacoes_Coordenador`: espaço para validação manual das práticas.

## Observação de segurança

Para uso institucional, prefira publicar o Web App com acesso restrito aos usuários da organização, quando possível.
Para uma versão mais segura e com login individual, a próxima evolução recomendada é Firebase Authentication + Firestore.
