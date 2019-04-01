import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

/**
 * Generated class for the UpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-up',
  templateUrl: 'up.html',
})
export class UpPage {

  imageURI: any;
  imageFileName: any;
  
  public items = [];
  apple:string;
  FarmerName:string;
  FileName:string;
  farmerFolder:string;
  localFileLocation:string;
  timestamp:string;
  filetype:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: SQLite,
    private transfer: FileTransfer,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        //try - listing farmer --success
        db.executeSql('select ffname,ftype,ts,floc,fil3nam3 from media where bool=0', {})
          .then((data) => {
            this.items = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                this.items.push({
                  name: data.rows.item(i).ffname,
                  type: data.rows.item(i).ftype,
                  filname: data.rows.item(i).fil3nam3
                });
              }
            }

          });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpPage');
  }

  // sync func
  sync() {
    // alert("Hello sync");
    // let loader = this.loadingCtrl.create({
    //   content: "Uploading..."
    // });
    // loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    // try
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        //try - upload data retrieve
        db.executeSql('select ffname,floc,ts,fil3nam3,ftype from media where bool=0', {})
          .then((data) => {
            this.items = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                this.apple = String(data.rows.item(i).ffname)
                this.farmerFolder = String(data.rows.item(i).floc)
                this.FileName = String(data.rows.item(i).fil3nam3)
                this.timestamp = String(data.rows.item(i).ts)
                this.filetype = String(data.rows.item(i).ftype)

                this.localFileLocation = this.farmerFolder + "/" + this.FileName;

                let options: FileUploadOptions = { 
                  fileKey: "file", //check here
                  fileName: this.FileName, 
                  // chunkedMode: false, //check here
                  // mimeType: "image/jpg", //check here
                  headers: {},
                  params:{'farmerName': this.apple,'Timestamp':this.timestamp}
                }   
            
                fileTransfer.upload(this.localFileLocation, 'http://192.168.1.2/Farmersfz/upload.php', options) //check here
                  .then((data) => {
                    console.log(data + " Uploaded Successfully");
                    // this.imageFileName = "http://192.168.137.236:80/farmersfz/uploads/" + this.FileName;
                    this.presentToast("data uploaded successfully");
                    // load er.dismiss();
                  }, (err) => {
                    // loader.dismiss();
                    alert("up fails")
                    // console.log(err);
                    // this.presentToast(err);
                  })
                  .catch(e => {
                    this.presentToast("Upload Completed")
                  }) ;
              }
            }

          });
          db.executeSql('UPDATE media SET bool=1 WHERE bool=0',{})
          .then()
          .catch(e => console.log(e));
  
      });

  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

}
