/**
 * Created by xiaochen on 4/25/16.
 */
Template.IbuyitProduct.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    result: [],
    providers: [],
    categories: [],
    brands: []
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
  },
  brandList: function() {
    let instance = Template.instance();
    Meteor.call("products/brands", function(error, result) {
      if (error) {
        instance.state.set('brands', []);
      } else {
        instance.state.set('brands', result);
      }
    });

    return instance.state.get('brands');
  },
  getBrandLink: function(brand) {
    let route = "/product/search?brand=" + brand;
    return route;
  },
  getDetailLink: function(id) {
    let route = "/product/item?id=" + id;
    return route;
  },
  getGstPrice: function(price) {
    return (price * 1.15).toFixed(2);
  },
  getStock: function(isBackorder, stock) {
    if (isBackorder) {
      return "B";
    } else {
      return stock;
    }
  },
  getSupplierSelected: function(supplier) {
    ReactionRouter.watchPathChange();
    let current = ReactionRouter.current().queryParams.provider;
    console.log("supplier: " + supplier + "|current query: " + current);
    let ret = "";
    if (current) {
      if (current === supplier) {
        ret = "selected";
      }
    } else if (supplier === "0") {
      ret = "selected";
    }
    return ret;
  },
  getCategorySelected: function(category) {
    ReactionRouter.watchPathChange();
    let current = ReactionRouter.current().queryParams.category;
    console.log("category: " + category + "|current query: " + current);
    let ret = "";
    if (current) {
      if (current === category) {
        ret = "selected";
      }
    } else if (category === "0") {
      ret = "selected";
    }
    return ret;
  },
  getBrandSelected: function(brand) {
    ReactionRouter.watchPathChange();
    let current = ReactionRouter.current().queryParams.brand;
    console.log("brand: " + brand + "|current query: " + current);
    let ret = "";
    if (current) {
      if (current === brand) {
        ret = "selected";
      }
    } else if (brand === "0") {
      ret = "selected";
    }
    return ret;
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

    let brand = $('#form-search #brandSelect').val();
    if (brand === "0") {
      brand = "";
    }

    let route = "/product/search" + "?provider=" + provider + "&category=" + category + "&brand=" + brand;
    ReactionRouter.go(route);
  },
  "click #form-search #product-search-reset": function(event) {
    event.preventDefault();
    // $('#form-search #providerSelect').val("0");
    // $('#form-search #categorySelect').val("0");
    // $('#form-search #brandSelect').val("0");
    ReactionRouter.go("/product");
  }
});
