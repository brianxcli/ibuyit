/**
 * Created by xiaochen on 5/10/16.
 */
let check = Package.check.check;

ReactionCore.Schemas.IbuyitProduct = new SimpleSchema([
  ReactionCore.Schemas.Product,
  {
    number: {
      type: String
    },
    brand: {
      type: String
    },
    category: {
      type: String
    },
    stock: {
      type: Number
    },
    retailPrice: {
      type: Number,
      decimal: true
    }
  }
]);

ReactionCore.Schemas.SynnexProduct = new SimpleSchema([
  ReactionCore.Schemas.IbuyitProduct,
  {
    block1Price: {
      type: Number,
      decimal: true
    },
    block2Price: {
      type: Number,
      decimal: true
    },
    block3Price: {
      type: Number,
      decimal: true
    }
  }
]);

ReactionCore.Collections.Products.attachSchema(ReactionCore.Schemas.IbuyitProduct,
  { selector: { type: "common" } });

ReactionCore.Collections.Products.attachSchema(ReactionCore.Schemas.SynnexProduct,
  { selector: { type: "synnex" } });

Random = Package.random.Random;

if (Meteor.isServer) {
  Meteor.methods({
    "products/findByNumber": function (number) {
      check(number, String);
      let result = ReactionCore.Collections.Products.findOne({number: number});
      return result;
    },
    "products/insert": function (product, isCommon) {
      check(product, Object);
      check(isCommon, Boolean);

      if (isCommon) {
        ReactionCore.Collections.Products.insert({
          _id: Random.id(),
          number: product.number,
          title: product.title,
          brand: product.brand,
          category: product.category,
          stock: product.stock,
          retailPrice: product.retailPrice,
          type: product.type
        });
      } else {
        let isBackorder = (product.isBackOrder) ? product.isBackOrder : false;

        ReactionCore.Collections.Products.insert({
          _id: Random.id(),
          number: product.number,
          title: product.title,
          brand: product.brand,
          category: product.category,
          stock: product.stock,
          retailPrice: product.retailPrice,
          type: product.type,
          isBackorder: isBackorder,
          block1Price: product.block1Price,
          block2Price: product.block2Price,
          block3Price: product.block3Price
        });
      }
    },
    "products/update": function(product, isCommon) {
      check(product, Object);
      check(isCommon, Boolean);

      if (isCommon) {
        let update = {
          stock: product.stock,
          retailPrice: product.retailPrice,
        };

        ReactionCore.Collections.Products.update({
            number: product.number
          }, {
            $set: update
          }, {
            selector: {
              type: "common"
            }
        });
      } else {
        let isBackorder = (product.isBackorder) ? product.isBackorder : false;
        let update = {
          stock: product.stock,
          retailPrice: product.retailPrice,
          isBackorder: isBackorder,
          block1Price: product.block1Price,
          block2Price: product.block2Price,
          block3Price: product.block3Price
        };

        ReactionCore.Collections.Products.update({
            number: product.number
          }, {
            $set: update
          }, {
            selector: {
              type: "synnex"
            }
          });
      }
    },
    "products/searchProducts": function(query) {
      check(query, Object);
      return ReactionCore.Collections.Products.find().fetch();
    }
  });
}
