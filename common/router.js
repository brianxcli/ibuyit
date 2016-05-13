Meteor.startup(function () {
  if (Meteor.isClient) {
    Tracker.autorun(function () {
      ReactionRouter.route("/", {
        name: "index",
        action: function () {
          BlazeLayout.render("coreLayout", {
            template: "IbuyitHome",
            layoutHeader: "layoutHeader",
            layoutFooter: "layoutFooter"
          });
        }
      });

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

      ReactionRouter.route("/product", {
        name: "product",
        action: () => {
          BlazeLayout.render("coreLayout", {
            template: "IbuyitProduct",
            layoutHeader: "layoutHeader",
            layoutFooter: "layoutFooter"
          });
        }
      });

      ReactionRouter.route("/product/search", {
        name: "product/search",
        action: () => {
          BlazeLayout.render("coreLayout", {
            template: "IbuyitProduct",
            layoutHeader: "layoutHeader",
            layoutFooter: "layoutFooter"
          });
        }
      });

      ReactionRouter.route("/product/import", {
        name: "product/import",
        action: () => {
          BlazeLayout.render("coreLayout", {
            template: "IbuyitProductImport",
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
