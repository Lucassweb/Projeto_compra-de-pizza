let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => {
    return document.querySelector(el);// está retornando pizzaJson
}

const cs = (el) => {
    return document.querySelectorAll(el);//retorna - array
}


//LISTAGEM DA PIZZA EXEMPLO ABAIXO:
pizzaJson.map((item, index) => {

    let pizzaItem = c('.models .pizza-item').cloneNode(true); // fazendo cloneNode
    pizzaItem.setAttribute('data-key', index);//quando clicar, vai conseguir pegar as informaçoes da pizza que esta clicando
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;//buscando, e adicionando a imagem
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;//buscando, e adicionando as descrição
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;//buscando, e adicionando os nomes dos item
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;/*buscando, e adicionando os preços...
     toFixed - formata um número usando notação de ponto fixo.*/
     
    pizzaItem.querySelector('a').addEventListener('click',(e) => { //buscando, e adicionando os preços
        e.preventDefault(); //previna ação padrão
//informaçoes da pizza que clickou
/* O método Element.closest() retorna o ancestral 
    mais próximo, em relação ao elemento atual, 
    que possui o seletor fornecido como parâmetro. */
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img; //buscando a imagem
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name; //buscando name da pizza
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; //buscando descrição da pizza
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=> {
            if(sizeIndex == 2){
                size.classList.add('selected'); //selecionando pizza grande 860g
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaWindowArea').style.opacity = 0; //quando for clickar no modelo da pizza ele irar ativa opacity
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1; //quando for clickar no modelo da pizza ele irar ativa opacity
        }, 200);
    });
    c('.pizza-area').append(pizzaItem);/*Preenche as informaçoes em pizzaitem... append -  adicionando conteúdo */
});



//Eventos do modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display ='none'
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});


c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) { /* se modalqt for maior do que 1, so vai diminuir se for mais do que 1. 
    Se for dois , vai diminuir pra 1, menos que isso n consegue... */              
        modalQt--
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});


c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++; //quando o cliente for clicar no +, ele inclementar mais 1
    c('.pizzaInfo--qt').innerHTML = modalQt; // reatualizar no modal
});


cs('.pizzaInfo--size').forEach((size, sizeIndex) => { //um evento for
    size.addEventListener('click',(e) => { // uma ação na hora que for clickar
        c('.pizzaInfo--size.selected').classList.remove('selected'); // remover na hora de selecionar o tamanho da pizza
        size.classList.add('selected')//selecionar proprio item que está clicando
    });
});


c('.pizzaInfo--addButton').addEventListener('click', ()=> { // evendo, quando cliente for clickar em adicionar no carrinho
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({ //informaçoes da pizza
            identifier,
            id:pizzaJson[modalKey].id,//id da pizza
            size, // tamanho da pizza
            qt:modalQt //a quantidade de pizza
        });
    }

    updateCart(); // função
    closeModal(); // função
});

    c('.menu-openner').addEventListener('click',() => { // evento click que mostrara o aside - mobile
        if(cart.length > 0) { // se cart.length for mais do que 0 , ou seja se tive item do carrinho ele abre
            // caso ao contrario nao ira acontecer nada, se nao tiver item selecionado
            c('aside').style.left = '0';
        }
        
    });

    c('.menu-closer').addEventListener('click',()=> {
        c('aside').style.left = '100vw';
    })

function updateCart() { //função, quando for escolher pizza, mostrara o valor no carrinho

    c('.menu-openner span').innerHTML = cart.length // quando for clickar no cart, adicionara no carrinho, versao mobile

    if(cart.length > 0) {
        c('aside').classList.add('show') // aparecer o carrinho
        c('.cart').innerHTML = ''; //zerar e mostrar o card

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) { // percorrendo for quando for clicar, ele adicionara mais 1
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt; // calculando os subtotal

            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
             /* criando switch , quando for escolher 
                o tamanho da pizz para mostrar*/
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'; //tamanho pequeno
                    break;
                case 1:
                    pizzaSizeName = 'M' //tamanho medio
                    break;
                case 2:
                    pizzaSizeName = 'G'; //tamanho grande
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; //selecionando as variaveis

            cartItem.querySelector('img').src = pizzaItem.img; // inserindo imagem
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; //Mostrando quantidade de pizza que o cliente ira escolher
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',() => { //evendo de click , quando for clickar no menos
                if(cart[i].qt > 1) { // se a quantidade de cart for maior que 1 ele diminui
                    cart[i].qt-- //diminui menos 1
                } else {
                    cart.splice(i, 1) // removendo cart , se for menor do que 1
                }
                updateCart(); // função
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',() => {//evendo de click , quando for clickar no mais
                cart[i].qt++; // aumenta mais 1
                updateCart();// função
            });
            c('.cart').append(cartItem);
        }

            desconto = subtotal * 0.1; // vai pegar 10% de desconto do subtotal
            total = subtotal - desconto // somando o total

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`; // interações com os valores 
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`; // interações com os valores 
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`; // interações com os valores 

    } else {
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw';
    }
}   