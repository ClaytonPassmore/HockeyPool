define(function(require) {
    var Screen = require('app/view/screen');
    var SideBar = require('app/view/sidebar');
    var DraftContainer = require('app/view/draft_container');
    var TitleSpan = require('app/view/title_span');

    var title_screen = Screen.get_current();
    var draft_screen = Screen.add_screen();

    title_span = new TitleSpan();
    title_span.set_title('Welcome to the Draft.');
    title_screen.appendChild(title_span.get_element());

    title_screen.addEventListener('click', Screen.next);
    title_screen.addEventListener('keypress', Screen.next);

    sidebar = new SideBar();
    sidebar.hide();
    sidebar.set_title("Clayton's Picks");
    sidebar.set_items(['Sydney Crosby', 'Snoop Dogg', 'Kobe Bryant', 'Lebron James']);

    draft_container = new DraftContainer();
    draft_screen.appendChild(sidebar.get_element());
    draft_screen.appendChild(draft_container.get_element());
});
