


Cypress.Commands.add('token', (email, password) => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            "email": email,
            "password": password
        }
    }).then((response) =>{
        return response.body.authorization
    })

})


Cypress.Commands.add('cadastrarProduto',(token,produto)=>{
    cy.request({
        method: 'POST',
        url:'produtos',
        headers:{authorization:token},
        body:{  
            "nome": produto,
            "preco": 100,
            "descricao": "Produto apenas",
            "quantidade": 100
        }
        // coloquei os voles setados pra facilitar nos testes
        
    })
})