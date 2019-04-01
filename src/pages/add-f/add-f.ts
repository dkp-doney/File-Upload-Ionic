import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';


/**
 * Generated class for the AddFPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-f',
  templateUrl: 'add-f.html',
})
export class AddFPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SQLite) {
  }
  farmerName = '';
  items = [];

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFPage');
  }
  
  save() {


    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        //data insert section
        db.executeSql('CREATE TABLE IF NOT EXISTS farmers(fid INTEGER PRIMARY KEY AUTOINCREMENT,fname UNIQUE NOT NULL)', {})
          .then()
          .catch(e => console.log(e));

        //data insert section
        db.executeSql('INSERT INTO farmers(fname) VALUES(?)', [this.farmerName])
          .then()
          .catch(e => console.log(e));
          this.farmerName="";


        //data retrieve section

        db.executeSql('select * from farmers', {}).then((data) => {

          JSON.stringify(data)

          //alert(data.rows.length);
          //alert(data.rows.item(5).name);
          this.items = [];
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              //alert(data.rows.item(i).name);�
              this.items.push({ name: data.rows.item(i).fname });
            }
          }

        }, (err) => {
          alert('Unable to execute sql: ' + JSON.stringify(err));
        });
      })
      .catch(e => alert(JSON.stringify(e)));

  }
  public del(){
    this.sqlite.deleteDatabase({
      name: 'data.db',
      location: 'default'
    }).then(()=>{
      alert("db deleted")
    })
    .catch(e => alert("No database to delete"));

    
    }
}
