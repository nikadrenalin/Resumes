
(function() {
'use strict';

angular
.module('resumeApp', ['ui.router', 'ui.bootstrap', 'ngFileUpload', 'resumeApp.services', 'ngMask'])
.config(routerConfig)
.controller('MainController', MainController)
.controller('ListController', ListController)
.controller('ModalController', ModalController)
.controller('navController', navController);

/** @ngInject */
function routerConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/main',
    templateUrl: 'src/views/main.html',
    controller: 'MainController',
    controllerAs: 'main'
  })
  .state('list', {
    url: '/list',
    templateUrl: 'src/views/list.html',
    controller: 'ListController',
    controllerAs: 'main'
  });

  $urlRouterProvider.otherwise('/main');
}

function MainController($scope, RestService, $state, $timeout, Upload, $uibModal) {
  var vm = this;

  vm.resumeSubmit = resumeSubmit;
  vm.contMethod = '';
  vm.technologies = ['.NET', 'HTML', 'Java', 'Javascript', 'CSS'];
  vm.technologSelect = [];
  vm.toggleSelection = toggleSelection;
  vm.englishLang = false;
  vm.chineseLang = false;
  vm.chineseLevel = '';
  vm.englishLevel = '';
  vm.uploadPic = uploadPic;
  vm.resumeFileName = '';
  vm.modalText = '';

  vm.contMethod = 'emailAndPhone';
  vm.englishLevel = 'Basic';
  vm.chineseLevel = 'Basic';


  function uploadPic(file) {
    file.upload = Upload.upload({
      url: 'api/upload',
      data: {file: file},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
        vm.resumeFileName = response.data.name;
      });
    }, function (response) {
      if (response.status > 0)
        vm.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  }

  function toggleSelection(technologi) {
    var idx = vm.technologSelect.indexOf(technologi);

    if (idx > -1) {
      vm.technologSelect.splice(idx, 1);
    }else {
      vm.technologSelect.push(technologi);
    }
  }

  function resumeSubmit() {
    var resume = {};

    resume.firstName = vm.firstName;
    resume.lastName = vm.lastName;
    resume.lastName = vm.lastName;
    resume.email = vm.email || '';
    resume.phone = vm.phone || '';
    resume.technologies = vm.technologSelect;
    resume.lang = selectLangs();
    resume.resumeUrl = vm.resumeFileName;

    RestService.create(resume)

    .success(function(data) {

      if (data.status === 'success') {

        vm.modalText = 'Resume submitted success!';
      }else if (data.status === 'validationError') {

        vm.modalText = 'Please fill all fields';
      }else {

        vm.modalText = data.text;
      }

      $uibModal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalController',
        resolve: {
          text: function () {
            return vm.modalText;
          }
        }
      });
    });

    function selectLangs() {
      var result = [],
      obj = {};

      if (vm.englishLang) {
        obj = {};
        obj.lang = 'English';
        obj.level = vm.englishLevel;
        result.push(obj);
      }

      if (vm.chineseLang) {
        obj = {};
        obj.lang = 'Chinese';
        obj.level = vm.chineseLevel;
        result.push(obj);
      }

      return result;
    }
  }
}

function ListController($scope, RestService) {
  var vm = this;

  vm.resumes = [];

  RestService.get()
  .success(function(data) {

    vm.resumes = data;
  });  
}

function ModalController($scope, $uibModalInstance, text) {

  $scope.message = text;

  $scope.closeModal = function closeModal() {

    $uibModalInstance.close();
  };
}

function navController($rootScope, $state) {

  $rootScope.$state = $state;
}

})();