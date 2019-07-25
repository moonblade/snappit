var express = require('express')
var router = express.Router()
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
var exec = require('child_process').exec;

function execute(command, callback){
  exec(command, function(error, stdout, stderr){ callback(stdout); });
};

const options = {
  swaggerDefinition: {
    info: {
      title: 'Snappit API',
      version: '1.0.0',
      description: 'Documetation for API definitions for snappit',
    },
  },
  apis: ['server/routes/index.js'],
};

var specs = null
execute("cd server; oas generate", result=>{
  specs = JSON.parse(result);
})
router.use('/test', (req, res)=>{
  res.json(specs)
});
router.use('/', swaggerUi.serve, (req, res)=>{
  swaggerUi.setup(specs)(req, res)
});

module.exports = router