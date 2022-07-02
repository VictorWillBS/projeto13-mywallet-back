function ola(){
    const nome = "victor"
    return nome
}

function teste(){
    console.log("oi")
    const nome = ola()
    console.log(nome)
}

teste()