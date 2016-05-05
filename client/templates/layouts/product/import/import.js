/**
 * Created by xiaochen on 4/30/16.
 */
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
      return instance.state.get('import');
    }
  }
});

Template.IbuyitProductImport.events({
  "submit form#form-import-csv": function (event, instance) {
    event.preventDefault();

    let file = event.target.csvfiles.files[0];
    let provider = event.target.provider.value;

    if (validateInput(file, provider)) {
      checkCsv(file, provider, instance);
    }
  }
});

let validateInput = (file, provider) => {
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
}

function checkCsv(file, provider, instance) {
  $('#form-import-csv button').attr('disabled', 'disabled');

  let res = {};

  if (!file) {
    res.success = false;
    res.errMsg = "No product csv file is found.";
  } else
  if (window.FileReader) {
    let reader = new FileReader();
    reader.onload = () => {
      res.result = IbuyitParse.parse(reader.result);
      res.success = true;
      instance.state.set('import', res);
      $('#form-import-csv button').removeAttr('disabled');
    }

    reader.readAsText(file);
    return;
  }
  else {
    res.success = false;
    res.errMsg = "The Browser you are using does not support file reader, please use another browser.";
  }

  instance.state.set('import', res);
  $('#form-import-csv button').removeAttr('disabled');
}
