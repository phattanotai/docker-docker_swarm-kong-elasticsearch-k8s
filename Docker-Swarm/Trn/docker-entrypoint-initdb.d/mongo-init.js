print('Start #################################################################');

db = db.getSiblingDB('trn');
db.createUser(
  {
    user: 'admin',
    pwd: '1234',
    roles: [{ role: 'readWrite', db: 'trn' }],
  },
);

db.createCollection('su_staff');
db.createCollection('su_organization');
db.createCollection('su_parameter');
db.createCollection('db_prefix');

db.su_staff.createIndex({email: 1, tel: 1},{ unique: true })
db.su_organization.createIndex({ou_name: 1},{ unique: true })

db.su_staff.insertMany([
  {
    "_id": ObjectId("5f4db31ec16246183cae1654"),
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "username": "staff@gmail.com",
    "prefix": ObjectId("5f522961ff666d127df0aabf"),
    "first_name": "staff",
    "last_name": "admin",
    "tel": "0854222522",
    "email": "staff@gmail.com",
    "password": "6e1a64e8d3380c0a5ca9f7e924ad092f17fd2b72a8c5058c5aafd88e474fa6fd",
    "reg_date": new Date(),
    "last_login_date": new Date(),
    "status": "0",
    "cr_by": "0",
    "cr_date": new Date(),
    "cr_prog": "staff",
    "upd_by": "staff@gmail.com",
    "upd_date": new Date(),
    "upd_prog": "staff"
}
])

db.su_organization.insertMany([
  {
    "_id": "5ce6471176e0c7dbe3548a1f",
    "ou_name": "HRM999",
    "ou_code": "HR",
    "ou_desc": "HRM999",
    "active": "1",
    "upd_by": "jakarta",
    "upd_date": new Date(),
    "upd_prog": "IPSUMT01"
  }
])

db.db_prefix.insertMany([
  {
    "_id": ObjectId("614b08fd1ba066662d25d938"),
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prefix_name": "นาย",
    "prefix_desc": "",
    "active": "1",
    "cr_by": "staff@gmail.com",
    "cr_date": new Date(),
    "cr_prog": "PrefixMember"
}
])

db.su_parameter.insertMany([
  {
    "_id": "5f4dbc2ec16246183cae1665",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "staff",
    "param_name": "staff_status",
    "param_seq": "0",
    "param_desc": "Normal",
    "param_value": "0",
    "active": "1",
    "param_default": "1",
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f4dbc5dc16246183cae1666",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "staff",
    "param_name": "staff_status",
    "param_seq": "1",
    "param_desc": "Lock",
    "param_value": "1",
    "active": "1",
    "param_default": "0",
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f4dbc84c16246183cae1667",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "staff",
    "param_name": "staff_status",
    "param_seq": "2",
    "param_desc": "Expired",
    "param_value": "2",
    "active": "1",
    "param_default": "0",
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f4f5fb8bcbf1747506eca67",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "withdraw",
    "param_name": "withdraw_status",
    "param_seq": "0",
    "param_desc": "New",
    "param_value": "000",
    "active": "1",
    "param_default": "1",
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f4f5fb8bcbf1747506eca68",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "withdraw",
    "param_name": "withdraw_status",
    "param_seq": "1",
    "param_desc": "Approve",
    "param_value": "200",
    "active": "1",
    "param_default": "0",
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f4f5fb8bcbf1747506eca69",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "withdraw",
    "param_name": "withdraw_status",
    "param_seq": "2",
    "param_desc": "Reject",
    "param_value": "300",
    "active": "1",
    "param_default": "0",
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f51b32b96a2a1e67479812c",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "member",
    "param_name": "member_status",
    "param_seq": 0,
    "param_desc": "Normal",
    "param_value": "0",
    "active": "1",
    "param_default": 1,
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f51b3e996a2a1e67479812d",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "member",
    "param_name": "member_status",
    "param_seq": 1,
    "param_desc": "Lock",
    "param_value": "1",
    "active": "1",
    "param_default": 0,
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f51b43d96a2a1e67479812e",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "member",
    "param_name": "member_status",
    "param_seq": 2,
    "param_desc": "Expired",
    "param_value": "2",
    "active": "1",
    "param_default": 0,
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f55d8d20df26b45da91c1f9",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "deposit",
    "param_name": "deposit_status",
    "param_seq": 0,
    "param_desc": "New",
    "param_value": "000",
    "active": "1",
    "param_default": 1,
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f55d8d20df26b45da91c1fa",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "deposit",
    "param_name": "deposit_status",
    "param_seq": 1,
    "param_desc": "Approve",
    "param_value": "200",
    "active": "1",
    "param_default": 0,
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f55d8d20df26b45da91c1fb",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "deposit",
    "param_name": "deposit_status",
    "param_seq": 2,
    "param_desc": "Reject",
    "param_value": "300",
    "active": "1",
    "param_default": 0,
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f56088e969deb4dc4cce8fa",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "master_data",
    "param_name": "active",
    "param_seq": "1",
    "param_desc": "Active",
    "param_value": "1",
    "active": "1",
    "param_default": "1",
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f56092b969deb4dc4cce8fb",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "master_data",
    "param_name": "active",
    "param_seq": "2",
    "param_desc": "In active",
    "param_value": "0",
    "active": "1",
    "param_default": "0",
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f6822d250918c5121c5d1b2",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "deposit",
    "param_name": "deposit_status",
    "param_seq": 0,
    "param_desc": "Waiting",
    "param_value": "400",
    "active": "1",
    "param_default": 0,
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": "5f6843087b8fcf4158fe62f6",
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "withdraw",
    "param_name": "withdraw_status",
    "param_seq": 3,
    "param_desc": "Waiting",
    "param_value": "400",
    "active": "1",
    "param_default": 0,
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  },
  {
    "_id": ObjectId(),
    "ou_id": ObjectId("5ce6471176e0c7dbe3548a1f"),
    "prog_module": "withdraw",
    "param_name": "withdraw_status",
    "param_seq": 3,
    "param_desc": "Waiting",
    "param_value": "400",
    "active": "1",
    "param_default": 0,
    "cr_by": "INITIAL",
    "cr_date": new Date(),
    "cr_prog": "INITIAL",
    "upd_by": "INITIAL",
    "upd_date": new Date(),
    "upd_prog": "INITIAL"
  }
])

print('END #################################################################');