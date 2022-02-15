const fetch = require("sync-fetch");
const hypixel_utils = require("./hypixel-utils");
const util = require('util');


class Guild {
    constructor (id, hypixel_utils) {
        this.id = id;
        this.hypixel_utils = hypixel_utils;
    }

    [util.inspect.custom] () {
        return { "id": this.id, "name": this.#get_guild().name }
    }

    #get_guild() {
        return this.hypixel_utils.get_hypixel_response("guild", `id=${this.id}`).guild;
    }

    get_name() {
        return this.#get_guild().name
    }

    get_member_list(parseNames=true, ranksOnly=false, sortBy="default") {
        var member_list = [];
        var username = "parseNames=false";

        this.#get_guild().members.forEach(member => {
            if (parseNames) {
                username = this.hypixel_utils.uuid_to_username(member.uuid);
            }
            if (ranksOnly && member.rank == "Member") {
                return;
            }
            member_list.push({ "uuid": member.uuid, username, "rank": member.rank, "joined": new Date(member.joined), "gexpToday": member.expHistory[Object.keys(member.expHistory)[0]] });         
        });

        if (sortBy == "gexpToday") {
            member_list.sort(function(a,b){ // idk how this works taken from here https://stackoverflow.com/questions/8175093/simple-function-to-sort-an-array-of-objects
                var x = a.gexpToday < b.gexpToday? -1:1;
                return x; 
            });
        } else if (sortBy == "joined") {
            member_list.sort(function(a,b){
                var x = a.joined < b.joined? -1:1;
                return x; 
            });
        }
        return member_list;
    }

    get_member_count() {
        return this.#get_guild().members.length
    }

    get_gexp_today() {
        var gexp = 0;
        var member_xp;

        this.#get_guild().members.forEach(member => {
            member_xp = member.expHistory[Object.keys(member.expHistory)[0]]
            if (gexp >= 250000) {
                gexp += member_xp * 0.3;
            } else if (gexp >= 200000) {
                gexp += member_xp * 0.1
            } else {
                gexp += member_xp
            }
        });

        return gexp;
    }

    get_gexp_total() {
        return this.#get_guild().exp
    }



}

module.exports = {Guild};

