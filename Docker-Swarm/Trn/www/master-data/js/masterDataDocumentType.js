$(document).on("nifty.ready", () => {
  document.querySelector("title").innerHTML = "TRN | MASTER DATA";
  $('#master-menu-li').addClass('active-sub');
  $('#master-menu-ul').addClass('in');
  $('#master-menu-li-doc').addClass('active-sub');
  $("#page-title > h1.page-header").text("Master Data");
  $("#page-navigate > .breadcrumb-level-1").text("Master Data");
  $("#page-navigate > .breadcrumb-level-2").text("Document type");
  $("#page-navigate > .breadcrumb-level-3").remove();
  renderDdlActive();
  renderSearchTable();
});

const renderDdlActive = function () {
  let obj = {
    module: "master_data",
    name: "active",
    active: "1",
  };
  let res = callXMLHttpRequest(`${API.masterData}/renderDdlDocType`, obj);
  if (res.statusCode == "200") {
    generateOptionWithValue("activeDdl", res.data);
    generateOptionWithValue("activeDdlModal", res.data);
  }
};

$("#addDoc").click(function () {
  $("#modalDoc").modal("show");
  el("docAbbModal").readOnly = false;
  $("#modalDoc").bootstrapValidator("destroy");
  el("docNameModal").value = "";
  el("docAbbModal").value = "";
  el("docDescModal").value = "";
  el("activeDdlModal").value = "";
  el("docId").value = "";
  $("#activeDdlModal").selectpicker("refresh");
  el("btnEditDocType").classList.add("d-p-none");
  if ($("#btnAddDocType").hasClass("d-p-none")) {
    el("btnAddDocType").classList.remove("d-p-none");
  }
});

$("#btnAddDocType").click(function () {
  $("#modalDoc").bootstrapValidator("destroy");
  if (validateAddDoc()) {
    let obj = {
      docName: el("docNameModal").value.trim(),
      docAbb: el("docAbbModal").value.trim(),
      docDesc: el("docDescModal").value.trim(),
      active: el("activeDdlModal").value,
    };
    let res = callXMLHttpRequest(`${API.masterData}/addDocType`, obj);
    if (res.statusCode == "200") {
      renderSearchTable();
      alertMsg("success", "Add document type success");
      $("#modalDoc").modal("hide");
    } else {
      alertMsg("danger", res.statusText);
    }
  }
});

const validateAddDoc = function () {
  elementsName = {
    docNameModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    docAbbModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    activeDdlModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
  };
  if (validate("#modalDoc", elementsName)) {
    return true;
  } else {
    return false;
  }
};

const renderSearchTable = function () {
  let obj = {
    docName: el("docName").value.trim(),
    docDesc: el("docDesc").value.trim(),
    active: el("activeDdl").value,
  };
  let column = [
    {
      data: "doc_type_name",
      className: "text-left",
    },
    {
      data: "doc_abb",
      className: "text-left",
    },
    {
      data: "doc_desc",
      className: "text-left",
      render: function (data) {
        if (data) {
          return data;
        } else {
          return "-";
        }
      },
    },
    {
      data: "param_desc",
      className: "text-left",
    },
    {
      data: null,
      className: "text-center",
      render: function (data) {
        return `<button class="btn btn-mint btn-icon" onclick='updateDocType(${JSON.stringify(
          data
        )})'><i class="far fa-edit"></i></button>`;
      },
    },
  ];
  let res = callXMLHttpRequest(`${API.masterData}/searchDocType`, obj);
  if (res.statusCode == "200") {
    setParameterTable("tableDoc", res.data, column);
  } else {
    setParameterTable("tableDoc", [], column);
  }
};

$("#resetDoc").click(function () {
  el("docName").value = "";
  el("docDesc").value = "";
  el("activeDdl").value = "";
  $("#activeDdl").selectpicker("refresh");
  renderSearchTable();
});

$("#searchDoc").click(function () {
  renderSearchTable();
});

const updateDocType = function (data) {
  $("#modalDoc").modal("show");
  $("#modalDoc").bootstrapValidator("destroy");
  el("btnAddDocType").classList.add("d-p-none");
  if ($("#btnEditDocType").hasClass("d-p-none")) {
    el("btnEditDocType").classList.remove("d-p-none");
  }
  el("docId").value = data._id;
  el("docNameModal").value = data.doc_type_name;
  el("docAbbModal").value = data.doc_abb;
  el("docAbbModal").readOnly = true;
  el("docDescModal").value = data.doc_desc;
  el("activeDdlModal").value = data.active;
  $("#activeDdlModal").selectpicker("refresh");
};

$("#btnEditDocType").click(function () {
  if (el("docId").value) {
    if (validateEdit()) {
      let obj = {
        docId: el("docId").value,
        docName: el("docNameModal").value.trim(),
        docAbb: el("docAbbModal").value.trim(),
        docDesc: el("docDescModal").value.trim(),
        active: el("activeDdlModal").value,
      };
      let res = callXMLHttpRequest(`${API.masterData}/updateDocType`, obj);
      if (res.statusCode == "200") {
        renderSearchTable();
        alertMsg("success", "Update data success");
        $("#modalDoc").modal("hide");
      } else {
        alertMsg("danger", res.statusText);
      }
    }
  } else {
    alertMsg("danger", "User ID not found");
  }
});

const validateEdit = function () {
  elementsName = {
    docNameModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    docAbbModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    activeDdlModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
  };
  if (validate("#modalDoc", elementsName)) {
    return true;
  } else {
    return false;
  }
};
