const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'actions', 'checkout.ts');
let content = fs.readFileSync(filePath, 'utf8');

const target = `    const orderMetadata = {
      billing: {
        firstName,
        lastName,
        email,`;

const replacement = `    const orderMetadata = {
      billing: {
        firstName,
        lastName,
        company: ((formData.get('companyName') as string) || (formData.get('company') as string) || '').trim(),
        nif: ((formData.get('nif') as string) || (formData.get('nipc') as string) || '').trim(),
        email,`;

if (!content.includes('orderMetadata = {')) {
  console.error('Could not find orderMetadata in checkout.ts');
  process.exit(1);
}

// Normalize newlines for replacement
const hasCRLF = content.includes('\r\n');
const normalizedTarget = hasCRLF ? target.replace(/\n/g, '\r\n') : target.replace(/\r\n/g, '\n');
const normalizedReplacement = hasCRLF ? replacement.replace(/\n/g, '\r\n') : replacement.replace(/\r\n/g, '\n');

if (content.includes(normalizedTarget)) {
  content = content.replace(normalizedTarget, normalizedReplacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated checkout.ts with company and nif');
} else {
  console.error('Target string not matched exactly');
  process.exit(1);
}

