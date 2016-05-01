/**
 * Created by xiaochen on 4/30/16.
 */
Template.IbuyitProductImport.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    import: {}
  });
});

let self = Template.instance();

Template.IbuyitProductImport.helpers({
  productList: () => {
    if (Meteor.isClient) {
      let instance = Template.instance();
      return instance.state.get('import');
    }
  }
});

Template.IbuyitProductImport.events({
  "submit form#form-import-csv": function (event, instance) {
    event.preventDefault();
    checkCsv(event, instance);
  }
});

function checkCsv(event, instance) {
  $('#form-import-csv button').attr('disabled', 'disabled');
  let file = event.target.csvfiles.files[0];
  let res = {};

  if (!file) {
    res.success = false;
    res.errMsg = "No product csv file is found.";
  } else if (window.FileReader) {
    let reader = new FileReader();
    reader.onload = () => {
      res.result = IbuyitParse.parse(reader.result);
      res.success = true;
      instance.state.set('import', res);
      $('#form-import-csv button').removeAttr('disabled');
    }

    reader.readAsText(file);
    return;
  } else {
    res.success = false;
    res.errMsg = "The Browser you are using does not support file reader, please use another browser.";
  }

  instance.state.set('import', res);
  $('#form-import-csv button').removeAttr('disabled');
}
