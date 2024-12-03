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
    const { document_version, product_name, document_owner, developer, stakeholder, project_overview, darci_roles, startDate, endDate } = req.body;

    // Ensure req.user is defined
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    // Validate input data
    if (!darci_roles || typeof darci_roles !== 'object') {
      console.error('Invalid darci_roles data:', darci_roles);
      throw new Error('Invalid darci_roles data');
    }

    const { decider = [], accountable = [], responsible = [], consulted = [], informed = [] } = darci_roles;

    // Fetch personil names based on IDs
    const getPersonilNames = async (ids) => {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return [];
      }
      const personil = await Personil.findAll({ where: { personil_id: ids.filter(id => id !== undefined) } });
      return personil.map(p => p.personil_name);
    };

    const documentOwnerNames = await getPersonilNames(document_owner);
    const developerNames = await getPersonilNames(developer);
    const stakeholderNames = await getPersonilNames(stakeholder);
    const deciderNames = await getPersonilNames(decider);
    const accountableNames = await getPersonilNames(accountable);
    const responsibleNames = await getPersonilNames(responsible);
    const consultedNames = await getPersonilNames(consulted);
    const informedNames = await getPersonilNames(informed);

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
      startDate,
      endDate
    };

    // Send data to Flask API
    const response = await axios.post('http://localhost:5001/api/generate-prd', prdData);

    // Retrieve generated PRD data from Flask API
    const generatedPRD = response.data;

    // Store generated PRD data in the database
    const newPRD = await PRD.create({
      user_id: req.user.user_id,
      document_version,
      product_name,
      document_stage: 'draft',
      created_date: new Date(),
      overview: generatedPRD.project_overview.overview,
      start_date: startDate,
      end_date: endDate
    });

    // Store related data (team roles, timeline, success metrics, user stories, UI/UX, references)
    await Promise.all([
      ...generatedPRD.darci_roles.decider.map(role => DARCI.create({ prd_id: newPRD.prd_id, role: 'decider', person_id: role.person_id, guidelines: role.guidelines })),
      ...generatedPRD.darci_roles.accountable.map(role => DARCI.create({ prd_id: newPRD.prd_id, role: 'accountable', person_id: role.person_id, guidelines: role.guidelines })),
      ...generatedPRD.darci_roles.responsible.map(role => DARCI.create({ prd_id: newPRD.prd_id, role: 'responsible', person_id: role.person_id, guidelines: role.guidelines })),
      ...generatedPRD.darci_roles.consulted.map(role => DARCI.create({ prd_id: newPRD.prd_id, role: 'consulted', person_id: role.person_id, guidelines: role.guidelines })),
      ...generatedPRD.darci_roles.informed.map(role => DARCI.create({ prd_id: newPRD.prd_id, role: 'informed', person_id: role.person_id, guidelines: role.guidelines })),
      ...generatedPRD.project_timeline.milestones.map(milestone => Timeline.create({ prd_id: newPRD.prd_id, start_date: milestone.start_date, end_date: milestone.end_date, activity: milestone.activity, pic_id: milestone.pic_id })),
      ...generatedPRD.success_metrics.map(metric => Success_Metrics.create({ prd_id: newPRD.prd_id, metric_name: metric.metric_name, definition: metric.definition, actual_value: metric.actual_value, target_value: metric.target_value })),
      ...generatedPRD.user_stories.map(story => User_Stories.create({ prd_id: newPRD.prd_id, title: story.title, user_story: story.user_story, acceptance_criteria: story.acceptance_criteria, priority: story.priority })),
      UI_UX.create({ prd_id: newPRD.prd_id, link: generatedPRD.ui_ux.link }),
      ...generatedPRD.references.map(ref => References.create({ prd_id: newPRD.prd_id, reference_link: ref.reference_link })),
      ...document_owner.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'documentOwner' })),
      ...developer.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'developer' })),
      ...stakeholder.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'stakeholder' }))
    ]);

    // Fetch the complete PRD with its associations
    const completePRD = await PRD.findByPk(newPRD.prd_id, {
      include: [
        { model: DARCI, as: 'darciRoles' },
        { model: Personil, as: 'personils' },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: UI_UX, as: 'uiUx' },
        { model: References, as: 'references' }
      ]
    });

    res.status(201).json(completePRD);
  } catch (error) {
    console.error('Error creating PRD:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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