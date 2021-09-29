// VARIABLE
let bankList = [],
  depositList = [],
  dataSet = [],
  dataMember = {},
  dataDepositAdd = {},
  billImg = '',
  routePath = '',
  imageBill = '';
const statusValue = {
  newStatus: '000',
  approveStatus: '200',
  rejectStatus: '300',
};
const memberStatus = {
  normal: '0',
  lock: '1',
  expired: '2',
};
const allRoutes = {
  add: 'add',
  detail: 'detail',
  approve: 'approve',
};
const statusCodeTranslations = {
  success: 230,
  fail: 231,
};
const alertMessages = {
  lock: 'The member is status lock.',
  expired: 'The member is status expired.',
  searchFail: 'Not search for username. click button search.',
  updateDepositSuccess: 'Add new balance in wallet main.',
  updateDepositFail: 'Not add new balance in wallet main.',
  addDepositSuccess: 'Add deposit is successfully.',
  addDepositFail: 'Add deposit is failed.',
  editDepositSuccess: 'Edit deposit is successfully.',
  editDepositFail: 'Edit deposit is failed.',
  amount: 'Amount have to more than zero.',
};
// CREATE ELEMENT INPUT
let remarkBox = elementId('remarkBox');
let uploadBox = elementId('uploadBox');
let bankSelectBox = elementId('bankSelectBox');
let bankInputBox = elementId('bankInputBox');
let searchUsername = elementId('searchUsername');
let searchStatus = elementId('searchStatus');
let searchDateFrom = elementId('searchDateFrom');
let searchDateTo = elementId('searchDateTo');
let username = elementId('username');
let bank = elementId('bank');
let date = elementId('date');
let upload = elementId('upload');
let amount = elementId('amount');
let remark = elementId('remark');
let bankShow = elementId('bankShow');
// BUTTON ELEMENTS
const approveDeposit = elementId('approveDeposit');
const rejectDeposit = elementId('rejectDeposit');
const saveDeposit = elementId('saveDeposit');
const searchUsernameModal = elementId('searchUsernameModal');
const searchDeposit = elementId('searchDeposit');
const resetAllSearch = elementId('resetAllSearch');
const loadingTable = elementId('loadingTable');
const modalClose = elementId('mdClose');
// CREATE ELEMENT LABELS
elementId('lbSearchUsername').innerText = 'Username';
elementId('lbSearchStatus').innerText = 'Status';
elementId('lbSearchDateFrom').innerText = 'Date from';
elementId('lbSearchDateTo').innerText = 'Date to';
// CREATE ELEMENT BUTTONS SEARCH
searchDeposit.innerHTML = '<i class="fas fa-search"></i>&nbsp;Search';
resetAllSearch.innerHTML = '<i class="fas fa-redo-alt fa-flip-horizontal"></i>&nbsp;Reset';
elementId('openModalAdd').innerHTML = '<i class="fas fa-plus"></i>&nbsp;Add';
// CREATE ELEMENT LABELS IN MODAL
elementId('mdUsername').innerHTML = 'Username&nbsp;<span class="text-danger">*</span>';
elementId('mdBank').innerHTML = 'Bank&nbsp;<span class="text-danger">*</span>';
elementId('mdDate').innerHTML = 'Date&nbsp;<span class="text-danger">*</span>';
elementId('mdAmount').innerHTML = 'Amount&nbsp;<span class="text-danger">*</span>';
elementId('mdUpload').innerHTML = 'Upload&nbsp;<span class="text-danger">*</span>';
elementId('mdRemark').innerText = 'Remark';
elementId('mdBankInput').innerHTML = 'Bank&nbsp;<span class="text-danger">*</span>';
// CREATE ELEMENT BUTTONS IN MODAL
modalClose.innerHTML = '<i class="fas fa-times"></i>&nbsp;Close';
approveDeposit.innerHTML = '<i class="fas fa-check"></i>&nbsp;Approve';
rejectDeposit.innerHTML = '<i class="fas fa-times"></i>&nbsp;Reject';
saveDeposit.innerHTML = '<i class="fas fa-save"></i>&nbsp;Save';
searchUsernameModal.innerHTML = '<i class="fas fa-search"></i>&nbsp;Search';

// LENGTH INPUT
username.maxLength = 255;
bank.maxLength = 255;
date.maxLength = 255;
remark.maxLength = 255;
const readerFunction = () => {
  getDeposit();
  getDepositStatus();
  renderTableDeposit();
};

// NIFTY ON READY
$(document).on('nifty.ready', () => {
  // CREATE PAGE HEADER
  document.querySelector('title').innerHTML = 'TRN | DEPOSIT';
  $('#deposit-menu-li').addClass('active-sub');
  $('#deposit-menu-ul').addClass('in');
  $('#deposit-menu-ul-li').addClass('active-sub');
  // CREATE PAGE TITLE
  document.getElementById('page-header').innerText = 'Deposit';
  document.getElementById('breadcrumb-level-1').innerText = 'Deposit Management';
  document.getElementById('breadcrumb-level-2').style.display = 'none';
  document.getElementById('breadcrumb-level-3').style.display = 'none';
  // RENDER FUNCTIONS
  readerFunction();
  //!<-----------JQUERY SYNTAX --------->
  // CHECK DEMICAL 2 DIGIT ONLY
  $(document).on('keydown', 'input[pattern]', function () {
    const input = $(this);
    const oldVal = input.val();
    const regex = new RegExp(input.attr('pattern'), 'g');
    setTimeout(() => {
      const newVal = input.val();
      if (!regex.test(newVal)) {
        input.val(oldVal);
      }
    }, 0);
  });
  // CALCULATE DAY END YEAR
  const startDate = moment([2020, moment().format('MM') - 1]);
  const endDate = moment(startDate).endOf('year');
  const countDay = moment(endDate.toDate()).diff(moment(), 'days');
  let dateDisable = [];
  for (let index = 0; index < countDay; index++) {
    dateDisable.push(moment().add(index + 1, 'day'));
  }
  // CREATE DATETIMEPICKER ON MODAL DEPOSIT
  $('#date').datetimepicker({
    format: 'YYYY-MM-DD HH:mm:ss',
    disabledDates: dateDisable,
  });
  $('#dateFrom input').datetimepicker({ format: 'YYYY-MM-DD 00:00' });
  $('#dateTo input').datetimepicker({ format: 'YYYY-MM-DD 23:59' });
  // MAX MIN DATEPICKER
  $('#dateFrom').on('dp.change', (e) => {
    $('#searchDateTo').data('DateTimePicker').minDate(e.date);
  });
  $('#dateTo').on('dp.change', (e) => {
    $('#searchDateFrom').data('DateTimePicker').maxDate(e.date);
  });

  //!<-----------JQUERY SYNTAX --------->
  // KEY INPUT ENTER
  username.addEventListener('keyup', async (event) => {
    if (event.keyCode === 13) {
      if (username.value) {
        dataMember = await getMember();
        if (dataMember) {
          if (dataMember.status === memberStatus.normal) {
            alertMsg('success', `The username is ${dataMember.username}.`);
            username.value = dataMember.username;
          } else if (dataMember.status === memberStatus.lock) {
            alertMsg('danger', alertMessages.lock);
          } else {
            alertMsg('danger', alertMessages.expired);
          }
        } else {
          alertMsg('danger', alertMessages.searchFail);
        }
      }
    }
  });
  // BUTTON CLOSE MODAL
  document.getElementsByClassName('close')[0].addEventListener('click', () => {
    $('#modalFormDeposit').bootstrapValidator('destroy');
  });
  modalClose.addEventListener('click', () => {
    $('#modalFormDeposit').bootstrapValidator('destroy');
  });
  // SEARCH DEPOSIT DATA ENTER
  searchUsername.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      getDeposit();
    }
  });
  // GET BANK ON CLICK
  document.querySelector('[data-id=bank]').addEventListener('click', (event) => {
    if (dataDepositSelect) {
      if (dataDepositSelect.status === statusValue.newStatus) {
        getDepositBank();
      }
    }
  });
  // SEARCH DEPOSIT DATA
  searchDeposit.addEventListener('click', () => {
    getDeposit();
  });
  // RESET ALL VALUE
  resetAllSearch.addEventListener('click', () => {
    resetSearch();
  });
  // SEARCH USERNAME ON MODAL
  searchUsernameModal.addEventListener('click', async () => {
    if (username.value) {
      if (routePath === allRoutes.add) {
        dataMember = await getMember();
        if (dataMember) {
          if (dataMember.status === memberStatus.normal) {
            alertMsg('success', `The username is ${dataMember.username}.`);
            username.value = dataMember.username;
          } else if (dataMember.status === memberStatus.lock) {
            alertMsg('danger', alertMessages.lock);
          } else {
            alertMsg('danger', alertMessages.expired);
          }
        } else {
          alertMsg('danger', alertMessages.searchFail);
        }
      }
    }
  });
  // APPROVE DEPOSIT ON MODAL
  approveDeposit.addEventListener('click', async () => {
    if (validateData()) {
      const dataMember = await getMember();
      if (dataMember.status === memberStatus.normal) {
        dataDepositSelect.status = statusValue.approveStatus;
        dataDepositSelect.remark =remark.value;
        const res = await callXMLHttpRequest(`${API.deposit}/updateDepositStatus`, dataDepositSelect);
        if (res.statusCode === statusCodeTranslations.success) {
          alertMsg('success', res.statusText);
          $('#modalDeposit').modal('hide');
          getDeposit();
        } else {
          alertMsg('danger', res.statusText);
          getDeposit();
        }
      } else if (dataMember.status === memberStatus.lock) {
        alertMsg('danger', alertMessages.lock);
      } else if (dataMember.status === memberStatus.expired) {
        alertMsg('danger', alertMessages.expired);
      }
    }
  });
  // REJECT DEPOSIT ON MODAL
  rejectDeposit.addEventListener('click', async () => {
    if (validateData()) {
      dataDepositSelect.status = statusValue.rejectStatus;
      dataDepositSelect.remark =remark.value;
      const res = await callXMLHttpRequest(`${API.deposit}/updateDepositStatus`, dataDepositSelect);
      if (res.statusCode === statusCodeTranslations.success) {
        alertMsg('success', res.statusText);
        $('#modalDeposit').modal('hide');
        getDeposit();
      } else {
        alertMsg('danger', res.statusText);
        getDeposit();
      }
    }
  });
  // UPLOAD BILL IMAGE DEPOSIT
  upload.addEventListener('change', () => {
    const file = upload.files[0];
    let image = new Image();
    image.onload = () => {
      // RESIZE IMAGE
      let canvas = document.createElement('canvas'),
        max_size = 400, // TODO : pull max size from a site config
        width = image.width,
        height = image.height;
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      billImg = dataUrl;
      document.getElementById('image-bill-show').src = billImg;
    };
    image.src = URL.createObjectURL(file);
  });
  // SAVE DEPOSIT ON MODAL
  saveDeposit.addEventListener('click', async () => {
    $('#modalFormDeposit').bootstrapValidator('destroy');
    if (validateData()) {
      const dataMember = await getMember();
      if (dataMember.status === memberStatus.normal) {
        if (amount.value > 0) {
          const findIndex = bankList.findIndex((x) => x.bank_abb === bank.value);
          if (routePath === allRoutes.add) {
            const dataDepositAdd = {
              uid: dataMember._id,
              amount: parseFloat(amount.value),
              bank_id: bankList[findIndex]._id,
              bank_abb: bank.value,
              bill_date: new Date(date.value),
              bill_slip: billImg,
              doc_date: new Date(),
              request_date: new Date(),
              status: statusValue.newStatus,
              username: dataMember.username,
            };
            if (dataDepositAdd.uid && dataDepositAdd.username) {
              const insertDeposit = await callXMLHttpRequest(`${API.deposit}/insertDepositTransaction`, dataDepositAdd);
              if (insertDeposit.data) {
                alertMsg('success', alertMessages.addDepositSuccess);
                $('#modalDeposit').modal('hide');
                clearModal();
                getDeposit();
              } else {
                alertMsg('danger', insertDeposit.statusText);
              }
            } else {
              alertMsg('danger', insertDeposit.statusText);
            }
          } else {
            const dataDepositEdit = {
              uid: dataMember._id,
              amount: parseFloat(amount.value),
              bank_id: bankList[findIndex]._id,
              bank_abb: bank.value,
              bill_date: new Date(date.value),
              bill_slip: billImg,
              doc_date: new Date(),
              request_date: new Date(),
              status: statusValue.newStatus,
              username: dataMember.username,
              depositId: dataDepositSelect._id,
            };
            const editDeposit = await callXMLHttpRequest(`${API.deposit}/editDeposit`, dataDepositEdit);
            if (editDeposit.data) {
              alertMsg('success', editDeposit.statusText);
              $('#modalDeposit').modal('hide');
              clearModal();
              getDeposit();
            } else {
              alertMsg('danger', editDeposit.statusText);
            }
          }
        } else {
          alertMsg('danger', alertMessages.amount);
        }
      } else if (dataMember.status === memberStatus.lock) {
        alertMsg('danger', alertMessages.lock);
      } else {
        alertMsg('danger', alertMessages.expired);
      }
    }
  });
});
// TABLE DEPOSIT
const renderTableDeposit = (params) => {
  let data = [];
  if (params) {
    data = params;
  }
  const column = [
    {
      title: 'Date',
      data: 'doc_date',
      className: 'text-center',
      render: (data) => {
        return data ? moment(data).format('YYYY-MM-DD HH:mm:ss') : '-';
      },
    },
    {
      title: 'Username',
      data: 'username',
      className: 'text-center',
      render: (data) => {
        return data.toLowerCase();
      },
    },
    {
      title: 'Status',
      data: null,
      className: 'text-center',
      render: (data) => {
        return data.status == statusValue.newStatus
          ? `<p class="text-warning">${data.status_name}</p>`
          : data.status === statusValue.approveStatus
          ? `<p class="text-success">${data.status_name}</p>`
          : `<p class="text-danger">${data.status_name}</p>`;
      },
    },
    {
      title: 'Amount',
      data: 'amount',
      className: 'text-center',
      render: (data) => {
        return data ? formatcurrency(data) : formatcurrency(0.0);
      },
    },
    {
      title: 'Approved by',
      data: 'approve_by',
      className: 'text-center',
      render: (data) => {
        return data.toLowerCase();
      },
    },
    {
      title: 'Action',
      data: null,
      className: 'text-center',
      render: (data) => {
        return `
        <button class="btn btn-xs btn-info" onclick='openModalDeposit("${allRoutes.detail}", ${JSON.stringify(data)})'>
        <i class="fas fa-search"></i>&nbsp;Detail
        </button>
        <button class="btn btn-xs btn-mint" id="openModalApprove" style="display: ${
          data.status === statusValue.approveStatus || data.status === statusValue.rejectStatus ? 'none' : ''
        }" onclick='openModalDeposit("${allRoutes.approve}", ${JSON.stringify(data)})'>
        <i class="fas fa-clipboard-list"></i>&nbsp;Approve / Reject
        </button>
        `;
      },
    },
  ];
  if (data.length) {
    setParameterTable('tableDeposit', data, column);
  } else {
    setParameterTable('tableDeposit', [], column);
  }
};
// OPEN MODAL DEPOSIT
const openModalDeposit = async (route, data) => {
  dataDepositSelect = data;
  if (dataDepositSelect) {
    if (dataDepositSelect.status === statusValue.newStatus) {
      bank.innerHTML = `<option value="">${dataDepositSelect.bank_name}</option>`;
      $('#bank').selectpicker('refresh');
    }
  }
  if (route !== allRoutes.add) {
    imageBill = await getImageBill(dataDepositSelect);
  }
  $('#modalDeposit')
    .modal('show')
    .on('hidden.bs.modal', (e) => {
      clearModal();
    });

  if (route === allRoutes.add) {
    getDepositBank();
    $('.modal-title').text('Add Deposit');
    saveDeposit.innerHTML = '<i class="fas fa-save"></i>&nbsp;Save';
    controlInput(route);
  } else if (route === allRoutes.detail) {
    // CREATE MODAL HEADER
    $('.modal-title').text('Detail Deposit');
    if (dataDepositSelect.status === statusValue.newStatus) {
      $('.modal-title').text('Edit Deposit');
    } else {
      bankShow.value = data.bank_name;
    }

    // ADD VALUE ON MODAL
    dataMember.username = data.username;
    dataMember._id = data._id;
    username.value = dataMember.username;
    date.value = moment(data.bill_date).format('YYYY-MM-DD HH:mm:ss');
    amount.value = data.amount;
    bank.value = data.to_bank_abb;
    remark.value = data.remark;
    billImg = imageBill.bill_slip;
    saveDeposit.innerHTML = '<i class="fas fa-save"></i>&nbsp;Save';
    document.getElementById('image-bill-show').src = imageBill.bill_slip;
    controlInput(route, data.status);
  } else {
    // CREATE MODAL HEADER
    $('.modal-title').text('Approve / Reject Deposit');
    // ADD VALUE ON MODAL
    username.value = data.username;
    date.value = moment(data.bill_date).format('YYYY-MM-DD HH:mm:ss');
    amount.value = data.amount;
    bank.value = data.to_bank_abb;
    bankShow.value = data.bank_name;
    document.getElementById('image-bill-show').src = imageBill.bill_slip;
    controlInput(route);
  }
};
// CONTROL INPUT ON MODAL
controlInput = (route, status) => {
  routePath = route;
  if (route === allRoutes.add) {
    // DISABLE INPUT
    username.readOnly = false;
    bank.disabled = false;
    date.readOnly = false;
    amount.readOnly = false;
    upload.readOnly = false;
    // NON DISPLAY
    remarkBox.style.display = 'none';
    uploadBox.style.display = '';
    bankSelectBox.style.display = '';
    bankInputBox.style.display = 'none';
    // NON DISPLAY BUTTON
    saveDeposit.style.display = '';
    approveDeposit.style.display = 'none';
    rejectDeposit.style.display = 'none';
    searchUsernameModal.disabled = false;
  } else if (route === allRoutes.detail) {
    if (status !== statusValue.newStatus) {
      // DISABLE INPUT
      username.readOnly = true;
      bank.disabled = true;
      date.readOnly = true;
      amount.readOnly = true;
      upload.readOnly = true;
      remark.readOnly = true;
      bankShow.readOnly = true;
      remarkBox.style.display = '';
      uploadBox.style.display = 'none';
      bankSelectBox.style.display = 'none';
      bankInputBox.style.display = '';
      // NON DISPLAY BUTTON
      saveDeposit.style.display = 'none';
      searchUsernameModal.disabled = true;
    } else {
      // NON DISPLAY BUTTON
      username.readOnly = true;
      bank.disabled = false;
      date.readOnly = false;
      amount.readOnly = false;
      upload.readOnly = false;
      remark.readOnly = false;
      remarkBox.style.display = 'none';
      uploadBox.style.display = '';
      bankSelectBox.style.display = '';
      bankInputBox.style.display = 'none';
      // NON DISPLAY BUTTON
      saveDeposit.style.display = '';
      searchUsernameModal.disabled = true;
    }
    approveDeposit.style.display = 'none';
    rejectDeposit.style.display = 'none';
  } else {
    // DISABLE INPUT
    username.readOnly = true;
    bank.disabled = true;
    date.readOnly = true;
    amount.readOnly = true;
    upload.readOnly = true;
    remark.readOnly = true;
    remark.readOnly = false;
    bankShow.readOnly = true;
    // NON DISPLAY BUTTON
    saveDeposit.style.display = 'none';
    approveDeposit.style.display = '';
    rejectDeposit.style.display = '';
    remarkBox.style.display = '';
    uploadBox.style.display = 'none';
    bankSelectBox.style.display = 'none';
    bankInputBox.style.display = '';
    searchUsernameModal.readOnly = true;
  }
  $('#bank').selectpicker('refresh');
};
// RESET ALL SEARCH DATA
const resetSearch = () => {
  searchUsername.value = '';
  searchStatus.value = statusValue.newStatus;
  searchDateFrom.value = '';
  searchDateTo.value = '';
  searchStatus.value = '';
  $('#searchStatus').selectpicker('refresh');
  getDeposit();
};
// CLEAR INPUT MODAL
const clearModal = () => {
  username.value = '';
  bank.value = '';
  date.value = '';
  amount.value = '';
  upload.value = '';
  remark.value = '';
  document.getElementById('image-bill-show').src = '';
};
const getDepositStatus = async () => {
  // GET DATA DEPOSIT STATUS
  const depositStatus = await callXMLHttpRequest(`${API.deposit}/getDepositStatus`, {}).data;
  searchStatus.innerHTML += `<option value="">All</option>`;
  for (let index = 0; index < depositStatus.length; index++) {
    searchStatus.innerHTML += `<option value="${depositStatus[index].param_value}">${depositStatus[index].param_desc}</option>`;

    if (depositStatus[index].param_value === statusValue.newStatus) {
      statusValue.newStatus = depositStatus[index].param_value;
    } else if (depositStatus[index].param_value === statusValue.approveStatus) {
      statusValue.approveStatus = depositStatus[index].param_value;
    } else {
      statusValue.rejectStatus = depositStatus[index].param_value;
    }
  }

  $('#searchStatus').selectpicker('refresh');
};
const getDepositBank = async () => {
  bank.innerHTML = '';
  bankList = await callXMLHttpRequest(`${API.deposit}/getDepositBank`, {}).data;
  bank.innerHTML = `<option value="">---- Select Bank ----</option>`;
  for (let index = 0; index < bankList.length; index++) {
    bank.innerHTML += `<option value="${bankList[index].bank_abb}">${bankList[index].bank_name}</option>`;
  }
  if (dataDepositSelect) {
    if (dataDepositSelect.status === statusValue.newStatus) {
      let findIndex = bankList.findIndex((x) => x.bank_abb === dataDepositSelect.to_bank_abb);
      if(findIndex !== -1) {
        bank.value = bankList[findIndex].bank_abb;
      }
    }
  }
  $('#bank').selectpicker('refresh');
};
// GET DATA DEPOSIT API
const getDeposit = async () => {
  depositList = [];
  const dataJson = {
    username: searchUsername.value.trim().toLowerCase(),
    status: searchStatus.value,
    dateFrom: new Date(searchDateFrom.value),
    dateTo: new Date(searchDateTo.value),
  };
  depositList = await callXMLHttpRequest(`${API.deposit}/getDeposit`, dataJson).data;
  loadingTable.style.display = 'none';

  renderTableDeposit(depositList);
};
// GET DATA MEMBER
const getMember = async () => {
  return await callXMLHttpRequest(`${API.deposit}/getSearchUsername`, { username: username.value.trim().toLowerCase() }).data[0];
};
// GET DATA MEMBER
const getImageBill = async (data) => {
  return await callXMLHttpRequest(`${API.deposit}/getDepositImageBill`, { _id: data._id }).data[0];
};
// FUNCTION VALIDATION
const validateData = () => {
  elementsName = {
    username: {
      validators: {
        notEmpty: {
          message: 'Username is required and cannot be empty.',
        },
        regexp: {
          regexp: /^[a-zA-Z0-9@_\.]+$/,
          message: 'The username can only consist of alphabetical, number, dot and underscore',
        },
      },
    },
    date: {
      validators: {
        notEmpty: {
          message: 'Date is required and cannot be empty.',
        },
      },
    },
    bank: {
      validators: {
        notEmpty: {
          message: 'Bank is required and cannot be empty.',
        },
      },
    },
    amount: {
      validators: {
        notEmpty: {
          message: 'Amount is required and cannot be empty.',
        },
        numeric: {
          message: 'Amount is not a number.',
        },
      },
    },
    upload: {
      validators: {
        notEmpty: {
          message: 'Upload is required and cannot be empty.',
        },
      },
    },
  };
  if (dataDepositSelect) {
    if (routePath === allRoutes.detail || routePath === allRoutes.approve) {
      delete elementsName.upload;
    }
  }
  if (validate('#modalFormDeposit', elementsName)) {
    return true;
  } else {
    return false;
  }
};
