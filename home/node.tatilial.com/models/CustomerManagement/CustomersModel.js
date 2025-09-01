const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    usersId: {
      type: "int",
      nullable: true,
    },
    firstName: {
      type: "varchar",
      nullable: false,
      length: 255,
      transformer: {
        to: (value) => value.toLowerCase(),
        from: (value) => value,
      },
    },
    lastName: {
      type: "varchar",
      nullable: false,
      length: 255,
      transformer: {
        to: (value) => value.toLowerCase(),
        from: (value) => value,
      },
    },
    email: {
      type: "varchar",
      nullable: false,
      unique: true,
      length: 255,
    },
    password: {
      type: "varchar",
      nullable: false,
      length: 255,
    },
    telNumber: {
      type: "varchar",
      nullable: true,
    },
    identityNo: {
      type: "varchar",
      //unique: true,
      nullable: true,
    },
    passportNo: {
      type: "varchar",
      //unique: true,
      nullable: true,
    },
    gender: {
      type: "varchar",
      nullable: true,
    },
    customerType: {
      type: "varchar",
      nullable: true,
    },
    address: {
      type: "varchar",
      nullable: true,
    },
    city: {
      type: "varchar",
      nullable: true,
    },
    country: {
      type: "varchar",
      nullable: true,
    },
    dateOfBirth: {
      type: "date",
      nullable: true,
    },
    companyName: {
      type: "varchar",
      nullable: true,
    },
    taxAdministration: {
      type: "varchar",
      nullable: true,
    },
    taxNo: {
      type: "varchar",
      nullable: true,
    },
    registrationDate: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    lastLoginDate: {
      type: "timestamp",
      nullable: true,
    },
    isBlackList: {
      type: "boolean",
      default: false,
    },
    messagePermition: {
      type: "boolean",
      default: true,
    },
    deniz: {
      type: "boolean",
      default: true,
    },
  }
});
