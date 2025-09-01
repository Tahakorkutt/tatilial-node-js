const { getRepository } = require("typeorm");
const DubaiTurlari = require("../../models/DubaiTurlari/dubaiturlari")

const getAllTurlar = async (req, res) => {
  try {
    const turlar = await getRepository(DubaiTurlari).find();
    res.json(turlar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTuruById = async (req, res) => {
  try {
    const id = req.params.id;
    const tur = await getRepository(DubaiTurlari).findOneBy({ id: parseInt(id) });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });
    res.json(tur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTuru = async (req, res) => {
  try {
    const newTur = getRepository(DubaiTurlari).create(req.body);
    const result = await getRepository(DubaiTurlari).save(newTur);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTuru = async (req, res) => {
  try {
    const id = req.params.id;
    const turRepo = getRepository(DubaiTurlari);
    const tur = await turRepo.findOneBy({ id: parseInt(id) });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });

    turRepo.merge(tur, req.body);
    const result = await turRepo.save(tur);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTuru = async (req, res) => {
  try {
    const id = req.params.id;
    const turRepo = getRepository(DubaiTurlari);
    const tur = await turRepo.findOneBy({ id: parseInt(id) });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });

    await turRepo.remove(tur);
    res.json({ message: "Tur başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTurlar,
  getTuruById,
  createTuru,
  updateTuru,
  deleteTuru,
};


