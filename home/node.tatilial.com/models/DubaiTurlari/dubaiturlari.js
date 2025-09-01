const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "DubaiTuru",
  tableName: "DubaiTurlari",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    turAdi: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    cikisNoktasi: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    sure: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    fiyat: {
      type: "decimal",
      precision: 18,
      scale: 2,
      nullable: false,
    },
    paraBirimi: {
      type: "varchar",
      length: 10,
      nullable: false,
    },
    tarih: {
      type: "date",
      nullable: false,
    },
    turSuresi: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    gun: { // 🔹 varchar olarak tanımlandı
      type: "varchar",
      length: 50,
      nullable: false,
    },
    kategori: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    turSirketi: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    kategoriUstAciklama: {
      type: "text",
      nullable: true,
    },
    kategoriAltAciklama: {
      type: "text",
      nullable: true,
    }
  }
});
