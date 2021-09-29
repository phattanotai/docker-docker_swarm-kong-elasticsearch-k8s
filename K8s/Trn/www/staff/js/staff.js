let editData;
let addOrEditBool = false;
const dateFormat = 'DD MMM YYYY HH:mm:ss';
let statusData = [];
let prefixData = [];
let allPrefixData = [];
const backspace = 8;
const ctrl = 17;
const prefixActive = {
    active: '1',
    inactive: '0'
}
let prefixBool = false;
$(document).on('nifty.ready', function () {
    document.querySelector('title').innerHTML = 'TRN | STAFF';
    $('#staff-menu-li').addClass('active-sub');
    $('#staff-menu-ul').addClass('in');
    $('#staff-menu-ul-li').addClass('active-sub');
    $('#page-title > h1.page-header').text('Staff');
    $('#page-navigate > .breadcrumb-level-1').text('Staff Management');
    $('#page-navigate > .breadcrumb-level-2').remove();
    $('#page-navigate > .breadcrumb-level-3').remove();
    setTimeout(() => {
        fatchResult(`${API.staff}/getPrefix`,{}).then(async res => {
            if(res){
                for await(let i of res){
                    if(i.active === prefixActive.active){
                        prefixData.push(i);
                    }
                    allPrefixData.push(i);
                }
                setSelectPrefix();
            }
        });
        fatchResult(`${API.staff}/getStatus`,{}).then(res => {
            if(res){
                statusData = res;
                setSelectStatus();
            }
        });
        searchStaff();
    }, 300);
   
    // CHECK PATTERN INPUT KEYDOWN
    $(document).on('keydown', 'input[pattern]', function(e){
        if(e.keyCode === ctrl || e.originalEvent.key === 'v'){
            const input = $(this);
            const oldVal = input.val();
            const regex = new RegExp(input.attr('pattern'), 'g');
            setTimeout(() => {
              const newVal = input.val();
              if (!regex.test(newVal)) {
                input.val(oldVal);
              }
            }, 0);
        }else if(e.originalEvent.keyCode !== backspace){
            const input = $(this);
            const oldVal = input.val();
            const regex = new RegExp(input.attr('pattern'), 'g');
            setTimeout(() => {
              const newVal = e.originalEvent.key;
              if (!regex.test(newVal)) {
                input.val(oldVal);
              }
            }, 0);
        }
    });
    // CHECK PATTERN INPUT PASTE
    $(document).on('paste', 'input[pattern]', function(e){
        if(e.originalEvent.keyCode !== backspace){
            const input = $(this);
            const oldVal = input.val();
            const regex = new RegExp(input.attr('pattern'), 'g');
            setTimeout(() => {
              const newVal = input.val();
              if (!regex.test(newVal)) {
                input.val(oldVal);
              }
            }, 0);
        }
    });
   $("#clickSearch").click(()=> {
       searchStaff();
   });
   $("#clickReset").click(()=> {
       document.getElementById("staffSearchName").value = '';
       document.getElementById("staffSearchUsername").value = '';
       document.getElementById("staffSearchStatus").value = '';
       document.getElementById("staffSearchTel").value = '';
       $('.selectpicker').selectpicker('refresh');
       searchStaff();
   });

   $('[data-id=editPrefix]').on('click',() =>{
        if(!prefixBool){
            setSelectPrefix();
        }else{
            setSelectPrefixEdit();
            document.getElementById("editPrefix").value = editData.staffPrefix;
            $('.selectpicker').selectpicker('refresh');
        }
    });
});

const findPrefixValue = function(data,msg) {
    return new Promise(resolve => {
       data.findIndex(l => {
           if(l.name === msg){
              resolve(l.value);
           }
         });
    });
}
const findPrefixName = function(data,msg) {
    return new Promise(resolve => {
       data.findIndex(l => {
           if(l.value === msg){
              resolve(l.name);
           }
         });
    });
}
// SEARCH INPUT ENTER
const enterKey = function(e){
    if(e.keyCode === 13){
        searchStaff();
    }
}
// SEARCH DATA STAFF =====================================================
const searchStaff = function(){
    $("#searchForm").bootstrapValidator("destroy");
    if (validateSearchData()) {
        const searchData = {
            staffName: (document.getElementById("staffSearchName").value).trim(),
            staffUsername: (document.getElementById("staffSearchUsername").value).trim(),
            staffStatus: (document.getElementById("staffSearchStatus").value).trim(),
            staffTel: (document.getElementById("staffSearchTel").value).trim() 
       }
       fatchResult(`${API.staff}/searchStaff`,searchData).then(res => {
            if(res){
                 setDataTable(res);
            }else{
                setDataTable({});
            }
       });
    }  
}
// SET DATATABLE ========================================================
const setDataTable = function(data){
    let column = [
        {
            data: "staffUsername",
            className: "text-left operate-link",
        },
        {
            data: null,
            className: "text-center",
            render: function(data){
                return data.staffFirstName + ' ' + data.staffLastName;
            }
        },
        {
            data: "staffTel",
            className: "text-center"
        },
        {
            data: "registerDate",
            className: "text-center",
            render: function (data) {
                return moment(data).format('DD MMM YYYY HH:mm:ss');
              }
        },
        {
            data: "statusName",
            className: "text-center"
        },
        {
            data: null,
            className: "text-center",
            render: function (data) {
                return `<a onclick='showEditData(${JSON.stringify(data)})' class="btn btn-mint btn-icon">
                            <i class="far fa-edit"></i>
                        </a>
                        `;
              }
        }];
    setParameterTable("staffTable", data, column);
}
// SET SELECT OPTION ===============================================
const setSelectPrefix =  function(){
    $("#editPrefix").empty();
    $("#addPrefix").empty();
    $("#addPrefix").append(new Option('Please select...', ''));
    $("#editPrefix").append(new Option('Please select...', ''));
    for (const element of prefixData){
        $("#addPrefix").append(new Option(element.name, element.value));
        $("#editPrefix").append(new Option(element.name, element.value));
    }  
    $('.selectpicker').selectpicker('refresh');
}
const setSelectPrefixEdit = function(){
    $("#editPrefix").empty();
    $("#editPrefix").append(new Option('Please select...', ''));
    for (const element of allPrefixData){
        $("#editPrefix").append(new Option(element.name, element.value));
    }  
    $('.selectpicker').selectpicker('refresh');
}

const setSelectStatus = function(){
    $("#staffSearchStatus").append(new Option('Please select...', ''));
    $("#editStatus").append(new Option('Please select...', ''));
    for(const element of statusData){
        $("#editStatus").append(new Option(element.name, element.value));
        $("#staffSearchStatus").append(new Option(element.name, element.value));
    }  
    $('.selectpicker').selectpicker('refresh');
}
// SEND DATA TO api add =================================================
const addStaffData = async function(){
    $("#addStaffForm").bootstrapValidator("destroy");
    if (validateAddData()) {
        const saveData = {
            staffPrefix: (document.getElementById("addPrefix").value).trim() ,
            staffFirstName: (document.getElementById("addFirstname").value).trim(),
            staffLastName: (document.getElementById("addLastname").value).trim(),
            staffEmail: (document.getElementById("addEmail").value).trim(),
            staffTel: (document.getElementById("addTelephone").value).trim(),
            staffUsername: (document.getElementById("addEmail").value).trim(),
            staffPassword: generatePassword(),
            staffStatus: '0' ,
            program: 'staff'
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to save",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save it!'
        }).then((result) => {
            if (result.value) {
                fatchResult(`${API.staff}/addStaff`,saveData).then(res => {
                    if(res){
                        addOrEditBool = true;
                        document.getElementById("addUsername").value = saveData.staffUsername;
                        document.getElementById("addPassword").value = saveData.staffPassword;
                    }
                });
            }
        });
    }
}
// SEND DATA TO API EDIT =================================================
const editStaffData = async function(){
    $("#editStaffForm").bootstrapValidator("destroy");
    if (validateEditData()) {
        const saveData = {
            _id: editData._id,
            staffPrefix: (document.getElementById("editPrefix").value).trim(),
            staffFirstName: (document.getElementById("editFirstname").value).trim(),
            staffLastName: (document.getElementById("editLastname").value).trim(),
            staffEmail: (document.getElementById("editEmail").value).trim(),
            staffTel: (document.getElementById("editTelephone").value).trim(),
            staffUsername: (editData.staffUsername).trim(),
            staffStatus: (document.getElementById("editStatus").value).trim(),
            program: 'staff'
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to edit",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, edit it!'
        }).then((result) => {
            if (result.value) {
                fatchResult(`${API.staff}/editStaff`,saveData).then(res => {
                    if(res){
                        addOrEditBool = true;
                    }
                });
            }
        });
    }
}
// SEND DATA TO API RESET PASSWORD =================================================
const resetPassword = async function(){
    const saveData = {
        _id: editData._id,
        staffUsername: editData.staffUsername,    
        staffPassword: generatePassword(),
        program: 'staff'
    }
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to reset password",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
        if (result.value) {
            fatchResult(`${API.staff}/resetPassword`,saveData).then(res => {
                if(res){
                    document.getElementById('editPassword').value = saveData.staffPassword;
                }
            });
        }
    });
}
// CLOSE MODAL =================================================
const closeModal = function(){
    $('#staff-edit-modal').modal('hide');
    $('#staff-add-modal').modal('hide');
    $("#editStaffForm").bootstrapValidator("destroy");
    $("#addStaffForm").bootstrapValidator("destroy");
    document.getElementById("addPrefix").value = '';
    document.getElementById("addFirstname").value = '';
    document.getElementById("addLastname").value = '';
    document.getElementById("addEmail").value = '';
    document.getElementById("addTelephone").value = '';
    document.getElementById("addEmail").value = '';
    document.getElementById("addUsername").value = '';
    document.getElementById("addPassword").value = '';
    document.getElementById("editPassword").value = '';
    $('.selectpicker').selectpicker('refresh');
    if(addOrEditBool){
        searchStaff();
        addOrEditBool = false;
    }
}
// OPEN staff-edit-modal =================================================
const showEditData = async function(data){
    setSelectPrefixEdit();
    editData = data;
    document.getElementById("editPrefix").value = editData.staffPrefix;
    document.getElementById("editFirstname").value = editData.staffFirstName;
    document.getElementById("editLastname").value = editData.staffLastName;
    document.getElementById("editEmail").value = editData.staffEmail;
    document.getElementById("editTelephone").value = editData.staffTel;
    document.getElementById("editStatus").value = editData.status;
    document.getElementById("editUsername").value = editData.staffUsername;
    $('.selectpicker').selectpicker('refresh');
    $('#staff-edit-modal').modal({backdrop: 'static', keyboard: false});  
}
// OPEN MODAL
const openModal = function(){
    $('#staff-add-modal').modal({backdrop: 'static', keyboard: false});  
}
// VALIDATE  =============================================================
const validateAddData = function () {
    elementsName = {
        addPrefix: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                }
            }
        },
        addFirstname: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                }
            }
        },
        addLastname: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                }
            }
        },
        addEmail: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                },
            },
        },
        addTelephone: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                },
                stringLength: {
                    max: 10,
                    min: 10,
                    message: 'The Telephone must be  10 characters'
                },
                 regexp: {
                    regexp: /^[0-9]+$/,
                    message: "fomart invaild number only"
                }, 
            }
        }
    }
    if (validate('#addStaffForm', elementsName)) {
        return true;
    } else {
        return false;
    }
}
const validateEditData = function () {
    elementsName = {
        editPrefix: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                }
            }
        },
        editFirstname: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                }
            }
        },
        editLastname: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                }
            }
        },
        editEmail: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                },
            },
           
        },
        editTelephone: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                },
                 regexp: {
                    regexp: /^[0-9]+$/,
                    message: "fomart invaild number only"
                },
                stringLength: {
                    max: 10,
                    min: 10,
                    message: 'The Telephone must be  10 characters'
                }
            }
        },
        editStatus: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                }
            }
        }
    }
    if (validate('#editStaffForm', elementsName)) {
        return true;
    } else {
        return false;
    }
}
const validateSearchData = function () {
    elementsName = {
        staffSearchTel: {
            validators: {
                 regexp: {
                    regexp: /^[0-9]+$/,
                    message: "fomart invaild number only"
                },
                stringLength: {
                    max: 10,
                    message: 'The Telephone must be  10 characters'
                }
            }
        },
    }
    if (validate('#searchForm', elementsName)) {
        return true;
    } else {
        return false;
    }
}
// =====================================================================================