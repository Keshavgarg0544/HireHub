require('dotenv').config();
const db = require("./models");

async function migrate() {
  console.log("Starting CompanyMember migration...");
  try {
    await db.sequelize.authenticate();
    
    // Ensure the table exists and new columns are added
    await db.sequelize.sync({ alter: true });

    const companies = await db.Company.findAll();
    console.log(`Found ${companies.length} companies.`);

    let migrated = 0;
    for (const company of companies) {
      if (company.createdBy) {
        // Check if it already exists
        const exists = await db.CompanyMember.findOne({
          where: { userId: company.createdBy, companyId: company.id }
        });

        if (!exists) {
          await db.CompanyMember.create({
            userId: company.createdBy,
            companyId: company.id,
            role: 'COMPANY_ADMIN',
            status: 'APPROVED'
          });
          migrated++;
        }
      }
    }
    
    console.log(`Migration successful! Migrated ${migrated} records.`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

migrate();
