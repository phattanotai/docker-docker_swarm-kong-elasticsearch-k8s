let saveType = "add";
let addOrEditBool = false;
let editData;
let bankActive;

$(document).on("nifty.ready", () => {
  document.querySelector("title").innerHTML = "TRN | MASTER DATA";
  $('#master-menu-li').addClass('active-sub');
  $('#master-menu-ul').addClass('in');
  $('#master-menu-li-bank').addClass('active-sub');
  $("#page-title > h1.page-header").text("Master Data");
  $("#page-navigate > .breadcrumb-level-1").text("Bank");
  $("#page-navigate > .breadcrumb-level-2").remove();
  $("#page-navigate > .breadcrumb-level-3").remove();

  setTimeout(() => {
    fatchResult(`${API.masterData}/getBankActive`, {}).then((res) => {
      if (res) {
        bankActive = res;
        setSelectBankActive(res);
      }
    });
    searchBank();
  }, 300);
});

// INPUT KEYUP id bankAbbModal,bankAbb TO UPPERCASE
$('#bankAbbModal,#bankAbb').keyup(async e =>{
    document.getElementById("bankAbbModal").value = (document.getElementById("bankAbbModal").value).toUpperCase();
    document.getElementById("bankAbb").value = (document.getElementById("bankAbb").value).toUpperCase();
});

$('#bankAbbModal,#bankAbb').on('paste',function() {
  document.getElementById("bankAbbModal").value = (document.getElementById("bankAbbModal").value).toUpperCase();
  document.getElementById("bankAbb").value = (document.getElementById("bankAbb").value).toUpperCase();
});
//FUNCTION SET SELECT =================================================
const setSelectBankActive = async function (data) {
  $("#bankActive").append(new Option("Please select...", ""));
  for await (const element of data) {
    $("#bankActive").append(new Option(element.name, element.value));
    $("#bankActiveModal").append(new Option(element.name, element.value));
  }
  $(".selectpicker").selectpicker("refresh");
};
//FUNCTION EVENT CLICK SEARCH DATA =================================================
const resetSearch = function () {
  document.getElementById("bankname").value = "";
  document.getElementById("bankActive").value = "";
  document.getElementById("bankAbb").value = "";
  $(".selectpicker").selectpicker("refresh");
  searchBank();
};
// OPEN ADD MODAL =================================================
const searchBank = function () {
  const searchData = {
    bankName: (document.getElementById("bankname").value).trim(),
    bankActive: (document.getElementById("bankActive").value).trim(),
    bankAbb: (document.getElementById("bankAbb").value).trim(),
  };
  fatchResult(`${API.masterData}/searchBank`, searchData).then((res) => {
    if (res) {
      setDataTable(res);
    } else {
      setDataTable({});
    }
  });
};
// SEARCH INPUT ENTER
const enterKey = function(e){
  if(e.keyCode === 13){
    searchBank();
  }
}
// OPEN ADD MODAL =================================================
const openModal = function () {
  $('#modalBank').modal({backdrop: 'static', keyboard: false}); 
  saveType = "add";
};
// CLOSE MODAL =================================================
const closeModal = function () {
    $("#modalBank").modal("hide");
    if (addOrEditBool) {
      searchBank();
      addOrEditBool = false;
    }
    document.getElementById("bankNameModal").value = "";
    document.getElementById("bankAbbModal").value = "";
    document.getElementById("bankDescModal").value = "";
    document.getElementById("bankActiveModal").value = bankActive[0].value;
    $("#modalBankForm").bootstrapValidator("destroy");
};
// SET DATATABLE ========================================================
const setDataTable = function (data) {
  let column = [
    {
      data: "bankName",
      className: "text-left operate-link",
    },
    {
      data: "bankAbb",
      className: "text-center",
    },
    {
      data: "bankDescription",
      className: "text-center",
      render: function (data) {
        return data ? `${data}<span class="CellComment" >${data}</span>` : "-";
      },
    },
    {
      data: "bankActiveName",
      className: "text-center",
    },
    {
      data: null,
      className: "text-center",
      render: function (data) {
        return `<a onclick='showEditData(${JSON.stringify(data)})' class="btn btn-mint btn-icon"><i class="far fa-edit"></i></a>`;
      },
    },
  ];
  const columnDefs = [
    { width: 120, targets: 0 },
    { width: 50, targets: 1 },
    { width: 150, targets: 2 },
    { width: 50, targets: 3 },
    { width: 50, targets: 4 },
  ]
  setParameterTable("bankTable", data, column,null,null,columnDefs);
};
// FUNCTION EVENT OPEN MODAL EDIT =================================================
const showEditData = function (data) {
  editData = data;
  document.getElementById("bankNameModal").value = data.bankName;
  document.getElementById("bankAbbModal").value = data.bankAbb;
  document.getElementById("bankDescModal").value = data.bankDescription;
  document.getElementById("bankActiveModal").value = data.bankActive;
  $(".selectpicker").selectpicker("refresh");
  $('#modalBank').modal({backdrop: 'static', keyboard: false});
  saveType = "edit";
};

//FUNCTION EVENT SEND DATA TO api add =================================================
const saveBankData = async function () {
  $("#modalBankForm").bootstrapValidator("destroy");
  if (validateAddModal()) {
    const saveData = {
      bankName: (document.getElementById("bankNameModal").value).trim(),
      bankAbb: (document.getElementById("bankAbbModal").value).trim(),
      bankDescription: (document.getElementById("bankDescModal").value).trim(),
      bankActive: (document.getElementById("bankActiveModal").value).trim(),
      program: "masterDataBank",
    };
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then((result) => {
      if (result.value) {
        if (saveType === "add") {
          fatchResult(`${API.masterData}/addBank`, saveData).then((res) => {
            if (res) {
              addOrEditBool = true;
            }
          });
        } else {
          saveData._id = editData._id;
          fatchResult(`${API.masterData}/editBank`, saveData).then((res) => {
            if (res) {
              addOrEditBool = true;
            }
          });
        }
      }
    });
  }
};
// VALIDATE  =============================================================
const validateAddModal = function () {
  elementsName = {
    bankNameModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    bankAbbModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    bankActiveModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
  };
  if (validate("#modalBankForm", elementsName)) {
    return true;
  } else {
    return false;
  }
};
