define(function(require) {
    var Screen = require('app/view/screen');
    var SideBar = require('app/view/sidebar');
    var DraftContainer = require('app/view/draft_container');
    var TitleSpan = require('app/view/title_span');

    var screen_mgr = new Screen();
    var title_screen = screen_mgr.get_current();
    var draft_screen = screen_mgr.add_screen();

    title_span = new TitleSpan();
    title_span.set_title('Welcome to the Draft.');
    title_screen.appendChild(title_span.get_element());

    title_screen.addEventListener('click', screen_mgr.next.bind(screen_mgr));

    sidebar = new SideBar();
    sidebar.hide();
    sidebar.set_title("Clayton's Picks");
    sidebar.set_items(['Sydney Crosby', 'Snoop Dogg', 'Kobe Bryant', 'Lebron James']);

    draft_container = new DraftContainer();
    draft_screen.appendChild(sidebar.get_element());
    draft_screen.appendChild(draft_container.get_element());
});
