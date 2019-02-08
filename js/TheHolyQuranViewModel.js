/// <reference path="surasname.js" />
/// <reference path="../knockout-3.4.2.js" />

function ReciterModel() {
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable();
    self.rewaya = ko.observable();
    self.Server = ko.observable();
    self.letter = ko.observable();
    self.count = ko.observable();
    self.suras = ko.observableArray();

    return self;
}

var quranViewModel = function () {
    var self = this;
    self.titolo = "The Holy Quran";
    self.urlApi = 'http://www.mp3quran.net/api/_english.json';
    self.Reciters = ko.observableArray();
    self.BackupReciters = ko.observableArray();
    self.LetterReciters = ko.computed(function () {
        var ListOfLetters = [];
        /*
        for (var i = 0; i < RecitersArray.length; i++) {
            if (ListOfLetters.indexOf(self.RecitersArray[i].letter, 0) < 0) {
                ListOfLetters.push(self.RecitersArray[i].letter);
            }
        }
      */
        ko.utils.arrayForEach(self.BackupReciters(), (reciter) => {
            if (ListOfLetters.indexOf(reciter.letter, 0) < 0) {
                ListOfLetters.push(reciter.letter);
            }
        });

        //console.log(ListOfLetters);
        return ListOfLetters;

    });


    self.filterByLetter = function (selectedLetter) {
        console.log(selectedLetter);
        var filterReciters = ko.computed(function () {
            return ko.utils.arrayFilter(self.BackupReciters(), function (item) {
                if (item.letter.indexOf(selectedLetter) >= 0) {
                    return true;
                }
                return false;

            });

        });
        return self.Reciters(filterReciters());
    }

    self.Reciter = ko.observable(new ReciterModel());
    self.surasNameUrl = ko.observableArray();
    self.mp3SrcFile = ko.observableArray();
    self.loadReciter = function (reciterSelected) {
        var selectedSuras = reciterSelected.suras;
        var serverUrl = reciterSelected.Server;
        var surasNameReciterArray = Suras_Name.filter(function (sura) {
            for (var i = 0; i < selectedSuras.length; i++) {
                if (sura.id.indexOf(selectedSuras[i], 0) >= 0) {
                    return true;
                }
                return false;
            }

        });

        self.surasNameUrl(surasNameReciterArray);
        self.Reciter(reciterSelected);
        $("#listenQuran").modal('show');
    }




    self.init = function () {
        self.filterByLetter('Z');
        $.getJSON(self.urlApi, (data) => {
            self.Reciters(data.reciters);
            self.BackupReciters(data.reciters);

        });
    }




    self.pageSize = ko.observable(5);
    self.pageIndex = ko.observable(0);

    self.pagedList = ko.dependentObservable(function () {
        var size = self.pageSize();
        var start = self.pageIndex() * size;
        return self.Reciters.slice(start, start + size);
    });
    self.maxPageIndex = ko.dependentObservable(function () {

        return Math.ceil(self.Reciters().length / self.pageSize()) - 1;
    });
    self.previousPage = function () {
        if (self.pageIndex() > 0) {
            self.pageIndex(self.pageIndex() - 1);
        }
    };
    self.nextPage = function () {
        if (self.pageIndex() < self.maxPageIndex()) {
            self.pageIndex(self.pageIndex() + 1);
        }
    };
    self.allPages = ko.dependentObservable(function () {
        var pages = [];

        for (i = 0; i <= self.maxPageIndex(); i++) {
            pages.push({
                pageNumber: (i + 1)
            });
        }
        return pages;
    });
    self.moveToPage = function (index) {
        self.pageIndex(index);
    };


    return self;
}


var vm = new quranViewModel();
vm.init();
ko.applyBindings(vm);
