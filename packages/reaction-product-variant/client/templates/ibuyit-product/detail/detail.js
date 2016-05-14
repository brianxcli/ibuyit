/**
 * Created by xiaochen on 5/13/16.
 */
Template.IbuyitProductDetail.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    product: {},
  });
});

Template.IbuyitProductDetail.helpers({
  getProduct: function() {
    ReactionRouter.watchPathChange();
    let route = ReactionRouter.current();
    let id = route.queryParams.id;
    let instance = Template.instance();

    Meteor.call("products/findProductById", id, function(error, result) {
      if (error) {
        instance.state.set('product', {});
      } else {
        instance.state.set('product', result);
      }
    });

    return instance.state.get('product');
  },
  isSynnex: function(type) {
    return type === "synnex";
  },
  getTaxPrice: function(price) {
    return (price * 1.15).toFixed(2);
  },
  getStock: function(isBackorder, stock) {
    if (isBackorder) {
      return "Backorder needed";
    } else {
      return stock;
    }
  }
});

Template.IbuyitProductDetail.events({
  "click .detailActionBtnWrapper #detailAddToCartBtn": function(event) {
    // console.log('add to cart');
  },
  "click .detailActionBtnWrapper #detailBackBtn": function(event) {
    window.history.back();
  }
});
