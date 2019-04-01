import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File} from '@ionic-native/file';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { Camera } from '@ionic-native/camera';
import { MediaCapture, MediaFile, CaptureVideoOptions } from '@ionic-native/media-capture';
import { FilePath } from '@ionic-native/file-path';
import { Media, MediaObject } from '@ionic-native/media';
import { Storage} from '@ionic/storage';

// const MEDIA_FILES_KEY = 'mediaFiles';

declare var cordova: any;

@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {
  note='';
  mediaFiles = [];
  @ViewChild('myvideo') myVideo: any;
  @ViewChild('myimage') myImage: any;
  public appName: string = "FarmersFz";
  public farmerId;
  public farmerName;
  public items = [];
  public farm = [];
  private blue: string;
  images = [];
  lastImage: string = null;
  loading: Loading;
  public newFileName;
  public fpath: string;
  public fncount: number = 0;
  public timestamp: string;
  public currentFarmerFolder: string;

  recording: boolean = false;
  afilePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];
  


  constructor(public navCtrl: NavController,
    private file: File,
    public navParams: NavParams,
    public sqlite: SQLite,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public platform: Platform,
    private filePath: FilePath,
    public toastCtrl: ToastController,
    public mediaCapture: MediaCapture,
    public storage:Storage,
    public media:Media
  ) {

    this.fpath = cordova.file.externalRootDirectory + this.appName;
    this.farmerName = this.navParams.get('par');
    this.blue = this.farmerName;
    this.file.createDir(cordova.file.externalRootDirectory,this.appName, true);
    // this.navCtrl.setRoot(this.navCtrl.getActive().component);
    this.file.createDir(cordova.file.externalRootDirectory + "FarmersFz", this.blue, true);
    this.currentFarmerFolder = this.fpath + "/" + this.blue;
    // this.navCtrl.setRoot(this.navCtrl.getActive().component);
    // this.file.listDir(this.fpath, this.blue);

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('select ftype,ts,fil3nam3 from media where bool=0 AND ffname=?',[this.blue] )
        .then((data) => {
          this.farm = [];
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              this.farm.push({ 
                name: data.rows.item(i).fil3nam3,
                type: data.rows.item(i).ftype,
                time: data.rows.item(i).ts
              });
            }
          }

        }, (err) => {
          console.error(JSON.stringify(err));
          this.presentToast("Add a media")
        } );
        //try - listing farmer --success
        db.executeSql('select fid,fname from farmers where fname = ?', [this.blue])
          .then((data) => {
            this.items = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                this.items.push({ id: data.rows.item(i).fid });
              }
            }

          });

          // try print
          
      });
      
  }

  returnId(rid) {
    this.farmerId = rid.id;
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    this.file.createDir(cordova.file.externalRootDirectory + "FarmersFz", this.blue, true);
    var options = {
      quality: 60,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {

            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, () => {
      this.presentToast('Error while selecting image.');
    });
  }
  

  private createFileName() {
    this.fncount = this.fncount + 1
    var d = new Date(),
      n = d.getDate(),
      a = d.getMonth(),
      b = d.getFullYear(),
      c = d.getMinutes(),
      e = d.getHours(),
      f = d.getSeconds();
    // this.newFileName = this.blue + n + "-" + a + "-" + b + "-" + this.fncount + ".3gp";
    this.newFileName = this.blue + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpg';

    this.timestamp = n + "-" + a + "-" + b + "--" + e + ":" + c + ":" + f +" " ;
    return this.newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    
    
    this.file.moveFile(namePath, currentName, this.currentFarmerFolder, this.newFileName).then(() => {
      this.lastImage = newFileName;
    }, () => {
      this.presentToast('Error while storing file.');
    });
    // try inserting data into media table
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO media (ffname,ftype,floc,fil3nam3,farNotes,ts,bool) VALUES(?,?,?,?,?,?,?)', [this.blue,"image/jpg", this.currentFarmerFolder,this.newFileName,"Nil", this.timestamp,0])
          .then((data) => {
          }, () => {
            this.presentToast('Error while storing file.');
          });
      });

  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }


  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 3,
      duration: 30,
      quality: 20,
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');
      // var toDirectory = this.file.dataDirectory;

      // this.file.copyFile(fromDirectory , fileName , toDirectory , fileName)
    this.file.createDir(cordova.file.externalRootDirectory + "FarmersFz", this.blue, true);

      this.copyFileToLocalDirVid(fromDirectory, fileName, this.createFileVid());

    }, () => {
      this.presentToast('Error while selecting vid.');
    });
       // try inserting video into media table
      //  this.sqlite.create({
      //   name: 'data.db',
      //   location: 'default'
      // })
      //   .then((db: SQLiteObject) => {
      //     db.executeSql('INSERT INTO media (ffname,ftype,floc,fil3nam3,farNotes,ts,bool) VALUES(?,?,?,?,?,?,?)', [this.blue,"video/mp4", this.currentFarmerFolder,this.newFileName,"Nil", this.timestamp,0])
      //       .then((data) => {
      //       }, () => {
      //         this.presentToast('Error while storing file.');
      //       });
      //   });
  }
  private copyFileToLocalDirVid(namePath, currentName, newFileName) {
    
    
    this.file.moveFile(namePath, currentName, this.currentFarmerFolder, this.newFileName).then(() => {
      this.lastImage = newFileName;
    }, () => {
      this.presentToast('Error while storing file.');
    });
    // try inserting data into media table
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO media (ffname,ftype,floc,fil3nam3,farNotes,ts,bool) VALUES(?,?,?,?,?,?,?)', [this.blue,"video/mp4", this.currentFarmerFolder,this.newFileName,"Nil", this.timestamp,0])
          .then((data) => {
          }, () => {
            this.presentToast('Error while storing file.');
          });
      });

  }



  private createFileVid() {
    this.fncount = this.fncount + 1
    var d = new Date(),
      n = d.getDate(),
      a = d.getMonth(),
      b = d.getFullYear(),
      c = d.getMinutes(),
      e = d.getHours(),
      f = d.getSeconds();
    // this.newFileName = this.blue + n + "-" + a + "-" + b + "-" + this.fncount + ".mp4";
    this.newFileName = this.blue + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.mp4';
    
    this.timestamp = n + "-" + a + "-" + b + "--" + e + ":" + c + ":" + f;
    return this.newFileName;
  }

  
  // 
  startRecord() {
    if (this.platform.is('ios')) {
      this.fileName = this.blue + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
      this.afilePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.afilePath);
    } else if (this.platform.is('android')) {
    this.file.createDir(cordova.file.externalRootDirectory + "FarmersFz", this.blue, true);

      this.fileName = this.blue + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
      this.afilePath = this.fpath+"/"+this.blue+"/" + this.fileName;
      this.audio = this.media.create(this.afilePath);
      var d = new Date(),
      n = d.getDate(),
      a = d.getMonth(),
      b = d.getFullYear(),
      c = d.getMinutes(),
      e = d.getHours(),
      f = d.getSeconds();
    this.timestamp = n + "-" + a + "-" + b + "--" + e + ":" + c + ":" + f;
      
    }
    this.audio.startRecord();
    this.recording = true;
  }
  stopRecord() {
    this.audio.stopRecord();
    let data = { filename: this.fileName };
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    // this.getAudioList();


       // try inserting audio into media table
       this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql('INSERT INTO media (ffname,ftype,floc,fil3nam3,farNotes,ts,bool) VALUES(?,?,?,?,?,?,?)', [this.blue,"audio/3gp", this.currentFarmerFolder,this.fileName,"Nil", this.timestamp,0])
            .then((data) => {
            }, () => {
              this.presentToast('Error while storing file.');
            });
        });
  
  }
  addText() {
    var d = new Date(),
      n = d.getDate(),
      a = d.getMonth(),
      b = d.getFullYear(),
      c = d.getMinutes(),
      e = d.getHours(),
      f = d.getSeconds();
    this.timestamp = ""+ n + a  + b  + e  + c  + f ;
    // create
    this.file.createDir(cordova.file.externalRootDirectory + "FarmersFz", this.blue, true);

    this.file.createFile(this.currentFarmerFolder, this.blue+this.timestamp+".txt", true);
    this.file.writeExistingFile(this.currentFarmerFolder, this.blue+this.timestamp+".txt", '\n\n'+this.timestamp+'\n'+ this.note)
    this.fileName = this.blue+this.timestamp+".txt";
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.presentToast('inserting');
      db.executeSql('INSERT INTO media (ffname,ftype,floc,fil3nam3,farNotes,ts,bool) VALUES(?,?,?,?,?,?,?)', [this.blue,"text/txt", this.currentFarmerFolder,this.fileName,this.note, this.timestamp,0])
        .then((data) => {
        }, () => {
          this.presentToast('Error while storing file.');
        });
        this.note="";
          });


  }


}