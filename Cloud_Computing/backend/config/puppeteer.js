const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

// Inisialisasi Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_BUCKET_SERVICE_ACCOUNT,
});
const bucketName = process.env.GCLOUD_BUCKET_NAME;

const generatePDF = async (prdData) => {
  const templatePath = path.join(__dirname, '../templates/prdTemplate.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateHtml);

  // Register the formatDate helper
  Handlebars.registerHelper('formatDate', function(date) {
    if (!date) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  });

  // Map person names to DARCI roles and timelines
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

  // Define the file path to save the PDF locally
  const pdfPath = path.join(__dirname, `../output/PRD_${prdData.prd_id}.pdf`);

  // Save the PDF to the specified path
  await page.pdf({ path: pdfPath, format: 'A4' });

  await browser.close();

  // Upload the PDF to Google Cloud Storage
  await storage.bucket(bucketName).upload(pdfPath, {
    destination: `PRD_${prdData.prd_id}.pdf`,
  });

  console.log(`PDF uploaded to ${bucketName}/PRD_${prdData.prd_id}.pdf`);

  // Return the URL of the uploaded PDF
  const publicUrl = `https://storage.googleapis.com/${bucketName}/PRD_${prdData.prd_id}.pdf`;
  return publicUrl;
};

module.exports = generatePDF;