//1
alert("Hello World") 

//2
function btn() {
    alert("Hello World")
}

//3
function maiorNum(){
    a = prompt("Insira o primeiro número");
    b = prompt("Insira o segundo número");
    c = prompt("Insira o terceiro número");
   
    if(a>b && a>c){
        alert("O maior número é "+ a)
    }else if(b>a && b>c){
        alert("O maior número é "+ b)
    }else if (c>a && c>b){
        alert("O maior número é "+ c)
    }
}

//4
function idade(){
    idade = prompt("Insira sua idade: ")

    if(idade >= 18){
        alert("Você é maior de idade.")
    }else{
        alert("Você é menor de idade")
    }
}

//5
function media() {
   a = Number (prompt("Insira o primeiro número"));
   b = Number(prompt("Insira o segundo número"));
   c = Number(prompt("Insira o terceiro número"));
    
    soma = (a+b+c)
    mediaAritmetica =soma/3

    alert("A média desses números é "+ mediaAritmetica)
}

//6
function imc(){
    altura = Number(prompt("Insira a sua altura: "))
    peso = Number(prompt("Insira o seu peso: "))

    calculoImc = peso / (altura * altura)

    alert("Seu IMC é: "+ calculoImc)
}

//8