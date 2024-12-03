const { Personil } = require('../models');

const getAllPersonil = async (req, res) => {
  try {
    const personil = await Personil.findAll();
    res.json(personil);
  } catch (error) {
    console.error('Error fetching personil:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getPersonilById = async (req, res) => {
  try {
    const personil = await Personil.findByPk(req.params.id);
    if (!personil) {
      return res.status(404).json({ message: 'Personil not found' });
    }
    res.json(personil);
  } catch (error) {
    console.error('Error fetching personil:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createPersonil = async (req, res) => {
  try {
    const { personil_name, role } = req.body;
    const created_by = req.user.user_id;
    const newPersonil = await Personil.create({ personil_name, role, created_by });
    res.status(201).json(newPersonil);
  } catch (error) {
    console.error('Error creating personil:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updatePersonil = async (req, res) => {
  try {
    const { personil_name, role } = req.body;
    const personil = await Personil.findByPk(req.params.id);
    if (!personil) {
      return res.status(404).json({ message: 'Personil not found' });
    }
    personil.personil_name = personil_name;
    personil.role = role;
    await personil.save();
    res.json(personil);
  } catch (error) {
    console.error('Error updating personil:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deletePersonil = async (req, res) => {
  try {
    const personil = await Personil.findByPk(req.params.id);
    if (!personil) {
      return res.status(404).json({ message: 'Personil not found' });
    }
    await personil.destroy();
    res.json({ message: 'Personil deleted successfully' });
  } catch (error) {
    console.error('Error deleting personil:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllPersonil,
  getPersonilById,
  createPersonil,
  updatePersonil,
  deletePersonil,
};