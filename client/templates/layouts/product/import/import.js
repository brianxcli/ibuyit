/**
 * Created by xiaochen on 4/30/16.
 */
Random = Package.random.Random;

Template.IbuyitProductImport.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    import: {}
  });
});

Template.IbuyitProductImport.helpers({
  productList: () => {
    if (Meteor.isClient) {
      let instance = Template.instance();
      if ($('#importScvBtn').hasClass('active')) {
        $('#importScvBtn').removeClass('active');
      }

      return instance.state.get('import');
    }
  },
  getNameClass: (provider) => {
    // if (provider === "4") {
      return 'col-xs-6';
    // } else {
    //   return 'col-xs-4';
    // }
  },
  getProviderSpecificFields: (product, index) => {
    switch (product.provider) {
      case 1:
          return "<input type='hidden' value='" + product.ShopPrice + "' name='ShopPrice'>" +
              "<input type='hidden' value='" + product.Details + "' name='Details'>" +
              "<input type='hidden' value='" + product.provider + "' name='Provider'>";
          break;
      case 2:
      case 3:
          return "<input type='hidden' value='" + product.Category + "' name='Category'>" +
              "<input type='hidden' value='" + product.provider + "' name='Provider'>";
          break;
      case 4:
          return "<input type='hidden' value='" + product.Block1Price + "' name='Block1Price'>" +
              "<input type='hidden' value='" + product.Block2Price + "' name='Block2Price'>" +
              "<input type='hidden' value='" + product.Block3Price + "' name='Block3Price'>" +
              "<input type='hidden' value='" + product.Category + "' name='Category'>" +
              "<input type='hidden' value='" + product.provider + "' name='Provider'>";
          break;
    }
    return "";
  }
});

Template.IbuyitProductImport.events({
  "submit form#form-import-csv": function (event, instance) {
    event.preventDefault();

    let file = event.target.csvfiles.files[0];
    let provider = event.target.provider.value;

    if (isFilevalid(file, provider)) {
      readCsvFile(file, provider, instance);
    }
  },

  "submit form#form-import-result": function (event, instance) {
    event.preventDefault();
    let productList = $('form#form-import-result .list-products');

    productList.each(function() {
      let info = $(this).find("input");
      let product = createProductFromInputs(info);
      let query = objectToQuery(product);

      Meteor.call("products/findByNumber", query.number, function(error, result) {
        if (error) {
          console.log(error);
        } else {
          let isCommon = query.type == "common";
          let method = (result) ? "products/update" : "products/insert";
          Meteor.call(method, query, isCommon);
        }
      });
    });
  }
});

let isFilevalid = (file, provider) => {
  if (!$('#form-import-csv #file-warning').hasClass('hide')) {
    $('#form-import-csv #file-warning').addClass('hide');
  }

  if (!$('#form-import-csv #provider-warning').hasClass('hide')) {
    $('#form-import-csv #provider-warning').addClass('hide');
  }

  if (!file) {
    $('#form-import-csv #file-warning').removeClass('hide');
    $('#form-import-csv #file-warning').text('Please choose a csv or txt file.');
    return false;
  }

  if (provider == undefined || provider === "0") {
    $('#form-import-csv #provider-warning').removeClass('hide');
    $('#form-import-csv #provider-warning').text('Please choose a provider for your file.');
    return false;
  }

  return true;
};

function readCsvFile(file, provider, instance) {
  $('#form-import-csv button').attr('disabled', 'disabled');

  let res = {};

  if (!file) {
    res.success = false;
    res.errMsg = "No product csv file is found.";
  } else
  if (window.FileReader) {
    let reader = new FileReader();
    reader.onload = () => {
      let array = IbuyitParse.parse(reader.result);
      res.result = readProducts(array, provider);

      if (res.result === undefined) {
        res.success = false;
        // res.errMsg = "The file you upload does not match the provider.";
        $('#form-import-csv #file-warning').removeClass('hide');
        $('#form-import-csv #file-warning').text('The file uploaded does not match the provider.');
      } else {
        res.success = true;
        res.provider = provider;
      }

      instance.state.set('import', res);
      $('#form-import-csv button').removeAttr('disabled');
    }

    reader.readAsText(file);
    $('#importScvBtn').toggleClass("active");
    return;
  } else {
    res.success = false;
    res.errMsg = "The Browser you are using does not support file reader, please use another browser.";
  }

  instance.state.set('import', res);
  $('#form-import-csv button').removeAttr('disabled');
};

readProducts = (array, provider) => {
  let data = array.data;
  let titles = data[0];

  switch (provider) {
    case "1":
      if (checkIMTitles(titles)) {
        return readCSVProducts(data, provider);
      }
      break;
    case "2":
      if (checkAnywareTitles(titles)) {
        return readCSVProducts(data, provider);
      }
      break;
    case "3":
      if (checkPBTitles(titles)) {
        return readCSVProducts(data, provider);
      }
      break;
    case "4":
      if (checkSynnexTitles(titles)) {
        return readCSVProducts(data, provider);
      }
      break;
  }
};

let readCSVProducts = (data, provider) => {
  let len = data.length;
  let constructor = getConstructor(provider);
  let result = [];

  let titleCount = data[0].length;

  for (let i = 1; i < len; i++) {
    let product = data[i];

    if (product != undefined && product.length == titleCount) {
      result.push(constructor(product));
    }
  }

  return result;
};

let getConstructor = (provider) => {
  let method;
  switch (provider) {
    case "1":
      method = getIMProductInstance;
      break;
    case "2":
      method = getAnywareProductInstance;
      break;
    case "3":
      method = getPBProductInstance;
      break;
    case "4":
      method = getSynnexProductInstance;
      break;
  }
  return method;
};

let checkIMTitles = (titles) => {
  return (titles[IMFields.Name] === "Name" &&
  titles[IMFields.NO] === "NO." &&
  titles[IMFields.Brand] === "Brand" &&
  titles[IMFields.MarketPrice] === "Market price" &&
  titles[IMFields.ShopPrice] === "Shop price" &&
  titles[IMFields.Details] === "Details" &&
  titles[IMFields.Stock] === "Entity");
};

let getIMProductInstance = (product) => {
  let obj = new Object();
  obj.Name = product[IMFields.Name].trim();
  obj.No = product[IMFields.NO].trim();
  obj.Brand = product[IMFields.Brand].trim();
  obj.RetailPrice = product[IMFields.MarketPrice].trim();
  obj.ShopPrice = product[IMFields.ShopPrice].trim();
  obj.Details = product[IMFields.Details].trim();
  obj.Stock = product[IMFields.Stock].trim();
  obj.provider = 1;
  return obj;
};

let checkAnywareTitles = (titles) => {
  return (titles[AnywareFields.ItemNumber] === "ItemNumber" &&
    titles[AnywareFields.ItemName] == "ItemName" &&
    titles[AnywareFields.QuantityOnHand] == "QuantityOnHand" &&
    titles[AnywareFields.SellingPrice] == "SellingPrice" &&
    titles[AnywareFields.Brand] == "Brand" &&
    titles[AnywareFields.Category] == "Category");
};

let getAnywareProductInstance = (product) => {
  let obj = new Object();
  obj.No = product[AnywareFields.ItemNumber].trim();
  obj.Name = product[AnywareFields.ItemName].trim();
  obj.Stock = product[AnywareFields.QuantityOnHand].trim();
  obj.RetailPrice = product[AnywareFields.SellingPrice].trim();
  obj.Brand = product[AnywareFields.Brand].trim();
  obj.Category = product[AnywareFields.Category].trim();
  obj.provider = 2;
  return obj;
};

let checkPBTitles = (titles) => {
  return (titles[PBFields.PartNumber] === "PB Part Number" &&
    titles[PBFields.ProductName] === "Product Name" &&
    titles[PBFields.BulkStock] === "Bulk Stock" &&
    titles[PBFields.YourPrice] === "Your Price" &&
    titles[PBFields.Category] === "Category" &&
    titles[PBFields.Brand] === "Brand" );
};

let getPBProductInstance = (product) => {
  let obj = new Object();
  obj.No = product[PBFields.PartNumber].trim();
  obj.Name = product[PBFields.ProductName].trim();
  obj.Stock = product[PBFields.BulkStock].trim();
  obj.RetailPrice = product[PBFields.YourPrice].trim();
  obj.Category = product[PBFields.Category].trim();
  obj.Brand = product[PBFields.Brand].trim();
  obj.provider = 3;
  return obj;
};

let checkSynnexTitles = (titles) => {
  return (titles[SynnexFields.PartNo] === "PartNo" &&
  titles[SynnexFields.Vendor] === "Vendor" &&
  titles[SynnexFields.RRP] === "RRP" &&
  titles[SynnexFields.Block_1Price] === "Block1_Price" &&
  titles[SynnexFields.Block_2Price] === "Block2_Price" &&
  titles[SynnexFields.Block_3Price] === "Block3_Price" &&
  titles[SynnexFields.ProductGroup] === "ProductGroup" &&
  titles[SynnexFields.Stock] === "Stock" &&
  titles[SynnexFields.Description] === "Description");
};

let getSynnexProductInstance = (product) => {
  let obj = new Object();
  obj.No = product[SynnexFields.PartNo].trim();
  obj.Brand = product[SynnexFields.Vendor].trim();
  obj.RetailPrice = product[SynnexFields.RRP].trim();
  obj.Block1Price = product[SynnexFields.Block_1Price].trim();
  obj.Block2Price = product[SynnexFields.Block_2Price].trim();
  obj.Block3Price = product[SynnexFields.Block_3Price].trim();
  obj.Category = product[SynnexFields.ProductGroup].trim();
  obj.Stock = product[SynnexFields.Stock].trim();
  obj.Name = product[SynnexFields.Description].trim();
  obj.provider = 4;
  return obj
};

let IMFields = {
  Name: 0,
  NO: 1,
  Brand: 2,
  MarketPrice: 3,
  ShopPrice: 4,
  Details: 11,
  Stock: 20
};

let AnywareFields = {
  ItemNumber: 0,
  ItemName: 1,
  QuantityOnHand: 2,
  SellingPrice: 3,
  Brand: 4,
  Category: 5
};

let PBFields = {
  PartNumber: 0,
  ProductName: 2,
  BulkStock: 3,
  YourPrice: 4,
  Category: 5,
  Brand: 6
};

let SynnexFields = {
  Vendor: 1,
  PartNo: 2,
  RRP: 3,
  Block_1Price: 6,
  Block_2Price: 7,
  Block_3Price: 8,
  ProductGroup: 9,
  Stock: 10,
  Description: 11
};

let createProductFromInputs = (inputs) => {
  let ret = new Object();

  inputs.each(function () {
    let name = $(this).attr('name');
    let value = $(this).val();
    ret[name] = value;
  });

  return ret;
};

let objectToQuery = (product) => {
  let ret = new Object();

  ret.number = product.No;
  ret.title = product.Name;
  ret.brand = product.Brand;
  ret.category = product.Category;
  ret.retailPrice = Number(product.RetailPrice);

  if (product.Provider == 4) {
    ret.type = "synnex";

    ret.block1Price = Number(product.Block1Price);
    ret.block2Price = Number(product.Block2Price);
    ret.block3Price = Number(product.Block3Price);

    if (product.Stock === "B") {
      ret.stock = 0;
      ret.isBackorder = true;
    } else {
      ret.stock = Number(product.Stock);
      ret.isBackorder = false;
    }
  } else {
    ret.type = "common";
    ret.stock = Number(product.Stock);
  }

  return ret;
};
