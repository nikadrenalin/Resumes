
var Resume = require('./models/resume');
var path = require('path');

function getResumes(res) {
  Resume.find(function (err, resumes) {

    if (err) {
      res.send(err);
  }

  res.json(resumes); 
});
}

module.exports = function (app) {
  app.get('/api/resumes', function (req, res) {
    getResumes(res);
});

  app.post('/api/resumes', function (req, res) {

    if (req.body.firstName.length &&
      req.body.lastName.length &&
      req.body.technologies.length &&
      req.body.lang.length &&
      req.body.resumeUrl.length &&
      (req.body.email.length ||
        req.body.phone.length)) {

      Resume.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        technologies: req.body.technologies,
        lang: req.body.lang,
        resumeUrl: req.body.resumeUrl
    }, function (err, resume) {
        if (err) {
          res.json({status:'error', text: err.text});
      }

      res.json({status:'success'});
  });
}else {

    res.json({status:'validationError'});
}

});

  app.post('/api/upload', function (req, res) {

    var file = req.files.file,
    obj = {};

    obj.name = path.basename(file.path);

    res.json(obj);

});

  app.get('/api/download/:file', function (req, res) {

    var fileName = req.params.file,
    file = path.resolve("./") + '/uploads/' + fileName;

    res.download(file);

});
};