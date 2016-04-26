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
  }
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
  }
});
