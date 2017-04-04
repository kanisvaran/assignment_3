(function () {

'use strict';

  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuSearchService',MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .directive('foundItems',FoundItemDirective);


  function FoundItemDirective() {
  var ddo = {
    templateUrl: 'foundList.html',
    scope: {
      items: '<',
      removeItem: '&onRemove'
    },
    // controller: 'ShoppingListDirectiveController as list',
    controller: FoundItemDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function FoundItemDirectiveController() {
  var list = this;

  list.validateMsg = function () {
    if(list.items===undefined){
      console.log("i ma undefined");
      return false;
    }else{
      if(list.items.length < 0) {
        console.log("found items");
        return true;
      }else{
      console.log("not found items");
      return false;
    }
    }

  };
}



  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var naDwnCtrl = this;

    //naDwnCtrl.searchTerm= "house-made dough dumpling";

    naDwnCtrl.narrowDownMe= function () {
      //naDwnCtrl.items = [];
      if(naDwnCtrl.searchTerm === ""){
        console.log("searchTerm : "+naDwnCtrl.searchTerm);
        naDwnCtrl.items = [];
        return naDwnCtrl.items;
      }

      naDwnCtrl.items = MenuSearchService.getMatchedMenuItems(naDwnCtrl.searchTerm);

    }

    naDwnCtrl.removeItem = function functionName(index) {
      console.log("index Value"+index);
        MenuSearchService.removeItems(index);
    }

  }


  MenuSearchService.$inject=['$http','ApiBasePath'];
  function MenuSearchService($http,ApiBasePath) {

    var service = this;
    var foundItems = [];

    service.getMatchedMenuItems = function (searchTerm) {

      foundItems = [];

      console.log("searchTerm : " + searchTerm);
      var promise = $http({
            method:"GET",
            url: (ApiBasePath + "/menu_items.json")
          });

      promise.then(function (response) {



        var length = response.data.menu_items.length;

        console.log("length : "+length);

        for(var x =0;x<response.data.menu_items.length;x++){
          var items = response.data.menu_items[x];
          var item =items;

          if(item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !==-1){
              console.log(item.description.toLowerCase());
              foundItems.push(item);
          }

          // for(var jsonObj in items){
          //   console.log(jsonObj.id);
          //   console.log("result : "+JSON.stringify(jsonObj));
          // }

        }

        // for(var menuItem in items){
        //   console.log(" JSON String"+JSON.stringify(menuItem));
        //   var x = menuItem[0];
        //   console.log(x);
        //
        //   console.log(""+menuItem.short_name);
        //   console.log("Next Item");
        // }
        //   console.log("response.data : "+response.data);
      })
      .catch(function (error) {
        console.log("error : "+error);
      });


      return foundItems;

    };

    service.removeItems = function (indexValue) {
        console.log(indexValue);
        foundItems.splice(indexValue,1);
    }


  }

})();
