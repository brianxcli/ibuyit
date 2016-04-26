/**
 * Created by xiaochen on 4/26/16.
 */
Template.IbuyitImport.replaces('import');

Template.import.events({
  'submit form#form-import-csv'(event) {
    event.preventDefault();
    uploadCsv(event);
  }
});

function uploadCsv(event) {
  $('#form-import-csv button').attr('disabled','disabled');

  let file = event.target.csvfiles.files[0];

  if (window.FileReader) {
    let reader = new FileReader();

    // reader.onload is invoked when the file
    // reader actually begins loading the file
    reader.onload = () => {
      let result = IbuyitParse.parse(reader.result);
      console.log(result);
      $('#form-import-csv button').removeAttr('disabled');
    }

    reader.readAsText(file);
  } else {
    $('#form-import-csv #result').text('Browser is not supported. Please change to another browser.');
    $('#form-import-csv button').removeAttr('disabled');
  }
}
