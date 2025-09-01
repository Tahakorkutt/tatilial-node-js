const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Rezervasyon",
  tableName: "Rezervasyon",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    ad: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    turAdi: {        // BURASI EKLENDİ
      type: "varchar",
      length: 255,
      nullable: false,
    },
    soyad: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    iletisimNumarasi: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    mesaj: {
      type: "varchar",
      length: 100,
      nullable: false,
    }
  }
});
