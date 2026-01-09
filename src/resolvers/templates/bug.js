export default {
  issueType: 'Bug',

  fields: [
    'Full CEM Account Name',
    'Steps to Reproduce',
    'Expected Result',
    'Actual Result',
    'Related Links',
    'Was this ever working before in this account',
    'Was this ever working before details',
    'Any other helpful information',
  ],

  required: [
    'Full CEM Account Name',
    'Steps to Reproduce',
    'Expected Result',
    'Actual Result',
    'Related Links',
    'Was this ever working before in this account',
  ],

  conditionalRequired: [
    {
      when: section =>
        ['yes', 'not sure'].includes(
          section['Was this ever working before in this account']?.toLowerCase()
        ),
      require: 'Was this ever working before details',
      message:
        '“Was this ever working before details” is required when answer is Yes or Not Sure',
    },
  ],

  rules: [
    {
      check: section =>
        /https?:\/\/\S+/.test(section['Related Links'] || ''),
      message: 'Related Links must contain at least one valid URL',
    },
  ],
};
