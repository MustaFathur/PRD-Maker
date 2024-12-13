const { User, PRD, Personil, Timeline, Success_Metrics, User_Stories, UI_UX, References, DARCI, DocumentOwner, Stakeholder, Developer, Problem_Statement, Objective } = require('../models');
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
    const { stage, userFilter } = req.query;
    const whereClause = {};

    if (stage) {
      whereClause.document_stage = stage;
    }

    if (userFilter === 'current') {
      whereClause.user_id = req.user.user_id;
    }

    const prds = await PRD.findAll({
      where: whereClause,
      include: [
        { model: DocumentOwner, as: 'documentOwners' },
        { model: Stakeholder, as: 'stakeholders' },
        { model: Developer, as: 'developers' },
        { model: DARCI, as: 'darciRoles' },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: Problem_Statement, as: 'problemStatements' },
        { model: Objective, as: 'objectives' },
        { model: User, attributes: ['name'], as: 'user' }
      ]
    });

    const prdList = prds.map(prd => {
      const prdData = JSON.parse(JSON.stringify(prd));
      prdData.document_owner = prdData.documentOwners.map(owner => owner.personil_name).join(', ') || 'N/A';
      prdData.developer = prdData.developers.map(dev => dev.personil_name).join(', ') || 'N/A';
      prdData.stakeholder = prdData.stakeholders.map(stake => stake.personil_name).join(', ') || 'N/A';
      prdData.user_name = prd.user.name; 
      return prdData;
    });

    res.json(prdList);
  } catch (error) {
    console.error('Error fetching PRDs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getPRDById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching PRD with ID: ${id}`);
    const prd = await PRD.findByPk(id, {
      include: [
        { model: DocumentOwner, as: 'documentOwners' },
        { model: Stakeholder, as: 'stakeholders' },
        { model: Developer, as: 'developers' },
        { model: DARCI, as: 'darciRoles' },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: Problem_Statement, as: 'problemStatements' },
        { model: Objective, as: 'objectives' },
        { model: UI_UX, as: 'uiUx' },
        { model: References, as: 'references' }
      ]
    });
    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    // Convert Sequelize model instance to plain object
    const prdData = JSON.parse(JSON.stringify(prd));
    console.log('Fetched PRD data:', prdData);

    // Ensure all required properties are defined
    prdData.created_date = prdData.created_date || 'N/A';

    // Extract Document Owner, Developer, and Stakeholder from the respective tables
    prdData.document_owner = prdData.documentOwners.map(owner => owner.personil_name) || [];
    prdData.developer = prdData.developers.map(dev => dev.personil_name) || [];
    prdData.stakeholder = prdData.stakeholders.map(stake => stake.personil_name) || [];

    prdData.darciRoles = prd.darciRoles.map(darci => ({
      role: darci.role,
      personil_name: darci.personil_name,
      guidelines: darci.guidelines
    }));

    prdData.uiUx = prd.uiUx.map(uiux => ({
      link: uiux.link
    }));

    prdData.references = prd.references.map(reference => ({
      link: reference.reference_link
    }));

    console.log('Processed PRD data:', prdData);
    res.json(prdData);
  } catch (error) {
    console.error('Error fetching PRD:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const createPRD = async (req, res) => {
  try {
    const flaskUrl = process.env.FLASK_URL || 'http://127.0.0.1:8080'
    const { document_version, product_name, document_owner, developer, stakeholder, project_overview, darci_roles, start_date, end_date } = req.body;

    // Fetch personil names based on IDs
    const documentOwnerNames = await Personil.findAll({ where: { personil_id: document_owner }, attributes: ['personil_id', 'personil_name'] });
    const developerNames = await Personil.findAll({ where: { personil_id: developer }, attributes: ['personil_id', 'personil_name'] });
    const stakeholderNames = await Personil.findAll({ where: { personil_id: stakeholder }, attributes: ['personil_id', 'personil_name'] });

    // Convert personil IDs to names
    const documentOwnerNamesMap = documentOwnerNames.reduce((acc, personil) => {
      acc[personil.personil_id] = personil.personil_name;
      return acc;
    }, {});
    const developerNamesMap = developerNames.reduce((acc, personil) => {
      acc[personil.personil_id] = personil.personil_name;
      return acc;
    }, {});
    const stakeholderNamesMap = stakeholderNames.reduce((acc, personil) => {
      acc[personil.personil_id] = personil.personil_name;
      return acc;
    }, {});

    // Prepare data to send to LLM API
    const prdDataToSend = {
      document_version,
      product_name,
      document_owner: document_owner.map(id => documentOwnerNamesMap[id]),
      developer: developer.map(id => developerNamesMap[id]),
      stakeholders: stakeholder.map(id => stakeholderNamesMap[id]),
      project_overview,
      darci_roles,
      start_date,
      end_date
    };

    // Send data to LLM API
    const response = await axios.post(`${flaskUrl}/api/generate-prd`, prdDataToSend);

    // Log the response from LLM API
    console.log('Response from LLM API:', response.data);

    // Retrieve generated PRD data from LLM API
    const generatedPRD = response.data;

    // Check if generatedPRD contains the expected properties
    if (!generatedPRD || !generatedPRD.darci || !generatedPRD.header || !generatedPRD.overview || !generatedPRD.project_timeline || !generatedPRD.success_metrics || !generatedPRD.user_stories) {
      throw new Error('Invalid response from LLM API');
    }

    // Extract Problem Statements and Objectives
    const problemStatements = generatedPRD.overview.sections
      .filter(section => section.title.toLowerCase().includes('problem statement'))
      .map(section => section.content);

    const objectives = generatedPRD.overview.sections
      .filter(section => section.title.toLowerCase().includes('objective'))
      .map(section => section.content);

    // Store generated PRD data in the database
    const newPRD = await PRD.create({
      user_id: req.user.user_id,
      document_version: generatedPRD.header.document_version,
      product_name: generatedPRD.header.product_name,
      document_stage: 'draft', // Set document_stage to 'draft'
      project_overview, // Use project_overview from user input
      created_date: new Date(generatedPRD.header.created_date),
      start_date,
      end_date
    });

    // Store Document Owners
    await Promise.all(document_owner.map(id => DocumentOwner.create({ prd_id: newPRD.prd_id, personil_name: documentOwnerNamesMap[id] })));

    // Store Developers
    await Promise.all(developer.map(id => Developer.create({ prd_id: newPRD.prd_id, personil_name: developerNamesMap[id] })));

    // Store Stakeholders
    await Promise.all(stakeholder.map(id => Stakeholder.create({ prd_id: newPRD.prd_id, personil_name: stakeholderNamesMap[id] })));

    // Store DARCI roles
    await Promise.all([
      ...darci_roles.decider.map(personil_id => DARCI.create({ prd_id: newPRD.prd_id, personil_id, role: 'decider', personil_name: documentOwnerNamesMap[personil_id] || developerNamesMap[personil_id] || stakeholderNamesMap[personil_id], guidelines: generatedPRD.darci.roles.find(role => role.name === 'decider').guidelines })),
      ...darci_roles.accountable.map(personil_id => DARCI.create({ prd_id: newPRD.prd_id, personil_id, role: 'accountable', personil_name: documentOwnerNamesMap[personil_id] || developerNamesMap[personil_id] || stakeholderNamesMap[personil_id], guidelines: generatedPRD.darci.roles.find(role => role.name === 'accountable').guidelines })),
      ...darci_roles.responsible.map(personil_id => DARCI.create({ prd_id: newPRD.prd_id, personil_id, role: 'responsible', personil_name: documentOwnerNamesMap[personil_id] || developerNamesMap[personil_id] || stakeholderNamesMap[personil_id], guidelines: generatedPRD.darci.roles.find(role => role.name === 'responsible').guidelines })),
      ...darci_roles.consulted.map(personil_id => DARCI.create({ prd_id: newPRD.prd_id, personil_id, role: 'consulted', personil_name: documentOwnerNamesMap[personil_id] || developerNamesMap[personil_id] || stakeholderNamesMap[personil_id], guidelines: generatedPRD.darci.roles.find(role => role.name === 'consulted').guidelines })),
      ...darci_roles.informed.map(personil_id => DARCI.create({ prd_id: newPRD.prd_id, personil_id, role: 'informed', personil_name: documentOwnerNamesMap[personil_id] || developerNamesMap[personil_id] || stakeholderNamesMap[personil_id], guidelines: generatedPRD.darci.roles.find(role => role.name === 'informed').guidelines }))
    ]);

    // Store timelines
    await Promise.all(generatedPRD.project_timeline.phases.map(timeline => Timeline.create({ prd_id: newPRD.prd_id, time_period: timeline.time_period, activity: timeline.activity, pic: timeline.pic })));

    // Store success metrics
    await Promise.all(generatedPRD.success_metrics.metrics.map(metric => Success_Metrics.create({ prd_id: newPRD.prd_id, name: metric.name, definition: metric.definition, current: metric.current, target: metric.target })));

    // Store user stories
    await Promise.all(generatedPRD.user_stories.stories.map(story => User_Stories.create({ prd_id: newPRD.prd_id, title: story.title, user_story: story.user_story, acceptance_criteria: story.acceptance_criteria, priority: story.priority })));

    // Store problem statements
    await Promise.all(problemStatements.map(content => Problem_Statement.create({ prd_id: newPRD.prd_id, content })));

    // Store objectives
    await Promise.all(objectives.map(content => Objective.create({ prd_id: newPRD.prd_id, content })));

    // Fetch the newly created PRD with all related data
    const createdPRD = await PRD.findByPk(newPRD.prd_id, {
      include: [
        { model: DocumentOwner, as: 'documentOwners' },
        { model: Stakeholder, as: 'stakeholders' },
        { model: Developer, as: 'developers' },
        { model: DARCI, as: 'darciRoles' },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: Problem_Statement, as: 'problemStatements' },
        { model: Objective, as: 'objectives' }
      ]
    });

    const createdPRDData = JSON.parse(JSON.stringify(createdPRD));
    createdPRDData.document_owner = createdPRDData.documentOwners.map(owner => owner.personil_name) || [];
    createdPRDData.developer = createdPRDData.developers.map(dev => dev.personil_name) || [];
    createdPRDData.stakeholder = createdPRDData.stakeholders.map(stake => stake.personil_name) || [];

    // Extract DARCI roles
    createdPRDData.darciRoles = createdPRD.darciRoles.map(darci => ({
      role: darci.role,
      personil_name: darci.personil_name,
      guidelines: darci.guidelines
    }));

    res.status(201).json(createdPRDData);
  } catch (error) {
    console.error('Error creating PRD:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const updatePRD = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      document_version,
      product_name,
      document_owner = [],
      developer = [],
      stakeholder = [],
      project_overview,
      darci_roles = [],
      start_date,
      end_date,
      ui_ux = [],
      references = [],
      problem_statements = [],
      objectives = [],
      timelines = [],
      success_metrics = [],
      user_stories = []
    } = req.body;

    console.log('Updating PRD with ID:', id);
    console.log('Request body:', req.body);

    // Find the PRD to be updated
    const prd = await PRD.findByPk(id);
    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    // Update PRD data
    prd.document_version = document_version;
    prd.product_name = product_name;
    prd.project_overview = project_overview;
    prd.start_date = start_date;
    prd.end_date = end_date;
    await prd.save();

    // Update related data (DocumentOwner, Developer, Stakeholder, DARCI, Timeline, Success Metrics, User Stories, Problem Statements, Objectives, UI_UX, References)
    await Promise.all([
      DocumentOwner.destroy({ where: { prd_id: id } }),
      Developer.destroy({ where: { prd_id: id } }),
      Stakeholder.destroy({ where: { prd_id: id } }),
      DARCI.destroy({ where: { prd_id: id } }),
      Timeline.destroy({ where: { prd_id: id } }),
      Success_Metrics.destroy({ where: { prd_id: id } }),
      User_Stories.destroy({ where: { prd_id: id } }),
      Problem_Statement.destroy({ where: { prd_id: id } }),
      Objective.destroy({ where: { prd_id: id } }),
      UI_UX.destroy({ where: { prd_id: id } }),
      References.destroy({ where: { prd_id: id } })
    ]);

    await Promise.all([
      ...document_owner.map(personil_name => DocumentOwner.create({ prd_id: id, personil_name })),
      ...developer.map(personil_name => Developer.create({ prd_id: id, personil_name })),
      ...stakeholder.map(personil_name => Stakeholder.create({ prd_id: id, personil_name })),
      ...darci_roles.map(role => DARCI.create({ prd_id: id, ...role })),
      ...timelines.map(timeline => Timeline.create({ prd_id: id, ...timeline })),
      ...success_metrics.map(metric => Success_Metrics.create({ prd_id: id, ...metric })),
      ...user_stories.map(story => User_Stories.create({ prd_id: id, ...story })),
      ...problem_statements.map(statement => Problem_Statement.create({ prd_id: id, content: statement.content })),
      ...objectives.map(objective => Objective.create({ prd_id: id, content: objective.content })),
      ...ui_ux.map(uiux => UI_UX.create({ prd_id: id, link: uiux.link })),
      ...references.map(reference => References.create({ prd_id: id, reference_link: reference.link }))
    ]);

    console.log('PRD updated successfully:', prd);
    res.json(prd);
  } catch (error) {
    console.error('Error updating PRD:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const deletePRD = async (req, res) => {
  try {
    const { id } = req.params;
    const prd = await PRD.findByPk(id);
    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    // Delete related data
    await Promise.all([
      DocumentOwner.destroy({ where: { prd_id: prd.prd_id } }),
      Stakeholder.destroy({ where: { prd_id: prd.prd_id } }),
      Developer.destroy({ where: { prd_id: prd.prd_id } }),
      DARCI.destroy({ where: { prd_id: prd.prd_id } }),
      Timeline.destroy({ where: { prd_id: prd.prd_id } }),
      Success_Metrics.destroy({ where: { prd_id: prd.prd_id } }),
      User_Stories.destroy({ where: { prd_id: prd.prd_id } }),
      Problem_Statement.destroy({ where: { prd_id: prd.prd_id } }),
      Objective.destroy({ where: { prd_id: prd.prd_id } })
    ]);

    // Delete PRD
    await prd.destroy();
    res.json({ message: 'PRD deleted successfully' });
  } catch (error) {
    console.error('Error deleting PRD:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const archivePRD = async (req, res) => {
  try {
    const { id } = req.params;
    const prd = await PRD.findByPk(id);

    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    prd.document_stage = 'completed';
    await prd.save();

    res.json({ message: 'PRD archived successfully', prd });
  } catch (error) {
    console.error('Error archiving PRD:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const downloadPRD = async (req, res) => {
  try {
    const { id } = req.params;
    const prd = await PRD.findByPk(id, {
      include: [
        { model: DocumentOwner, as: 'documentOwners' },
        { model: Stakeholder, as: 'stakeholders' },
        { model: Developer, as: 'developers' },
        { model: DARCI, as: 'darciRoles' },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: Problem_Statement, as: 'problemStatements' },
        { model: Objective, as: 'objectives' },
        { model: UI_UX, as: 'uiUx' },
        { model: References, as: 'references' },
        { model: User, attributes: ['name'], as: 'user' }
      ]
    });

    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    if (prd.document_stage === 'draft') {
      prd.document_stage = 'ongoing';
      await prd.save();
    }

    // Convert Sequelize model instance to plain object
    const prdData = JSON.parse(JSON.stringify(prd));

    // Ensure all required properties are defined
    prdData.created_date = prdData.created_date || 'N/A';

    // Extract Document Owner, Developer, and Stakeholder from the respective tables
    prdData.document_owner = prdData.documentOwners.map(owner => owner.personil_name) || [];
    prdData.developer = prdData.developers.map(dev => dev.personil_name) || [];
    prdData.stakeholder = prdData.stakeholders.map(stake => stake.personil_name) || [];

    prdData.darciRoles = prd.darciRoles.map(darci => ({
      role: darci.role,
      personil_name: darci.personil_name,
      guidelines: darci.guidelines
    }));

    prdData.uiUx = prd.uiUx.map(uiux => ({
      link: uiux.link
    }));

    prdData.references = prd.references.map(reference => ({
      link: reference.reference_link
    }));

    // Generate PDF using puppeteer
    const pdfUrl = await generatePDF(prdData);

    // Send the PDF URL to the client
    res.json({ url: pdfUrl });
  } catch (error) {
    console.error('Error downloading PRD:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  dashboard,
  getAllPRDs,
  createPRD,
  getPRDById,
  updatePRD,
  deletePRD,
  archivePRD,
  downloadPRD,
};