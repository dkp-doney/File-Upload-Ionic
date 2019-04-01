import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { UpPage } from "../pages/up/up";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataPage } from '../pages/data/data';
import { MediaCapture } from '@ionic-native/media-capture';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { AddFPage } from '../pages/add-f/add-f';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DataPage,
    AddFPage,
    UpPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name:'farm',
      driverOrder:['indexeddb', 'sqlite', 'websql']
    })
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DataPage,
    AddFPage,
    UpPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Media,
    MediaCapture,
    File,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    FilePath,
    FileTransfer,
    FileTransferObject,
    // FileUploadOptions



  ]
})
export class AppModule {}
