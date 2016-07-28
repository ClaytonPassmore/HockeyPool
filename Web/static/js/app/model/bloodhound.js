define(['bloodhound'], function(Bloodhound) {
    var bloodhound = function(data, datum_tokenizer, query_tokenizer) {
        datum_tokenizer = datum_tokenizer || Bloodhound.tokenizers.whitespace;
        query_tokenizer = query_tokenizer || Bloodhound.tokenizers.whitespace;

        this.bloodhound = new Bloodhound({
            datumTokenizer: datum_tokenizer,
            queryTokenizer: query_tokenizer,
            local: data
        });
        this.set_data(data);
        return this;
    };

    bloodhound.prototype.set_data = function(data) {
        this.bloodhound.clear();
        this.bloodhound.local = data;
        this.bloodhound.initialize(true);
    };

    bloodhound.prototype.get_bloodhound = function() {
        return this.bloodhound;
    };

    bloodhound.prototype.remove = function(item) {
        var data = this.bloodhound.local;
        for(idx in data) {
            if(item == data[idx]) {
                data.splice(idx, 1);
                break;
            }
        }
        this.set_data(data);
    };

    bloodhound.prototype.add = function(item) {
        var data = this.bloodhound.local;
        data.push(item);
        this.set_data(data);
    };

    return bloodhound;
});
