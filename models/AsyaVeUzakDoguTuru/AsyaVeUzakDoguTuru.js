const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "AsyaVeUzakDoguTuru",
  tableName: "AsyaVeUzakDoguTurlari",
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
    turSirketi: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    bolge: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    kategori: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    sure: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    ulasim: {
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
    enYakinTarih: {
      type: "date",
      nullable: false,
    },
    kategoriUstAciklama: {
      type: "text",
      nullable: true, // üst açıklama - isteğe bağlı
    },
    kategoriAltAciklama: {
      type: "text",
      nullable: true, // alt açıklama - isteğe bağlı
    }
  }
});
