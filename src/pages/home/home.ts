import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SQLiteObject, SQLite } from '@ionic-native/sqlite';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {

  public items = [];
  db:SQLiteObject;
  constructor(public navCtrl: NavController, public sqlite: SQLite) {


  }

}
