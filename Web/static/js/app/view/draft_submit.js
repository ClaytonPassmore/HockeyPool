define(['app/view/title_span'], function(TitleSpan) {
    var draft_submit = function(DraftSubmitModel) {
        this.model = DraftSubmitModel;
        this.model.add_event_listener(this.submit_handler.bind(this));
        this.title_span = new TitleSpan('Submitting the draft...');
        return this;
    };

    draft_submit.prototype.get_element = function() {
        return this.title_span.get_element();
    };

    draft_submit.prototype.submit_handler = function(error) {
        if(error) {
            this.title_span.set_title('We failed to submit your data. Retry?');
        } else {
            this.title_span.set_title('The draft was submitted successfully!');
        }
    };

    return draft_submit;
})
