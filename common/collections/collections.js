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
  { selector: { type: "anyware" } });

ReactionCore.Collections.Products.attachSchema(ReactionCore.Schemas.IbuyitProduct,
  { selector: { type: "pb" } });

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
    "products/findProductById": function(id) {
      check(id, String);
      return ReactionCore.Collections.Products.findOne({_id: id});
    },
    "products/insert": function (product, type) {
      check(product, Object);
      check(type, String);

      if (type != "synnex") {
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
    "products/update": function(product, type) {
      check(product, Object);
      check(type, String);

      if (type != "synnex") {
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
              type: type
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
    "products/searchProducts": function(params) {
      check(params, Object);

      let query = {};
      if (params.provider != undefined && params.provider != "") {
        query.type = params.provider;
      }
      if (params.category != undefined && params.category != "") {
        query.category = params.category;
      }
      if (params.brand != undefined && params.brand != "") {
        query.brand = params.brand;
      }

      return ReactionCore.Collections.Products.find(query, {sort: {updatedAt: -1}}).fetch();
    },
    "products/providers": function() {
      // Meteor collection doesn't support distinct() method,
      // The following is the solution from
      // https://coderwall.com/p/o9np9q/get-unique-values-from-a-collection-in-meteor
      let allTypes = ReactionCore.Collections.Products.find({}, {fields: {type: 1}, sort: {type: 1}}).fetch();
      let distinctArray = _.uniq(allTypes, false, function(d) {return d.type});
      return _.pluck(distinctArray, 'type');
    },
    "products/categories": function() {
      let allCategories = ReactionCore.Collections.Products.find({}, {fields: {category: 1}, sort: {category: 1}}).fetch();
      let distinctArray = _.uniq(allCategories, false, function(d) {return d.category});
      return _.pluck(distinctArray, 'category');
    },
    "products/brands": function() {
      let allBrands = ReactionCore.Collections.Products.find({}, {fields: {brand: 1}, sort:{brand: 1}}).fetch();
      let distinctArray = _.uniq(allBrands, false, function(d) {return d.brand});
      return _.pluck(distinctArray, 'brand');
    }
  });
}
