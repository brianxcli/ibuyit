/**
 * Created by xiaochen on 4/25/16.
 */
Template.IbuyitProduct.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    result: [],
    providers: [],
    categories: []
  });
});

Template.IbuyitProduct.helpers({
  productList: function() {
    let instance = Template.instance();

    ReactionRouter.watchPathChange();
    let route = ReactionRouter.current();

    Meteor.call("products/searchProducts", route.queryParams, function(error, result) {
      instance.state.set('result', result);
    });
    return instance.state.get('result');
  },
  providerList: function() {
    let instance = Template.instance();
    Meteor.call("products/providers", function(error, result) {
      if (error) {
        instance.state.set('providers', []);
      } else {
        instance.state.set('providers', result);
      }
    });

    return instance.state.get('providers');
  },
  categoryList: function() {
    let instance = Template.instance();
    Meteor.call("products/categories", function(error, result) {
      if (error) {
        instance.state.set('categories', []);
      } else {
        instance.state.set('categories', result);
      }
    });

    return instance.state.get('categories');
  }
});

Template.IbuyitProduct.events({
  "click #form-search #product-search": function(event) {
    event.preventDefault();
    let provider = $('#form-search #providerSelect').val();
    if (provider === "0") {
      provider = "";
    }

    let category = $('#form-search #categorySelect').val();
    if (category === "0") {
      category = "";
    }

    let route = "/product/search" + "?provider=" + provider + "&category=" + category;
    ReactionRouter.go(route);
  },
  "click #form-search #product-search-reset": function(event) {
    event.preventDefault();
    $('#form-search #providerSelect').val("0");
    $('#form-search #categorySelect').val("0");
  }
});
