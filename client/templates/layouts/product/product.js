/**
 * Created by xiaochen on 4/25/16.
 */
Template.IbuyitProduct.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    result: []
  });
});

Template.IbuyitProduct.helpers({
  searchString: function() {
    return {};
  },
  productList: function() {
    let instance = Template.instance();
    let query = {};
    Meteor.call("products/searchProducts", query, function(error, result) {
      instance.state.set('result', result);
    });
    return instance.state.get('result');
  }
});

Template.IbuyitProduct.events({

});
