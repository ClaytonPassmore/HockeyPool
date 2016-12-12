const Bloodhound = require('../lib/bloodhound');


class bloodhound {
    constructor() {
        var datum_tokenizer = Bloodhound.tokenizers.obj.whitespace('playerName');
        var query_tokenizer = Bloodhound.tokenizers.whitespace;

        this.bloodhound = new Bloodhound({
            identify: function(item) { return item.id; },
            datumTokenizer: datum_tokenizer,
            queryTokenizer: query_tokenizer
        });
    }

    set_data(data) {
        this.bloodhound.clear();
        this.bloodhound.local = data;
        this.bloodhound.initialize(true);
    }

    get_bloodhound() {
        return this.bloodhound;
    }

    get_by_id(id) {
        return this.bloodhound.get([id]);
    }

    remove(id) {
        var data = this.bloodhound.local;
        for(var idx in data) {
            if(id == data[idx].id) {
                data.splice(idx, 1);
                break;
            }
        }
        this.set_data(data);
    }

    add(item) {
        var data = this.bloodhound.local;
        data.push(item);
        this.set_data(data);
    }
}


exports.Bloodhound = bloodhound;
