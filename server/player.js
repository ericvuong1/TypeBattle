function Player(hp, name) {
    return {
        hp: hp,
        name: name,
        disabled: false,
        isBlocking: false
    }
}


module.exports = Player;