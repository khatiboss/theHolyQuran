var idReciter = 0;
var reciterData = [];
function PlaylistViewModel() {
    var self = this;

    self.urlApi = "http://www.mp3quran.net/api/_english.json";
    self.availableReciterName = ko.observable();
    self.availableRewaya = ko.observable();
    self.availableSuras = ko.observableArray();
    self.availableSurasName = ko.observableArray();
    self.availableServer = ko.observable();

    self.downloadFile = ko.observable();

    self.selectedFile = ko.observable();
    self.selectedNbr = ko.observable();
    self.selectedName = ko.observable();

    self.playSura = function(data) {
        self.selectedName(data.name);
        self.selectedNbr(data.id);
        if (data.id > 99) {
            self.selectedFile(self.availableServer() + "/" + data.id + ".mp3");
        } else if (data.id < 10) {
            self.selectedFile(
                self.availableServer() + "/00" + data.id + ".mp3"
            );
        } else {
            self.selectedFile(self.availableServer() + "/0" + data.id + ".mp3");
        }
    };

    self.downloadSura = function(data) {
        if (data.id > 99) {
            self.downloadFile(self.availableServer() + "/" + data.id + ".mp3");
        } else if (data.id < 10) {
            self.downloadFile(
                self.availableServer() + "/00" + data.id + ".mp3"
            );
        } else {
            self.downloadFile(self.availableServer() + "/0" + data.id + ".mp3");
        }

        window.open(self.downloadFile(), "_blank");
    };
    self.selectedReciter = ko.observable();
    self.recitersList = ko.observableArray();

    self.changeReciter = function(rec) {
        idReciter = rec.selectedReciter();
        $.getJSON(self.urlApi, function(data) {
            reciters_Data = data.reciters;
            reciterData = data.reciters[idReciter];

            reciterServer = reciterData.Server;
            reciterName = reciterData.name;
            rewaya = reciterData.rewaya;
            reciterSurasNbrString = reciterData.suras;
            reciterSurasNbr = reciterSurasNbrString.split(",");

            var reciterSurasName = Suras_Name.filter(function(nbr) {
                return reciterSurasNbr.indexOf(nbr.id) != -1;
            });
            self.availableSurasName(reciterSurasName);
            self.availableServer(reciterServer);
            self.availableReciterName(reciterName);
            self.availableRewaya(rewaya);
        });

    };

    //Pulisce
    /*
    reciterData = data.reciters[150];
    reciterServer = reciterData.Server;
    reciterName = reciterData.name;
    rewaya = reciterData.rewaya;
    reciterSurasNbrString = reciterData.suras;
    reciterSurasNbr = reciterSurasNbrString.split(",");

    var reciterSurasName = Suras_Name.filter(function(nbr) {
        return reciterSurasNbr.indexOf(nbr.id) != -1;
    });
    self.availableSurasName(reciterSurasName);
    self.availableServer(reciterServer);
    self.availableReciterName(reciterName);
    self.availableRewaya(rewaya);

*/

    self.init = function() {
        $.getJSON(self.urlApi, function(data) {
            reciters_Data = data.reciters;
console.log(reciters_Data);
            reciterData = data.reciters[150];
            reciterServer = reciterData.Server;
            reciterName = reciterData.name;
            rewaya = reciterData.rewaya;
            reciterSurasNbrString = reciterData.suras;
            reciterSurasNbr = reciterSurasNbrString.split(",");

            var reciterSurasName = Suras_Name.filter(function(nbr) {
                return reciterSurasNbr.indexOf(nbr.id) != -1;
            });
            self.availableSurasName(reciterSurasName);
            self.availableServer(reciterServer);
            self.availableReciterName(reciterName);
            self.availableRewaya(rewaya);

            var recitersName = [];
            $.each(reciters_Data, function(i) {
                recitersName.push({
                    id: i,
                    name: reciters_Data[i].name
                });
            });
            self.recitersList(recitersName);
        });
    };

    return self;
}

var reciters_Data = [];

var reciterSurasNbr = [];
