import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataPage } from '../data/data';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { File} from '@ionic-native/file';

declare var cordova: any;  

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',

})
export class ListPage {
  
  // declarations
  public selectedItem: any;
  public icons: string[];
  public db: SQLiteObject;
  public items = [];
  public ids = [];
  public param: Object;
  public pushPage: any;
  public data: any;
  public item;
  public apple:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private file: File,public sqlite: SQLite) {
    // initializations
    this.file.createDir(cordova.file.externalRootDirectory,"FarmersFz", true);

    this.items = [];
    this.data;
    this.ids = [];
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        //try - listing farmer --success
        db.executeSql('select fid,fname from farmers', {})
          .then((data) => {
            JSON.stringify(data);
            this.items = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                  this.items.push({ name: data.rows.item(i).fname });
            }
          }
          }, (err) => {
            alert("No farmer found !");
            alert("Add a farmer from 'Add Farmer' page :-) ");

          } );

        // try - creating data-mappping table 
        db.executeSql('CREATE TABLE IF NOT EXISTS media(ffname TEXT(100),ftype TEXT(100),floc TEXT(100),fil3nam3 TEXT(100),farNotes TEXT(100),ts TEXT(100),bool BOOLEAN NOT NULL CHECK (bool IN (0,1)))', {})  
        .then(() => {
          }, (err) => {
            alert("No farmer found !");
            alert("Add a farmer from 'Add Farmer' page :-) ");

          });
      });

  } //end of constructor

  setMeLive(bye){
     this.navCtrl.push(DataPage, {
      par: bye.name
    });

  }
}
