const helpers = {}

helpers.random = ()=>{
    const poss = 'abcdefghijklmnopqrstuvwxyz0123456789'
    var ran = ""
    for(var i=0; i<7; i++){
        ran += poss.charAt(Math.floor(Math.random()*poss.length))
    }
    return ran
}

module.exports = helpers