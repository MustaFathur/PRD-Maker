const { User, PRD, Personil, Timeline, Success_Metrics, User_Stories, UI_UX, References, DARCI, PRD_Personil } = require('../models');
const axios = require('axios');
const generatePDF = require('../config/puppeteer');

const dashboard = async (req, res) => {
  try {
    const user = req.user;

    const personilTotal = await Personil.count();
    const prdDraftTotal = await PRD.count({ where: { document_stage: 'draft' } });
    const prdTotal = await PRD.count();

    res.json({
      user: {
        name: user.name,
      },
      personilTotal,
      prdDraftTotal,
      prdTotal,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getAllPRDs = async (req, res) => {
  try {
    const { stage } = req.query;
    const whereClause = stage ? { document_stage: stage } : {};
    const prds = await PRD.findAll({ where: whereClause });
    res.json(prds);
  } catch (error) {
    console.error('Error fetching PRDs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getPRDById = async (req, res) => {
  try {
    const prd = await PRD.findByPk(req.params.id, {
      include: [
        { model: DARCI, as: 'darci_roles' },
        { model: Personil, as: 'personils' },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: UI_UX, as: 'uiUx' },
        { model: References, as: 'references' }
      ],
    });
    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }
    res.json(prd);
  } catch (error) {
    console.error('Error fetching PRD:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const createPRD = async (req, res) => {
  try {
    const { document_version, product_name, document_owner, developer, stakeholder, project_overview, darci_roles, start_date, end_date } = req.body;

    // Fungsi untuk mendapatkan nama personil berdasarkan ID
    const getPersonilNames = async (ids) => {
      const personil = await Personil.findAll({ where: { personil_id: ids } });
      return personil.map(p => p.personil_name);
    };

    const documentOwnerNames = await getPersonilNames(document_owner);
    const developerNames = await getPersonilNames(developer);
    const stakeholderNames = await getPersonilNames(stakeholder);
    const deciderNames = await getPersonilNames(darci_roles.decider);
    const accountableNames = await getPersonilNames(darci_roles.accountable);
    const responsibleNames = await getPersonilNames(darci_roles.responsible);
    const consultedNames = await getPersonilNames(darci_roles.consulted);
    const informedNames = await getPersonilNames(darci_roles.informed);

    // Prepare data to send to Flask API
    const prdData = {
      product_name,
      document_owner: documentOwnerNames,
      developer: developerNames,
      stakeholder: stakeholderNames,
      project_overview,
      darci_roles: {
        decider: deciderNames,
        accountable: accountableNames,
        responsible: responsibleNames,
        consulted: consultedNames,
        informed: informedNames
      },
      start_date,
      end_date
    };

    // Send data to Flask API
    const response = await axios.post('http://localhost:8080/api/generate-prd', prdData);

    // Log the response from Flask API
    console.log('Response from Flask API:', response.data);

    // Retrieve generated PRD data from Flask API
    const generatedPRD = response.data;

    // Check if generatedPRD contains the expected properties
    if (!generatedPRD || !generatedPRD.darci || !generatedPRD.header || !generatedPRD.overview || !generatedPRD.project_timeline || !generatedPRD.success_metrics || !generatedPRD.user_stories) {
      throw new Error('Invalid response from Flask API');
    }

    // Convert overview to string
    const overviewString = JSON.stringify(generatedPRD.overview);

    // Store generated PRD data in the database
    const newPRD = await PRD.create({
      user_id: req.user.user_id,
      document_version,
      product_name: generatedPRD.header.product_name || product_name,
      document_stage: 'draft',
      created_date: new Date(),
      overview: overviewString || project_overview,
      start_date,
      end_date
    });

    // Store related data (team roles, timeline, success metrics, user stories)
    await Promise.all([
      ...generatedPRD.darci.roles.map(role => DARCI.create({ prd_id: newPRD.prd_id, role: role.role, person_id: role.person_id, guidelines: role.guidelines })),
      ...generatedPRD.project_timeline.phases.map(timeline => Timeline.create({ prd_id: newPRD.prd_id, activity: timeline.activity, start_date: timeline.start_date, end_date: timeline.end_date })),
      ...generatedPRD.success_metrics.metrics.map(metric => Success_Metrics.create({ prd_id: newPRD.prd_id, metric_name: metric.name, definition: metric.definition, actual_value: metric.current, target_value: metric.target })),
      ...generatedPRD.user_stories.stories.map(story => User_Stories.create({ prd_id: newPRD.prd_id, title: story.title, user_story: story.user_story, acceptance_criteria: story.acceptance_criteria, priority: story.priority }))
    ]);

    res.status(201).json(newPRD);
  } catch (error) {
    console.error('Error creating PRD:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const selectSource = async (req, res) => {
  try {
    const prd = await PRD.findByPk(req.params.id);
    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }
    await prd.update({ source: req.body.source });
    res.json(prd);
  } catch (error) {
    console.error('Error selecting source:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updatePRD = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, document_owner, developer, stakeholder, project_overview, darci_roles, startDate, endDate } = req.body;

    // Temukan PRD yang akan diperbarui
    const prd = await PRD.findByPk(id);
    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    // Perbarui data PRD
    prd.product_name = product_name;
    prd.overview = project_overview;
    prd.start_date = startDate;
    prd.end_date = endDate;
    await prd.save();

    // Hapus data terkait yang lama
    await Promise.all([
      DARCI.destroy({ where: { prd_id: id } }),
      Timeline.destroy({ where: { prd_id: id } }),
      Success_Metrics.destroy({ where: { prd_id: id } }),
      User_Stories.destroy({ where: { prd_id: id } }),
      UI_UX.destroy({ where: { prd_id: id } }),
      References.destroy({ where: { prd_id: id } }),
      PRD_Personil.destroy({ where: { prd_id: id } })
    ]);

    // Tambahkan data terkait yang baru
    await Promise.all([
      ...darci_roles.decider.map(role => DARCI.create({ prd_id: id, role: 'decider', person_id: role.person_id, guidelines: role.guidelines })),
      ...darci_roles.accountable.map(role => DARCI.create({ prd_id: id, role: 'accountable', person_id: role.person_id, guidelines: role.guidelines })),
      ...darci_roles.responsible.map(role => DARCI.create({ prd_id: id, role: 'responsible', person_id: role.person_id, guidelines: role.guidelines })),
      ...darci_roles.consulted.map(role => DARCI.create({ prd_id: id, role: 'consulted', person_id: role.person_id, guidelines: role.guidelines })),
      ...darci_roles.informed.map(role => DARCI.create({ prd_id: id, role: 'informed', person_id: role.person_id, guidelines: role.guidelines })),
      ...req.body.timelines.map(timeline => Timeline.create({ prd_id: id, ...timeline })),
      ...req.body.success_metrics.map(metric => Success_Metrics.create({ prd_id: id, ...metric })),
      ...req.body.user_stories.map(story => User_Stories.create({ prd_id: id, ...story })),
      ...req.body.ui_ux.map(uiux => UI_UX.create({ prd_id: id, ...uiux })),
      ...req.body.references.map(reference => References.create({ prd_id: id, ...reference })),
      ...document_owner.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'documentOwner' })),
      ...developer.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'developer' })),
      ...stakeholder.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'stakeholder' }))
    ]);

    res.json({ message: 'PRD updated successfully' });
  } catch (error) {
    console.error('Error updating PRD:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const deletePRD = async (req, res) => {
  try {
    const prd = await PRD.findByPk(req.params.id);
    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    // Delete related data
    await Promise.all([
      DARCI.destroy({ where: { prd_id: prd.prd_id } }),
      Timeline.destroy({ where: { prd_id: prd.prd_id } }),
      Success_Metrics.destroy({ where: { prd_id: prd.prd_id } }),
      User_Stories.destroy({ where: { prd_id: prd.prd_id } }),
      UI_UX.destroy({ where: { prd_id: prd.prd_id } }),
      References.destroy({ where: { prd_id: prd.prd_id } }),
      PRD_Personil.destroy({ where: { prd_id: prd.prd_id } })
    ]);

    // Delete PRD
    await prd.destroy();

    res.json({ message: 'PRD deleted successfully' });
  } catch (error) {
    console.error('Error deleting PRD:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const downloadPRD = async (req, res) => {
  try {
    const prd = await PRD.findByPk(req.params.id, {
      include: [
        { model: DARCI, as: 'darci_roles', include: [{ model: Personil }] },
        { model: Personil, as: 'personils' },
        { model: Timeline, as: 'timelines', include: [{ model: Personil }] },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: UI_UX, as: 'uiUx' },
        { model: References, as: 'references' },
        { model: PRD_Personil, as: 'prdPersonils', include: [{ model: Personil }] }
      ],
    });
    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    // Convert Sequelize model instance to plain object
    const prdData = JSON.parse(JSON.stringify(prd));

    // Ensure all required properties are defined
    prdData.created_date = prdData.created_date || 'N/A';

    // Map person names to DARCI roles and timelines
    prdData.darci_roles = prdData.darci_roles.map(role => ({
      ...role,
      person_name: role.Personil ? role.Personil.personil_name : 'N/A'
    }));
    prdData.timelines = prdData.timelines.map(timeline => ({
      ...timeline,
      pic_name: timeline.Personil ? timeline.Personil.personil_name : 'N/A'
    }));

    // Extract Document Owner, Developer, and Stakeholder from prdPersonils
    prdData.document_owner = prdData.prdPersonils.find(personil => personil.role === 'documentOwner')?.Personil.personil_name || 'N/A';
    prdData.developer = prdData.prdPersonils.filter(personil => personil.role === 'developer').map(personil => personil.Personil.personil_name).join(', ') || 'N/A';
    prdData.stakeholder = prdData.prdPersonils.filter(personil => personil.role === 'stakeholder').map(personil => personil.Personil.personil_name).join(', ') || 'N/A';

    // Generate PDF from PRD data and get the file path
    const pdfPath = await generatePDF(prdData);

    // Send the file path as the response
    res.json({ message: 'PDF generated successfully', path: pdfPath });
  } catch (error) {
    console.error('Error downloading PRD:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  dashboard,
  getAllPRDs,
  createPRD,
  getPRDById,
  selectSource,
  updatePRD,
  deletePRD,
  downloadPRD,
};