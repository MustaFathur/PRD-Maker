const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Register the formatDate helper
Handlebars.registerHelper('formatDate', function(date) {
  if (!date) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
});

const generatePDF = async (prd) => {
  const templatePath = path.join(__dirname, '../templates/prdTemplate.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateHtml);

  // Convert Sequelize model instance to plain object
  const prdData = JSON.parse(JSON.stringify(prd));

  // Map person names to DARCI roles and timelines
  prdData.darciRoles = prdData.darciRoles.map(role => ({
    ...role,
    person_name: role.Personil ? role.Personil.personil_name : 'N/A'
  }));
  prdData.timelines = prdData.timelines.map(timeline => ({
    ...timeline,
    pic_name: timeline.Personil ? timeline.Personil.personil_name : 'N/A'
  }));

  // Log the data passed to the template
  console.log('Data passed to template:', prdData);

  const html = template(prdData);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Define the file path to save the PDF
  const pdfPath = path.join(__dirname, `../output/PRD_${prd.prd_id}.pdf`);

  // Save the PDF to the specified path
  await page.pdf({ path: pdfPath, format: 'A4' });

  await browser.close();
  return pdfPath;
};

module.exports = generatePDF;