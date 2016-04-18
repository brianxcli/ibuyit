Meteor.startup(function () {
  if (Meteor.isClient) {
    Tracker.autorun(function () {
      ReactionRouter.route("/about", {
        name: "about",
        action: () => {
          BlazeLayout.render("coreLayout", {
            template: "IbuyitAbout",
            layoutHeader: "layoutHeader",
            layoutFooter: "layoutFooter"
          });
        }
      });

      // initialize client routing
      if (ReactionCore.Subscriptions.Packages.ready() && ReactionCore.Subscriptions.Shops.ready()) {
        ReactionRouter.initPackageRoutes();
      }
    }); // end tracker
  }
});
