const fetch = require("sync-fetch");
const guild = require("./guild");

class HypixelUtils {
    constructor (hypixel_api_token) {
        this.hypixel_api_token = "607a4221-a77b-478d-aa38-9e15b97202ae";
        this.hypixel_api_url = "https://api.hypixel.net/";
    }

    get_hypixel_response(subdir, query) {
        return fetch(this.hypixel_api_url + `${subdir}?${query}&key=${this.hypixel_api_token}`).json();
    }

    // Misc player tools
    does_player_exist(username) {
        return fetch(`https://playerdb.co/api/player/minecraft/${username}`).json().success;
    }

    username_to_uuid(username) {
        return fetch(`https://playerdb.co/api/player/minecraft/${username}`).json().data.player.id;
    }

    uuid_to_username(uuid) {
        return this.get_hypixel_response("player", `uuid=${uuid}&`).player.displayname // maybe this is faster but needs further testing
        return fetch(`https://playerdb.co/api/player/minecraft/${uuid}`).json().data.player.username;
    }

    // Guild stuff
    get_guild_by_uuid(uuid) {
        return new guild.Guild(this.get_hypixel_response("guild", `player=${uuid}`).guild._id, this)
    }

    get_guild_by_id(id) {
        return new guild.Guild(this.get_hypixel_response("guild", `id=${id}`).guild._id, this)
    }
}

module.exports = {HypixelUtils};
