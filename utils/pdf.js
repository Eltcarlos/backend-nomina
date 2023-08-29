const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const { formatCurrency, dateFormatter } = require("./formatter");
const { v4: uuidv4 } = require("uuid");
const uploadFileToS3 = require("../services/s3Service");

/**
 * Creates a PDF document based on the provided data and template.
 * @param {Object} commercialAdvisor - Information about the commercial advisor.
 * @param {number} baseSalary - Base salary of the commercial advisor.
 * @param {number} totalCommissions - Total commissions earned by the commercial advisor.
 * @param {number} healthInsurance - Health insurance deduction.
 * @param {number} pension - Pension deduction.
 * @param {number} laborRisks - Labor risks deduction.
 * @param {number} totalDeductions - Total deductions from the salary.
 * @param {number} totalEarnings - Total earnings, including commissions.
 * @param {number} netSalary - Net salary after deductions.
 * @returns {string|null} - Location of the generated PDF in AWS S3.
 */

const create_pdf = async (
  commercialAdvisor,
  baseSalary,
  totalCommissions,
  healthInsurance,
  pension,
  laborRisks,
  totalDeductions,
  totalEarnings,
  netSalary
) => {
  try {
    const loadPdfBytes = fs.readFileSync("./docs/plantilla-nomina.pdf");
    const pdfDoc = await PDFDocument.load(loadPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const font = await pdfDoc.embedFont("Helvetica-Bold");
    const styles = {
      size: 10,
      font,
      color: rgb(0, 0, 0),
    };

    const {
      name,
      document,
      email,
      oldDate,
      base,
      totalCommission,
      totalEarning,
      health,
      pensions,
      labor,
      totalDeduction,
      datePayroll,
      numberAccount,
      salaryNet,
    } = transFormNumberAndString(
      commercialAdvisor,
      baseSalary,
      totalCommissions,
      healthInsurance,
      pension,
      laborRisks,
      totalDeductions,
      totalEarnings,
      netSalary
    );

    firstPage.drawText(name, { x: 374, y: 738, ...styles });
    firstPage.drawText(document, { x: 369, y: 727, ...styles });
    firstPage.drawText(email, { x: 369, y: 715, ...styles });
    firstPage.drawText(oldDate, { x: 430, y: 702, ...styles });

    firstPage.drawText(base, { x: 501, y: 636.5, ...styles });
    firstPage.drawText(totalCommission, { x: 508, y: 587, ...styles });
    firstPage.drawText(totalEarning, { x: 500, y: 573, ...styles });

    firstPage.drawText(health, { x: 508, y: 520, ...styles });
    firstPage.drawText(pensions, { x: 508, y: 508, ...styles });
    firstPage.drawText(labor, { x: 508, y: 495, ...styles });
    firstPage.drawText(totalDeduction, { x: 508, y: 470, ...styles });

    firstPage.drawText(datePayroll, { x: 198, y: 459, ...styles });
    firstPage.drawText(numberAccount, { x: 142, y: 433.5, ...styles });

    firstPage.drawText(salaryNet, { x: 501, y: 407, ...styles });

    const modifiedPdfBytes = await pdfDoc.save();
    const pdfFileName = `${uuidv4()}-${name.trim().replace(/\s+/g, "-")}.pdf`;
    const uploadS3 = await uploadFileToS3(pdfFileName, modifiedPdfBytes);
    return uploadS3.Location;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Transforms various numeric and string values into formatted strings.
 * @param {Object} commercialAdvisor - Information about the commercial advisor.
 * @param {number} baseSalary - Base salary of the commercial advisor.
 * @param {number} totalCommissions - Total commissions earned by the commercial advisor.
 * @param {number} healthInsurance - Health insurance deduction.
 * @param {number} pension - Pension deduction.
 * @param {number} laborRisks - Labor risks deduction.
 * @param {number} totalDeductions - Total deductions from the salary.
 * @param {number} totalEarnings - Total earnings, including commissions.
 * @param {number} netSalary - Net salary after deductions.
 * @returns {Object} - An object containing various formatted strings.
 */

const transFormNumberAndString = (
  commercialAdvisor,
  baseSalary,
  totalCommissions,
  healthInsurance,
  pension,
  laborRisks,
  totalDeductions,
  totalEarnings,
  netSalary
) => {
  const name = commercialAdvisor.name.firstName + " " + commercialAdvisor.name.lastName;
  const document = formatCurrency(commercialAdvisor.document);
  const email = commercialAdvisor.email;
  const oldDate = dateFormatter(commercialAdvisor.createdAt);
  const base = formatCurrency(baseSalary);
  const totalCommission = formatCurrency(totalCommissions);
  const totalEarning = formatCurrency(totalEarnings);
  const health = formatCurrency(healthInsurance);
  const pensions = formatCurrency(pension);
  const labor = formatCurrency(laborRisks);
  const totalDeduction = formatCurrency(totalDeductions);
  const datePayroll = dateFormatter(new Date());
  const numberAccount = formatCurrency(commercialAdvisor.numberAccount);
  const salaryNet = formatCurrency(netSalary);

  return {
    name,
    document,
    email,
    oldDate,
    base,
    totalCommission,
    totalEarning,
    health,
    pensions,
    labor,
    totalDeduction,
    datePayroll,
    numberAccount,
    salaryNet,
  };
};

module.exports = create_pdf;
