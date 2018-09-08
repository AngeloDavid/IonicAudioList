import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Globals} from '../../app/datos/global';
import { Media, MediaObject } from '@ionic-native/media';
import { ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  global: any;
  file: MediaObject;
  constructor(public navCtrl: NavController, public gl : Globals, private media: Media, public toastCtrl: ToastController, private filef: File) {
    this.global= gl.categories_dt;
    
   /* this.filef.checkDir(this.filef.dataDirectory, 'www').then(_ => this.presentToast('Directory exists')
    ).catch(err => this.presentToast('Directory doesn\'t exist'));*/

  }

  play(ruta:string){
    // ya puedo acceder a los archivos de sonidos en la apk. pero se deben pasar a guardar en el dispositivo par que no genere error con
    // por los audios
     this.filef.resolveDirectoryUrl(this.filef.applicationDirectory).then((rd)=>{
      //this.presentToast(rd.nativeURL+'www/'+ruta);
     this.filef.checkDir(rd.nativeURL, 'www/assets/sounds/').then(_ => this.presentToast('Directory exists')
      ).catch(err => this.presentToast('Directory doesn\'t exist'+JSON.stringify(err)));
      this.file= this.media.create(rd.nativeURL+'www/'+ruta);
      this.file.onSuccess.subscribe((onSuccess) => this.presentToast	('archivo correcto'+onSuccess));
   
       this.file.onError.subscribe(error =>{
         
         this.presentToast(JSON.stringify(error)); console.log(error)} );
       this.file.play()

     /*  this.filef.listDir(rd.nativeURL, 'www/assets/sounds')
      .then(items =>{
        for(let i in items){
          this.presentToast(items[i].fullPath); // I see “database.db” here
        }
        })
        .catch(err => {
          this.presentToast(JSON.stringify(err) );
        });*/

    /*   this.filef.readAsDataURL(rd.nativeURL+'/www/assets/sounds','nariz.mp3').then((data)=>{
        this.presentToast('Exsiste archivo'+data);
       }).catch((err)=>{
        this.presentToast('no existe archivo'+JSON.stringify(err));
      })*/

      /*this.filef.checkFile(rd.nativeURL+'www/assets/sounds','nariz.mp3').then(()=>{
        this.presentToast('Exsiste archivo');
      }).catch((err)=>{
        this.presentToast('no existe archivo'+JSON.stringify(err));
      })*/
     })

    
   /* let p = window.location.pathname;
    let root = '/android_asset/www/'+ruta;
    this.file= this.media.create(root);
   this.file.onSuccess.subscribe((onSuccess) => this.presentToast	('archivo correcto'+onSuccess));

    this.file.onError.subscribe(error =>{
      
      this.presentToast(root+'-'+ p+ JSON.stringify(error)); console.log(error)} );
    this.file.play();*/
  }

  presentToast(msg:string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 10000
    });
    toast.present();
  }
}
