require('dotenv').config();
const db = require("./models");
const Company = db.Company;

async function checkLogos() {
  const companies = await Company.findAll();
  companies.forEach(c => {
    console.log(`Company: ${c.name}, Logo: ${c.logoUrl}`);
  });
  process.exit();
}

checkLogos();
