const Commission = require("../models/commission");
const Commercial = require("../models/commercialAdvisor");
const Experience = require("../models/experience");
const social_security = require("./constants");
const create_pdf = require("./pdf");

/**
 * Calculates the payroll for a commercial advisor.
 * @param {string} commercialAdvisorId - ID of the commercial advisor.
 * @returns {Object} - Payroll details including deductions, earnings, and PDF.
 */

const calculatePayroll = async (commercialAdvisorId) => {
  const commercialAdvisor = await fetchCommercialAdvisor(commercialAdvisorId);
  const experience = await fetchExperience(commercialAdvisor.experience);

  const commissions = await calculateTotalCommissions(commercialAdvisor.monthlySales, experience._id);
  const totalEarnings = experience.salary + commissions.tier1 + commissions.tier2 + commissions.tier3;
  const totalCommissions = commissions.tier1 + commissions.tier2 + commissions.tier3;
  const { healthInsurance, pension, laborRisks, totalDeductions } = calculateDeductions(totalEarnings);
  const netSalary = totalEarnings - totalDeductions;
  const PDF = await create_pdf(
    commercialAdvisor,
    experience.salary,
    totalCommissions,
    healthInsurance,
    pension,
    laborRisks,
    totalDeductions,
    totalEarnings,
    netSalary
  );
  return {
    healthInsurance,
    pension,
    laborRisks,
    totalDeductions,
    totalEarnings,
    netSalary,
    PDF,
  };
};

/**
 * Fetches commercial advisor details by ID.
 * @param {string} id - ID of the commercial advisor.
 * @returns {Object} - Commercial advisor details.
 * @throws {Error} - If commercial advisor is not found.
 */

const fetchCommercialAdvisor = async (id) => {
  try {
    const commercialAdvisor = await Commercial.findById(id);
    return commercialAdvisor;
  } catch (error) {
    throw new Error("Asesor Comercial no encontrado.");
  }
};

/**
 * Fetches experience details by ID.
 * @param {string} id - ID of the experience.
 * @returns {Object} - Experience details.
 * @throws {Error} - If experience is not found.
 */

const fetchExperience = async (id) => {
  try {
    const experience = await Experience.findById(id);
    return experience;
  } catch (error) {
    throw new Error("Experiencia no encontrada.");
  }
};

/**
 * Calculates deductions based on the given basic salary.
 * @param {number} basicSalary - The basic salary of the commercial advisor.
 * @returns {Object} - Deductions details including health insurance, pension, labor risks, and total deductions.
 */

const calculateDeductions = (basicSalary) => {
  const healthInsurance = basicSalary * social_security.healthInsurance;
  const pension = basicSalary * social_security.pension;
  const laborRisks = basicSalary * social_security.laborRisks;
  const totalDeductions = healthInsurance + pension + laborRisks;
  return { healthInsurance, pension, laborRisks, totalDeductions };
};

/**
 * Calculates total commissions based on sales and experience ID.
 * @param {number} sales - Monthly sales of the commercial advisor.
 * @param {string} experienceId - ID of the experience.
 * @returns {Object} - Total commission details for different tiers.
 * @throws {Error} - If commission or tier sales are not found.
 */

const calculateTotalCommissions = async (sales, experienceId) => {
  try {
    const commission = await Commission.findOne({ experience: experienceId });
    if (!commission) {
      throw new Error("Comisión no encontrada.");
    }

    const target = commission.target;
    const tier1Sales = target * 0.6;
    const tier2Sales = target + target * 0.2;
    const tier3Sales = target + target * 0.4;

    let totalCommissions = {
      tier1: 0,
      tier2: 0,
      tier3: 0,
    };

    if (sales >= tier3Sales) {
      totalCommissions.tier3 = sales * (commission.commissionTier3 / 100);
    } else if (sales >= tier2Sales) {
      totalCommissions.tier2 = sales * (commission.commissionTier2 / 100);
    } else if (sales >= tier1Sales) {
      totalCommissions.tier1 = sales * (commission.commissionTier1 / 100);
    }

    return totalCommissions;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = calculatePayroll;
