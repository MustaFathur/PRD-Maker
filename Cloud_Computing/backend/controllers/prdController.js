const { PRD, Personil, Timeline, Success_Metrics, User_Stories, UI_UX, References, DARCI, PRD_Personil, ProblemStatement, Objective } = require('../models');
const axios = require('axios');
const generatePDF = require('../config/puppeteer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

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

    const prds = await PRD.findAll({
      where: whereClause,
      include: [
        { model: PRD_Personil, as: 'prdPersonils', include: [{ model: Personil }] },
        { model: DARCI, as: 'darciRoles', include: [{ model: Personil }] },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: ProblemStatement, as: 'problemStatements' },
        { model: Objective, as: 'objectives' }
      ]
    });

    const prdList = prds.map(prd => {
      const prdData = JSON.parse(JSON.stringify(prd));
      prdData.document_owner = prdData.prdPersonils.find(personil => personil.role === 'document_owner')?.Personil.personil_name || 'N/A';
      prdData.developer = prdData.prdPersonils.filter(personil => personil.role === 'developer').map(personil => personil.Personil.personil_name).join(', ') || 'N/A';
      prdData.stakeholder = prdData.prdPersonils.filter(personil => personil.role === 'stakeholder').map(personil => personil.Personil.personil_name).join(', ') || 'N/A';
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
    const prd = await PRD.findByPk(id, {
      include: [
        { model: PRD_Personil, as: 'prdPersonils', include: [{ model: Personil }] },
        { model: DARCI, as: 'darciRoles', include: [{ model: Personil }] },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: ProblemStatement, as: 'problemStatements' },
        { model: Objective, as: 'objectives' }
      ]
    });
    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    // Convert Sequelize model instance to plain object
    const prdData = JSON.parse(JSON.stringify(prd));

    // Ensure all required properties are defined
    prdData.created_date = prdData.created_date || 'N/A';

    // Extract Document Owner, Developer, and Stakeholder from prdPersonils
    prdData.document_owner = prdData.prdPersonils.find(personil => personil.role === 'document_owner')?.Personil.personil_name || 'N/A';
    prdData.developer = prdData.prdPersonils.filter(personil => personil.role === 'developer').map(personil => personil.Personil.personil_name).join(', ') || 'N/A';
    prdData.stakeholder = prdData.prdPersonils.filter(personil => personil.role === 'stakeholder').map(personil => personil.Personil.personil_name).join(', ') || 'N/A';

    res.json(prdData);
  } catch (error) {
    console.error('Error fetching PRD:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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

    // Prepare data to send to LLM API
    const prdDataToSend = {
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

    // Send data to LLM API
    const response = await axios.post('http://localhost:8080/api/generate-prd', prdDataToSend);

    // Log the response from LLM API
    console.log('Response from LLM API:', response.data);

    // Retrieve generated PRD data from LLM API
    const generatedPRD = response.data;

    // Check if generatedPRD contains the expected properties
    if (!generatedPRD || !generatedPRD.darci || !generatedPRD.header || !generatedPRD.overview || !generatedPRD.project_timeline || !generatedPRD.success_metrics || !generatedPRD.user_stories) {
      throw new Error('Invalid response from LLM API');
    }

    // Convert overview sections to plain text
    const overviewText = generatedPRD.overview.sections.map(section => `${section.title}: ${section.content}`).join('\n\n');

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
      document_stage: generatedPRD.header.doc_stage,
      project_overview: overviewText,
      created_date: new Date(generatedPRD.header.created_date),
      start_date,
      end_date
    });

    // Ensure all personils exist in the database
    const allPersonils = [...document_owner, ...developer, ...stakeholder, ...darci_roles.decider, ...darci_roles.accountable, ...darci_roles.responsible, ...darci_roles.consulted, ...darci_roles.informed];
    const uniquePersonils = [...new Set(allPersonils)];
    const existingPersonils = await Personil.findAll({ where: { personil_id: uniquePersonils } });
    const existingPersonilIds = existingPersonils.map(p => p.personil_id);

    if (existingPersonilIds.length !== uniquePersonils.length) {
      throw new Error('Some personils do not exist in the database');
    }

    // Store related data (team roles, timeline, success metrics, user stories, problem statements, objectives)
    await Promise.all([
      ...document_owner.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'document_owner' })),
      ...developer.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'developer' })),
      ...stakeholder.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'stakeholder' })),
      ...darci_roles.decider.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'decider' })),
      ...darci_roles.accountable.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'accountable' })),
      ...darci_roles.responsible.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'responsible' })),
      ...darci_roles.consulted.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'consulted' })),
      ...darci_roles.informed.map(personil_id => PRD_Personil.create({ prd_id: newPRD.prd_id, personil_id, role: 'informed' })),
      ...generatedPRD.project_timeline.phases.map(timeline => Timeline.create({ prd_id: newPRD.prd_id, time_period: timeline.time_period, activity: timeline.activity, pic: timeline.pic })),
      ...generatedPRD.success_metrics.metrics.map(metric => Success_Metrics.create({ prd_id: newPRD.prd_id, name: metric.name, definition: metric.definition, current: metric.current, target: metric.target })),
      ...generatedPRD.user_stories.stories.map(story => User_Stories.create({ prd_id: newPRD.prd_id, title: story.title, user_story: story.user_story, acceptance_criteria: story.acceptance_criteria, priority: story.priority })),
      ...problemStatements.map(content => ProblemStatement.create({ prd_id: newPRD.prd_id, content })),
      ...objectives.map(content => Objective.create({ prd_id: newPRD.prd_id, content }))
    ]);

    // Store DARCI roles
    await Promise.all(
      generatedPRD.darci.roles.map(role => {
        return role.members.map(member => {
          return DARCI.create({
            prd_id: newPRD.prd_id,
            role: role.name,
            personil_id: existingPersonils.find(p => p.personil_name === member).personil_id,
            guidelines: role.guidelines
          });
        });
      })
    );

    // Fetch the newly created PRD with all related data
    const createdPRD = await PRD.findByPk(newPRD.prd_id, {
      include: [
        { model: PRD_Personil, as: 'prdPersonils', include: [{ model: Personil }] },
        { model: DARCI, as: 'darciRoles', include: [{ model: Personil }] },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: ProblemStatement, as: 'problemStatements' },
        { model: Objective, as: 'objectives' }
      ]
    });

    const createdPRDData = JSON.parse(JSON.stringify(createdPRD));
    createdPRDData.document_owner = createdPRDData.prdPersonils.find(personil => personil.role === 'document_owner')?.Personil.personil_name || 'N/A';
    createdPRDData.developer = createdPRDData.prdPersonils.filter(personil => personil.role === 'developer').map(personil => personil.Personil.personil_name).join(', ') || 'N/A';
    createdPRDData.stakeholder = createdPRDData.prdPersonils.filter(personil => personil.role === 'stakeholder').map(personil => personil.Personil.personil_name).join(', ') || 'N/A';

    // Extract DARCI roles
    createdPRDData.darciRoles = createdPRD.darciRoles.map(darci => ({
      role: darci.role,
      personil_name: darci.Personil.personil_name,
      guidelines: darci.guidelines
    }));

    res.status(201).json(createdPRDData);
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
    const { document_version, product_name, document_owner, developer, stakeholder, project_overview, darci_roles, start_date, end_date, ui_ux, references, problem_statements, objectives } = req.body;

    // Temukan PRD yang akan diperbarui
    const prd = await PRD.findByPk(id);
    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    // Perbarui data PRD
    prd.document_version = document_version;
    prd.product_name = product_name;
    prd.project_overview = project_overview;
    prd.start_date = start_date;
    prd.end_date = end_date;
    await prd.save();

    // Ensure all personils exist in the database
    const allPersonils = [...document_owner, ...developer, ...stakeholder, ...darci_roles.decider, ...darci_roles.accountable, ...darci_roles.responsible, ...darci_roles.consulted, ...darci_roles.informed];
    const uniquePersonils = [...new Set(allPersonils)];
    const existingPersonils = await Personil.findAll({ where: { personil_id: uniquePersonils } });
    const existingPersonilIds = existingPersonils.map(p => p.personil_id);

    if (existingPersonilIds.length !== uniquePersonils.length) {
      throw new Error('Some personils do not exist in the database');
    }

    // Hapus data terkait yang lama
    await Promise.all([
      DARCI.destroy({ where: { prd_id: id } }),
      Timeline.destroy({ where: { prd_id: id } }),
      Success_Metrics.destroy({ where: { prd_id: id } }),
      User_Stories.destroy({ where: { prd_id: id } }),
      UI_UX.destroy({ where: { prd_id: id } }),
      References.destroy({ where: { prd_id: id } }),
      ProblemStatement.destroy({ where: { prd_id: id } }),
      Objective.destroy({ where: { prd_id: id } }),
      PRD_Personil.destroy({ where: { prd_id: id } })
    ]);

    // Tambahkan data terkait yang baru
    await Promise.all([
      ...darci_roles.decider.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'decider' })),
      ...darci_roles.accountable.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'accountable' })),
      ...darci_roles.responsible.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'responsible' })),
      ...darci_roles.consulted.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'consulted' })),
      ...darci_roles.informed.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'informed' })),
      ...document_owner.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'document_owner' })),
      ...developer.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'developer' })),
      ...stakeholder.map(personil_id => PRD_Personil.create({ prd_id: id, personil_id, role: 'stakeholder' })),
      ...ui_ux.map(uiux => UI_UX.create({ prd_id: id, link: uiux.link })),
      ...references.map(reference => References.create({ prd_id: id, reference_link: reference.reference_link })),
      ...problem_statements.map(content => ProblemStatement.create({ prd_id: id, content })),
      ...objectives.map(content => Objective.create({ prd_id: id, content })),
      ...req.body.timelines.map(timeline => Timeline.create({ prd_id: id, time_period: timeline.time_period, activity: timeline.activity, pic: timeline.pic })),
      ...req.body.success_metrics.map(metric => Success_Metrics.create({ prd_id: id, name: metric.name, definition: metric.definition, current: metric.current, target: metric.target })),
      ...req.body.user_stories.map(story => User_Stories.create({ prd_id: id, title: story.title, user_story: story.user_story, acceptance_criteria: story.acceptance_criteria, priority: story.priority }))
    ]);

    // Fetch the updated PRD with all related data
    const updatedPRD = await PRD.findByPk(id, {
      include: [
        { model: DARCI, as: 'darciRoles' },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: UI_UX, as: 'uiUx' },
        { model: References, as: 'references' },
        { model: ProblemStatement, as: 'problemStatements' },
        { model: Objective, as: 'objectives' }
      ]
    });

    res.json(updatedPRD);
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
      DARCI.destroy({ where: { prd_id: prd.prd_id } }),
      Timeline.destroy({ where: { prd_id: prd.prd_id } }),
      Success_Metrics.destroy({ where: { prd_id: prd.prd_id } }),
      User_Stories.destroy({ where: { prd_id: prd.prd_id } }),
      UI_UX.destroy({ where: { prd_id: prd.prd_id } }),
      References.destroy({ where: { prd_id: prd.prd_id } }),
      ProblemStatement.destroy({ where: { prd_id: prd.prd_id } }),
      Objective.destroy({ where: { prd_id: prd.prd_id } }),
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

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_BUCKET_SERVICE_ACCOUNT,
});
const bucketName = process.env.GCLOUD_BUCKET_NAME;

const downloadPRD = async (req, res) => {
  try {
    const { id } = req.params;
    const prd = await PRD.findByPk(id, {
      include: [
        { model: DARCI, as: 'darciRoles', include: [{ model: Personil }] },
        { model: Timeline, as: 'timelines' },
        { model: Success_Metrics, as: 'successMetrics' },
        { model: User_Stories, as: 'userStories' },
        { model: UI_UX, as: 'uiUx' },
        { model: References, as: 'references' },
        { model: PRD_Personil, as: 'prdPersonils', include: [{ model: Personil }] },
      ]
    });

    if (!prd) {
      return res.status(404).json({ message: 'PRD not found' });
    }

    const fileName = `PRD_${prd.prd_id}.pdf`;
    const file = storage.bucket(bucketName).file(fileName);

    // Check if the file exists in the bucket
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ message: 'File not found in Google Cloud Storage' });
    }

    // Create a temporary local file path
    const tempFilePath = path.join(__dirname, `../../temp/${fileName}`);

    // Download the file to the temporary local path
    await file.download({ destination: tempFilePath });

    // Send the file to the client
    res.download(tempFilePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Error sending file' });
      }

      // Delete the temporary local file after sending it
      fs.unlinkSync(tempFilePath);
    });
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
  selectSource,
  updatePRD,
  deletePRD,
  downloadPRD,
};