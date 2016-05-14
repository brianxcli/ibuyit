/**
 * Created by xiaochen on 4/15/16.
 */
Template.IbuyitNavBar.replaces("CoreNavigationBar");

Template.CoreNavigationBar.helpers({
  getFocused(current) {
    // FlowRouter.current() is not reactive, call
    // watchPathChange() to watch the changes in path
    ReactionRouter.watchPathChange();

    let path = ReactionRouter.current().route.name;
    if (path === current) {
      return "focused";
    } else {
      return "";
    }
  },
});

Template.CoreNavigationBar.events({
  'click #home'() {
    ReactionRouter.go('/');
  },
  'click #product'() {
    ReactionRouter.go('/product');
  },
  'click #about'() {
    ReactionRouter.go('/about');
  },
  'click .popup-menu #home'() {
    ReactionRouter.go('/');
  },
  'click .popup-menu #product'() {
    ReactionRouter.go('/product');
  },
  'click .popup-menu #about'() {
    ReactionRouter.go('/about');
  }
});

let closePopmenu = function() {
  if ($('.popup-menu').is(':visible')) {
    $('.popup-menu').hide();
  }
}

// let mql = window.matchMedia("(min-width: 768px)");
// mql.addListener(handleOrientationChange);
// handleOrientationChange(mql);
//
// function handleOrientationChange(mql) {
//   if (mql.matches) {
//     closePopmenu();
//   }
// }
