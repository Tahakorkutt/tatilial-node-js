const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Iletisim",
  tableName: "IletisimModel",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    adSoyad: {
      type: "varchar",
      length: 200,
      nullable: false,
    },
    konu: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    mesaj: {
      type: "varchar",
      length: 1000,
      nullable: false,
    },
    telefon: {
      type: "varchar",
      length: 20,
      nullable: true // isteğe bağlı alan; zorunlu yapmak istersen false yapabilirsin
    }
  }
});
