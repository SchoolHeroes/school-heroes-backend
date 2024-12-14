const { httpError } = require('../helpers');
const messages = require('../utils/messages.json');

// const validateBody = schema => {
//     const func = (req, res, next) => {
//         const {error} = schema.validate(req.body);
    
//         if (error) {
//             next(httpError(400, error.message));
//         }
//         next();
//     }
//     return func;
// };

const validateBody = (schemaFactory) => {
  const func = (req, res, next) => {
    const langMessages = messages[req.language]
    const schema = schemaFactory(langMessages); 

    const { error } = schema.validate(req.body);
    if (error) {
      next(httpError(400, error.message));
    } else {
      next();
    }
  };
  return func;
};

module.exports = validateBody;
