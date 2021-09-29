const {collections} = require('../constants/constantsVariable');

const param = require('./su_parameter.js');
const organ = require('./su_organization.js');
const staff = require('./su_staff.js');

(async () => {
    try {
    const db = await require('./config/mongodb')();
    
    const coll = await db.listCollections().toArray();
    const collectionNames = coll.map(c => c.name);

    
    for(const i of collectionNames){
      if(i === collections.staff){
        await db.collection(collections.staff).drop()
      }

      if(i === collections.organization){
         await db.collection(collections.organization).drop()
      }

      if(i === collections.parameter){
        await db.collection(collections.parameter).drop()
      }
    }
    

    await db.collection(collections.staff).createIndex({email: 1, tel: 1},{ unique: true })
    await db.collection(collections.organization).createIndex({ou_name: 1},{ unique: true })
   

    await db.collection(collections.staff).insertMany(staff)
    await db.collection(collections.organization).insertMany(organ)
    await db.collection(collections.parameter).insertMany(param)

    console.log("migration data success");
    process.exit(1)

    } catch (error) {
        throw error;
    }
})();

