# Projeto Compiladores
## Reconhecedor e Compiladores de Requisições HTTP

1. [Sobre](#sobre)
2. [Reconhecedor](#reconhecedor)
3. [Contexto Interno](#contexto-interno)
4. [Exemplos de Entrada](#exemplos)
5. [Uso do Compilador](#uso)
6. [Grupo](#grupo)

## Sobre
Esse repositório contem o codigo fonte do projeto de compiladores para um compilador de requisições HTTP.

O compilador é escrito em Javascript utilizando da biblioteca [Ohm.js](https://ohmjs.org/) para o reconhecimento da [síntaxe](#reconhecedor) própria.

O objetivo desse compilador é gerar as linhas HTTP que constituem uma requisição HTTP válida a partir de codigo de alto nível como entrada.

## Reconhecedor
Esse compilador tem uma síntaxe própria para a declaração e manipulação de varíaveis que vão constituir as requisições HTTP finais. Essa síntaxe, escrito utilizando a biblioteco do ohm.js, é declarada no arquivo [grammar.ohm](grammar.ohm) e contém as seguintes regras regras definidas:

 * Bloco de comandos - define uma lista de comandos (é a base para o reconhecimento de qualquer regra). Cada comando é separado por um ";".
 * Commando - define os comandos reconhecidos
   * declaração de varíavel
   * adição de cabeçalho
   * remoção de cabeçalho
   * adição de parâmetro
   * remoção de parâmetro
   * adição de corpo
   * remoção de corpo
   * comentário
 * Método - define os métodos HTTP reconhecidos pela linguagem
 * Variável - define o que é um nome de variável válido
 * URL - define esquema de URL válido
 * Carater especial - facilitar a incorporação de carateres especiais em outras regras
 * Chave válida - define esquema para chaves de cabeçalhos e parâmetros
 * Valor válido - define esquema para valores de cabeçaçhos e parâmetros

## Contexto Interno
O compilador vai tratar os comandos dentro do contexto dado na entrada, isso inclui a validação das seguintes regras:

 * Validação que uma variável foi declarada antes de manipular ela
 * Validação que uma variável não está sendo redeclarada
 * Validação que um cabeçalho ou parâmetro existe antes da remoção

Para isso é mantido um contexto que é um mapa de nomes de variáveis para as estruturas de variáveis e uma classe de variável com seus métodos de manipulação. Essas declarações estão no arquivo [dataStructures.js](dataStructures.js)

## Exemplos de Entrada
```
// Isso aqui é um comentário e será ignorado pelo reconhecedor;
// Vamos declarar uma variável;
myReq = GET https://ohmjs.org;

// Agora vamos colocar uns cabeçalhos nela;
myReq ADD HEADER user-agent Mozilla;
myReq ADD HEADER referer https://www.google.com/;

// Vamos adicionar um parametro;
myReq ADD PARAM search term;

// Vamos remover um parametro e um cabeçalho;
myReq REMOVE HEADER user-agent;
myReq REMOVE PARAM search;

// Pronto vai ser gerado a requisição como saída;
```

```
// Um exemplo de mock de uma API;
// Uma requisição insere um cliente e a outra busca;

reqOne = GET http://internal.api.com.br/api/v1/clients;
reqTwo = PUT http://internal.api.com.br/api/v1/clients;

reqTwo ADD HEADER authorization myapikey;
reqTwo ADD HEADER content-type application/json;
reqTwo ADD BODY {"id": 1, "name": "myClient", "address": "A very interesting address"};

reqOne ADD HEADER authorization myapikey;
reqOne ADD PARAM name myClient;
```

```
// Exemplos de erro de síntaxe;

1badvariable = GET https://www.test.com;
forgotMySemicolon = PUT https://www.google.com

var = GET https://www.google.com;
var ADD HEADER badheader 😀;
```

```
// Exemplos de erro de semântica;

undeclared ADD HEADER authorization myapikey;

var = GET https://www.google.com;
var REMOVE PARAM undeclared;
```

## Uso do Compilador
O compilador é invocado usando o [node.js](https://nodejs.org):
```
node compiler.js input [-o|--output output]
```

Se for dado um arquivo de saída o compilador irá escrever o resultado nesse caminho se possível. Caso contrário vai escrever o resultado na saída padrão.

## Grupo
 * Djalma Alves dos Santos Júnior
 * Felipe Augusto da Silva Ribeiro
 * Noam Eyal Resnick