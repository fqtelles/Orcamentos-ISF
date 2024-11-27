# Aplicativo de Orçamentos

Este é um aplicativo de orçamentos desenvolvido com React Native. Ele permite que os usuários selecionem produtos, ajustem quantidades e gerem um orçamento que pode ser exportado como um arquivo PDF.

## Funcionalidades

- Seleção de produtos com caixas de seleção.
- Ajuste de quantidades dos produtos selecionados.
- Geração de orçamento com base nos produtos selecionados e suas quantidades.
- Exportação do orçamento gerado como um arquivo PDF.

## Pré-requisitos

Certifique-se de ter o ambiente de desenvolvimento React Native configurado. Siga as instruções de configuração no [site oficial do React Native](https://reactnative.dev/docs/environment-setup).

## Instalação

1. Clone este repositório:
    ```sh
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_REPOSITORIO>
    ```

2. Instale as dependências:
    ```sh npm install -g react-native-cli
    npx react-native init NomeDoProjeto
    cd NomeDoProjeto
    npm install @react-navigation/native @react-navigation/native-stack
    npm install react-native-screens react-native-safe-area-context
    npm install @react-native-community/checkbox
    npm install react-native-html-to-pdf
    npx react-native link
    ```

## Executando o Aplicativo

### Iniciar o Metro Bundler

Primeiro, você precisará iniciar o **Metro**, o _bundler_ JavaScript que acompanha o React Native.

Para iniciar o Metro, execute o seguinte comando a partir do diretório raiz do seu projeto React Native:

```sh
# usando npm
npm start

# OU usando Yarn
yarn start
```

## Estrutura do Projeto
- App.tsx: Componente principal do aplicativo.
- ProductCheckboxes: Componente para seleção de produtos e ajuste de quantidades.
- BudgetButton: Componente para gerar o orçamento.
- BudgetScreen: Tela que exibe o orçamento gerado.
- ExportButton: Componente para exportar o orçamento como PDF.
- styles: Estilos utilizados no aplicativo.

