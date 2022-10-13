/// <reference types="cypress" />
import contrato from '../../contracts/produtos.contracts'

//fazendo um teste de versão entere branchs do git




describe('Testa toda a parte de produto da API', () => {
 
    
    let token

    before(() => {
    
      cy.token('fulano@qa.com','teste').then(tkn => {
        token = tkn
      })
        
    });


    it.only('Deve validar contrato de Produtos', () => {

        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
        
    });

    it('Listar Produtos', () => {
        cy.request({
            method:'GET',
            url:'http://localhost:3000/produtos'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })
        
    });

    it('Cadastrar produto', () => {
        cy.request({
           method:'Post',
           url:'http://localhost:3000/produtos',
           body:{
            "nome": "Boneco do Bunny Girl 32442333",
            "preco": 501,
            "descricao": "Action Figure",
            "quantidade": 1000
          },
          headers:{authorization:token}


        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
        
        
    });

    it('Cadastrar produto de maneira dinamica', () => {
        let produto = `Boneco do Anime ${Math.floor(Math.random()*100000000)}`
        cy.request({
           method:'Post',
           url:'http://localhost:3000/produtos',
           body:{
            "nome": produto,
            "preco": 501,
            "descricao": "Action Figure",
            "quantidade": 1000
          },
          headers:{authorization:token}


        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
        
        
    });


    it('Testar se o produto já está cadastrado ', () => {
        cy.request({
            method:'Post',
            url:'http://localhost:3000/produtos',
            body:{
             "nome": "Boneco do Bunny Girl",
             "preco": 501,
             "descricao": "Action Figure",
             "quantidade": 1000
           },
           headers:{authorization:token},
           failOnStatusCode: false
 
 
         }).then((response) => {
             expect(response.status).to.equal(400)
             expect(response.body.message).to.equal('Já existe produto com esse nome')
         })
        
        
    });

    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Boneco do Anime ${Math.floor(Math.random()*100000000)}`
        cy.cadastrarProduto(token, produto)
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'PUT',
                url:`produtos/${id}`,
                headers: {authorization: token},
                body: {
                    "nome": produto,
                    "preco": 100,
                    "descricao": "Produto Testado",
                    "quantidade": 100
                }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })

        
    });

    
    it('Deve deletar um produto previamente cadastrado', () => {
        let produto = `Boneco do Anime ${Math.floor(Math.random()*100000000)}`
        cy.cadastrarProduto(token, produto)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers:{authorization: token}
    
            }).then(response => {
                expect(response.body.message).to.equal("Registro excluído com sucesso");
                expect(response.status).to.equal(200)
            })
        })


       
    });



   

   
    
});