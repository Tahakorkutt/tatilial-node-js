const { getRepository } = require("typeorm");
const AdminUsers = require("../../models/GeneralSettings/AdminUsersModel");

const getAdminUsers = async (req, res) => {
  try {
    const adminUserRepository = getRepository(AdminUsers);
    const adminUsers = await adminUserRepository.find();
    res.json(adminUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUserRepository = await getRepository(AdminUsers);
    const adminUser = await adminUserRepository.findOneBy({ id: id });
    if (adminUser) {
      res.json(adminUser);
    } else {
      res.status(404).json({ message: "Admin user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdminUser = async (req, res) => {
  try {
    const adminUserRepository = getRepository(AdminUsers);
    const adminUser = adminUserRepository.create(req.body);
    const savedAdminUser = await adminUserRepository.save(adminUser);
    res.status(201).json(savedAdminUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUserRepository = await getRepository(AdminUsers);
    const adminUser = await adminUserRepository.findOneBy({ id: id });
    if (adminUser) {
      getRepository(AdminUsers).merge(adminUser, req.body);
      const result = await getRepository(AdminUsers).save(adminUser);
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Admin user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAdminUser = async (req, res) => {
  try {
    const result = await getRepository(AdminUsers).delete(req.params.id);
    if (result.affected) {
      res.status(200).json({ message: "Admin user deleted successfully" });
    } else {
      res.status(404).json({ message: "Admin user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
};
