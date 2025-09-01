const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "AdminUsers",
  tableName: "adminUsers",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      length: 255,
    },
    email: {
      type: "varchar",
      length: 255,
    },
    dateOfRegistration: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    lastLogin: {
      type: "timestamp",
      nullable: true,
    },
    grade: {
      type: "varchar",
      length: 50,
    },
    telNumber: {
      type: "varchar",
      length: 20,
    },
    job: {
      type: "varchar",
      length: 255,
    },
  },
});
