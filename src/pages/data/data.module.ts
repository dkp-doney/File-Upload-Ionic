import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataPage } from './data';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    DataPage,
    HttpClient
  ],
  imports: [
    IonicPageModule.forChild(DataPage),
    HttpClient
  ],
  entryComponents:[
    HttpClient
  ],
  providers:[
    HttpClient
  ]
})
export class DataPageModule {}
